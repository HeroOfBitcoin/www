import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';
import { LANGUAGE_OPTIONS } from '../i18n/locales';
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
    case 'it':
      // Italy flag
      return (
        <svg viewBox="0 0 16 12" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          <rect width="5.33" height="12" fill="#009246" />
          <rect x="5.33" width="5.34" height="12" fill="#FFF" />
          <rect x="10.67" width="5.33" height="12" fill="#CE2B37" />
        </svg>
      );
    case 'ja':
      // Japan flag
      return (
        <svg viewBox="0 0 16 12" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          <rect width="16" height="12" fill="#FFF" />
          <circle cx="8" cy="6" r="3" fill="#BC002D" />
        </svg>
      );
    case 'fr':
      // France flag
      return (
        <svg viewBox="0 0 16 12" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          <rect width="5.33" height="12" fill="#0055A4" />
          <rect x="5.33" width="5.34" height="12" fill="#FFF" />
          <rect x="10.67" width="5.33" height="12" fill="#EF4135" />
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
    case 'ko':
      // South Korea flag
      return (
        <svg viewBox="0 0 16 12" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          <rect width="16" height="12" fill="#FFF" />
          <circle cx="8" cy="6" r="2.5" fill="#CD2E3A" />
          <path d="M5.5,6 A2.5,2.5 0 0 0 10.5,6 A1.25,1.25 0 0 1 8,6 A1.25,1.25 0 0 0 5.5,6" fill="#0047A0" />
          <g stroke="#111" strokeWidth="0.55">
            <path d="M2.2,2.5 L4.2,1.3 M2.6,3.2 L4.6,2" />
            <path d="M11.4,10 L13.4,8.8 M11.8,10.7 L13.8,9.5" />
            <path d="M11.4,2 L13.4,3.2 M11.8,1.3 L13.8,2.5" />
            <path d="M2.2,9.5 L4.2,10.7 M2.6,8.8 L4.6,10" />
          </g>
        </svg>
      );
    case 'nl':
      // Netherlands flag
      return (
        <svg viewBox="0 0 16 12" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          <rect width="16" height="4" fill="#AE1C28" />
          <rect y="4" width="16" height="4" fill="#FFF" />
          <rect y="8" width="16" height="4" fill="#21468B" />
        </svg>
      );
    case 'fi':
      // Finland flag
      return (
        <svg viewBox="0 0 16 12" className="w-full h-full" style={{ imageRendering: 'pixelated' }}>
          <rect width="16" height="12" fill="#FFF" />
          <rect x="4" width="2.5" height="12" fill="#003580" />
          <rect y="4.75" width="16" height="2.5" fill="#003580" />
        </svg>
      );
  }
};

const languageNames = Object.fromEntries(
  LANGUAGE_OPTIONS.map(({ code, name }) => [code, name]),
) as Record<Language, string>;

const languageLabels: Record<Language, string> = {
  en: 'Language: English',
  es: 'Idioma: Español',
  it: 'Lingua: Italiano',
  ja: '言語：日本語',
  de: 'Sprache: Deutsch',
  ko: '언어: 한국어',
  fr: 'Langue : Français',
  nl: 'Taal: Nederlands',
  fi: 'Kieli: Suomi',
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

  const languages = LANGUAGE_OPTIONS.map(({ code }) => code);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Current language button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 py-1 border-2 border-black bg-white hover:bg-yellow-100 transition-all md:min-h-[44px] md:px-1.5"
        title={languageNames[language]}
        aria-label={languageLabels[language]}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="w-5 h-4 border border-black overflow-hidden">
          <FlagIcon lang={language} />
        </div>
        <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div role="listbox" className="absolute top-full left-0 mt-1 bg-white border-2 border-black shadow-lg z-50 min-w-[132px] max-h-[70vh] overflow-y-auto">
          {languages.map((lang) => (
            <button
              key={lang}
              onClick={() => handleSelect(lang)}
              role="option"
              aria-selected={lang === language}
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
