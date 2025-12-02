import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, Translations } from './translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // 1. Check URL parameter first (highest priority for direct links)
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang') as Language;
    if (urlLang && ['en', 'es', 'de'].includes(urlLang)) {
      // Save to localStorage so it persists after navigation
      localStorage.setItem('hob-language', urlLang);
      return urlLang;
    }
    // 2. Check localStorage
    const saved = localStorage.getItem('hob-language') as Language;
    if (saved && ['en', 'es', 'de'].includes(saved)) {
      return saved;
    }
    // 3. Check browser language
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang === 'es') return 'es';
    if (browserLang === 'de') return 'de';
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('hob-language', lang);
    document.documentElement.lang = lang;
    // Update URL parameter without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
  };

  useEffect(() => {
    document.documentElement.lang = language;
    // Ensure URL has lang parameter on initial load
    const url = new URL(window.location.href);
    if (url.searchParams.get('lang') !== language) {
      url.searchParams.set('lang', language);
      window.history.replaceState({}, '', url.toString());
    }
  }, [language]);

  const t = translations[language] as Translations;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
