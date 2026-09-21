import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, translations, Translations } from './translations';
import { resolveLanguage, rememberLanguage } from './locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(resolveLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    rememberLanguage(lang);
    document.documentElement.lang = lang;
    // Update URL parameter without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url.toString());
  };

  useEffect(() => {
    document.documentElement.lang = language;
    rememberLanguage(language);
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
