import { FlagIcon } from './LanguageSwitcher';

import { BETA_GAME_LANGUAGES, gameLanguageName, type GameLanguage } from '../data/game-languages';
import '../styles/game-languages.css';
export type { GameLanguage } from '../data/game-languages';

export default function ProductLanguages({ languages }: { languages: readonly GameLanguage[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs" data-game-languages={languages.join(',')}>
      {languages.map((language) => (
        <li key={language} className="inline-flex items-center gap-2 whitespace-nowrap">
          <span className="inline-block h-4 w-5 shrink-0 overflow-hidden border border-black/30" aria-hidden="true">
            <FlagIcon lang={language} />
          </span>
          <span lang={language}>
            {gameLanguageName(language)}
            {BETA_GAME_LANGUAGES.includes(language) && <> <small className="game-language-beta">BETA</small></>}
          </span>
        </li>
      ))}
    </ul>
  );
}
