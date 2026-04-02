import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Download, RefreshCcw } from 'lucide-react';

import PixelCard from './components/ui/PixelCard';
import { getApiBaseUrl } from './lib/api';

type CheckoutStatus = 'pending' | 'processing' | 'paid' | 'expired' | 'underpaid' | 'refunded';

interface OrderStatusResponse {
  status: CheckoutStatus;
  order_id: string;
  payment_id: string | null;
  amount: number;
  currency: string;
  created_at: string;
  paid_at: string | null;
  download_token?: string;
  download_expires_at?: string;
  downloads_remaining?: number;
}

const POLL_INTERVAL_MS = 3_000;
const POLL_WINDOW_MS = 120_000;

function formatTimestamp(value: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-US', {
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

function getStatusTitle(status: CheckoutStatus | null): string {
  if (!status) {
    return 'Digital Delivery';
  }

  switch (status) {
    case 'pending':
      return 'Waiting for payment';
    case 'processing':
      return 'Payment detected';
    case 'paid':
      return 'Payment confirmed';
    case 'expired':
      return 'Checkout expired';
    case 'underpaid':
      return 'Payment underpaid';
    case 'refunded':
      return 'Payment refunded';
  }
}

function getStatusBody(status: CheckoutStatus | null): string {
  if (!status) {
    return 'Checking your order and unlocking your download.';
  }

  switch (status) {
    case 'pending':
      return 'Complete the hosted checkout in your payment window. This page refreshes automatically for up to two minutes.';
    case 'processing':
      return 'The network saw your payment. We are waiting for final confirmation before the ZIP unlocks.';
    case 'paid':
      return 'Your dummy test bundle is ready. Download access is temporary and limited.';
    case 'expired':
      return 'This checkout expired before the payment settled. Start a new test checkout.';
    case 'underpaid':
      return 'A payment was detected, but the full amount has not settled yet.';
    case 'refunded':
      return 'This payment can no longer unlock the download.';
  }
}

const SuccessPage: React.FC = () => {
  const apiBaseUrl = useMemo(() => getApiBaseUrl(), []);
  const orderId = useMemo(() => new URLSearchParams(window.location.search).get('order_id'), []);

  const [order, setOrder] = useState<OrderStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [pollingStopped, setPollingStopped] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setIsLoading(false);
      setError('Missing order reference. Start again from the hidden checkout test page.');
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
              : 'Could not load this order right now.',
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
        setError(pollError instanceof Error ? pollError.message : 'Could not load this order right now.');
      }
    };

    void poll();

    return () => {
      isMounted = false;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [apiBaseUrl, orderId]);

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
      setError(refreshError instanceof Error ? refreshError.message : 'Could not load this order right now.');
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

  return (
    <div className="min-h-screen flex flex-col items-center py-4 md:py-8 px-2 md:px-0 relative">
      <div className="w-full max-w-4xl bg-yellow-400 min-h-[80vh] pixel-shadow border-4 border-black relative overflow-hidden">
        <header className="border-b-4 border-black bg-yellow-400 p-4 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-3 transition-transform hover:scale-105">
              <img
                src="/assets/images/HoB_Logo_only.png"
                alt="Hero of Bitcoin"
                className="h-12 md:h-14 w-auto mix-blend-multiply"
              />
              <div className="hidden md:block">
                <p className="font-pixel text-[10px] uppercase">Digital Delivery</p>
                <p className="text-xs font-mono text-yellow-900">Private payment confirmation and download page</p>
              </div>
            </a>
            <a
              href="/checkout-test.html"
              className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-yellow-100 transition-colors font-pixel text-[10px]"
            >
              <ArrowLeft size={14} />
              <span>TEST CHECKOUT</span>
            </a>
          </div>
        </header>

        <main className="p-4 md:p-8 bg-[#f8f9fa] min-h-[calc(80vh-92px)]">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex flex-wrap gap-3 items-center justify-between">
              <a
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-yellow-100 transition-colors font-pixel text-[10px]"
              >
                <ArrowLeft size={14} />
                <span>BACK TO HOME</span>
              </a>
              <button
                type="button"
                onClick={refreshStatus}
                className="inline-flex items-center gap-2 px-4 py-2 border-2 border-black bg-white hover:bg-yellow-100 transition-colors font-pixel text-[10px]"
              >
                <RefreshCcw size={14} />
                <span>REFRESH STATUS</span>
              </button>
            </div>

            <PixelCard variant={order ? statusVariant(order.status) : 'info'} title={getStatusTitle(order?.status ?? null)}>
              <div className="space-y-4">
                <p className="font-mono text-sm text-gray-700">
                  {isLoading ? 'Checking payment status...' : getStatusBody(order?.status ?? null)}
                </p>

                {error && (
                  <div className="border border-red-200 bg-red-50 p-3 text-sm font-mono text-red-700">
                    {error}
                  </div>
                )}

                {pollingStopped && order && !isTerminalStatus(order.status) && (
                  <div className="border border-amber-200 bg-amber-50 p-3 text-sm font-mono text-amber-900">
                    Still waiting? If you paid on-chain, confirmation can take longer than the auto-refresh window.
                  </div>
                )}

                {order && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="border-2 border-black bg-white p-3">
                        <p className="font-pixel text-[10px] uppercase mb-2">Order Details</p>
                        <dl className="space-y-2 text-sm font-mono text-gray-700">
                          <div>
                            <dt className="font-bold">Order ID</dt>
                            <dd className="break-all">{order.order_id}</dd>
                          </div>
                          <div>
                            <dt className="font-bold">Payment ID</dt>
                            <dd className="break-all">{order.payment_id ?? '—'}</dd>
                          </div>
                          <div>
                            <dt className="font-bold">Amount</dt>
                            <dd>{`${order.amount.toFixed(2)} ${order.currency}`}</dd>
                          </div>
                        </dl>
                      </div>

                      <div className="border-2 border-black bg-white p-3">
                        <p className="font-pixel text-[10px] uppercase mb-2">Status Timing</p>
                        <dl className="space-y-2 text-sm font-mono text-gray-700">
                          <div>
                            <dt className="font-bold">Created</dt>
                            <dd>{formatTimestamp(order.created_at)}</dd>
                          </div>
                          <div>
                            <dt className="font-bold">Paid At</dt>
                            <dd>{formatTimestamp(order.paid_at)}</dd>
                          </div>
                          <div>
                            <dt className="font-bold">Downloads Remaining</dt>
                            <dd>{order.downloads_remaining ?? '—'}</dd>
                          </div>
                          <div>
                            <dt className="font-bold">Last Updated</dt>
                            <dd>{formatTimestamp(lastUpdatedAt)}</dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {order.status === 'paid' && (
                      <div className="border-2 border-black bg-green-50 p-4">
                        <p className="font-mono text-sm text-green-900 mb-2">
                          The temporary checkout token is live until {formatTimestamp(order.download_expires_at ?? null)}.
                        </p>
                        <p className="font-mono text-sm text-green-900 mb-3">
                          Clicking download generates a private file URL for this order only.
                        </p>
                        <button
                          type="button"
                          onClick={downloadBundle}
                          disabled={!order.download_token}
                          className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white font-pixel border-2 border-black hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                          <Download size={16} />
                          <span>DOWNLOAD ZIP</span>
                        </button>
                        {!order.download_token && (
                          <p className="text-sm font-mono text-red-700 mt-3">This order has used all remaining downloads.</p>
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
