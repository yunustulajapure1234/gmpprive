import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useBooking } from "../context/BookingContext";
import { useAdmin } from "../context/AdminContext";
import ServiceDetailsModal from "../components/ServiceDetailsModal";

/* =========================
   TOAST NOTIFICATION
========================= */
const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[100] animate-slide-in-right">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 px-6 py-4 flex items-center gap-3 min-w-[280px]">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-gray-900">{message}</p>
      </div>
    </div>
  );
};

/* =========================
   SKELETON
========================= */
const ServiceSkeleton = () => (
  <div className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 animate-pulse h-full flex flex-col shadow-sm">
    <div className="aspect-[4/3] bg-gray-200" />
    <div className="p-6 flex-1 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-5/6" />
    </div>
  </div>
);

const WomenServices = () => {
  const { language } = useLanguage();
  const { cart, addToCart, removeFromCart } = useBooking();
  const { getServicesByGender, getCategories } = useAdmin();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState(null);

  /* =========================
     DATA
  ========================= */
  const services = useMemo(
    () => getServicesByGender("women"),
    [getServicesByGender]
  );

  const categories = useMemo(
    () => getCategories("women"),
    [getCategories]
  );

  useEffect(() => {
    if (services.length > 0) {
      const timer = setTimeout(() => setIsLoading(false), 600);
      return () => clearTimeout(timer);
    }
  }, [services]);

  /* =========================
     FILTER
  ========================= */
  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchCategory =
        selectedCategory === "all" ||
        service.category === selectedCategory;

      const matchSearch =
        searchQuery === "" ||
        service.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.nameAr?.includes(searchQuery);

      return matchCategory && matchSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  /* =========================
     HELPERS
  ========================= */

  const getServiceCartQty = (serviceId) => {
    const items = cart.filter((item) => item._id === serviceId);
    return items.reduce((sum, item) => sum + item.quantity, 0);
  };

  const isMassageOrSpa = (service) => {
    const category = service.category?.toLowerCase();
    return category?.includes("massage") || category?.includes("spa");
  };

  const showToast = (message) => {
    setToast(message);
  };

  const handleDirectAdd = (e, service) => {
    e.stopPropagation();

    addToCart({
      ...service,
      selectedDuration: {
        minutes: parseInt(service.duration) || 60,
        price: service.price,
      },
      quantity: 1,
    });

    showToast(
      language === "ar"
        ? "✅ تمت الإضافة إلى السلة"
        : "✅ Added to cart successfully"
    );
  };

  const handleIncrement = (e, service) => {
    e.stopPropagation();
    
    addToCart({
      ...service,
      selectedDuration: {
        minutes: parseInt(service.duration) || 60,
        price: service.price,
      },
      quantity: 1,
    });

    showToast(
      language === "ar"
        ? "✅ تمت الإضافة إلى السلة"
        : "✅ Added to cart"
    );
  };

  const handleDecrement = (e, serviceId) => {
    e.stopPropagation();
    
    const currentQty = getServiceCartQty(serviceId);
    if (currentQty === 1) {
      removeFromCart(serviceId);
      showToast(
        language === "ar"
          ? "🗑️ تم الإزالة من السلة"
          : "🗑️ Removed from cart"
      );
    } else {
      // Find the first cart item with this serviceId and reduce its quantity
      const cartItem = cart.find((item) => item._id === serviceId);
      if (cartItem) {
        addToCart({
          ...cartItem,
          quantity: -1, // This will decrease the quantity
        });
        showToast(
          language === "ar"
            ? "➖ تم تقليل الكمية"
            : "➖ Quantity decreased"
        );
      }
    }
  };
// Create unique categories from services
const uniqueCategories = [
  ...new Map(
    services.map((s) => [
      s.category,
      {
        key: s.category,
        name: s.category,
        nameAr: s.categoryAr,
      },
    ])
  ).values(),
];

  /* =========================
     UI
  ========================= */

 return (
  <section className="pt-28 pb-0 bg-gray-50 min-h-screen">
    {/* Toast Notification */}
    {toast && <Toast message={toast} onClose={() => setToast(null)} />}

    <div className="max-w-7xl mx-auto px-4">

      {/* ================= SEARCH + CATEGORY ================= */}
      <div className="mb-10 space-y-6">

        {/* ================= SEARCH (CENTER DESKTOP) ================= */}
        <div className="relative max-w-xl mx-auto">
          <input
            type="text"
            placeholder={
              language === "ar"
                ? "ابحث عن خدمة..."
                : "Search services..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-gray-300 focus:border-amber-500 focus:ring-4 focus:ring-amber-100 outline-none shadow-md text-base font-medium transition-all"
          />
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* ================= CATEGORY BUTTONS ================= */}
        {/* ================= CATEGORY BUTTONS ================= */}
<div className="relative">
  <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-3 scrollbar-hide px-1">

    {/* ALL SERVICES */}
    <button
      onClick={() => setSelectedCategory("all")}
      className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
        selectedCategory === "all"
          ? "bg-amber-500 text-white shadow-lg scale-105"
          : "bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-300 hover:shadow"
      }`}
    >
      {language === "ar" ? "جميع الخدمات" : "All Services"}
    </button>

    {/* BACKEND DRIVEN CATEGORIES */}
    {uniqueCategories.map((cat) => (
      <button
        key={cat.key}
        onClick={() => setSelectedCategory(cat.key)}
        className={`px-4 py-2 sm:px-6 sm:py-3 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
          selectedCategory === cat.key
            ? "bg-amber-500 text-white shadow-lg scale-105"
            : "bg-white border-2 border-gray-200 text-gray-700 hover:border-amber-300 hover:shadow"
        }`}
      >
        {language === "ar" ? cat.nameAr : cat.name}
      </button>
    ))}
  </div>

  {/* GOLDEN LINE */}
  <div className="pointer-events-none absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80" />
</div>

      </div>

      {/* ================= GRID ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">

        {isLoading ? (
          [...Array(8)].map((_, i) => <ServiceSkeleton key={i} />)
        ) : filteredServices.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <p className="text-xl font-semibold text-gray-600">
              {language === "ar"
                ? "لم يتم العثور على خدمات"
                : "No services found"}
            </p>
          </div>
        ) : (
          filteredServices.map((service) => {
            const cartQty = getServiceCartQty(service._id);
            const isMassage = isMassageOrSpa(service);

            const basePrice =
              isMassage && service.durations?.length
                ? service.durations[0].price
                : service.price;

            return (
              <div
                key={service._id}
                onClick={() => {
                  if (isMassage) setSelectedService(service);
                }}
                className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:border-amber-200 transition-all duration-300 cursor-pointer flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                {/* IMAGE */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <img
                    src={service.imageUrl || service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                  />
                  {cartQty > 0 && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                      {cartQty}
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
                    {language === "ar"
                      ? service.nameAr
                      : service.name}
                  </h3>

                  <p className="text-xs text-gray-500 mb-4 line-clamp-2 flex-1">
                    {language === "ar"
                      ? service.descriptionAr
                      : service.description}
                  </p>

                  {/* PRICE */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {isMassage ? "Starts from" : "Price"}
                      </span>
                      <span className="text-xl font-black text-amber-600 block">
                        {basePrice} <span className="text-xs">AED</span>
                      </span>
                    </div>

                    {cartQty === 0 ? (
                      <button
                        onClick={(e) =>
                          isMassage
                            ? setSelectedService(service)
                            : handleDirectAdd(e, service)
                        }
                        className="px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 active:scale-95 transition-all shadow-md hover:shadow-lg"
                      >
                        {isMassage ? "Select" : "Add +"}
                      </button>
                    ) : (
                      <div
                        className="flex items-center bg-gray-100 rounded-xl overflow-hidden shadow-md"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => handleDecrement(e, service._id)}
                          className="w-9 h-9 flex items-center justify-center bg-white hover:bg-gray-50 active:scale-95 transition-all text-gray-700 font-bold text-lg"
                        >
                          −
                        </button>

                        <span className="px-4 font-bold text-base min-w-[40px] text-center">
                          {cartQty}
                        </span>

                        <button
                          onClick={(e) => handleIncrement(e, service)}
                          className="w-9 h-9 flex items-center justify-center bg-amber-500 text-white hover:bg-amber-600 active:scale-95 transition-all font-bold text-lg"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>

    {/* MODAL */}
    {selectedService && (
      <ServiceDetailsModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onSuccess={showToast}
      />
    )}
 <style>{`

      .scrollbar-hide::-webkit-scrollbar {
        display: none;
      }

      .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `}</style>
  </section>
);

};

export default WomenServices;