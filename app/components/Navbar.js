"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState("en");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem("selectedLanguage");
    const langFromPath = window.location.pathname.split("/")[1];
    const finalLang = storedLang || (langFromPath === "ru" ? "ru" : "en");
    setCurrentLang(finalLang);

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Skip rendering navbar on admin pages
  if (pathname?.includes("/admin")) {
    return null;
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-5">
      <div className="max-w-[1296px] bg-white shadow-header mx-auto w-full rounded-[30px] min-h-[46px] md:pr-[26px] md:pl-[26px] lg:pl-[32px] flex items-center justify-between">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <Link
              href={
                currentLang === "en"
                  ? "#withusyoucan"
                  : `${currentLang}#withusyoucan`
              }
              className="px-3 py-1.5 text-black text-base font-normal"
            >
              {t("navbar.ourServices")}
            </Link>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 h-10 flex items-center justify-center">
            <Link
              href="/"
              className="relative w-24 h-10 flex items-center justify-center"
            >
              <div
                className={`absolute transition-all duration-300 ${
                  isScrolled
                    ? "opacity-0 translate-y-3"
                    : "opacity-100 translate-y-0"
                }`}
              >
                <Image
                  src="/assets/logo.svg"
                  alt="Company Logo"
                  width={31}
                  height={40}
                  priority
                  className="ml-6"
                />
              </div>
              <div
                className={`absolute transition-all duration-300 ${
                  isScrolled
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 -translate-y-3"
                }`}
              >
                <Image
                  src="/assets/scroll-logo.svg"
                  alt="finerlux-logo"
                  width={104}
                  height={24}
                />
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-6 lg:gap-[48px]">
            <button className="text-black text-base font-normal">
              <Link
                target="_blank"
                href="https://wa.me/447394784277"
                className="flex items-center text-black text-base font-normal"
              >
                {t("navbar.chat")}
              </Link>
            </button>
            <Link
              target="_blank"
              href="https://wa.me/447394784277"
              className="flex items-center text-black text-base font-normal"
            >
              <span className="mr-2">{t("navbar.needHelp")}</span>+44 735 558
              1510
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-between w-full relative px-3.5 md:px-0">
          <button
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="flex items-center"
          >
            <Image
              src={isMenuOpen ? "/assets/close-menu.svg" : "/assets/menu.svg"}
              alt={isMenuOpen ? "Close menu" : "Open menu"}
              width={32}
              height={32}
            />
          </button>

          <Link
            href="/"
            className="relative w-24 h-8 flex items-center justify-center"
          >
            <div
              className={`absolute transition-all duration-300 ${
                isScrolled
                  ? "opacity-0 translate-y-3"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <Image
                src="/assets/logo.svg"
                alt="Company Logo"
                width={31}
                height={40}
              />
            </div>
            <div
              className={`absolute transition-all duration-300 ${
                isScrolled
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-3"
              }`}
            >
              <Image
                src="/assets/scroll-logo.svg"
                alt="finerlux-logo"
                width={94}
                height={24}
              />
            </div>
          </Link>

          <button>
            <Link href="https://wa.me/447394784277" target="_blank">
              <Image
                src="/assets/chat-icon.svg"
                alt="chat"
                width={26}
                height={26}
              />
            </Link>
          </button>

          {/* Mobile Menu */}
          <div
            className={`absolute top-[38px] z-50 left-0 right-0 w-full transition-transform duration-300 shadow-header rounded-[30px] ease-in-out ${
              isMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-10 pointer-events-none"
            }`}
          >
            <div className="bg-white rounded-[30px] py-7 overflow-hidden flex flex-col items-center text-center gap-4">
              <ul className="space-y-4">
                <li>
                  <Link
                    href={
                      currentLang === "en"
                        ? "#withusyoucan"
                        : `${currentLang}#withusyoucan`
                    }
                    className="text-base font-normal text-black"
                    onClick={toggleMenu}
                  >
                    {t("navbar.ourServices")}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/"
                    className="text-base font-normal text-black"
                    onClick={toggleMenu}
                  >
                    {t("navbar.main")}
                  </Link>
                </li>
              </ul>
              <div className="mt-4 px-4">
                <div className="w-fit mx-auto bg-[#E3E8ED] rounded-[15px] px-5 py-2.5 text-center">
                  <Link
                    href="https://wa.me/447394784277"
                    target="_blank"
                    onClick={toggleMenu}
                    className="text-base font-normal text-black flex flex-col"
                  >
                    <span className="mr-2">{t("navbar.needHelp")}</span>+44 735
                    558 1510
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
