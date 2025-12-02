import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';

/*
  =============================================================================
  PIXEL ART FLAG BUTTONS
  =============================================================================
  Simple CSS-based pixel art flags for language switching.
  Styled to match the retro Game Boy aesthetic.
  =============================================================================
*/

const PixelFlag: React.FC<{
  lang: Language;
  isActive: boolean;
  onClick: () => void;
}> = ({ lang, isActive, onClick }) => {
  // Pixel art flag designs using CSS
  const getFlagContent = () => {
    switch (lang) {
      case 'en':
        // UK/US inspired - simplified Union Jack style
        return (
          <svg viewBox="0 0 16 12" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
            {/* Background */}
            <rect width="16" height="12" fill="#012169" />
            {/* White diagonals */}
            <path d="M0,0 L16,12 M16,0 L0,12" stroke="#FFF" strokeWidth="2" />
            {/* Red diagonals */}
            <path d="M0,0 L16,12 M16,0 L0,12" stroke="#C8102E" strokeWidth="1" />
            {/* White cross */}
            <rect x="6" y="0" width="4" height="12" fill="#FFF" />
            <rect x="0" y="4" width="16" height="4" fill="#FFF" />
            {/* Red cross */}
            <rect x="7" y="0" width="2" height="12" fill="#C8102E" />
            <rect x="0" y="5" width="16" height="2" fill="#C8102E" />
          </svg>
        );
      case 'es':
        // Spain flag
        return (
          <svg viewBox="0 0 16 12" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
            <rect width="16" height="3" fill="#AA151B" />
            <rect y="3" width="16" height="6" fill="#F1BF00" />
            <rect y="9" width="16" height="3" fill="#AA151B" />
          </svg>
        );
      case 'de':
        // Germany flag
        return (
          <svg viewBox="0 0 16 12" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
            <rect width="16" height="4" fill="#000" />
            <rect y="4" width="16" height="4" fill="#DD0000" />
            <rect y="8" width="16" height="4" fill="#FFCC00" />
          </svg>
        );
    }
  };

  const labels: Record<Language, string> = {
    en: 'EN',
    es: 'ES',
    de: 'DE',
  };

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1 px-2 py-1 border-2 transition-all
        ${isActive
          ? 'border-black bg-white scale-105 pixel-shadow-sm'
          : 'border-transparent hover:border-black/50 hover:bg-yellow-300'
        }
      `}
      title={lang === 'en' ? 'English' : lang === 'es' ? 'Español' : 'Deutsch'}
    >
      <div className="w-5 h-4 border border-black overflow-hidden">
        {getFlagContent()}
      </div>
      <span className="font-pixel text-[8px] hidden sm:inline">{labels[lang]}</span>
    </button>
  );
};

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <PixelFlag lang="en" isActive={language === 'en'} onClick={() => setLanguage('en')} />
      <PixelFlag lang="es" isActive={language === 'es'} onClick={() => setLanguage('es')} />
      <PixelFlag lang="de" isActive={language === 'de'} onClick={() => setLanguage('de')} />
    </div>
  );
};

export default LanguageSwitcher;
