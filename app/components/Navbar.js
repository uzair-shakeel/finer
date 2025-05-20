"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

const SearchHeader = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.2933 20.7075C19.684 21.0978 20.3172 21.0975 20.7075 20.7067C21.0978 20.316 21.0975 19.6828 20.7067 19.2925L19.2933 20.7075ZM20 20L20.7067 19.2925L16.0848 14.6758L15.3781 15.3833L14.6714 16.0908L19.2933 20.7075L20 20ZM17.3333 10.6667H16.3333C16.3333 13.7963 13.7963 16.3333 10.6667 16.3333V17.3333V18.3333C14.9009 18.3333 18.3333 14.9009 18.3333 10.6667H17.3333ZM10.6667 17.3333V16.3333C7.53705 16.3333 5 13.7963 5 10.6667H4H3C3 14.9009 6.43248 18.3333 10.6667 18.3333V17.3333ZM4 10.6667H5C5 7.53705 7.53705 5 10.6667 5V4V3C6.43248 3 3 6.43248 3 10.6667H4ZM10.6667 4V5C13.7963 5 16.3333 7.53705 16.3333 10.6667H17.3333H18.3333C18.3333 6.43248 14.9009 3 10.6667 3V4Z" fill="#828282" />
  </svg>
);

const MobileHeaderSearch = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25.96 27.3743C26.3507 27.7646 26.9839 27.7643 27.3742 27.3735C27.7645 26.9828 27.7641 26.3496 27.3734 25.9593L25.96 27.3743ZM26.6667 26.6668L27.3734 25.9593L21.2109 19.8037L20.5042 20.5112L19.7974 21.2188L25.96 27.3743L26.6667 26.6668ZM23.1111 14.2224H22.1111C22.1111 18.5793 18.5791 22.1113 14.2222 22.1113V23.1113V24.1113C19.6837 24.1113 24.1111 19.6839 24.1111 14.2224H23.1111ZM14.2222 23.1113V22.1113C9.86532 22.1113 6.33334 18.5793 6.33334 14.2224H5.33334H4.33334C4.33334 19.6839 8.76075 24.1113 14.2222 24.1113V23.1113ZM5.33334 14.2224H6.33334C6.33334 9.86547 9.86532 6.3335 14.2222 6.3335V5.3335V4.3335C8.76075 4.3335 4.33334 8.7609 4.33334 14.2224H5.33334ZM14.2222 5.3335V6.3335C18.5791 6.3335 22.1111 9.86547 22.1111 14.2224H23.1111H24.1111C24.1111 8.7609 19.6837 4.3335 14.2222 4.3335V5.3335Z" fill="black" />
  </svg>
);

const NAV_LINKS = [
  { href: "/jewellery", label: "Jewellery" },
  { href: "/#withusyoucan", label: "navbar.ourServices" },
  { href: "/blog", label: "Blog" },
];

const WATCHES_DROPDOWN = {
  topBrands: [
    { label: "Rolex", count: 120 },
    { label: "Cartier", count: 120 },
    { label: "Omega", count: 71 },
    { label: "Breitling", count: 132 },
    { label: "Hublot", count: 21 },
  ],
  topBrandsOne: [
    { label: "Patek Philippe", count: 120 },
    { label: "Audemars Piguet", count: 132 },
    { label: "Vacheron Constantin", count: 71 },
    { label: "Jaeger-LeCoultre", count: 21 },
  ],
  popularLinks: ["New Arrivals", "Rolex Watches", "Special Offers", "Collections"],
  price: ["Under 1000$", "1000$ to 5000$", "5000$ to 10000$"],
  categories: ["Limited Edition", "Vintage"],
};

