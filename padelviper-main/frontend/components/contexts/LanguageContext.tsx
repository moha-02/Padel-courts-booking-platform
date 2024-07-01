// contexts/LanguageContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import i18n from '../../config/i18n';

type Language = 'en' | 'es';

interface LanguageContextProps {
  language: Language;
  changeLanguage: (lng: Language) => void;
}

interface LanguageProviderProps {
  children: ReactNode;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(i18n.language as Language);

  const changeLanguage = (lng: Language) => {
    i18n.changeLanguage(lng);
    setLanguage(lng);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
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
