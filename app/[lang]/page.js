"use client";
import React, { useEffect } from "react";
import Hero from "../components/Hero";
import Tab from "../components/Tabs/Tab";
import { useTranslation } from "react-i18next";
import { I18nextProvider } from "react-i18next";
import NewArrivals from "../components/NewArrivals";
import WithUsYouCan from "../components/WithUsYouCan";

const LanguagePage = () => {
  const { i18n } = useTranslation();
  useEffect(() => {
    const getLanguage = () => {
      if (typeof window !== "undefined") {
        const pathLang = window.location.pathname.split("/")[1];
        const storedLang = localStorage.getItem("selectedLanguage");
        return pathLang === "ru" ? "ru" : storedLang || "en";
      }
      return "en";
    };

    const selectedLang = getLanguage();

    if (i18n.isInitialized) {
      i18n.changeLanguage(selectedLang).catch((err) => {
        console.error("Error changing language:", err);
      });
      localStorage.setItem("selectedLanguage", selectedLang);
    }
  }, [i18n]);

  return (
    <I18nextProvider i18n={i18n}>
      <Hero />
      <NewArrivals />
      <WithUsYouCan />
      <Tab />
    </I18nextProvider>
  );
};

export const getStaticPaths = async () => {
  return {
    paths: [{ params: { lang: "en" } }, { params: { lang: "ru" } }],
    fallback: false,
  };
};

export default LanguagePage;
