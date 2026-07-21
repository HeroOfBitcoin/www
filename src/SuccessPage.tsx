import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Download, LoaderCircle, RefreshCcw } from 'lucide-react';

import PixelCard from './components/ui/PixelCard';
import { translations, type Language } from './i18n/translations';
import { isLanguage, LOCALE_BY_LANGUAGE } from './i18n/locales';
import { getApiBaseUrl } from './lib/api';

type CheckoutStatus = 'pending' | 'processing' | 'paid' | 'expired' | 'underpaid' | 'refunded';

interface OrderStatusResponse {
  status: CheckoutStatus;
  order_id: string;
  payment_id: string | null;
  product_id: string;
  product_name: string;
  shipping_region: string | null;
  has_digital_download: number;
  requires_fulfillment_details: number;
  fulfillment_details_submitted_at: string | null;
  amount: number;
  currency: string;
  created_at: string;
  paid_at: string | null;
  download_token?: string;
  download_expires_at?: string;
  downloads_remaining?: number;
}

interface FulfillmentFormState {
  email: string;
  recipientName: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
  stateOrRegion: string;
  country: string;
  note: string;
}

const POLL_INTERVAL_MS = 3_000;
const POLL_WINDOW_MS = 120_000;

const EMPTY_FULFILLMENT_FORM: FulfillmentFormState = {
  email: '',
  recipientName: '',
  addressLine1: '',
  addressLine2: '',
  postalCode: '',
  city: '',
  stateOrRegion: '',
  country: '',
  note: '',
};

