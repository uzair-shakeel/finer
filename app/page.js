"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { initI18n } from "../i18n";
import Hero from "./components/Hero";
import NewArrivals from "./components/NewArrivals";
import WithUsYouCan from "./components/WithUsYouCan";
import Tab from "./components/Tabs/Tab";

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initI18n();

        let preferredLang = "en";

        if (typeof window !== "undefined") {
          const storedLang = localStorage.getItem("selectedLanguage");
          if (storedLang && (storedLang === "en" || storedLang === "ru")) {
            preferredLang = storedLang;
          } else {
            const browserLang = navigator.language.split("-")[0];
            if (browserLang === "ru") {
              preferredLang = "ru";
            }
            localStorage.setItem("selectedLanguage", preferredLang);
          }
        }

        if (preferredLang === "en") {
          router.push("/");
        } else {
          router.push(`/${preferredLang}`);
        }
      } catch (error) {
        console.error("Failed to initialize:", error);
        router.push("/");  
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [router]);

  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: "5px solid #f3f3f3",
          borderTop: "5px solid #017EFE",
          borderRadius: "50%",
          animation: "spin 1s linear infinite"
        }} />
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div>
      <Hero />
      <NewArrivals />
      <WithUsYouCan />
      <Tab />
    </div>
  );
};

export default Page;