export const SUPPORTED_LANGUAGES = ['en', 'es', 'de', 'ko'] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_OPTIONS: ReadonlyArray<{
  code: Language;
  name: string;
  locale: string;
}> = [
  { code: 'en', name: 'English', locale: 'en-US' },
  { code: 'es', name: 'Español', locale: 'es-ES' },
  { code: 'de', name: 'Deutsch', locale: 'de-DE' },
  { code: 'ko', name: '한국어', locale: 'ko-KR' },
];

export const LOCALE_BY_LANGUAGE: Record<Language, string> = Object.fromEntries(
  LANGUAGE_OPTIONS.map(({ code, locale }) => [code, locale]),
) as Record<Language, string>;

export function isLanguage(value: string | null | undefined): value is Language {
  return SUPPORTED_LANGUAGES.includes(value as Language);
}
