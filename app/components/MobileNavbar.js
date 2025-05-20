"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

const MobileHeaderSearch = () => (
     <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25.96 27.3743C26.3507 27.7646 26.9839 27.7643 27.3742 27.3735C27.7645 26.9828 27.7641 26.3496 27.3734 25.9593L25.96 27.3743ZM26.6667 26.6668L27.3734 25.9593L21.2108 19.8037L20.5041 20.5112L19.7974 21.2188L25.96 27.3743L26.6667 26.6668ZM23.1111 14.2224H22.1111C22.1111 18.5793 18.5791 22.1113 14.2222 22.1113V23.1113V24.1113C19.6837 24.1113 24.1111 19.6839 24.1111 14.2224H23.1111ZM14.2222 23.1113V22.1113C9.8653 22.1113 6.33333 18.5793 6.33333 14.2224H5.33333H4.33333C4.33333 19.6839 8.76073 24.1113 14.2222 24.1113V23.1113ZM5.33333 14.2224H6.33333C6.33333 9.86547 9.8653 6.3335 14.2222 6.3335V5.3335V4.3335C8.76073 4.3335 4.33333 8.7609 4.33333 14.2224H5.33333ZM14.2222 5.3335V6.3335C18.5791 6.3335 22.1111 9.86547 22.1111 14.2224H23.1111H24.1111C24.1111 8.7609 19.6837 4.3335 14.2222 4.3335V5.3335Z" fill="black" />
     </svg>
);

const NAV_LINKS = [
     { href: "/jewellery", label: "Jewellery" },
     { href: "/#withusyoucan", label: "navbar.ourServices" },
     { href: "/blog", label: "Blog" },
];

const Logo = ({ isScrolled, currentLang }) => (
     <Link
          href="/"
          className="relative w-24 h-10 flex items-center justify-center"
     >
          <div
               className={`absolute transition-all duration-300 ${isScrolled ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}
          >
               <Image
                    src="/assets/logo.svg"
                    alt="Company Logo"
                    width={31}
                    height={40}
                    priority
               />
          </div>
          <div
               className={`absolute transition-all duration-300 ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}
          >
               <Image
                    src="/assets/scroll-logo.svg"
                    alt="Finerlux Logo"
                    width={104}
                    height={24}
               />
          </div>
     </Link>
);

const SearchInput = () => (
     <div
          className="bg-[#E3E8ED] rounded-[30px] h-[34px] w-full overflow-hidden px-3 relative flex items-center justify-between"
     >
          <input
               type="text"
               placeholder="Search"
               className="text-base leading-[19px] overflow-hidden bg-transparent outline-none placeholder-gray-500"
          />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M19.2933 20.7075C19.684 21.0978 20.3172 21.0975 20.7075 20.7067C21.0978 20.316 21.0975 19.6828 20.7067 19.2925L19.2933 20.7075ZM20 20L20.7067 19.2925L16.0848 14.6758L15.3781 15.3833L14.6714 16.0908L19.2933 20.7075L20 20ZM17.3333 10.6667H16.3333C16.3333 13.7963 13.7963 16.3333 10.6667 16.3333V17.3333V18.3333C14.9009 18.3333 18.3333 14.9009 18.3333 10.6667H17.3333ZM10.6667 17.3333V16.3333C7.53705 16.3333 5 13.7963 5 10.6667H4H3C3 14.9009 6.43248 18.3333 10.6667 18.3333V17.3333ZM4 10.6667H5C5 7.53705 7.53705 5 10.6667 5V4V3C6.43248 3 3 6.43248 3 10.6667H4ZM10.6667 4V5C13.7963 5 16.3333 7.53705 16.3333 10.6667H17.3333H18.3333C18.3333 6.43248 14.9009 3 10.6667 3V4Z" fill="#828282" />
          </svg>
     </div>
);

const NavLink = ({ href, label, currentLang, onClick }) => {
     const { t } = useTranslation();
     const linkHref =
          label.startsWith("navbar.")
               ? currentLang === "en"
                    ? href
                    : `/${currentLang}${href}`
               : currentLang === "en"
                    ? href
                    : `/${currentLang}${href}`;
     return (
          <Link
               href={linkHref}
               className="text-sm leading-[17px] font-normal text-black transition-colors"
               onClick={onClick}
          >
               {label.startsWith("navbar.") ? t(label) : label}
          </Link>
     );
};

