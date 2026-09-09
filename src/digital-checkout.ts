import type { Language } from './i18n/locales';

export interface DigitalCheckoutCopy {
  creating: string;
  invalidDiscount: string;
  unavailable: string;
}

export interface DigitalCheckoutInput {
  language: Language;
  couponCode: string;
  copy: DigitalCheckoutCopy;
}

interface CheckoutResponse {
  checkout_url?: unknown;
}

interface FetchResponse {
  ok: boolean;
  status: number;
  json(): Promise<unknown>;
}

export interface DigitalCheckoutDependencies {
  apiBaseUrl: string;
  fetcher: (url: string, init: RequestInit) => Promise<FetchResponse>;
  navigate: (url: string) => void;
  setBusy: (isBusy: boolean) => void;
  setStatus: (message: string, isError?: boolean) => void;
}

export function submitDigitalCheckoutOnEnter(
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

export function buildDigitalCheckoutPayload(language: Language, couponCode: string): {
  product_id: 'instant-download';
  lang: Language;
  coupon_code?: string;
} {
  const trimmedCouponCode = couponCode.trim();
  return {
    product_id: 'instant-download',
    lang: language,
    ...(trimmedCouponCode ? { coupon_code: trimmedCouponCode } : {}),
  };
}

export class DigitalCheckoutController {
  private isBusy = false;
  private generation = 0;

  constructor(private readonly dependencies: DigitalCheckoutDependencies) {}

  reset(): void {
    this.generation += 1;
    this.isBusy = false;
    this.dependencies.setBusy(false);
    this.dependencies.setStatus('');
  }

  async start(input: DigitalCheckoutInput): Promise<boolean> {
    if (this.isBusy) {
      return false;
    }

    const attempt = ++this.generation;
    const payload = buildDigitalCheckoutPayload(input.language, input.couponCode);
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
        const isInvalidDiscount = response.status === 400 && Boolean(payload.coupon_code);
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
