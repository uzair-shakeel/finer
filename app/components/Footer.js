"use client";
import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Instagram from "../SvgIcons/Instagram";
import Whatsapp from "../SvgIcons/Whatsapp";
import Telegram from "../SvgIcons/Telegram";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { scrollToHomeFormSection } from "../utils/navigation";
import { usePathname } from "next/navigation";

const LanguageDropdown = dynamic(() => import("./LanguageDropdown"), {
  ssr: false,
  loading: () => (
    <div className="h-[42px] w-full bg-gray-100 rounded-[30px] animate-pulse"></div>
  ),
});

const Footer = () => {
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  const fallbackTranslation = {
    "footer.headline": "We help watch collectors do more of what they love.",
    "footer.rights": "All rights reserved",
    "footer.designBy": "Website design by Toxarolik",
  };

  const { t, ready } = useTranslation();
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    setIsClient(true);
    const storedLang = localStorage.getItem("selectedLanguage");
    const langFromPath = window.location.pathname.split("/")[1];
    const finalLang = storedLang || (langFromPath === "ru" ? "ru" : "en");
    setCurrentLang(finalLang);
  }, []);

  const safeT = (key) => {
    if (ready) return t(key);
    return fallbackTranslation[key] || key;
  };

  // Move conditional return AFTER all hooks are called
  if (pathname?.includes("/admin")) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Content */}
      <div className="relative z-10 pt-[24px] sm:pt-[95px] md:pt-[46px] !pb-0 w-full mx-auto max-w-full">
        <div className="flex items-center justify-center ml-2 sm:ml-10 md:ml-20 mb-[25px]">
          <Image
            src="/assets/finerlux-rabbit-full-logo-blue-footer.svg"
            alt="footer"
            width={162}
            height={213}
            className="md:w-[162px] md:h-[213px] w-[124px] h-[164px]"
          />
        </div>
        <div className="relative max-w-[1120px] w-full mx-auto h-full">
          {/* Background for desktop */}
          {/* <div
            className="hidden lg:block absolute inset-0 z-10 w-full h-full bg-no-repeat bottom-0 -ml-5"
            style={{ backgroundImage: "url('/assets/footer-bg.svg')" }}
          /> */}
          {/* Background for mobile */}
          {/* <div
            className="lg:hidden absolute inset-0 z-10 w-full h-full bg-no-repeat bg-cover"
            style={{ backgroundImage: "url('/assets/footer-bg-mobile.svg')" }}
          /> */}
          <div className="px-5 w-full relative top-0 z-50 left-0 h-full flex flex-col items-center">
            <h2 className="text-[#000000] px-2 sm:px-0 max-w-[545px] text-[24px] md:text-[36px] leading-[95%] font-semibold text-center">
              {safeT("footer.headline")}
            </h2>
            <div className="mb-12 mt-[32px] md:mt-[48px] w-full max-w-[1100px] mx-auto gap-8 grid grid-cols-1 sm:grid-cols-2 lg:flex items-start justify-between">
              <ul className="lg:w-[240px]">
                <li className="text-black text-[18px] md:text-[24px] font-semibold mb-3 lg:mb-6 leading-[22px] sm:leading-[29px]">
                  {t("footer.contacts.title")}
                </li>
                <li className="text-black text-[14px] md:text-[18px] font-normal mb-[12px] lg:mb-[18px] leading-[17px] sm:leading-[22px]">
                  Hatton Garden, London
                </li>
                <li className="text-black text-[14px] md:text-[18px] font-normal mb-[12px] lg:mb-[18px] leading-[17px] sm:leading-[22px]">
                  <a href="mailto:info@finerlux.com">info@finerlux.com</a>
                </li>
                <li className="text-black text-[14px] md:text-[18px] font-normal leading-[17px] sm:leading-[22px]">
                  <a href="tel:++447355581510">+44 735 558 1510</a>
                </li>
              </ul>

              <ul className="lg:w-[140px]">
                <li className="text-black text-[18px] md:text-[24px] font-semibold mb-3 lg:mb-6 leading-[22px] sm:leading-[29px]">
                  {t("footer.services.title")}
                </li>
                {/* <li
                  className="text-black text-[14px] md:text-[18px] font-normal mb-[12px] lg:mb-[18px] !leading-[22px] cursor-pointer hover:text-[#017EFE] transition-colors"
                  onClick={() => scrollToHomeFormSection("sell")}
                >
                  {t("footer.services.sell")}
                </li> */}

                <li
                  className="text-black text-[14px] md:text-[18px] font-normal mb-[12px] lg:mb-[18px] leading-[17px] sm:leading-[22px] cursor-pointer hover:text-[#017EFE] transition-colors"
                  onClick={() => scrollToHomeFormSection("part-exchange")}
                >
                  {t("footer.services.partExchange")}
                </li>
                <li
                  className="text-black text-[14px] md:text-[18px] font-normal mb-[12px] lg:mb-[18px] leading-[17px] sm:leading-[22px] cursor-pointer hover:text-[#017EFE] transition-colors"
                  onClick={() => scrollToHomeFormSection("authenticate")}
                >
                  {t("footer.services.authenticate")}
                </li>
                <li
                  className="text-black text-[14px] md:text-[18px] font-normal mb-[12px] lg:mb-[18px] leading-[17px] sm:leading-[22px] cursor-pointer hover:text-[#017EFE] transition-colors"
                  onClick={() => scrollToHomeFormSection("source")}
                >
                  {t("footer.services.source")}
                </li>
                <li
                  className="text-black text-[14px] md:text-[18px] font-normal leading-[17px] sm:leading-[22px] cursor-pointer hover:text-[#017EFE] transition-colors"
                  onClick={() => scrollToHomeFormSection("buy")}
                >
                  {t("footer.services.buy")}
                </li>
              </ul>

              <ul className="lg:w-[240px]">
                <li className="text-black text-[18px] md:text-[24px] font-semibold mb-3 lg:mb-6 leading-[22px] sm:leading-[29px]">
                  {t("footer.privacy.title")}
                </li>
                <li className="text-black text-[14px] md:text-[18px] font-normal mb-[12px] lg:mb-[18px] leading-[17px] sm:leading-[22px] cursor-pointer hover:text-[#017EFE] transition-colors">
                  <Link href="/terms-condition">Terms & Conditions</Link>
                </li>
                <li className="text-black text-[14px] md:text-[18px] font-normal mb-[12px] lg:mb-[18px] leading-[17px] sm:leading-[22px] cursor-pointer hover:text-[#017EFE] transition-colors">
                  <Link href="/privacy-policy">Privacy policy</Link>
                </li>
                <li className="text-black text-[14px] md:text-[18px] font-normal leading-[17px] sm:leading-[22px]">
                  Copyright © 2025
                </li>
              </ul>

              <div className="lg:max-w-[306px]">
                <div className="w-full">
                  <label
                    htmlFor="currency"
                    className="block text-sm md:text-[16px] font-normal text-black mb-1.5 md:mb-3 !leading-[19px]"
                  >
                    {t("footer.currencyLabel")}
                  </label>
                  <div className="relative w-full">
                    <select
                      id="currency"
                      name="currency"
                      className="w-full lg:w-[306px] px-4 focus:border-[#017EFE] text-base min-h-[33px] md:h-[42px] bg-white appearance-none rounded-[30px] placeholder:text-[#828282] text-black outline-none border transition-colors duration-300"
                    >
                      <option>GBP</option>
                      <option>USD</option>
                      <option>EUR</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg
                        width="15"
                        height="16"
                        viewBox="0 0 15 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1 4L7.5 12L14 4"
                          stroke="#828282"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {isClient && (
                  <div className="w-full mt-3 md:mt-6">
                    <Suspense
                      fallback={
                        <div className="h-[42px] w-full bg-gray-100 rounded-[30px] animate-pulse"></div>
                      }
                    >
                      <LanguageDropdown />
                    </Suspense>
                  </div>
                )}

                <div className="mt-8 sm:mt-6 flex items-center gap-4 md:gap-[30px]">
                  <Link
                    href="https://www.instagram.com/finerlux.co"
                    target="_blank"
                  >
                    <Instagram />
                  </Link>
                  <Link href="https://wa.me/447394784277" target="_blank">
                    <Whatsapp />
                  </Link>
                  {/* <Link href="/" target="_blank">
                  <Telegram/>
                  </Link> */}
                  {/* <Link href="/">
                    <Telegram />
                  </Link> */}
                </div>
              </div>
            </div>
            {/* <h2 className="lg:pb-11 mt-12 lg:mt-[95px] text-center text-[#000000] text-[14px] md:text-[18px] font-normal">
              {safeT("footer.rights")}
            </h2>
            <h2 className="pb-6 pt-[15px] md:pb-11 text-center text-[#000000] text-[14px] font-normal lg:hidden block">
              {safeT("footer.designBy")}
            </h2> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
