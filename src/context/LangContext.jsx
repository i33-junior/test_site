import { createContext, useContext, useState } from 'react';
import { translations, fieldLabelMap } from '../i18n/translations';

const LangContext = createContext(null);

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('admin_lang') || 'pl');

  const switchLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('admin_lang', newLang);
  };

  const t = (key) => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[lang] || entry.pl || key;
  };

  const fieldLabel = (fieldName) => {
    const tKey = fieldLabelMap[fieldName];
    if (!tKey) return fieldName;
    return t(tKey);
  };

  return (
    <LangContext.Provider value={{ lang, switchLang, t, fieldLabel }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
