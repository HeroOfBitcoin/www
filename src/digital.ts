import './styles/digital.css';
import { digitalTranslations, type DigitalTranslation } from './i18n/digital-translations';
import {
  LANGUAGE_OPTIONS,
  LOCALE_BY_LANGUAGE,
  isLanguage,
  type Language,
} from './i18n/locales';
import { getApiBaseUrl } from './lib/api';

interface ProductPrice {
  id: string;
  amount: number | null;
  currency: string;
  btc: string | null;
  reference_usd: number | null;
  reference_eur: number | null;
}

interface PriceResponse {
  products?: ProductPrice[];
}

interface BtcRatePayload {
  USD?: unknown;
  EUR?: unknown;
}

interface BtcRates {
  usdPerBtc: number;
  eurPerBtc: number;
}

interface CheckoutResponse {
  checkout_url?: string;
}

const fastRateUrl = 'https://mempool.space/api/v1/prices';
const fastRateDelayMs = 180;
const fastRateTimeoutMs = 2_000;
const apiBaseUrl = getApiBaseUrl();
const checkoutButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-checkout]'));
const statusNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-checkout-status]'));
const languagePicker = document.querySelector<HTMLSelectElement>('[data-language-picker]');
const priceNode = document.querySelector<HTMLElement>('[data-btc-price]');
const reviewNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-review]'));
const reviewIndexNode = document.querySelector<HTMLElement>('[data-review-index]');
const previousReviewButton = document.querySelector<HTMLButtonElement>('[data-review-prev]');
const nextReviewButton = document.querySelector<HTMLButtonElement>('[data-review-next]');
const initialPriceUsd = Number(priceNode?.dataset.priceUsd);
let currentLanguage: Language = 'en';
let currentProductPrice: ProductPrice | null = null;
let fastRates: BtcRates | null = null;
let hasServerBtcPrice = false;
let activeReviewIndex = 0;

function readStoredLanguage(): Language | null {
  try {
    const storedLanguage = window.localStorage.getItem('hob-language');
    return isLanguage(storedLanguage) ? storedLanguage : null;
  } catch {
    return null;
  }
}

function resolveInitialLanguage(): Language {
  const urlLanguage = new URL(window.location.href).searchParams.get('lang');
  if (isLanguage(urlLanguage)) {
    return urlLanguage;
  }

  const storedLanguage = readStoredLanguage();
  if (storedLanguage) {
    return storedLanguage;
  }

  for (const browserLocale of navigator.languages) {
    const browserLanguage = browserLocale.toLowerCase().split('-')[0];
    if (isLanguage(browserLanguage)) {
      return browserLanguage;
    }
  }

  return 'en';
}

function textFor(copy: DigitalTranslation, key: string | undefined): string | null {
  if (!key || !(key in copy)) {
    return null;
  }

  return copy[key as keyof DigitalTranslation];
}

