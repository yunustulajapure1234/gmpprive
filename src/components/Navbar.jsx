import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useBooking } from "../context/BookingContext";
import logo from "../assets/GMP-Prive-Beauty-and-fitness (2) (1).png";

const Navbar = ({ onCartClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const { language, toggleLanguage, t } = useLanguage();
  const { cart } = useBooking();

  /* ================= REACTIVE CART COUNT ================= */
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textColor = "text-white";
  const hoverColor = "hover:text-amber-400";

  return (
    <>
      {/* ================= BANNER ================= */}
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-[30] bg-gradient-to-br from-amber-400 to-yellow-700 text-white overflow-hidden shadow-lg">
          <div className="relative flex items-center h-10">
            <button
              onClick={() => setShowBanner(false)}
              className="absolute left-3 w-6 h-6 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full"
            >
              ✕
            </button>

            <div className="marquee-container w-full">
              <div className="marquee-content">
                {t?.banner?.items?.map((item, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-8 text-sm font-semibold whitespace-nowrap"
                  >
                    {item}
                  </span>
                ))}
                {t?.banner?.items?.map((item, index) => (
                  <span
                    key={`dup-${index}`}
                    className="inline-flex items-center px-8 text-sm font-semibold whitespace-nowrap"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= NAVBAR ================= */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          showBanner ? "top-10" : "top-0"
        } ${
          scrolled
            ? "bg-black/95 backdrop-blur-md shadow-2xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <a href="/" className="flex items-center space-x-3">
              <img
                src={logo}
                alt="GMP Privé"
                className="h-14 w-auto object-contain"
              />
            </a>

            {/* ================= DESKTOP MENU ================= */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className={`${textColor} ${hoverColor} font-semibold`}>
                {t.nav.home}
              </a>
              <a href="#about" className={`${textColor} ${hoverColor} font-semibold`}>
                {t.nav.about}
              </a>
              <a href="#packages" className={`${textColor} ${hoverColor} font-semibold`}>
                {t.nav.packages || "Packages"}
              </a>
              <a href="#services" className={`${textColor} ${hoverColor} font-semibold`}>
                {t.nav.services || "Services"}
              </a>
              <a href="#contact" className={`${textColor} ${hoverColor} font-semibold`}>
                {t.nav.contact}
              </a>

              {/* LANGUAGE */}
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-full bg-white text-gray-800 font-semibold hover:scale-105 transition"
              >
                {language === "en" ? "العربية" : "English"}
              </button>

              {/* CART */}
              <button
                onClick={onCartClick}
                className="relative px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full shadow-md"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {/* ================= MOBILE ================= */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="px-3 py-2 bg-white rounded-lg text-sm font-semibold"
              >
                {language === "en" ? "ع" : "EN"}
              </button>

              <button
                onClick={onCartClick}
                className="relative px-3 py-2 bg-amber-500 text-white rounded-lg"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-xs font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 bg-white rounded-lg"
              >
                ☰
              </button>
            </div>
          </div>

          {/* ================= MOBILE MENU ================= */}
          {mobileOpen && (
            <div className="md:hidden pb-4 space-y-3 bg-black/90 backdrop-blur-md rounded-b-xl -mx-4 px-6">
              <a href="/" className="block py-2 text-white font-semibold">
                {t.nav.home}
              </a>
              <a href="#about" className="block py-2 text-white font-semibold">
                {t.nav.about}
              </a>
              <a href="#packages" className="block py-2 text-white font-semibold">
                {t.nav.packages || "Packages"}
              </a>
              <a href="#services" className="block py-2 text-white font-semibold">
                {t.nav.services || "Services"}
              </a>
              <a href="#contact" className="block py-2 text-white font-semibold">
                {t.nav.contact}
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* ================= MARQUEE CSS ================= */}
      <style>{`
        .marquee-container {
          overflow: hidden;
        }

        .marquee-content {
          display: flex;
          animation: marquee 30s linear infinite;
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </>
  );
};

export default Navbar;
