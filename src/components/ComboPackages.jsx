import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useLanguage } from "../context/LanguageContext";
import { useBooking } from "../context/BookingContext";

/* =========================
   TOAST
========================= */
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-50 animate-slideIn">
      <div className="bg-white shadow-2xl rounded-xl px-6 py-4 border-l-4 border-amber-500 flex items-center gap-3">
        <span className="text-amber-600 text-xl">✓</span>
        <p className="font-semibold text-sm text-gray-800">{message}</p>
      </div>
    </div>
  );
};

const ComboPackages = () => {
  const { language } = useLanguage();
  const { cart, addToCart, removeFromCart } = useBooking();
  const isAr = language === "ar";

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    api.get("/packages")
      .then((res) => setPackages(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  /* =========================
     HELPERS
  ========================= */

  const showToast = (msg) => setToast(msg);

  const getCartQty = (id) => {
    const items = cart.filter((item) => item._id === id);
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const handleAdd = (pkg) => {
    addToCart({
      _id: pkg._id,
      name: pkg.title,
      nameAr: pkg.titleAr,
      title: pkg.title,
      titleAr: pkg.titleAr,
      items: pkg.items || [],
      itemsAr: pkg.itemsAr || [],
      price: pkg.price,
      quantity: 1,
      type: "package",
      selectedDuration: null
    });
    showToast(
      isAr ? "✅ تمت الإضافة إلى السلة" : "✅ Added to cart"
    );
  };

  const handleIncrement = (pkg) => {
    addToCart({
      _id: pkg._id,
      type: "package",
      title: pkg.title,
      titleAr: pkg.titleAr,
      items: pkg.items || [],
      itemsAr: pkg.itemsAr || [],
      price: pkg.price,
      quantity: 1,
      selectedDuration: {
        minutes: 0,
        price: pkg.price,
      },
    });
    showToast(
      isAr ? "➕ تمت زيادة الكمية" : "➕ Quantity increased"
    );
  };

  const handleDecrement = (id) => {
    const currentQty = getCartQty(id);

    if (currentQty === 1) {
      removeFromCart(id);
      showToast(
        isAr ? "🗑️ تم الحذف من السلة" : "🗑️ Removed from cart"
      );
    } else {
      const item = cart.find((i) => i._id === id);
      if (item) {
        addToCart({
          ...item,
          quantity: -1,
        });
        showToast(
          isAr ? "➖ تم تقليل الكمية" : "➖ Quantity decreased"
        );
      }
    }
  };

  /* =========================
     UI
  ========================= */

  if (loading) {
    return (
      <section className="py-20 text-center bg-white">
        <div className="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading packages...</p>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gradient-to-br from-amber-50 via-yellow-50 to-white" id="packages">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto px-4">
        {/* HEADING */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3  bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            {isAr ? "باقاتنا الفاخرة" : "Our Luxury Packages"}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto"></div>
        </div>

        {/* GRID - Compact Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {packages
            .filter((pkg) => pkg.isActive)
            .slice(0, showAll ? packages.length : 8)
            .map((pkg) => {
              const cartQty = getCartQty(pkg._id);
              const title = isAr ? pkg.titleAr : pkg.title;
              const items = isAr ? pkg.itemsAr || [] : pkg.items || [];

              return (
                <div
                  key={pkg._id}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 hover:border-amber-500/30"
                >
                  {/* Top Golden Border */}
                  <div className="h-0.5  bg-gradient-to-br from-amber-400 to-yellow-700"></div>

                  <div className="p-4 flex flex-col flex-1">
                    {/* Price Badge - Compact */}
                    <div className="flex justify-center mb-3">
                      <div className=" bg-gradient-to-br from-amber-400 to-yellow-700 text-white px-5 py-1.5 rounded-full shadow-md">
                        <span className="text-lg font-bold">{pkg.price}</span>
                        <span className="text-xs ml-1 font-semibold">
                          {isAr ? "درهم" : "AED"}
                        </span>
                      </div>
                    </div>

                    {/* Package Title - Compact */}
                    <h3 className="text-lg font-bold text-gray-800 text-center mb-3 min-h-[48px] flex items-center justify-center leading-tight">
                      {title}
                    </h3>

                    {/* Items List - Compact */}
                    <ul className={`space-y-1.5 text-xs text-gray-700 flex-1 mb-4 ${isAr ? "text-right" : ""}`}>
                      {items.map((item, i) => (
                        <li key={i} className="flex gap-2 items-start">
                          <span className="text-amber-600 text-sm mt-0.5 flex-shrink-0">✓</span>
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CART BUTTONS - Compact */}
                    {cartQty === 0 ? (
                      <button
                        onClick={() => handleAdd(pkg)}
                        className="w-full py-2.5  bg-gradient-to-br from-amber-400 to-yellow-700 hover:from-amber-600 hover:to-amber-700 text-white text-sm rounded-full font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
                      >
                        {isAr ? "أضف إلى السلة" : "Add to Cart"}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-lg py-2 px-3 border border-gray-200">
                        <button
                          onClick={() => handleDecrement(pkg._id)}
                          className="w-8 h-8 bg-white border-2 border-gray-300 hover:border-red-400 hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-full shadow-sm font-bold text-base transition-all active:scale-90"
                        >
                          −
                        </button>

                        <span className="font-bold text-lg text-gray-800 min-w-[1.5rem] text-center">
                          {cartQty}
                        </span>

                        <button
                          onClick={() => handleIncrement(pkg)}
                          className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-full shadow-md font-bold text-base transition-all active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>

        {/* MORE PACKAGES BUTTON */}
        {packages.filter((pkg) => pkg.isActive).length > 8 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-br from-amber-400 to-yellow-700 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-full shadow-lg  active:scale-95"
            >
              <span>{showAll ? (isAr ? "عرض أقل" : "Show Less") : (isAr ? "المزيد من الباقات" : "More Packages")}</span>
              <svg 
                className={`w-5 h-5 transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {!showAll && (
              <p className="mt-3 text-sm text-gray-500">
                {isAr 
                  ? `${packages.filter((pkg) => pkg.isActive).length - 8} باقات أخرى متاحة`
                  : `${packages.filter((pkg) => pkg.isActive).length - 8} more packages available`
                }
              </p>
            )}
          </div>
        )}
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
};

export default ComboPackages;