function formatFiat(amount: number, currency: string): string {
  return new Intl.NumberFormat(LOCALE_BY_LANGUAGE[currentLanguage], {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function readPositiveRate(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : null;
}

function parseBtcRates(payload: BtcRatePayload): BtcRates | null {
  const usdPerBtc = readPositiveRate(payload.USD);
  const eurPerBtc = readPositiveRate(payload.EUR);
  return usdPerBtc !== null && eurPerBtc !== null
    ? { usdPerBtc, eurPerBtc }
    : null;
}

function buildFastPrice(amountUsd: number, rates: BtcRates): ProductPrice {
  const sats = Math.max(1, Math.round((amountUsd / rates.usdPerBtc) * 100_000_000));
  const roundedBtc = sats / 100_000_000;

  return {
    id: 'instant-download',
    amount: amountUsd,
    currency: 'USD',
    btc: roundedBtc.toFixed(8),
    reference_usd: amountUsd,
    reference_eur: Number((roundedBtc * rates.eurPerBtc).toFixed(2)),
  };
}

function renderPrice(): void {
  const product = currentProductPrice;
  if (!product) {
    return;
  }

  document.querySelectorAll<HTMLElement>('[data-btc-price]').forEach((node) => {
    node.textContent = product.btc ? `${product.btc} BTC` : '— BTC';
  });

  const referenceUsd = product.reference_usd
    ?? (product.currency === 'USD' ? product.amount : null);
  const referenceEur = product.reference_eur
    ?? (product.currency === 'EUR' ? product.amount : null);

  if (referenceUsd !== null) {
    document.querySelectorAll<HTMLElement>('[data-reference-usd]').forEach((node) => {
      node.textContent = formatFiat(referenceUsd, 'USD');
    });
  }
  if (referenceEur !== null) {
    document.querySelectorAll<HTMLElement>('[data-reference-eur]').forEach((node) => {
      node.textContent = formatFiat(referenceEur, 'EUR');
    });
  }
}

function applyLanguage(language: Language): void {
  currentLanguage = language;
  const copy = digitalTranslations[language];

  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
  document.title = copy.pageTitle;
  document.querySelectorAll<HTMLMetaElement>('[data-page-description], [data-social-description]')
    .forEach((node) => node.setAttribute('content', copy.pageDescription));
  document.querySelectorAll<HTMLMetaElement>('[data-social-title]')
    .forEach((node) => node.setAttribute('content', copy.pageTitle));

  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach((node) => {
    const text = textFor(copy, node.dataset.i18n);
    if (text !== null) {
      node.textContent = text;
    }
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-aria]').forEach((node) => {
    const text = textFor(copy, node.dataset.i18nAria);
    if (text !== null) {
      node.setAttribute('aria-label', text);
    }
  });
  document.querySelectorAll<HTMLImageElement>('[data-i18n-alt]').forEach((node) => {
    const text = textFor(copy, node.dataset.i18nAlt);
    if (text !== null) {
      node.alt = text;
    }
  });

  if (languagePicker) {
    languagePicker.value = language;
    languagePicker.setAttribute('aria-label', copy.languageLabel);
  }

  try {
    window.localStorage.setItem('hob-language', language);
  } catch {
    // The URL remains the durable language state when storage is unavailable.
  }

  const url = new URL(window.location.href);
  url.searchParams.set('lang', language);
  window.history.replaceState({}, '', url);
  setStatus('');
  renderPrice();
}

function setStatus(message: string, isError = false): void {
  statusNodes.forEach((node) => {
    node.textContent = message;
    node.dataset.error = String(isError);
  });
}

function setCheckoutBusy(isBusy: boolean): void {
  const copy = digitalTranslations[currentLanguage];
  checkoutButtons.forEach((button) => {
    button.disabled = isBusy;
    button.setAttribute('aria-busy', String(isBusy));
    const label = button.querySelector<HTMLElement>('[data-i18n]') ?? button;
    const idleLabel = textFor(copy, label.dataset.i18n) ?? copy.buyWithBitcoin;
    label.textContent = isBusy ? copy.checkoutBusy : idleLabel;
  });
}

function showReview(index: number): void {
  if (reviewNodes.length === 0) {
    return;
  }

  activeReviewIndex = (index + reviewNodes.length) % reviewNodes.length;
  reviewNodes.forEach((node, reviewIndex) => {
    node.hidden = reviewIndex !== activeReviewIndex;
  });
  if (reviewIndexNode) {
    reviewIndexNode.textContent = String(activeReviewIndex + 1);
  }
}

async function loadPrice(): Promise<void> {
  try {
    const response = await fetch(`${apiBaseUrl}/api/products/prices`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as PriceResponse;
    const product = payload.products?.find((entry) => entry.id === 'instant-download');
    if (!product || product.amount === null) {
      return;
    }

    hasServerBtcPrice = typeof product.btc === 'string' && product.btc.length > 0;
    if (!hasServerBtcPrice && fastRates && product.currency === 'USD') {
      currentProductPrice = buildFastPrice(product.amount, fastRates);
    } else {
      currentProductPrice = product;
    }
    renderPrice();
  } catch {
    // The server calculates the authoritative total again when checkout starts.
  }
}

async function loadFastPrice(): Promise<void> {
  if (hasServerBtcPrice || !Number.isFinite(initialPriceUsd) || initialPriceUsd <= 0) {
    return;
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), fastRateTimeoutMs);

  try {
    const response = await fetch(fastRateUrl, {
      credentials: 'omit',
      headers: { Accept: 'application/json' },
      referrerPolicy: 'no-referrer',
      signal: controller.signal,
    });
    if (!response.ok) {
      return;
    }

    const rates = parseBtcRates((await response.json()) as BtcRatePayload);
    if (!rates || hasServerBtcPrice) {
      return;
    }

    fastRates = rates;
    const serverAmount = currentProductPrice?.currency === 'USD'
      ? currentProductPrice.amount
      : null;
    currentProductPrice = buildFastPrice(serverAmount ?? initialPriceUsd, rates);
    renderPrice();
  } catch {
    // The server request remains the privacy-preserving and authoritative fallback.
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function startCheckout(): Promise<void> {
  if (checkoutButtons.some((button) => button.disabled)) {
    return;
  }

  setCheckoutBusy(true);
  setStatus(digitalTranslations[currentLanguage].checkoutCreating);

  try {
    const response = await fetch(`${apiBaseUrl}/api/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        product_id: 'instant-download',
        lang: currentLanguage,
      }),
    });
    const payload = (await response.json().catch(() => null)) as CheckoutResponse | null;

    if (!response.ok || typeof payload?.checkout_url !== 'string') {
      throw new Error('Checkout unavailable');
    }

    window.location.assign(payload.checkout_url);
  } catch {
    setCheckoutBusy(false);
    setStatus(digitalTranslations[currentLanguage].checkoutUnavailable, true);
  }
}

if (languagePicker) {
  for (const option of Array.from(languagePicker.options)) {
    const languageOption = LANGUAGE_OPTIONS.find(({ code }) => code === option.value);
    if (languageOption) {
      option.textContent = languageOption.name;
    }
  }

  languagePicker.addEventListener('change', () => {
    if (isLanguage(languagePicker.value)) {
      applyLanguage(languagePicker.value);
    }
  });
}

checkoutButtons.forEach((button) => {
  button.addEventListener('click', startCheckout);
});

previousReviewButton?.addEventListener('click', () => {
  showReview(activeReviewIndex - 1);
});

nextReviewButton?.addEventListener('click', () => {
  showReview(activeReviewIndex + 1);
});

applyLanguage(resolveInitialLanguage());
showReview(activeReviewIndex);

const revealNodes = document.querySelectorAll<HTMLElement>('[data-reveal]');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.setAttribute('data-visible', 'true');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.setAttribute('data-visible', 'true'));
}

void loadPrice();
// Warm responses stay first-party; only a slow scale-to-zero wake-up uses the public rate fallback.
window.setTimeout(() => {
  if (!currentProductPrice?.btc) {
    void loadFastPrice();
  }
}, fastRateDelayMs);
