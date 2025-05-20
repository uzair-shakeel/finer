"use client";
import Link from "next/link";
import React, { useCallback, memo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { scrollToHomeFormSection } from "../utils/navigation";

const SkeletonHero = () => (
  <div className="max-w-[1360px] w-full mx-auto bg-white rounded-[20px] md:rounded-[45px] h-[207px] sm:h-[444px] overflow-hidden relative">
    <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>

    <div className="w-full sm:w-[500px] absolute bottom-0 sm:bg-white pb-[9px] sm:py-8 sm:pl-7 z-10">
      <div className="ml-[19px] sm:ml-0 h-[15px] sm:h-[40px] w-[150px] sm:w-[350px] bg-gray-300 animate-pulse rounded mb-1.5 sm:mb-6"></div>

      <div className="sm:block hidden">
        <div className="h-[18px] w-full max-w-[400px] bg-gray-300 animate-pulse rounded mb-2"></div>
        <div className="h-[18px] w-full max-w-[380px] bg-gray-300 animate-pulse rounded mb-2"></div>
        <div className="h-[18px] w-full max-w-[250px] bg-gray-300 animate-pulse rounded"></div>
      </div>

      <div className="ml-[19px] sm:ml-0 block sm:hidden w-[182px] h-[14px] bg-gray-300 animate-pulse rounded mb-1"></div>
      <div className="ml-[19px] sm:ml-0 block sm:hidden w-[160px] h-[14px] bg-gray-300 animate-pulse rounded"></div>

      <div className="mt-3 md:mt-[32px] flex items-center flex-wrap md:flex-nowrap justify-center sm:justify-start gap-3 sm:gap-6">
        <div className="bg-gray-300 animate-pulse w-[100px] sm:w-[120px] rounded-[60px] h-[35px] md:h-[39px]"></div>
        <div className="bg-gray-300 animate-pulse w-[100px] sm:w-[120px] rounded-[60px] h-[35px] md:h-[39px]"></div>
        <div className="bg-gray-300 animate-pulse w-[100px] sm:w-[120px] rounded-[60px] h-[35px] md:h-[39px]"></div>
      </div>
    </div>
  </div>
);

const LiveChatButton = memo(() => {
  return (
    <Link
      href="https://wa.me/447394784277"
      target="_blank"
      className="fixed right-6 bottom-6 md:right-8 md:bottom-8 rounded-[30px] h-[41px] md:h-[47px] w-[95px] md:w-[118px] text-sm md:text-base font-normal md:font-medium bg-[#60FF7D] text-black z-50 animate-subtleBounce hover:animate-none transition-transform flex items-center justify-center"
    >
      Live Chat
    </Link>
  );
});
LiveChatButton.displayName = 'LiveChatButton';

const Hero = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const preloadDesktopImage = document.createElement('link');
    preloadDesktopImage.rel = 'preload';
    preloadDesktopImage.as = 'image';
    preloadDesktopImage.href = '/assets/hero-image-updated.svg';
    document.head.appendChild(preloadDesktopImage);

    const preloadMobileImage = document.createElement('link');
    preloadMobileImage.rel = 'preload';
    preloadMobileImage.as = 'image';
    preloadMobileImage.href = '/assets/mobile-hero-image.svg';
    document.head.appendChild(preloadMobileImage);

    const desktopImg = document.createElement('img');
    const mobileImg = document.createElement('img');
    let loadedCount = 0;

    const checkAllLoaded = () => {
      loadedCount++;
      if (loadedCount >= 2) {
        setLoading(false);
      }
    };

    desktopImg.onload = checkAllLoaded;
    mobileImg.onload = checkAllLoaded;

    desktopImg.src = '/assets/hero-image-updated.svg';
    mobileImg.src = '/assets/mobile-hero-image.svg';

    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => {
      clearTimeout(timeoutId);
      if (document.head.contains(preloadDesktopImage)) {
        document.head.removeChild(preloadDesktopImage);
      }
      if (document.head.contains(preloadMobileImage)) {
        document.head.removeChild(preloadMobileImage);
      }
    };
  }, []);


  const { t } = useTranslation();

  const handleBuyClick = useCallback(() => {
    scrollToHomeFormSection("buy");
  }, []);

  const handleSellClick = useCallback(() => {
    scrollToHomeFormSection("sell");
  }, []);

  return (
    <div className="px-[9px] sm:px-5 mt-[74px] sm:mt-[35px] ">
      {loading ? (
        <SkeletonHero />
      ) : (
        <div className="max-w-[1360px] w-full mx-auto bg-white flex items-center justify-between rounded-[20px] md:rounded-[45px] h-[207px] sm:h-[444px] relative overflow-hidden">
          <div className="w-full text-left sm:w-[500px] z-30 rounded-tr-[30px] absolute bottom-0 sm:bg-white pb-[9px] sm:py-8 sm:pl-7">
            <h1 className="ml-[17px] sm:ml-0 text-[18px] sm:text-[40px] leading-[15px] sm:leading-[95%] font-semibold mb-1.5 sm:mb-6 max-w-[182px] sm:max-w-[417px]">
              Pre-Owned Watches & Jewellery
            </h1>
            <p className="sm:block hidden text-[14px] md:text-[18px] font-normal leading-[100%] md:leading-[114.99999999999999%]">
              We buy, sell, and source luxury watches and jewellery, helping
              collectors save time, elevate their style, and enjoy more of what
              they love.
            </p>
            <p className="ml-[17px] sm:ml-0 block sm:hidden w-[200px] text-[14px] font-normal leading-[14px] md:leading-[114.99999999999999%]">
              We buy, sell, and source luxury watches and jewellery, helping collectors save time.
            </p>
            <div className="mt-3 md:mt-[32px] flex items-center flex-wrap md:flex-nowrap justify-center sm:justify-start gap-3 sm:gap-6">
              <button
                onClick={handleSellClick}
                className="bg-[#017EFE] w-fit px-8 sm:px-10 rounded-[60px] text-white text-[12px] md:text-[16px] font-medium h-[35px] md:h-[39px] transition duration-300 hover:bg-[#003D7B]"
              >
                {t("hero.sellBtn")}
              </button>
              <button
                onClick={handleBuyClick}
                className="bg-[#017EFE] w-fit px-8 sm:px-10 rounded-[60px] text-white text-[12px] md:text-[16px] font-medium h-[35px] md:h-[39px] transition duration-300 hover:bg-[#003D7B]"
              >
                {t("hero.buyBtn")}
              </button>
              <Link
                href="/services"
                className="flex items-center justify-center !leading-[19px] w-fit px-8 sm:px-10 bg-white sm:bg-transparent rounded-[60px] text-[#017EFE] text-[12px] md:text-[16px] font-medium h-[35px] md:h-[39px] transition duration-300 hover:text-white hover:bg-[#017EFE] border-2 border-[#017EFE]"
              >
                Services
              </Link>
            </div>
          </div>
          <picture className="bg-white">
            <source
              media="(min-width: 800px)"
              srcSet="/assets/hero-image-updated.svg"
            />
            <img
              src="/assets/mobile-hero-image.svg"
              alt="Rolex GMT-Master II"
              className="w-full h-full min-h-full absolute inset-0 top-0 bottom-0 left-0 right-0 object-cover bg-white"
              loading="eager"
              fetchPriority="high"
            />
          </picture>
          <LiveChatButton />
        </div>
      )}
    </div>
  );
};

export default memo(Hero);