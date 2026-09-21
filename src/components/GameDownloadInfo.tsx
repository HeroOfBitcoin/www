import { digitalTranslations } from '../i18n/digital-translations';
import type { Language } from '../i18n/locales';
import GamePlatforms from './GamePlatforms';
import ProductLanguages from './ProductLanguages';

export default function GameDownloadInfo({ language }: { language: Language }) {
  const copy = digitalTranslations[language];
  return (
    <div className="game-download-info" data-game-download-info>
      <p className="game-download-info__title">{copy.launcherTitle}</p>
      <GamePlatforms />
      <p className="game-download-info__features">{copy.launcherFeatures}</p>
      <p className="game-download-info__label">{copy.gameLanguage}</p>
      <ProductLanguages languages={['en', 'nl', 'fi']} />
      <p className="game-download-info__guide">{copy.pdfGuide}</p>
    </div>
  );
}