function formatTimestamp(value: string | null, language: Language): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat(LOCALE_BY_LANGUAGE[language], {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function isTerminalStatus(status: CheckoutStatus): boolean {
  return ['paid', 'expired', 'underpaid', 'refunded'].includes(status);
}

function statusVariant(status: CheckoutStatus): 'default' | 'info' | 'success' | 'alert' {
  switch (status) {
    case 'paid':
      return 'success';
    case 'expired':
    case 'underpaid':
    case 'refunded':
      return 'alert';
    default:
      return 'info';
  }
}

function getStatusTitle(
  status: CheckoutStatus | null,
  checkoutText: (typeof translations)[Language]['checkout'],
): string {
  if (!status) {
    return checkoutText.headerTitle;
  }

  switch (status) {
    case 'pending':
      return checkoutText.pendingTitle;
    case 'processing':
      return checkoutText.processingTitle;
    case 'paid':
      return checkoutText.paidTitle;
    case 'expired':
      return checkoutText.expiredTitle;
    case 'underpaid':
      return checkoutText.underpaidTitle;
    case 'refunded':
      return checkoutText.refundedTitle;
  }
}

function getStatusBody(
  status: CheckoutStatus | null,
  checkoutText: (typeof translations)[Language]['checkout'],
): string {
  if (!status) {
    return checkoutText.subtitle;
  }

  switch (status) {
    case 'pending':
      return checkoutText.pendingBody;
    case 'processing':
      return checkoutText.processingBody;
    case 'paid':
      return checkoutText.paidBody;
    case 'expired':
      return checkoutText.expiredBody;
    case 'underpaid':
      return checkoutText.underpaidBody;
    case 'refunded':
      return checkoutText.refundedBody;
  }
}

const SuccessPage: React.FC = () => {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const orderId = useMemo(() => new URLSearchParams(window.location.search).get('order_id'), []);
  const language = useMemo<Language>(() => {
    const param = new URLSearchParams(window.location.search).get('lang');
    if (isLanguage(param)) {
      return param;
    }

    const saved = localStorage.getItem('hob-language');
    if (isLanguage(saved)) {
      return saved;
    }

    const browserLanguage = navigator.language.slice(0, 2);
    return isLanguage(browserLanguage) ? browserLanguage : 'en';
  }, []);
  const checkoutText = useMemo(() => translations[language].checkout, [language]);
  const homeHref = `/?lang=${language}`;
  const productsHref = `/?lang=${language}#products`;

  const [order, setOrder] = useState<OrderStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [pollingStopped, setPollingStopped] = useState(false);
  const [fulfillmentForm, setFulfillmentForm] = useState<FulfillmentFormState>(EMPTY_FULFILLMENT_FORM);
  const [fulfillmentSubmitting, setFulfillmentSubmitting] = useState(false);
  const [fulfillmentError, setFulfillmentError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = `Hero of Bitcoin - ${checkoutText.headerTitle}`;
    localStorage.setItem('hob-language', language);
  }, [checkoutText.headerTitle, language]);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      setError(checkoutText.missingOrder);
      return;
    }

    let isMounted = true;
    let timeoutId: number | undefined;
    const startedAt = Date.now();

    const poll = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/order-status?id=${encodeURIComponent(orderId)}`);
        const payload = (await response.json().catch(() => null)) as
          | OrderStatusResponse
          | { error?: string }
          | null;

        if (!response.ok || !payload || typeof (payload as OrderStatusResponse).status !== 'string') {
          throw new Error(
            payload && typeof (payload as { error?: string }).error === 'string'
              ? (payload as { error: string }).error
              : checkoutText.genericError,
          );
        }

        if (!isMounted) {
          return;
        }

        const nextOrder = payload as OrderStatusResponse;
        setOrder(nextOrder);
        setError(null);
        setIsLoading(false);
        setLastUpdatedAt(new Date().toISOString());

        const shouldContinuePolling =
          !isTerminalStatus(nextOrder.status) && Date.now() - startedAt < POLL_WINDOW_MS;

        if (shouldContinuePolling) {
          timeoutId = window.setTimeout(poll, POLL_INTERVAL_MS);
        } else if (!isTerminalStatus(nextOrder.status)) {
          setPollingStopped(true);
        }
      } catch (pollError) {
        if (!isMounted) {
          return;
        }

        setIsLoading(false);
        setError(pollError instanceof Error ? pollError.message : checkoutText.genericError);
      }
    };

    void poll();

    return () => {
      isMounted = false;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [apiBaseUrl, checkoutText.genericError, checkoutText.missingOrder, orderId]);

  const refreshStatus = async () => {
    if (!orderId) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/order-status?id=${encodeURIComponent(orderId)}`);
      const payload = (await response.json().catch(() => null)) as
        | OrderStatusResponse
        | { error?: string }
        | null;

      if (!response.ok || !payload || typeof (payload as OrderStatusResponse).status !== 'string') {
        throw new Error(
          payload && typeof (payload as { error?: string }).error === 'string'
            ? (payload as { error: string }).error
            : 'Could not load this order right now.',
        );
      }

      setOrder(payload as OrderStatusResponse);
      setLastUpdatedAt(new Date().toISOString());
        setPollingStopped(false);
      } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : checkoutText.genericError);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadBundle = () => {
    if (!orderId || !order?.download_token) {
      return;
    }

    window.location.assign(
      `${apiBaseUrl}/api/download?id=${encodeURIComponent(orderId)}&token=${encodeURIComponent(order.download_token)}`,
    );
  };

  const updateFulfillmentField = (field: keyof FulfillmentFormState, value: string) => {
    setFulfillmentForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submitFulfillmentDetails = async () => {
    if (!orderId) {
      return;
    }

    setFulfillmentSubmitting(true);
    setFulfillmentError(null);

    try {
      const response = await fetch(`${apiBaseUrl}/api/orders/${encodeURIComponent(orderId)}/fulfillment-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: fulfillmentForm.email,
          recipient_name: fulfillmentForm.recipientName,
          address_line1: fulfillmentForm.addressLine1,
          address_line2: fulfillmentForm.addressLine2 || undefined,
          postal_code: fulfillmentForm.postalCode,
          city: fulfillmentForm.city,
          state_or_region: fulfillmentForm.stateOrRegion || undefined,
          country: fulfillmentForm.country,
          note: fulfillmentForm.note || undefined,
        }),
      });
      const payload = (await response.json().catch(() => null)) as
        | { fulfillment_details_submitted_at?: string; error?: string }
        | null;

      if (!response.ok || !payload?.fulfillment_details_submitted_at) {
        throw new Error(payload?.error ?? checkoutText.fulfillmentRetry);
      }

      setOrder((current) => current
        ? {
          ...current,
          fulfillment_details_submitted_at: payload.fulfillment_details_submitted_at ?? null,
        }
        : current);
      setFulfillmentForm(EMPTY_FULFILLMENT_FORM);
    } catch (submitError) {
      setFulfillmentError(
        submitError instanceof Error ? submitError.message : checkoutText.fulfillmentRetry,
      );
    } finally {
      setFulfillmentSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-4 md:py-8 px-2 md:px-0 relative">
      <div className="w-full max-w-4xl bg-yellow-400 min-h-[80vh] pixel-shadow border-4 border-black relative overflow-hidden">
        <header className="border-b-4 border-black bg-yellow-400 p-4 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <a href={homeHref} className="flex items-center gap-3 transition-transform hover:scale-105">
              <img
                src="/assets/images/HoB_Logo_only.png"
                alt="Hero of Bitcoin"
                className="h-12 md:h-14 w-auto mix-blend-multiply"
              />
              <div className="hidden md:block">
                <p className="font-pixel text-[10px] uppercase">{checkoutText.headerTitle}</p>
                <p className="text-xs font-mono text-yellow-900">{checkoutText.headerSubtitle}</p>
              </div>
            </a>
            <a
              href={productsHref}
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-yellow-100 transition-colors font-pixel text-[10px]"
            >
              <ArrowLeft size={14} />
              <span>{checkoutText.backToProducts}</span>
            </a>
          </div>
        </header>

        <main className="p-4 md:p-8 bg-[#f8f9fa] min-h-[calc(80vh-92px)]">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <a
                href={homeHref}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-yellow-100 transition-colors font-pixel text-[10px]"
              >
                <ArrowLeft size={14} />
                <span>{checkoutText.backHome}</span>
              </a>
              <button
                type="button"
                onClick={refreshStatus}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-yellow-100 transition-colors font-pixel text-[10px]"
              >
                <RefreshCcw size={14} />
                <span>{checkoutText.refresh}</span>
              </button>
            </div>

            <PixelCard
              variant={order ? statusVariant(order.status) : 'info'}
              title={getStatusTitle(order?.status ?? null, checkoutText)}
            >
              <div className="space-y-4">
                <p className="font-mono text-sm text-gray-700">
                  {isLoading ? checkoutText.loading : getStatusBody(order?.status ?? null, checkoutText)}
                </p>

                {error && (
                  <div className="border border-red-200 bg-red-50 p-3 text-sm font-mono text-red-700">
                    {error}
                  </div>
                )}

                {pollingStopped && order && !isTerminalStatus(order.status) && (
                  <div className="border border-amber-200 bg-amber-50 p-3 text-sm font-mono text-amber-900">
                    {checkoutText.stillWaiting}
                  </div>
                )}

                {order && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="border-2 border-black bg-white p-3">
                        <p className="font-pixel text-[10px] uppercase mb-2">{checkoutText.orderDetails}</p>
                        <dl className="space-y-2 text-sm font-mono text-gray-700">
                          <div>
                            <dt className="font-bold">{checkoutText.orderId}</dt>
                            <dd className="break-all">{order.order_id}</dd>
                          </div>
                          <div>
                            <dt className="font-bold">{checkoutText.product}</dt>
                            <dd>{order.product_name}</dd>
                          </div>
                          <div>
                            <dt className="font-bold">{checkoutText.paymentId}</dt>
                            <dd className="break-all">{order.payment_id ?? '—'}</dd>
                          </div>
                          <div>
                            <dt className="font-bold">{checkoutText.amount}</dt>
                            <dd>{`${order.amount.toFixed(2)} ${order.currency}`}</dd>
                          </div>
                        </dl>
                      </div>

                      <div className="border-2 border-black bg-white p-3">
                        <p className="font-pixel text-[10px] uppercase mb-2">{checkoutText.statusTiming}</p>
                        <dl className="space-y-2 text-sm font-mono text-gray-700">
                          <div>
                            <dt className="font-bold">{checkoutText.createdAt}</dt>
                            <dd>{formatTimestamp(order.created_at, language)}</dd>
                          </div>
                          <div>
                            <dt className="font-bold">{checkoutText.paidAt}</dt>
                            <dd>{formatTimestamp(order.paid_at, language)}</dd>
                          </div>
                          <div>
                            <dt className="font-bold">{checkoutText.downloadsRemaining}</dt>
                            <dd>{order.downloads_remaining ?? '—'}</dd>
                          </div>
                          <div>
                            <dt className="font-bold">{checkoutText.lastUpdated}</dt>
                            <dd>{formatTimestamp(lastUpdatedAt, language)}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {order.status === 'paid' && (
                      <div className="border-2 border-black bg-green-50 p-4">
                        <div className="mb-4 border-2 border-black bg-yellow-300 px-4 py-4 text-center text-black pixel-shadow-sm">
                          <p className="font-pixel text-sm leading-relaxed md:text-lg">
                            {checkoutText.thankYouHeadlineLine1}
                            <br />
                            {checkoutText.thankYouHeadlineLine2}
                          </p>
                        </div>
                        <p className="font-mono text-sm text-green-900 mb-2">
                          {checkoutText.downloadAvailableUntil}{' '}
                          {formatTimestamp(order.download_expires_at ?? null, language)}.
                        </p>
                        <p className="font-mono text-sm text-green-900 mb-3">
                          {checkoutText.downloadHint}
                        </p>
                        <button
                          type="button"
                          onClick={downloadBundle}
                          disabled={!order.download_token}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-pixel border-2 border-black hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          <Download size={16} />
                          <span>{checkoutText.downloadButton}</span>
                        </button>
                        {!order.download_token && (
                          <p className="text-sm font-mono text-red-700 mt-3">{checkoutText.noDownloadsLeft}</p>
                        )}
                      </div>
                    )}

                    {order.status === 'paid' && order.requires_fulfillment_details === 1 && (
                      <div className="border-2 border-black bg-white p-4">
                        <p className="font-pixel text-[10px] uppercase mb-3">
                          {checkoutText.fulfillmentTitle}
                        </p>

                        {order.fulfillment_details_submitted_at ? (
                          <p className="font-mono text-sm text-green-900 bg-green-50 border border-green-200 p-3">
                            {checkoutText.fulfillmentReceived}
                          </p>
                        ) : (
                          <div className="space-y-4">
                            <p className="font-mono text-sm text-gray-700">
                              {checkoutText.fulfillmentBody}
                            </p>

                            <div className="grid gap-3 md:grid-cols-2">
                              <label className="block">
                                <span className="block text-[10px] font-pixel uppercase text-gray-800 mb-2">
                                  {checkoutText.emailLabel}
                                </span>
                                <input
                                  type="email"
                                  value={fulfillmentForm.email}
                                  onChange={(event) => updateFulfillmentField('email', event.target.value)}
                                  className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black focus:outline-none focus:ring-0"
                                  autoComplete="email"
                                  required
                                />
                              </label>
                              <label className="block">
                                <span className="block text-[10px] font-pixel uppercase text-gray-800 mb-2">
                                  {checkoutText.recipientNameLabel}
                                </span>
                                <input
                                  type="text"
                                  value={fulfillmentForm.recipientName}
                                  onChange={(event) => updateFulfillmentField('recipientName', event.target.value)}
                                  className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black focus:outline-none focus:ring-0"
                                  autoComplete="name"
                                  required
                                />
                              </label>
                            </div>

                            <label className="block">
                              <span className="block text-[10px] font-pixel uppercase text-gray-800 mb-2">
                                {checkoutText.addressLine1Label}
                              </span>
                              <input
                                type="text"
                                value={fulfillmentForm.addressLine1}
                                onChange={(event) => updateFulfillmentField('addressLine1', event.target.value)}
                                className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black focus:outline-none focus:ring-0"
                                autoComplete="address-line1"
                                required
                              />
                            </label>

                            <label className="block">
                              <span className="block text-[10px] font-pixel uppercase text-gray-800 mb-2">
                                {checkoutText.addressLine2Label}
                              </span>
                              <input
                                type="text"
                                value={fulfillmentForm.addressLine2}
                                onChange={(event) => updateFulfillmentField('addressLine2', event.target.value)}
                                className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black focus:outline-none focus:ring-0"
                                autoComplete="address-line2"
                              />
                            </label>

                            <div className="grid gap-3 md:grid-cols-2">
                              <label className="block">
                                <span className="block text-[10px] font-pixel uppercase text-gray-800 mb-2">
                                  {checkoutText.postalCodeLabel}
                                </span>
                                <input
                                  type="text"
                                  value={fulfillmentForm.postalCode}
                                  onChange={(event) => updateFulfillmentField('postalCode', event.target.value)}
                                  className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black focus:outline-none focus:ring-0"
                                  autoComplete="postal-code"
                                  required
                                />
                              </label>
                              <label className="block">
                                <span className="block text-[10px] font-pixel uppercase text-gray-800 mb-2">
                                  {checkoutText.cityLabel}
                                </span>
                                <input
                                  type="text"
                                  value={fulfillmentForm.city}
                                  onChange={(event) => updateFulfillmentField('city', event.target.value)}
                                  className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black focus:outline-none focus:ring-0"
                                  autoComplete="address-level2"
                                  required
                                />
                              </label>
                            </div>

                            <div className="grid gap-3 md:grid-cols-2">
                              <label className="block">
                                <span className="block text-[10px] font-pixel uppercase text-gray-800 mb-2">
                                  {checkoutText.stateOrRegionLabel}
                                </span>
                                <input
                                  type="text"
                                  value={fulfillmentForm.stateOrRegion}
                                  onChange={(event) => updateFulfillmentField('stateOrRegion', event.target.value)}
                                  className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black focus:outline-none focus:ring-0"
                                  autoComplete="address-level1"
                                />
                              </label>
                              <label className="block">
                                <span className="block text-[10px] font-pixel uppercase text-gray-800 mb-2">
                                  {checkoutText.countryLabel}
                                </span>
                                <input
                                  type="text"
                                  value={fulfillmentForm.country}
                                  onChange={(event) => updateFulfillmentField('country', event.target.value)}
                                  className="w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black focus:outline-none focus:ring-0"
                                  autoComplete="country-name"
                                  required
                                />
                              </label>
                            </div>

                            <label className="block">
                              <span className="block text-[10px] font-pixel uppercase text-gray-800 mb-2">
                                {checkoutText.noteLabel}
                              </span>
                              <textarea
                                value={fulfillmentForm.note}
                                onChange={(event) => updateFulfillmentField('note', event.target.value)}
                                className="min-h-[88px] w-full border-2 border-black bg-white px-3 py-2 font-mono text-sm text-black focus:outline-none focus:ring-0"
                              />
                            </label>

                            {fulfillmentError && (
                              <p className="text-[11px] font-mono text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                                {fulfillmentError}
                              </p>
                            )}

                            {fulfillmentSubmitting && (
                              <div
                                className="flex items-start gap-3 border border-amber-200 bg-amber-50 px-3 py-3 text-amber-950"
                                aria-live="polite"
                              >
                                <LoaderCircle className="mt-0.5 h-4 w-4 shrink-0 animate-spin" />
                                <p className="text-[11px] font-mono leading-relaxed">
                                  {checkoutText.fulfillmentSubmittingHint}
                                </p>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={submitFulfillmentDetails}
                              disabled={fulfillmentSubmitting}
                              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-black text-white font-pixel border-2 border-black hover:bg-neutral-800 transition-all disabled:bg-gray-500 disabled:cursor-wait"
                            >
                              <span>
                                {fulfillmentSubmitting
                                  ? checkoutText.fulfillmentSubmitting
                                  : checkoutText.fulfillmentSubmit}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </PixelCard>
          </div>
        </main>
      </div>

      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none opacity-10">
        <div className="w-full h-full bg-neutral-900 bg-[radial-gradient(#4b5563_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>
    </div>
  );
};

export default SuccessPage;
