"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

let initializationPromise = null;

const initI18n = async () => {
  // Check if we're already initializing or have initialized
  if (i18n.isInitialized || initializationPromise) {
    return initializationPromise || Promise.resolve(i18n);
  }

  // Create the initialization promise
  initializationPromise = new Promise((resolve) => {
    i18n
      .use(HttpBackend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: "en",
        debug: process.env.NODE_ENV === "development",
        interpolation: {
          escapeValue: false,
        },
        backend: {
          loadPath: "/locales/{{lng}}.json",
        },
        lng: typeof window !== "undefined" 
             ? localStorage.getItem("selectedLanguage") || "en" 
             : "en",
      })
      .then(() => resolve(i18n));
  });

  return initializationPromise;
};

// Only initialize in the browser
if (typeof window !== "undefined") {
  initI18n().catch(console.error);
}

export default i18n;
export { initI18n };