const ContactLink = ({ onClick }) => {
     const { t } = useTranslation();
     return (
          <Link
               target="_blank"
               href="https://wa.me/447394784277"
               className="text-base leading-[19px] font-normal text-black flex flex-col gap-2 transition-colors"
               onClick={onClick}
          >
               <span>{t("navbar.needHelp")}</span>+44 735 558 1510
          </Link>
     );
};

const MobileNavbar = () => {
     const { t } = useTranslation();
     const pathname = usePathname();
     const [currentLang, setCurrentLang] = useState("en");
     const [isScrolled, setIsScrolled] = useState(false);
     const [isMenuOpen, setIsMenuOpen] = useState(false);
     const mobileMenuRef = useRef(null);
     const [menuHeight, setMenuHeight] = useState(0);

     const handleScroll = useCallback(() => {
          setIsScrolled(window.scrollY > 20);
     }, []);

     const toggleMenu = useCallback(() => {
          setIsMenuOpen((prev) => !prev);
     }, []);

     useEffect(() => {
          if (isMenuOpen && mobileMenuRef.current) {
               const height = mobileMenuRef.current.scrollHeight;
               setMenuHeight(height);
          } else {
               setMenuHeight(0);
          }
     }, [isMenuOpen]);

     useEffect(() => {
          const storedLang = localStorage.getItem("selectedLanguage");
          const langFromPath = pathname?.split("/")[1];
          setCurrentLang(storedLang || (langFromPath === "ru" ? "ru" : "en"));

          window.addEventListener("scroll", handleScroll);
          return () => window.removeEventListener("scroll", handleScroll);
     }, [handleScroll, pathname]);

     if (pathname?.includes("/admin")) {
          return null;
     }

     return (
          <header className="fixed top-4 left-0 right-0 z-50 px-5 lg:hidden">
               <div
                    className="max-w-[1296px] relative bg-white shadow-lg mx-auto w-full min-h-[46px] md:pr-[27px] md:pl-[24px] flex flex-col items-center rounded-[30px] overflow-hidden"
               >
                    <div className="flex items-center justify-between w-full relative px-3.5 md:px-0 mt-0.5">
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
                         <Logo isScrolled={isScrolled} currentLang={currentLang} />
                         <button
                              onClick={toggleMenu}
                              aria-expanded={isMenuOpen}
                              aria-label={isMenuOpen ? "Close search" : "Open search"}
                         >
                              <MobileHeaderSearch />
                         </button>
                    </div>
                    <div
                         ref={mobileMenuRef}
                         className="w-full bg-white transition-all duration-300 ease-in-out"
                         style={{
                              height: `${menuHeight}px`,
                              visibility: menuHeight === 0 ? "hidden" : "visible",
                              transitionProperty: "height, visibility",
                         }}
                    >
                         <div className="p-6 flex flex-col gap-8">
                              <SearchInput />
                              <div className="flex flex-col gap-4">
                                   <div>
                                        <button className="flex items-center gap-4">
                                             <h3 className="text-sm leading-[17px] font-normal">Watches</h3>
                                              <svg
                                                       width="8"
                                                       height="15"
                                                       viewBox="0 0 8 15"
                                                       fill="none"
                                                       xmlns="http://www.w3.org/2000/svg"
                                                  >
                                                       <path
                                                            d="M1 13.5L7 7.5L0.999999 1.5"
                                                            stroke="#828282"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                       />
                                                  </svg>
                                        </button>
                                   </div>

                                   {NAV_LINKS.map((link) => (
                                        <div key={link.href} className="flex items-center gap-4">
                                             <NavLink
                                                  href={link.href}
                                                  label={link.label}
                                                  currentLang={currentLang}
                                                  onClick={toggleMenu}
                                             />
                                             {link.label !== "navbar.ourServices" && link.label !== "Blog" && (
                                                  <svg
                                                       width="8"
                                                       height="15"
                                                       viewBox="0 0 8 15"
                                                       fill="none"
                                                       xmlns="http://www.w3.org/2000/svg"
                                                  >
                                                       <path
                                                            d="M1 13.5L7 7.5L0.999999 1.5"
                                                            stroke="#828282"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                       />
                                                  </svg>
                                             )}
                                        </div>
                                   ))}
                              </div>
                              <div className="w-full">
                                   <div className="w-full bg-[#E3E8ED] rounded-[15px] px-5 py-2.5 text-center">
                                        <ContactLink onClick={toggleMenu} />
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </header>
     );
};

export default MobileNavbar;