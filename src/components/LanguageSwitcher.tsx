import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';
import { ChevronDown } from 'lucide-react';

/*
  =============================================================================
  PIXEL ART FLAG DROPDOWN
  =============================================================================
  Compact dropdown language switcher with pixel art flags.
  Shows current language flag, click to reveal dropdown with all options.
  =============================================================================
*/

const FlagIcon: React.FC<{ lang: Language }> = ({ lang }) => {
  switch (lang) {
    case 'en':
      // UK flag
      return (
        <svg viewBox="0 0 16 12" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          <rect width="16" height="12" fill="#012169" />
          <path d="M0,0 L16,12 M16,0 L0,12" stroke="#FFF" strokeWidth="2" />
          <path d="M0,0 L16,12 M16,0 L0,12" stroke="#C8102E" strokeWidth="1" />
          <rect x="6" y="0" width="4" height="12" fill="#FFF" />
          <rect x="0" y="4" width="16" height="4" fill="#FFF" />
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

const languageNames: Record<Language, string> = {
  en: 'English',
  es: 'Español',
  de: 'Deutsch',
};

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    setIsOpen(false);
  };

  const languages: Language[] = ['en', 'es', 'de'];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current language button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 border-2 border-black bg-white hover:bg-yellow-100 transition-all"
        title={languageNames[language]}
      >
        <div className="w-5 h-4 border border-black overflow-hidden">
          <FlagIcon lang={language} />
        </div>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border-2 border-black shadow-lg z-50 min-w-[100px]">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleSelect(lang)}
              className={`flex items-center gap-2 w-full px-2 py-1.5 hover:bg-yellow-100 transition-colors ${
                lang === language ? 'bg-yellow-200' : ''
              }`}
            >
              <div className="w-5 h-4 border border-black overflow-hidden">
                <FlagIcon lang={lang} />
              </div>
              <span className="font-pixel text-[8px]">{languageNames[lang]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
