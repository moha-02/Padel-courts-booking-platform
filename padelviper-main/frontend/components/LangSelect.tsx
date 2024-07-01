// components/LanguageSelector.tsx
import React from 'react';
import { useLanguage } from './contexts/LanguageContext'; // Corregir la importación del contexto
import Image from 'next/image';

export default function LanguageSelector(){
  const { language, changeLanguage } = useLanguage();

  const handleLanguageChange = (lng: 'en' | 'es') => {
    if (lng !== language) {
      changeLanguage(lng);
    }
  };

  return (
    <div className='mt-2 md:mr-3 hover:opacity-80'>
      {language === 'en' ? (
        <button type="button" onClick={() => handleLanguageChange('es')}>
          <Image src="/images/sp.png" width={28} height={28} alt="Español" />
        </button>
      ) : (
        <button type="button" onClick={() => handleLanguageChange('en')}>
          <Image src="/images/uk.png" width={28} height={28} alt="Ingles" />
        </button>
      )}
    </div>
  );
};

