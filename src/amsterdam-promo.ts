import { LOCALE_BY_LANGUAGE, type Language } from './i18n/locales';

export const AMSTERDAM_PROMO_CODE = 'AMSTERDAM12';
export const AMSTERDAM_PROMO_END = Date.parse('2026-11-09T17:00:00+01:00');

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