const Logo = ({ isScrolled, currentLang }) => (
  <Link
    href="/"
    className="relative w-24 h-10 flex items-center justify-center"
  >
    <div
      className={`absolute transition-all duration-300 ${isScrolled ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
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
      className={`absolute transition-all duration-300 ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
        }`}
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

const SearchInput = ({ isMobile = false }) => (
  <div
    className={`bg-[#E3E8ED] rounded-[30px] ${isMobile ? "h-[34px] w-full" : "h-[30px] xl:min-w-[180px] xl:max-w-[180px]"
      } overflow-hidden px-3 relative flex items-center justify-between`}
  >
    <input
      type="text"
      placeholder="Search"
      className={`h-full ${isMobile ? "text-base leading-[19px]" : "max-w-[120px]"
        } overflow-hidden bg-transparent outline-none placeholder-gray-500`}
    />
    <SearchHeader />
  </div>
);

const NavLink = ({ href, label, currentLang, isMobile = false, onClick }) => {
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
      className={`${isMobile
        ? "text-sm leading-[17px]"
        : "px-3 py-1.5 text-base leading-[19px]"
        } font-normal text-black   transition-colors`}
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
      className="text-base leading-[19px] font-normal text-black flex flex-col lg:flex-row gap-2 lg:gap-3   transition-colors"
      onClick={onClick}
    >
      <span>{t("navbar.needHelp")}</span>+44 735 558 1510
    </Link>
  );
};

const Navbar = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState("en");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isWatchesDropdownOpen, setIsWatchesDropdownOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const [menuHeight, setMenuHeight] = useState(0);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const toggleWatchesDropdown = useCallback(() => {
    setIsWatchesDropdownOpen((prev) => !prev);
  }, []);

  // Calculate and set the menu height when it opens
  useEffect(() => {
    if (isMenuOpen && mobileMenuRef.current) {
      // Set actual height when menu opens
      const height = mobileMenuRef.current.scrollHeight;
      setMenuHeight(height);
    } else {
      // Reset height when menu closes
      setMenuHeight(0);
    }
  }, [isMenuOpen, isWatchesDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isWatchesDropdownOpen &&
        !event.target.closest(".watches-dropdown-container")
      ) {
        setIsWatchesDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isWatchesDropdownOpen]);

  useEffect(() => {
    const storedLang = localStorage.getItem("selectedLanguage");
    const langFromPath = pathname?.split("/")[1];
    setCurrentLang(storedLang || (langFromPath === "ru" ? "ru" : "en"));

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, pathname]);

  useEffect(() => {
    console.log("Current pathname:", pathname);
  }, [pathname]);

  if (pathname?.includes("/admin")) {
    return null;
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-5">
      <div
        className={`max-w-[1296px] relative bg-white shadow-lg mx-auto w-full min-h-[46px] md:pr-[27px] md:pl-[24px] hidden lg:flex items-center justify-between ${isWatchesDropdownOpen ? "rounded-t-[23px]" : "rounded-[30px]"
          }`}
      >
        {/* Desktop Navigation */}
        <div className="lg:flex hidden items-center justify-between w-full">
          <div className="flex items-center gap-2 xl:gap-3">
            <div className="watches-dropdown-container group">
              <button
                className={`px-3 py-1.5 text-base leading-[19px] font-normal ${isWatchesDropdownOpen
                  ? "bg-[#017EFE] rounded-[30px] text-white"
                  : "text-black"
                  } hover:bg-[#017EFE] hover:text-white transition-colors rounded-[30px]`}
                onClick={toggleWatchesDropdown}
              >
                Watches
              </button>
              {isWatchesDropdownOpen && (
                <div
                  className="absolute top-full left-0 rounded-b-[23px] w-full bg-white shadow-lg pt-6 px-6 pb-12 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-w-[923px] flex items-start gap-6">
                    {/* Top Brands */}
                    <div>
                      <h3 className="text-[20px] leading-[24px] font-semibold mb-4">
                        Top Brands
                      </h3>
                      <div className="flex items-start gap-4">
                        <ul className="flex flex-col items-start gap-2">
                          {WATCHES_DROPDOWN.topBrands.map((brand) => (
                            <li key={brand.label}>
                              <Link
                                href={`/watches/${brand.label
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="text-base leading-[19px] font-normal"
                              >
                                {brand.label}{" "}
                                <span className="ml-3 text-sm text-[#828282] leading-[17px]">
                                  ({brand.count})
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <ul className="flex flex-col items-start gap-2">
                          {WATCHES_DROPDOWN.topBrandsOne.map((brand) => (
                            <li key={brand.label}>
                              <Link
                                href={`/watches/${brand.label
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                className="text-base leading-[19px] font-normal "
                              >
                                {brand.label}{" "}
                                <span className="ml-3 text-sm text-[#828282] leading-[17px]">
                                  ({brand.count})
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    {/* Popular Links */}
                    <div>
                      <h3 className="text-[20px] leading-[24px] font-semibold mb-4">
                        Popular Links
                      </h3>
                      <ul className="flex flex-col items-start gap-2">
                        {WATCHES_DROPDOWN.popularLinks.map((link) => (
                          <li key={link}>
                            <Link
                              href={`/watches/${link
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                              className="text-[16px] leading-[19px] font-normal "
                            >
                              {link}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Price */}
                    <div>
                      <h3 className="text-[20px] leading-[24px] font-semibold mb-4">
                        Price
                      </h3>
                      <ul className="flex flex-col items-start gap-2">
                        {WATCHES_DROPDOWN.price.map((range) => (
                          <li key={range}>
                            <Link
                              href={`/watches/price/${range
                                .toLowerCase()
                                .replace(/\s+/g, "-")
                                .replace(/\$/g, "")}`}
                              className="text-[16px] leading-[19px] font-normal  "
                            >
                              {range}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* Categories */}
                    <div>
                      <h3 className="text-[20px] leading-[24px] font-semibold mb-4">
                        Categories
                      </h3>
                      <ul className="flex flex-col items-start gap-2">
                        {WATCHES_DROPDOWN.categories.map((category) => (
                          <li key={category}>
                            <Link
                              href={`/watches/${category
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                              className="text-[16px] leading-[19px] font-normal  "
                            >
                              {category}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button
                    className="mt-4 w-[180px] h-[39px] hover:bg-[#017EFE] hover:text-white transition duration-300 rounded-[60px] border-2 border-[#017EFE] text-[#017EFE]"
                  >
                    <Link
                      href="/products"
                      className="text-[16px] leading-[19px] font-normal"
                    >
                      Shop All Watches
                    </Link>
                  </button>
                </div>
              )}
            </div>
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                currentLang={currentLang}
              />
            ))}
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 h-10 flex items-center justify-center">
            <Logo isScrolled={isScrolled} currentLang={currentLang} />
          </div>
          <div className="flex items-center gap-4">
            <SearchInput />
            <ContactLink />
          </div>
        </div>
        
      </div>

      {/* Mobile Navigation */}
      <div
        className={`max-w-[1296px] relative bg-white shadow-lg mx-auto w-full min-h-[46px] md:pr-[27px] md:pl-[24px] lg:hidden flex items-center justify-between ${isMenuOpen ? "rounded-t-[30px]" : "rounded-[30px]"
          }`}
      >
        <div className="flex items-center justify-between w-full relative px-3.5 md:px-0">
          <button
            onClick={toggleMenu}
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="flex items-center"
          >
            <Image
              src={isMenuOpen ? "/assets/close-menu.svg" : "/assets/menu.svg"}
              alt={isMenuOpen ? "Close menu" : "Open menu"}
              width={30}
              height={30}
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

          {/* Mobile Menu Content */}
          <div
            ref={mobileMenuRef}
            className={`absolute top-full z-50 left-0 right-0 w-full shadow-lg bg-white rounded-b-[30px] transition-all duration-300 ease-in-out overflow-hidden`}
            style={{ 
              height: `${menuHeight}px`,
              visibility: menuHeight === 0 ? 'hidden' : 'visible',
              transitionProperty: "height, visibility",
            }}
          >
            <div className="p-6 flex flex-col gap-8 rounded-b-[30px]">
              <SearchInput isMobile />
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <button
                    className={`text-sm leading-[17px] font-normal transition-colors duration-300 ${isWatchesDropdownOpen ? "text-[#017EFE]" : "text-black hover:text-[#017EFE]"
                      }`}
                    onClick={toggleWatchesDropdown}
                  >
                    Watches
                  </button>
                  <svg
                    width="8"
                    height="15"
                    viewBox="0 0 8 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`transition-transform duration-300 ${isWatchesDropdownOpen ? "rotate-90" : ""
                      }`}
                  >
                    <path
                      d="M1 13.5L7 7.5L0.999999 1.5"
                      stroke="#828282"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                {NAV_LINKS.map((link, index) => (
                  <div
                    key={link.href}
                    className="flex items-center gap-4"
                  >
                    <NavLink
                      href={link.href}
                      label={link.label}
                      currentLang={currentLang}
                      isMobile
                      onClick={toggleMenu}
                    />
                    {link.label !== "navbar.ourServices" &&
                      link.label !== "Blog" && (
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
              <div
                className="w-full"
              >
                <div className="w-full bg-[#E3E8ED] rounded-[15px] px-5 py-2.5 text-center">
                  <ContactLink onClick={toggleMenu} />
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