"use client";
import React, { useState, useEffect } from "react";
import i18n, { initI18n } from "../../i18n";
import { usePathname } from "next/navigation";
import { useTranslation } from 'react-i18next';

const languages = [
     { code: "en", name: "English" },
     { code: "ru", name: "Russian" },
];

const LanguageDropdown = () => {
     const { t } = useTranslation();
     const [currentLang, setCurrentLang] = useState(languages[0]);
     const [isI18nReady, setIsI18nReady] = useState(false);
     const pathname = usePathname();

     useEffect(() => {
          if (typeof window !== "undefined") {
               const savedLang = localStorage.getItem("selectedLanguage") || "en";
               const selectedLang = languages.find((lang) => lang.code === savedLang) || languages[0];
               setCurrentLang(selectedLang);

               initI18n()
                    .then(() => {
                         i18n.changeLanguage(selectedLang.code);
                         setIsI18nReady(true);
                    })
                    .catch(err => {
                         console.error("Failed to initialize i18n:", err);
                    });
          }
     }, []);

     const changeLanguage = (lng) => {
          if (i18n.isInitialized) {
            i18n.changeLanguage(lng);
            const selectedLang = languages.find((lang) => lang.code === lng);
            setCurrentLang(selectedLang);
            if (typeof window !== "undefined") {
              localStorage.setItem("selectedLanguage", lng);
              
              let currentPath = pathname;
              const firstSegment = pathname.split('/')[1];
              if (languages.some(lang => lang.code === firstSegment)) {
                currentPath = pathname.substring(firstSegment.length + 1) || '/';
              }
              
              const newPath = lng === "en" ? currentPath : `/${lng}${currentPath === '/' ? '' : currentPath}`;
              window.location.href = newPath;
            }
          } else {
            console.warn("i18n is not initialized, cannot change language.");
          }
        };

     return (
          <>
               <label htmlFor="language" className="block text-sm md:text-[16px] font-normal text-black mb-1.5 md:mb-3 !leading-[22px]">
               {t("footer.language")}
               </label>
               <div className="relative w-full">
                    <select
                         id="language"
                         name="language"
                         className="w-full lg:w-[306px] px-4 focus:border-[#017EFE] text-base min-h-[33px] md:h-[42px] bg-white appearance-none rounded-[30px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300"
                         value={currentLang.code}
                         onChange={(e) => changeLanguage(e.target.value)}
                    >
                         {languages.map((lang) => (
                              <option key={lang.code} value={lang.code}>{lang.name}</option>
                         ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                         <svg width="15" height="16" viewBox="0 0 15 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M1 4L7.5 12L14 4" stroke="#828282" strokeLinecap="round" strokeLinejoin="round" />
                         </svg>
                    </div>
               </div>
          </>
     );
};

export default LanguageDropdown;