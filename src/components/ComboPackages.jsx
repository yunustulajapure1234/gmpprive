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
  const { cart, addToCart, removeFromCart, updateQuantity } = useBooking();

  const isAr = language === "ar";

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    api
      .get("/packages")
      .then((res) => setPackages(res.data.data || []))
      .finally(() => setLoading(false));
  }, []);

  /* =========================
     HELPERS
  ========================= */

  const showToast = (msg) => setToast(msg);

  const getCartItem = (pkgId) => {
    return cart.find((item) => item._id === pkgId);
  };

  const getCartQty = (pkgId) => {
    const item = getCartItem(pkgId);
    return item ? item.quantity : 0;
  };

  /* =========================
     ADD
  ========================= */
  const handleAdd = (pkg) => {
    addToCart({
      _id: pkg._id,
      name: pkg.title,
      nameAr: pkg.titleAr,
      items: pkg.items || [],
      itemsAr: pkg.itemsAr || [],
      price: pkg.price,
      quantity: 1,
      type: "package",
      selectedDuration: null,
    });

    showToast(isAr ? "✅ تمت الإضافة إلى السلة" : "✅ Added to cart");
  };

  /* =========================
     INCREMENT
  ========================= */
  const handleIncrement = (pkg) => {
    addToCart({
      _id: pkg._id,
      name: pkg.title,
      nameAr: pkg.titleAr,
      items: pkg.items || [],
      itemsAr: pkg.itemsAr || [],
      price: pkg.price,
      quantity: 1,
      type: "package",
      selectedDuration: null,
    });

    showToast(isAr ? "➕ تمت زيادة الكمية" : "➕ Quantity increased");
  };

  /* =========================
     DECREMENT (FIXED)
  ========================= */
  const handleDecrement = (pkgId) => {
    const item = getCartItem(pkgId);
    if (!item) return;

    if (item.quantity <= 1) {
      removeFromCart(item.id); // use item.id not _id
      showToast(isAr ? "🗑️ تم الحذف من السلة" : "🗑️ Removed from cart");
    } else {
      updateQuantity(item.id, item.quantity - 1);
      showToast(isAr ? "➖ تم تقليل الكمية" : "➖ Quantity decreased");
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
    <section
      className="py-10 bg-gradient-to-br from-amber-50 via-yellow-50 to-white"
      id="packages"
    >
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto px-4">

        {/* HEADING */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            {isAr ? "باقاتنا الفاخرة" : "Our Luxury Packages"}
          </h2>
        </div>

        {/* GRID */}
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
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all flex flex-col overflow-hidden border"
                >
                  <div className="p-4 flex flex-col flex-1">

                    {/* PRICE */}
                    <div className="flex justify-center mb-3">
                      <div className="bg-gradient-to-br from-amber-400 to-yellow-700 text-white px-5 py-1.5 rounded-full shadow-md">
                        <span className="text-lg font-bold">{pkg.price}</span>
                        <span className="text-xs ml-1 font-semibold">
                          {isAr ? "درهم" : "AED"}
                        </span>
                      </div>
                    </div>

                    {/* TITLE */}
                    <h3 className="text-lg font-bold text-center mb-3">
                      {title}
                    </h3>

                    {/* ITEMS */}
                    <ul className="space-y-1.5 text-xs text-gray-700 flex-1 mb-4">
                      {items.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-amber-600">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>

                    {/* CART CONTROLS */}
                    {cartQty === 0 ? (
                      <button
                        onClick={() => handleAdd(pkg)}
                        className="w-full py-2.5 bg-gradient-to-br from-amber-400 to-yellow-700 text-white text-sm rounded-full font-semibold transition hover:scale-105"
                      >
                        {isAr ? "أضف إلى السلة" : "Add to Cart"}
                      </button>
                    ) : (
                      <div className="flex items-center justify-center gap-3 bg-gray-50 rounded-lg py-2 px-3 border">
                        <button
                          onClick={() => handleDecrement(pkg._id)}
                          className="w-8 h-8 bg-white border-2 rounded-full font-bold hover:bg-red-50"
                        >
                          −
                        </button>

                        <span className="font-bold text-lg min-w-[1.5rem] text-center">
                          {cartQty}
                        </span>

                        <button
                          onClick={() => handleIncrement(pkg)}
                          className="w-8 h-8 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full font-bold"
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
      </div>
    </section>
  );
};

export default ComboPackages;
