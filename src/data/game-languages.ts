// Public game availability. Interface languages are managed separately.
export const DIGITAL_GAME_LANGUAGES = ['en', 'nl', 'fi', 'it'] as const;
export type GameLanguage = typeof DIGITAL_GAME_LANGUAGES[number];
export const BETA_GAME_LANGUAGES: readonly GameLanguage[] = ['it'];
const names: Record<GameLanguage, string> = {
  en: 'English', nl: 'Nederlands', fi: 'Suomi', it: 'Italiano',
};
export function gameLanguageName(language: GameLanguage): string {
  return names[language] + (BETA_GAME_LANGUAGES.includes(language) ? ' (Beta)' : '');
}
