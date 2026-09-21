import type { Language } from './i18n/locales';

export interface CheckoutCopy {
  creating: string;
  invalidDiscount: string;
  unavailable: string;
}

export type CheckoutProduct = 'instant-download' | 'stackchain-magazine' | 'graded-copy';

export interface CheckoutInput {
  productId?: CheckoutProduct;
  shippingRegion?: 'de_eu' | 'world';
  language: Language;
  couponCode: string;
  copy: CheckoutCopy;
}

interface CheckoutResponse {
  checkout_url?: unknown;
}

interface FetchResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

export interface CheckoutDependencies {
  apiBaseUrl: string;
  fetcher: (url: string, init: RequestInit) => Promise<FetchResponse>;
  navigate: (url: string) => void;
  setBusy: (isBusy: boolean) => void;
  setStatus: (message: string, isError?: boolean) => void;
}

export function submitCheckoutOnEnter(
  event: Pick<KeyboardEvent, 'key' | 'preventDefault'>,
  startCheckout: () => void,
): boolean {
  if (event.key !== 'Enter') {
    return false;
  }

  event.preventDefault();
  startCheckout();
  return true;
}

export function buildCheckoutPayload(input: CheckoutInput) {
  const trimmedCouponCode = input.couponCode.trim();
  return {
    product_id: input.productId ?? 'instant-download',
    lang: input.language,
    ...(input.shippingRegion ? { shipping_region: input.shippingRegion } : {}),
    ...(trimmedCouponCode ? { coupon_code: trimmedCouponCode } : {}),
  };
}

export function normalizeCouponCodeEntry(value: string): string {
  return value.toUpperCase();
}

export class CheckoutController {
  private isBusy = false;
  private generation = 0;

  constructor(private readonly dependencies: CheckoutDependencies) {}

  reset(): void {
    this.generation += 1;
    this.isBusy = false;
    this.dependencies.setBusy(false);
    this.dependencies.setStatus('');
  }

  async start(input: CheckoutInput): Promise<boolean> {
    if (this.isBusy) {
      return false;
    }

    const attempt = ++this.generation;
    const payload = buildCheckoutPayload(input);
    let errorMessage = input.copy.unavailable;
    this.isBusy = true;
    this.dependencies.setBusy(true);
    this.dependencies.setStatus(input.copy.creating);

    try {
      const response = await this.dependencies.fetcher(
        `${this.dependencies.apiBaseUrl}/api/create-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        },
      );
      const responsePayload = (await response.json().catch(() => null)) as CheckoutResponse | null;

      if (attempt !== this.generation) {
        return false;
      }

      if (!response.ok || typeof responsePayload?.checkout_url !== 'string') {
        const isInvalidDiscount = [400, 409].includes(response.status) && Boolean(payload.coupon_code);
        if (isInvalidDiscount) {
          errorMessage = input.copy.invalidDiscount;
        }
        throw new Error('Checkout unavailable');
      }

      this.dependencies.navigate(responsePayload.checkout_url);
      return true;
    } catch {
      if (attempt !== this.generation) {
        return false;
      }

      this.isBusy = false;
      this.dependencies.setBusy(false);
      this.dependencies.setStatus(errorMessage, true);
      return false;
    }
  }
}
