"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";
import SearchHeader from "../SvgIcons/SearchHeader";
import MobileHeaderSearch from "../SvgIcons/MobileHeaderSearch";

// Constants for navigation links
const NAV_LINKS = [
  { href: "/jewellery", label: "Jewellery" },
  { href: "/#withusyoucan", label: "navbar.ourServices" },
  { href: "/blog", label: "Blog" },
];

// Data for the Watches dropdown menu
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
  popularLinks: [
    "New Arrivals",
    "Rolex Watches",
    "Special Offers",
    "Collections",
  ],
  price: [
    "Under 1000$",
    "1000$ to 5000$",
    "5000$ to 10000$",
  ],
  categories: [
    "Limited Edition",
    "Vintage",
  ],
};

// Reusable Logo Component
const Logo = ({ isScrolled, currentLang }) => (
  <Link href="/" className="relative w-24 h-10 flex items-center justify-center">
    <div className={`absolute transition-all duration-300 ${isScrolled ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>
      <Image src="/assets/logo.svg" alt="Company Logo" width={31} height={40} priority className="ml-6" />
    </div>
    <div className={`absolute transition-all duration-300 ${isScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"}`}>
      <Image src="/assets/scroll-logo.svg" alt="finerlux-logo" width={104} height={24} />
    </div>
  </Link>
);

// Reusable Search Input Component
const SearchInput = ({ isMobile = false }) => (
  <div className={`bg-[#E3E8ED] rounded-[30px] ${isMobile ? "h-[34px] w-full" : "h-[30px] xl:min-w-[180px] xl:max-w-[180px]"} overflow-hidden px-3 relative`}>
    <input
      type="text"
      placeholder="Search"
      className={`h-full ${isMobile ? "text-base leading-[19px]" : "max-w-[120px]"} overflow-hidden bg-transparent outline-none`}
    />
    <SearchHeader />
  </div>
);

// Reusable Nav Link Component
const NavLink = ({ href, label, currentLang, isMobile = false, onClick }) => {
  const { t } = useTranslation();
  const linkHref = label.startsWith("navbar.") ? (currentLang === "en" ? href : `/${currentLang}${href}`) : currentLang === "en" ? href : `/${currentLang}${href}`;
  return (
    <Link
      href={linkHref}
      className={`${isMobile ? "text-sm leading-[17px]" : "px-3 py-1.5 text-base leading-[19px]"} font-normal text-black`}
      onClick={onClick}
    >
      {label.startsWith("navbar.") ? t(label) : label}
    </Link>
  );
};

// Reusable Contact Link Component
const ContactLink = ({ onClick }) => {
  const { t } = useTranslation();
  return (
    <Link
      target="_blank"
      href="https://wa.me/447394784277"
      className="text-base leading-[19px] font-normal text-black flex flex-col lg:flex-row gap-2 lg:gap-3"
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
  const [isWatchesDropdownOpen, setIsWatchesDropdownOpen] = useState(false); // State for dropdown

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const toggleWatchesDropdown = useCallback(() => {
    setIsWatchesDropdownOpen((prev) => !prev);
  }, []);

  // Auto-close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isWatchesDropdownOpen && !event.target.closest(".group")) {
        setIsWatchesDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isWatchesDropdownOpen]);

  useEffect(() => {
    const storedLang = localStorage.getItem("selectedLanguage");
    const langFromPath = window.location.pathname.split("/")[1];
    setCurrentLang(storedLang || (langFromPath === "ru" ? "ru" : "en"));

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (pathname?.includes("/admin")) {
    return null;
  }

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-5">
      <div
        className={`max-w-[1296px] relative bg-white shadow-header mx-auto w-full min-h-[46px] md:pr-[27px] md:pl-[24px] flex items-center justify-between  ${isWatchesDropdownOpen ? "rounded-t-[23px]" : "rounded-[30px]"
          }`}
      >
        {/* Desktop Navigation */}
        <div className="lg:flex hidden items-center justify-between w-full">
          <div className="flex items-center gap-2 xl:gap-3">
            <div className="group">
              <button
                className={`px-3 py-1.5 text-base leading-[19px] font-normal ${isWatchesDropdownOpen ? "bg-[#017EFE] rounded-[30px] text-white" : "text-black"}`}
                onClick={toggleWatchesDropdown} // Toggle on click
              >
                Watches
              </button>
              {/* Dropdown Menu */}
              {isWatchesDropdownOpen && (
                <div
                  className="absolute top-full left-0  rounded-b-[23px] w-full min-w-full bg-white shadow-lg pt-6 px-6 pb-12 z-50"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="max-w-[923px] flex items-start gap-6">
                    {/* Top Brands */}
                    <div className="">
                      <h3 className="text-[20px] leading-[24px] font-semibold mb-4">Top Brands</h3>
                      <div className="flex items-start gap-4">
                        <ul className="flex flex-col items-start gap-2">
                          {WATCHES_DROPDOWN.topBrands.map((brand) => (
                            <li key={brand.label} className="">
                              <Link href={`/watches/${brand.label.toLowerCase().replace(/\s+/g, "-")}`} className="text-base leading-[19px] font-normal">
                                {brand.label} <span className="ml-3 text-sm text-[#828282] leading-[17px]">({brand.count})</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <ul className="flex flex-col items-start gap-2">
                          {WATCHES_DROPDOWN.topBrandsOne.map((brand) => (
                            <li key={brand.label}>
                              <Link href={`/watches/${brand.label.toLowerCase().replace(/\s+/g, "-")}`} className="text-base leading-[19px] font-normal">
                                {brand.label} <span className="ml-3 text-sm text-[#828282] leading-[17px]">({brand.count})</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Popular Links */}
                    <div>
                      <h3 className="text-[20px] leading-[24px] font-semibold mb-4">Popular Links</h3>
                      <ul className="flex flex-col items-start gap-2">
                        {WATCHES_DROPDOWN.popularLinks.map((link) => (
                          <li key={link}>
                            <Link href={`/watches/${link.toLowerCase().replace(/\s+/g, "-")}`} className="text-[16px] leading-[19px] font-normal">
                              {link}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Price */}
                    <div>
                      <h3 className="text-[20px] leading-[24px] font-semibold mb-4">Price</h3>
                      <ul className="flex flex-col items-start gap-2">
                        {WATCHES_DROPDOWN.price.map((range) => (
                          <li key={range}>
                            <Link href={`/watches/price/${range.toLowerCase().replace(/\s+/g, "-").replace(/\$/g, "")}`} className="text-[16px] leading-[19px] font-normal">
                              {range}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Categories */}
                    <div>
                      <h3 className="text-[20px] leading-[24px] font-semibold mb-4">Categories</h3>
                      <ul className="flex flex-col items-start gap-2">
                        {WATCHES_DROPDOWN.categories.map((category) => (
                          <li key={category} className="">
                            <Link href={`/watches/${category.toLowerCase().replace(/\s+/g, "-")}`} className="text-[16px] leading-[19px] font-normal">
                              {category}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <button className="mt-4 w-[180px] h-[39px] hover:bg-[#017EFE] hover:text-white transition duration-300 rounded-[60px] border-2 border-[#017EFE] text-[#017EFE]">
                    <Link href='/products' className="text-[16px] leading-[19px] font-normal ">Shop All Watches</Link>
                  </button>
                </div>
              )}
            </div>
            {NAV_LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} currentLang={currentLang} />
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

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between w-full relative px-3.5 md:px-0" >
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

          <button onClick={toggleMenu} aria-expanded={isMenuOpen} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            <MobileHeaderSearch />
          </button>

          {/* Mobile Menu */}
          <div
            className={`absolute top-full z-50 left-0 right-0 w-full transition-transform duration-300 shadow-header rounded-[30px] ease-in-out ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10 pointer-events-none"}`}
          >
            <div className={`bg-white p-6 overflow-hidden flex flex-col gap-8 ${isMenuOpen ? "rounded-[23px]" : "rounded-[30px]"}`}>
              <SearchInput isMobile />

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <button className="text-sm leading-[17px] font-normal text-black">Watches</button>
                  <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 13.5L7 7.5L0.999999 1.5" stroke="#828282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {NAV_LINKS.map((link) => (
                  <div key={link.href} className="flex items-center gap-4">
                    <NavLink href={link.href} label={link.label} currentLang={currentLang} isMobile onClick={toggleMenu} />
                    {link.label !== "navbar.ourServices" && link.label !== "Blog" && (
                      <svg width="8" height="15" viewBox="0 0 8 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 13.5L7 7.5L0.999999 1.5" stroke="#828282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>

              <div className="px-4m w-full">
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