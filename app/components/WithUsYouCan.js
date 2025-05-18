"use client";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { scrollToHomeFormSection } from "../utils/navigation";

const WithUsYouCan = () => {
  const { t } = useTranslation();

  return (
    <div
      className="scroll-mt-[80px] md:scroll-mt-[80px] px-[9px] sm:px-5 w-full"
      id="withusyoucan"
    >
      <div className="mt-[24px] md:mt-[48px] max-w-[1296px] mx-auto w-full">
        <h2 className="text-[22px] md:text-[36px] font-semibold !leading-[95%] mb-3 md:mb-9">
          {t("withUsYouCan.title")}
        </h2>
        <div className="w-full flex xl:flex-row flex-col items-start gap-3 sm:gap-6">
          <div className="w-full flex flex-col items-start gap-3 sm:gap-6">
            <div className="w-full flex items-center lg:flex-row flex-col gap-3 sm:gap-6">
              {/* Box 1 with Hover Scale Effect */}
              <div
                onClick={() => scrollToHomeFormSection("sell")}
                className="bg-white rounded-[20px] sm:rounded-[30px] w-full xl:max-w-[416px] xl:min-w-[416px] pl-[24px] pt-[24px] relative h-[150px] sm:h-[206px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-103"
              >
                <div className="max-w-[190px] sm:max-w-[300px] lg:max-w-[201px] ">
                  <h2 className="text-black text-[18px] sm:text-[24px] font-semibold !leading-[22px] sm:!leading-[29px] mb-3 sm:mb-[18px]">
                    {t("withUsYouCan.sell.title")}
                  </h2>
                  <p className="text-black text-[14px] sm:text-[16px] font-normal !leading-[120%]">
                    {t("withUsYouCan.sell.description")}
                  </p>
                </div>
                <div className="absolute -right-4 sm:right-1 -bottom-1 sm:-bottom-4">
                  <Image
                    src="/assets/with-us-sell.svg"
                    alt="sell"
                    width={215}
                    height={219}
                    className="sm:w-[215px] sm:h-[219px] w-[150px] h-[154px]"
                  />
                </div>
              </div>
              {/* Box 2 */}
              <div
                onClick={() => scrollToHomeFormSection("buy")}
                className="bg-white rounded-[20px] sm:rounded-[30px] w-full xl:max-w-[526px] pl-[24px] pt-[24px] relative h-[167px] sm:h-[206px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-103"
              >
                <div className="max-w-[184px] sm:max-w-[300px] lg:max-w-[250px] xl:max-w-[271px]">
                  <h2 className="text-black text-[18px] sm:text-[24px] font-semibold !leading-[29px] mb-3 sm:mb-[18px]">
                    {t("withUsYouCan.buy.title")}
                  </h2>
                  <p className="text-black text-[14px] sm:text-[16px] font-normal !leading-[120%]">
                    {t("withUsYouCan.buy.description")}
                  </p>
                </div>
                <div className="absolute right-[4px] sm:right-[30px] -bottom-[4px] sm:bottom-0">
                  <Image
                    src="/assets/with-us-buy.svg"
                    alt="buy"
                    width={183}
                    height={227}
                    className="sm:block hidden"
                  />
                  <Image
                    src="/assets/buytab.svg"
                    alt="buy"
                    width={116}
                    height={145}
                    className="block sm:hidden"
                  />
                </div>
              </div>
            </div>

            <div className="w-full flex items-center lg:flex-row flex-col gap-3 sm:gap-6">
              {/* Box 3 */}
              <div
                onClick={() => scrollToHomeFormSection("part-exchange")}
                className="bg-white rounded-[20px] sm:rounded-[30px] w-full xl:max-w-[526px] pl-[24px] pt-[24px] relative h-[184px] sm:h-[206px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-103"
              >
                <div className="max-w-[174px] sm:max-w-[300px] lg:max-w-[232px]">
                  <h2 className="text-black text-[18px] sm:text-[24px] font-semibold !leading-[29px] mb-3 sm:mb-[18px]">
                    {t("withUsYouCan.partExchange.title")}
                  </h2>
                  <p className="text-black text-[14px] sm:text-[16px] font-normal !leading-[120%]">
                    {t("withUsYouCan.partExchange.description")}
                  </p>
                </div>
                <div className="absolute -right-3 sm:right-0 bottom-8 sm:bottom-0">
                  <Image
                    src="/assets/with-us-part-exchange.svg"
                    alt="part-exchange"
                    width={250}
                    height={197}
                    className="sm:block hidden"
                  />
                  <Image
                    src="/assets/part-exchange.svg"
                    alt="part-exchange"
                    width={133}
                    height={118}
                    className="sm:hidden block"
                  />
                </div>
              </div>
              {/* Box 4 */}
              <div
                onClick={() => scrollToHomeFormSection("source")}
                className="bg-white rounded-[20px] sm:rounded-[30px] w-full xl:max-w-[416px] xl:min-w-[416px] pl-[24px] pt-[24px] relative h-[167px] sm:h-[206px] overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-103"
              >
                <div className="max-w-[171px] sm:max-w-[300px] lg:max-w-[280px] xl:max-w-[188px]">
                  <h2 className="text-black text-[18px] sm:text-[24px] font-semibold !leading-[29px] mb-3 sm:mb-[18px]">
                    {t("withUsYouCan.source.title")}
                  </h2>
                  <p className="text-black text-[14px] sm:text-[16px] font-normal !leading-[120%]">
                    {t("withUsYouCan.source.description")}
                  </p>
                </div>
                <div className="absolute -right-2 sm:right-[20px] -bottom-3 sm:bottom-0">
                  <Image
                    src="/assets/with-us-source.svg"
                    alt="source"
                    width={163}
                    height={220}
                    className="sm:block hidden"
                  />
                  <Image
                    src="/assets/sourcetab.svg"
                    alt="source"
                    width={140}
                    height={140}
                    className="block sm:hidden"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Box 5 */}
          <div
            onClick={() => scrollToHomeFormSection("authenticate")}
            className="bg-white rounded-[20px] sm:rounded-[30px] w-full lg:w-1/2 xl:max-w-[306px] xl:min-w-[306px] overflow-hidden pl-[24px] lg:pl-[24px] pr-[20px] pt-[24px] pb-2.5 h-[201px] lg:h-fit xl:h-[436px] flex xl:flex-col flex-row justify-between relative cursor-pointer transition-transform duration-300 hover:scale-103"
          >
            <div className="xl:max-w-[240px] max-w-[170px] sm:max-w-full">
              <h2 className="text-black text-[18px] sm:text-[24px] font-semibold !leading-[29px] mb-3 sm:mb-[18px]">
                {t("withUsYouCan.authenticate.title")}
              </h2>
              <p className="max-w-[300px] lg:w-fit text-black text-[14px] sm:text-[16px] font-normal !leading-[120%] mb-[15px]">
                {t("withUsYouCan.authenticate.description")}
              </p>
            </div>
            <Image
              src="/assets/authenticateTab.svg"
              alt="authenticate"
              width={192}
              height={245}
              className="xl:w-[192px] xl:h-[245px] w-[120px] h-[153px] sm:w-[150px] sm:h-[170px] absolute lg:static right-1 sm:right-4 bottom-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WithUsYouCan;
