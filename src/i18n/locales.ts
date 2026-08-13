// Keep this order aligned with the launcher's SUPPORTED_LANGUAGES contract.
export const SUPPORTED_LANGUAGES = ['en', 'es', 'it', 'ja', 'de', 'ko', 'fr', 'nl', 'fi'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_OPTIONS: ReadonlyArray<{
  code: Language;
  name: string;
  locale: string;
}> = [
  { code: 'en', name: 'English', locale: 'en-US' },
  { code: 'es', name: 'Español', locale: 'es-ES' },
  { code: 'it', name: 'Italiano', locale: 'it-IT' },
  { code: 'ja', name: '日本語', locale: 'ja-JP' },
  { code: 'de', name: 'Deutsch', locale: 'de-DE' },
  { code: 'ko', name: '한국어', locale: 'ko-KR' },
  { code: 'fr', name: 'Français', locale: 'fr-FR' },
  { code: 'nl', name: 'Nederlands', locale: 'nl-NL' },
  { code: 'fi', name: 'Suomi', locale: 'fi-FI' },
];

export const LOCALE_BY_LANGUAGE: Record<Language, string> = Object.fromEntries(
  LANGUAGE_OPTIONS.map(({ code, locale }) => [code, locale]),
) as Record<Language, string>;

export function isLanguage(value: string | null | undefined): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}
