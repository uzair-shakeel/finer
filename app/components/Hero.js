"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { scrollToHomeFormSection } from "../utils/navigation";

export const LiveChatButton = () => {
  return (
    <button className="fixed right-6 bottom-6 md:right-8 md:bottom-8 rounded-[30px] h-[41px] md:h-[47px] w-[95px] md:w-[118px]  text-sm md:text-base font-normal md:font-medium bg-[#60FF7D] text-black z-50 animate-subtleBounce hover:animate-none transition-transform">
      <Link href="https://wa.me/447394784277" target="_blank" >Live Chat</Link>
    </button>
  );
};

export const Content = () => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState("en");

  useEffect(() => {
    const storedLang = localStorage.getItem("selectedLanguage");
    const langFromPath = window.location.pathname.split("/")[1];
    const finalLang = storedLang || (langFromPath === "ru" ? "ru" : "en");
    setCurrentLang(finalLang);
  }, []);

  return (
    <div className="w-full text-left sm:w-[500px] z-30 rounded-tr-[30px] absolute bottom-0 sm:bg-white pb-[9px] sm:py-8 sm:pl-7">
      <h1 className="ml-[19px] sm:ml-0 text-[16px] sm:text-[40px] leading-[15px] sm:leading-[95%] font-semibold mb-1.5 sm:mb-6 max-w-[170px] sm:max-w-[417px]">
        Pre-Owned Watches & Jewellery
      </h1>
      <p className="sm:block hidden text-[14px] md:text-[18px] font-normal leading-[100%] md:leading-[114.99999999999999%]">
        We buy, sell, and source luxury watches and jewellery, helping collectors save time, elevate their style, and enjoy more of what they love.
      </p>
      <p className="ml-[19px] sm:ml-0 block sm:hidden w-[182px] text-[12px] font-normal leading-[14px] md:leading-[114.99999999999999%]">
        We buy, sell, and source luxury watches, helping collectors save time and enjoy more of
      </p>
      <div className="mt-3 md:mt-[32px] flex items-center flex-wrap md:flex-nowrap justify-center sm:justify-start gap-3 sm:gap-6">
        <button
          onClick={() => scrollToHomeFormSection("buy")}
          className="bg-[#017EFE] w-fit px-8 sm:px-10 rounded-[60px] text-white text-[12px] md:text-[16px] font-medium h-[35px] md:h-[39px] transition duration-300 hover:bg-[#003D7B]"
        >
          {t("hero.buyBtn")}
        </button>
        <button
          onClick={() => scrollToHomeFormSection("sell")}
          className="bg-[#017EFE] w-fit px-8 sm:px-10 rounded-[60px] text-white text-[12px] md:text-[16px] font-medium h-[35px] md:h-[39px] transition duration-300 hover:bg-[#003D7B]"
        >
          {t("hero.sellBtn")}
        </button>
        <Link
          href="/services"
          className="flex items-center justify-center !leading-[19px] w-fit px-8 sm:px-10 bg-white sm:bg-transparent rounded-[60px] text-[#017EFE] text-[12px] md:text-[16px] font-medium h-[35px] md:h-[39px] transition duration-300 hover:text-white hover:bg-[#017EFE] border-2 border-[#017EFE]"
        >
          Services
        </Link>
      </div>
    </div>
  );
};


const Hero = () => {
  const { t } = useTranslation();

  return (
    <div className="px-5 mt-[74px] sm:mt-[35px]">
      <div className="max-w-[1360px] w-full mx-auto bg-white flex items-center justify-between rounded-[20px] md:rounded-[45px] h-[207px] sm:h-[444px] relative overflow-hidden">
        <Content />

        <img
          src="/assets/hero-image-updated.svg"
          alt="Rolex GMT-Master II"
          className="w-full h-full min-h-full ml-5 absolute inset-0 top-0 bottom-0 left-0 right-0 object-cover sm:block hidden"
        />
        <img
          src="/assets/mobile-hero-image.svg"
          alt="Rolex GMT-Master II"
          className="w-full h-full min-h-full absolute inset-0 top-0 bottom-0 left-0 right-0 object-cover block sm:hidden"
        />

        <LiveChatButton />
      </div>
    </div>
  );
};

export default Hero;
