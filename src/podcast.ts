import './styles/podcast.css';
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
  error?: string;
}

const apiBaseUrl = getApiBaseUrl();
const checkoutButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-checkout]'));
const statusNodes = Array.from(document.querySelectorAll<HTMLElement>('[data-checkout-status]'));

function formatFiat(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

function setStatus(message: string, isError = false): void {
  statusNodes.forEach((node) => {
    node.textContent = message;
    node.dataset.error = String(isError);
  });
}

function setCheckoutBusy(isBusy: boolean): void {
  checkoutButtons.forEach((button) => {
    button.disabled = isBusy;
    button.setAttribute('aria-busy', String(isBusy));
    const label = button.querySelector('span') ?? button;
    if (!button.dataset.label) {
      button.dataset.label = label.textContent ?? 'Buy the digital bundle';
    }
    label.textContent = isBusy ? 'Opening secure checkout…' : button.dataset.label;
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

    document.querySelectorAll<HTMLElement>('[data-price]').forEach((node) => {
      node.textContent = formatFiat(product.amount as number, product.currency);
    });
    document.querySelectorAll<HTMLElement>('[data-currency]').forEach((node) => {
      node.textContent = product.currency;
    });

    const satsText = product.sats
      ? `About ${product.sats.toLocaleString('en-US')} sats at the current rate`
      : 'Bitcoin amount is fixed when checkout opens';
    document.querySelectorAll<HTMLElement>('[data-sats]').forEach((node) => {
      node.textContent = satsText;
    });
  } catch {
    // The server calculates the authoritative total again when checkout starts.
  }
}

async function startCheckout(): Promise<void> {
  if (checkoutButtons.some((button) => button.disabled)) {
    return;
  }

  setCheckoutBusy(true);
  setStatus('Creating your Bitcoin + Lightning checkout…');

  try {
    const response = await fetch(`${apiBaseUrl}/api/create-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        product_id: 'instant-download',
        lang: 'en',
      }),
    });
    const payload = (await response.json().catch(() => null)) as CheckoutResponse | null;

    if (!response.ok || typeof payload?.checkout_url !== 'string') {
      throw new Error(payload?.error ?? 'Checkout is temporarily unavailable');
    }

    window.location.assign(payload.checkout_url);
  } catch (error) {
    setCheckoutBusy(false);
    setStatus(
      error instanceof Error ? error.message : 'Checkout is temporarily unavailable',
      true,
    );
  }
}

checkoutButtons.forEach((button) => {
  button.addEventListener('click', startCheckout);
});

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
