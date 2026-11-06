import { LOCALE_BY_LANGUAGE, type Language } from './i18n/locales';
import type { ProductPrice } from './digital';

export const AMSTERDAM_PROMO_CODE = 'AMSTERDAM12';
export const AMSTERDAM_PROMO_END = Date.parse('2026-11-09T17:00:00+01:00');
const discountFactor = 0.88;

export function amsterdamPromoPrice(base: Readonly<ProductPrice>, code: string, now: number): ProductPrice {
  if (now >= AMSTERDAM_PROMO_END || code.trim().toUpperCase() !== AMSTERDAM_PROMO_CODE
      || base.amount === null || !Number.isFinite(base.amount) || base.amount <= 0) return base;

  const baseCents = Math.round(base.amount * 100);
  // Match checkout's integer-cent rounding before estimating the BTC amount.
  const amountCents = Math.max(1, Math.round(baseCents * discountFactor));
  if (amountCents >= baseCents) return base;

  const factor = amountCents / baseCents;
  const baseSats = Math.round(Number(base.btc) * 100_000_000);
  const sats = baseSats > 0 ? Math.max(1, Math.round(baseSats * factor)) : null;
  const referenceFactor = sats === null ? factor : sats / baseSats;
  const reference = (value: number | null, currency: string) => base.currency === currency
    ? amountCents / 100
    : value === null ? null : Number((value * referenceFactor).toFixed(2));

  return {
    ...base,
    amount: amountCents / 100,
    btc: sats === null ? null : (sats / 100_000_000).toFixed(8),
    reference_usd: reference(base.reference_usd, 'USD'),
    reference_eur: reference(base.reference_eur, 'EUR'),
  };
}

export const amsterdamPromoCopy = {
  en: { savings: '12% off', ends: 'Ends in', apply: 'Apply code' },
  es: { savings: '12 % de descuento', ends: 'Termina en', apply: 'Aplicar código' },
  it: { savings: '12% di sconto', ends: 'Scade tra', apply: 'Applica il codice' },
  ja: { savings: '12％オフ', ends: '終了まで', apply: 'コードを適用' },
  de: { savings: '12 % Rabatt', ends: 'Endet in', apply: 'Code anwenden' },
  ko: { savings: '12% 할인', ends: '종료까지', apply: '코드 적용' },
  fr: { savings: '−12 %', ends: 'Se termine dans', apply: 'Appliquer le code' },
  nl: { savings: '12% korting', ends: 'Eindigt over', apply: 'Code toepassen' },
  fi: { savings: '12 % alennus', ends: 'Aikaa jäljellä', apply: 'Käytä koodi' },
} satisfies Record<Language, { savings: string; ends: string; apply: string }>;

export function amsterdamPromoCountdown(now: number, language: Language): string | null {
  const seconds = Math.ceil((AMSTERDAM_PROMO_END - now) / 1_000);
  if (seconds <= 0) return null;

  const days = Math.floor(seconds / 86_400);
  const hours = Math.floor(seconds / 3_600) % 24;
  const minutes = Math.floor(seconds / 60) % 60;
  const clock = [hours, minutes, seconds % 60].map(value => String(value).padStart(2, '0')).join(':');
  if (days === 0) return clock;

  const dayCount = new Intl.NumberFormat(LOCALE_BY_LANGUAGE[language], {
    style: 'unit', unit: 'day', unitDisplay: 'narrow',
  }).format(days);
  return `${dayCount} ${clock}`;
}
