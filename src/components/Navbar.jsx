import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useBooking } from "../context/BookingContext";
import logo from "../assets/GMP-Prive-Beauty-and-fitness (2) (1).png";

const Navbar = ({ onCartClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const { language, toggleLanguage, t } = useLanguage();
  const { getCartCount } = useBooking();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = scrolled ? "text-white" : "text-white";
  const hoverColor = "hover:text-amber-400";

  return (
    <>
      {/* MARQUEE ANNOUNCEMENT BANNER */}
      {showBanner && (                                      
        <div className="fixed top-0 left-0 right-0 z-[30]  bg-gradient-to-br from-amber-400 to-yellow-700 text-white overflow-hidden shadow-lg">
          <div className="relative flex items-center h-10">
            {/* Close Button */}
            <button
              onClick={() => setShowBanner(false)}
              className="absolute left-2 sm:left-4 z-10 w-6 h-6 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full transition-all"
              aria-label="Close banner"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Marquee Content */}
          {/* Marquee Content */}
<div className="marquee-container w-full">
 <div className={`marquee-content ${language === "ar" ? "reverse" : ""}`}>

  {t?.banner?.items?.map((item, index) => (
    <span
      key={index}
      className="inline-flex items-center gap-3 px-8 text-sm sm:text-base font-semibold whitespace-nowrap"
    >
      {item}
    </span>
  ))}

  {t?.banner?.items?.map((item, index) => (
    <span
      key={"dup-" + index}
      className="inline-flex items-center gap-3 px-8 text-sm sm:text-base font-semibold whitespace-nowrap"
    >
      {item}
    </span>
  ))}

</div>

</div>

          </div>
        </div>
      )}

      {/* MAIN NAVBAR */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          showBanner ? "top-10" : "top-0"
        } ${
          scrolled
            ? "bg-black/95 backdrop-blur-md shadow-2xl"
            : "bg-transparent backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* TOP BAR */}
          <div className="flex items-center justify-between h-16">
            {/* LOGO */}
            <a href="/" className="flex items-center space-x-3">
              <img
                src={logo}
                alt="GMP Privé"
                className="h-14 w-auto object-contain"
              />
            </a>

            {/* DESKTOP MENU */}
           {/* DESKTOP MENU */}
<div className="hidden md:flex items-center space-x-8">
  <a href="/" className={`${textColor} ${hoverColor} font-semibold transition-colors`}>
    {t.nav.home}
  </a>

  <a href="#about" className={`${textColor} ${hoverColor} font-semibold transition-colors`}>
    {t.nav.about}
  </a>

  <a href="#packages" className={`${textColor} ${hoverColor} font-semibold transition-colors`}>
    {t.nav.packages || "Packages"}
  </a>

  <a href="#services" className={`${textColor} ${hoverColor} font-semibold transition-colors`}>
    {t.nav.services || "Services"}
  </a>

  {/* <a href="#faqs" className={`${textColor} ${hoverColor} font-semibold transition-colors`}>
    {t.nav.faqs || "FAQs"}
  </a> */}

  {/* <a href="#policy" className={`${textColor} ${hoverColor} font-semibold transition-colors`}>
    {t.nav.policy || "Policy"}
  </a> */}

  <a href="#contact" className={`${textColor} ${hoverColor} font-semibold transition-colors`}>
    {t.nav.contact}
  </a>


              {/* LANGUAGE */}
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-full bg-white/90 hover:bg-white text-gray-800 font-semibold transition-all hover:scale-105"
              >
                {language === "en" ? "العربية" : "English"}
              </button>

              {/* CART (ONLY OPEN CART) */}
              <button
                type="button"
                onClick={onCartClick}
                className="relative px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full hover:scale-105 transition-all shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {getCartCount()}
                  </span>
                )}
              </button>
            </div>

            {/* MOBILE */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="px-3 py-2 bg-white hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors"
              >
                {language === "en" ? "ع" : "EN"}
              </button>

              {/* CART */}
              <button
                type="button"
                onClick={onCartClick}
                className="relative px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-xs font-bold rounded-full flex items-center justify-center">
                    {getCartCount()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* MOBILE MENU */}
          {/* MOBILE MENU */}
{mobileOpen && (
  <div className="md:hidden pb-4 space-y-3 bg-black/90 backdrop-blur-md rounded-b-xl -mx-4 px-6">
    <a href="/" onClick={() => setMobileOpen(false)}
      className="block py-2 text-white hover:text-amber-400 font-semibold">
      {t.nav.home}
    </a>

    <a href="#about" onClick={() => setMobileOpen(false)}
      className="block py-2 text-white hover:text-amber-400 font-semibold">
      {t.nav.about}
    </a>

    <a href="#packages" onClick={() => setMobileOpen(false)}
      className="block py-2 text-white hover:text-amber-400 font-semibold">
      {t.nav.packages || "Packages"}
    </a>

    <a href="#services" onClick={() => setMobileOpen(false)}
      className="block py-2 text-white hover:text-amber-400 font-semibold">
      {t.nav.services || "Services"}
    </a>

    <a href="#faqs" onClick={() => setMobileOpen(false)}
      className="block py-2 text-white hover:text-amber-400 font-semibold">
      {t.nav.faqs || "FAQs"}
    </a>

    <a href="#policy" onClick={() => setMobileOpen(false)}
      className="block py-2 text-white hover:text-amber-400 font-semibold">
      {t.nav.policy || "Policy"}
    </a>

    <a href="#contact" onClick={() => setMobileOpen(false)}
      className="block py-2 text-white hover:text-amber-400 font-semibold">
      {t.nav.contact}
    </a>
  </div>
)}

        </div>
      </nav>

      {/* CSS for Marquee Animation */}
      <style>{`
        .marquee-container {
          overflow: hidden;
          position: relative;
        }

        .marquee-content {
          display: flex;
          animation: marquee 30s linear infinite;
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Smooth transition for navbar position */
        nav {
          transition: top 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;