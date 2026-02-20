import React, { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useBooking } from "../context/BookingContext";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/GMP-Prive-Beauty-and-fitness (2) (1).png";

const Navbar = ({ onCartClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  const { language, toggleLanguage, t } = useLanguage();
  const { getCartCount } = useBooking();

  const navigate = useNavigate();
  const location = useLocation();

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= UNIVERSAL NAVIGATION ================= */
  const goToSection = (sectionId) => {
    setMobileOpen(false);

    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const textColor = "text-white";
  const hoverColor = "hover:text-amber-400";

  return (
    <>
      {/* ================= MARQUEE BANNER ================= */}
      {showBanner && (
        <div className="fixed top-0 left-0 right-0 z-[30] bg-gradient-to-br from-amber-400 to-yellow-700 text-white overflow-hidden shadow-lg">
          <div className="relative flex items-center h-10">

            {/* Close Button */}
            <button
              onClick={() => setShowBanner(false)}
              className="absolute left-2 sm:left-4 z-10 w-6 h-6 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-full transition-all"
            >
              ✕
            </button>

            {/* Marquee */}
            <div className="marquee-container w-full">
              <div className={`marquee-content ${language === "ar" ? "reverse" : ""}`}>
                {t?.banner?.items?.map((item, index) => (
                  <span key={index} className="px-8 text-sm font-semibold whitespace-nowrap">
                    {item}
                  </span>
                ))}
                {t?.banner?.items?.map((item, index) => (
                  <span key={"dup-" + index} className="px-8 text-sm font-semibold whitespace-nowrap">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN NAVBAR ================= */}
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
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <button onClick={() => navigate("/")} className="flex items-center space-x-3">
              <img src={logo} alt="GMP Privé" className="h-14 w-auto object-contain" />
            </button>

            {/* ================= DESKTOP MENU ================= */}
            <div className="hidden md:flex items-center space-x-8">

              <button onClick={() => navigate("/")} className={`${textColor} ${hoverColor} font-semibold`}>
                {t.nav.home}
              </button>

              <button onClick={() => goToSection("about")} className={`${textColor} ${hoverColor} font-semibold`}>
                {t.nav.about}
              </button>

              <button onClick={() => goToSection("packages")} className={`${textColor} ${hoverColor} font-semibold`}>
                {t.nav.packages || "Packages"}
              </button>

              <button onClick={() => goToSection("services")} className={`${textColor} ${hoverColor} font-semibold`}>
                {t.nav.services || "Services"}
              </button>

              <button onClick={() => goToSection("contact")} className={`${textColor} ${hoverColor} font-semibold`}>
                {t.nav.contact}
              </button>

              {/* LANGUAGE */}
              <button
                onClick={toggleLanguage}
                className="px-4 py-2 rounded-full bg-white/90 hover:bg-white text-gray-800 font-semibold transition-all hover:scale-105"
              >
                {language === "en" ? "العربية" : "English"}
              </button>

              {/* CART */}
              <button
                type="button"
                onClick={onCartClick}
                className="relative px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full hover:scale-105 transition-all shadow-md"
              >
                🛒
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                    {getCartCount()}
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
                type="button"
                onClick={onCartClick}
                className="relative px-3 py-2 bg-amber-500 text-white rounded-lg shadow-md"
              >
                🛒
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-xs font-bold rounded-full flex items-center justify-center">
                    {getCartCount()}
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

              <button onClick={() => navigate("/")} className="block py-2 text-white font-semibold">
                {t.nav.home}
              </button>

              <button onClick={() => goToSection("about")} className="block py-2 text-white font-semibold">
                {t.nav.about}
              </button>

              <button onClick={() => goToSection("packages")} className="block py-2 text-white font-semibold">
                {t.nav.packages || "Packages"}
              </button>

              <button onClick={() => goToSection("services")} className="block py-2 text-white font-semibold">
                {t.nav.services || "Services"}
              </button>

              <button onClick={() => goToSection("contact")} className="block py-2 text-white font-semibold">
                {t.nav.contact}
              </button>

            </div>
          )}
        </div>
      </nav>

      {/* ================= MARQUEE CSS ================= */}
      <style>{`
        .marquee-container {
          overflow: hidden;
          position: relative;
        }

        .marquee-content {
          display: flex;
          animation: marquee 15s linear infinite;
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        nav {
          transition: top 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Navbar;
