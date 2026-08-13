import './styles/podcast.css';
import { podcastTranslations, type PodcastTranslation } from './i18n/podcast-translations';
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
  sats: number | null;
}

interface PriceResponse {
  products?: ProductPrice[];
}

interface CheckoutResponse {
  checkout_url?: string;
}

const apiBaseUrl = getApiBaseUrl();
const checkoutButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-checkout]'));
const statusNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-checkout-status]'));
const languagePicker = document.querySelector<HTMLSelectElement>('[data-language-picker]');
let currentLanguage: Language = 'en';
let currentProductPrice: ProductPrice | null = null;

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

function textFor(copy: PodcastTranslation, key: string | undefined): string | null {
  if (!key || !(key in copy)) {
    return null;
  }

  return copy[key as keyof PodcastTranslation];
}

function interpolate(template: string, replacements: Record<string, string>): string {
  return template.replace(/\{([^}]+)\}/g, (token, key: string) => replacements[key] ?? token);
}

function formatFiat(amount: number, currency: string): string {
  return new Intl.NumberFormat(LOCALE_BY_LANGUAGE[currentLanguage], {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function renderPrice(): void {
  const copy = podcastTranslations[currentLanguage];
  const product = currentProductPrice;
  if (!product || product.amount === null) {
    document.querySelectorAll<HTMLElement>('[data-sats]').forEach((node) => {
      node.textContent = copy.satsUnavailable;
    });
    return;
  }

  document.querySelectorAll<HTMLElement>('[data-price]').forEach((node) => {
    node.textContent = formatFiat(product.amount as number, product.currency);
  });

  const satsText = product.sats
    ? interpolate(copy.satsCurrent, {
        sats: product.sats.toLocaleString(LOCALE_BY_LANGUAGE[currentLanguage]),
      })
    : copy.satsUnavailable;
  document.querySelectorAll<HTMLElement>('[data-sats]').forEach((node) => {
    node.textContent = satsText;
  });
}

function applyLanguage(language: Language): void {
  currentLanguage = language;
  const copy = podcastTranslations[language];

  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
  document.title = copy.pageTitle;
  document.querySelector<HTMLMetaElement>('[data-page-description]')
    ?.setAttribute('content', copy.pageDescription);

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
  const copy = podcastTranslations[currentLanguage];
  checkoutButtons.forEach((button) => {
    button.disabled = isBusy;
    button.setAttribute('aria-busy', String(isBusy));
    const label = button.querySelector<HTMLElement>('[data-i18n]') ?? button;
    const idleLabel = textFor(copy, label.dataset.i18n) ?? copy.buyBundle;
    label.textContent = isBusy ? copy.checkoutBusy : idleLabel;
  });
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

    currentProductPrice = product;
    renderPrice();
  } catch {
    // The server calculates the authoritative total again when checkout starts.
  }
}

async function startCheckout(): Promise<void> {
  if (checkoutButtons.some((button) => button.disabled)) {
    return;
  }

  setCheckoutBusy(true);
  setStatus(podcastTranslations[currentLanguage].checkoutCreating);

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
    setStatus(podcastTranslations[currentLanguage].checkoutUnavailable, true);
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

applyLanguage(resolveInitialLanguage());

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
