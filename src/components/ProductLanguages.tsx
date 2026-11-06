import { BETA_GAME_LANGUAGES, gameLanguageName, type GameLanguage } from '../data/game-languages';
import '../styles/game-languages.css';
export type { GameLanguage } from '../data/game-languages';

export default function ProductLanguages({ languages }: { languages: readonly GameLanguage[] }) {
  return (
    <ul className="game-language-list" role="list" data-game-languages={languages.join(',')}>
      {languages.map((language) => (
        <li key={language}>
          <img src={`/assets/flags/${language}.svg`} width="20" height="15" alt="" />
          <span lang={language}>{gameLanguageName(language)}</span>
          {BETA_GAME_LANGUAGES.includes(language) && <small className="game-language-beta">Beta</small>}
        </li>
      ))}
    </ul>
  );
}
