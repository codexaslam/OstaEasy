import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

// Translation files
import en from "./locales/en.json";
import fi from "./locales/fi.json";
import sv from "./locales/sv.json";

const resources = {
  en: {
    translation: en,
  },
  fi: {
    translation: fi,
  },
  sv: {
    translation: sv,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
    },
  });

export default i18n;
