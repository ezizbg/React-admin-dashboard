import { useCallback, useEffect, useMemo, useState } from "react";
import { I18nContext } from "./i18nContext";
import { languages, translations } from "./translations";

const STORAGE_KEY = "adminflow_language";
const DEFAULT_LANGUAGE = "ru";

function getStoredLanguage() {
  const storedLanguage = localStorage.getItem(STORAGE_KEY);
  return translations[storedLanguage] ? storedLanguage : DEFAULT_LANGUAGE;
}

function getValue(dictionary, key) {
  return key.split(".").reduce((value, part) => value?.[part], dictionary);
}

function interpolate(value, params) {
  return Object.entries(params).reduce(
    (text, [key, replacement]) => text.replaceAll(`{${key}}`, String(replacement)),
    value
  );
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(getStoredLanguage);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((nextLanguage) => {
    if (!translations[nextLanguage]) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, nextLanguage);
    setLanguageState(nextLanguage);
  }, []);

  const t = useCallback(
    (key, params = {}) => {
      const value = getValue(translations[language], key) ?? getValue(translations[DEFAULT_LANGUAGE], key) ?? key;
      return typeof value === "string" ? interpolate(value, params) : key;
    },
    [language]
  );

  const value = useMemo(
    () => ({
      language,
      languages,
      setLanguage,
      t
    }),
    [language, setLanguage, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
