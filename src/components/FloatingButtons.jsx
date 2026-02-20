import React, { useMemo } from "react";
import { useBooking } from "../context/BookingContext";
import { useLanguage } from "../context/LanguageContext";
import logo from "../assets/logo.png"; // ← apna logo path yahan set karo

const FloatingButtons = ({ onCartClick }) => {
  const { cart } = useBooking();
  const { language } = useLanguage();

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <>
      {/* ================= CALL BUTTON ================= */}
      <a
        href="tel:+971528686112"
        className="fixed bottom-32 right-6 z-40 w-14 h-14 bg-gradient-to-br from-amber-400 to-yellow-700 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all duration-300 animate-pulse"
        aria-label="Call Now"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
          />
        </svg>
      </a>

      {/* ================= WHATSAPP BUTTON ================= */}
      <a
        href="https://wa.me/971528686112?text=Hello%20GMP%20Salon,%20I%20want%20to%20inquire%20about%20services."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 group"
        aria-label="Chat on WhatsApp"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-0 bg-green-500 rounded-full animate-pulse"></div>
          <div className="relative w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-all duration-300">
            {/* Official WhatsApp logo */}
            <svg className="w-12 h-12" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd"
                d="M24 4C12.954 4 4 12.954 4 24c0 3.733 1.022 7.226 2.8 10.21L4 44l10.05-2.766A19.929 19.929 0 0024 44c11.046 0 20-8.954 20-20S35.046 4 24 4z"
                fill="#fff"/>
              <path fillRule="evenodd" clipRule="evenodd"
                d="M24 7.5C14.835 7.5 7.5 14.835 7.5 24c0 3.322.96 6.42 2.62 9.04l.38.604-1.617 5.895 6.07-1.59.585.345A16.43 16.43 0 0024 40.5c9.165 0 16.5-7.335 16.5-16.5S33.165 7.5 24 7.5zm-6.59 9.27c.26 0 .545.003.786.013.29.012.614.03.923.71.37.81 1.18 2.88 1.29 3.09.11.21.18.46.04.73-.14.28-.21.45-.42.69-.21.24-.44.53-.63.71-.21.2-.43.42-.19.83.24.41 1.08 1.78 2.32 2.89 1.59 1.41 2.93 1.85 3.34 2.06.41.21.65.18.89-.11.24-.29 1.03-1.2 1.31-1.61.27-.41.55-.34.92-.2.37.13 2.35 1.11 2.76 1.31.41.2.68.3.78.47.1.17.1.97-.23 1.9-.33.94-1.94 1.8-2.65 1.87-.71.07-1.38.33-4.65-.97-3.93-1.55-6.41-5.56-6.6-5.82-.2-.26-1.6-2.13-1.6-4.06 0-1.93 1.01-2.88 1.37-3.27.36-.39.78-.49 1.04-.49z"
                fill="#25D366"/>
            </svg>
          </div>
        </div>
        <span className="absolute right-20 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {language === "ar" ? "دردش على واتساب" : "Chat on WhatsApp"}
        </span>
      </a>

      {/* ================= LOGO CART BUTTON (MOBILE ONLY) ================= */}
      {cartCount > 0 && (
        <div className="md:hidden fixed bottom-[180px] right-6 z-40" style={{ width: 56, height: 56 }}>
          {/* Badge OUTSIDE the button — no overflow-hidden interference */}
          <span
            style={{
              position: "absolute",
              top: -6,
              right: -6,
              zIndex: 10,
              minWidth: 22,
              height: 22,
              background: "#ef4444",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              borderRadius: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
              padding: "0 4px",
              animation: "bounce 1s infinite",
            }}
          >
            {cartCount > 99 ? "99+" : cartCount}
          </span>

          <button
            onClick={onCartClick}
            aria-label={`Cart (${cartCount} items)`}
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2.5px solid #fbbf24",
              background: "#000",
              padding: 0,
              cursor: "pointer",
              boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
              transition: "transform 0.2s",
              display: "block",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
            onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"}
            onMouseUp={e => e.currentTarget.style.transform = "scale(1)"}
          >
            <img
              src={logo}
              alt="Cart"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              draggable={false}
            />
          </button>
        </div>
      )}
    </>
  );
};

export default FloatingButtons;