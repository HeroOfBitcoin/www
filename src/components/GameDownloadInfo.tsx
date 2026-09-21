import { digitalTranslations } from '../i18n/digital-translations';
import type { Language } from '../i18n/locales';
import GamePlatforms from './GamePlatforms';
import ProductLanguages from './ProductLanguages';

export default function GameDownloadInfo({ language, compact = false }: { language: Language; compact?: boolean }) {
  const copy = digitalTranslations[language];
  return (
    <div className="game-download-info" data-game-download-info>
      <p className="game-download-info__title">{copy.launcherTitle}</p>
      <GamePlatforms />
      {!compact && <p className="game-download-info__features">{copy.launcherFeatures}</p>}
      <p className="game-download-info__label">{copy.gameLanguage}</p>
      <ProductLanguages languages={['en', 'nl', 'fi']} />
      {!compact && <p className="game-download-info__guide">{copy.pdfGuide}</p>}
    </div>
  );
}
