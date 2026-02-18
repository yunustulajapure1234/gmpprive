import React, { useState, useEffect, useMemo } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useBooking } from "../context/BookingContext";
import ResilientImage from "./ResilientImage";

const ServiceDetailsModal = ({ service, onClose, onSuccess }) => {
  const { language } = useLanguage();
  const { addToCart } = useBooking();

  const [selectedDuration, setSelectedDuration] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const durations = useMemo(() => {
    if (service?.durations?.length > 0) return service.durations;

    return [{
      minutes: parseInt(service?.duration) || 60,
      price: service?.price || 0,
    }];
  }, [service]);

  useEffect(() => {
    if (durations.length > 0) setSelectedDuration(durations[0]);
  }, [durations]);

  const totalPrice = useMemo(() => {
    return (selectedDuration?.price || 0) * quantity;
  }, [selectedDuration, quantity]);

  const handleAddToCart = () => {
    if (!selectedDuration) {
      onSuccess?.(
        language === "ar"
          ? "⚠️ الرجاء اختيار المدة"
          : "⚠️ Please select a duration"
      );
      return;
    }

    addToCart({
      _id: service._id,
      name: service.name,
      nameAr: service.nameAr,
      image: service.imageUrl || service.image,
      price: selectedDuration.price,
      selectedDuration,
      quantity,
      gender: service.gender,
      category: service.category,
    });

    onSuccess?.(
      language === "ar"
        ? "✅ تمت الإضافة إلى السلة"
        : "✅ Added to cart successfully"
    );

    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fade-in"
    >

      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-scale-in">

        {/* LEFT SIDE - IMAGE */}
        <div className="lg:w-1/2 p-6">
          <div className="rounded-2xl overflow-hidden aspect-[4/3] shadow-lg">
            <ResilientImage
              src={service.imageUrl || service.image}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* RIGHT SIDE - DETAILS */}
        <div className="lg:w-1/2 p-6 space-y-6 relative">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all active:scale-95"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Service Name */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === "ar" ? service.nameAr : service.name}
            </h2>
            <p className="text-sm text-gray-500">
              {language === "ar" ? service.descriptionAr : service.description}
            </p>
          </div>

          {/* DURATIONS */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {language === "ar" ? "اختر المدة" : "Select Duration"}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {durations.map((duration, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDuration(duration)}
                  className={`h-24 rounded-xl border-2 transition-all active:scale-95 ${
                    selectedDuration?.minutes === duration.minutes
                      ? "border-amber-500 bg-amber-50 shadow-md scale-105"
                      : "border-gray-200 hover:border-amber-300 hover:shadow-sm"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold text-lg text-gray-900">{duration.minutes}</div>
                    <div className="text-xs text-gray-400 font-medium uppercase">MIN</div>
                    <div className="text-amber-600 text-base font-bold mt-1">
                      {duration.price} AED
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY + TOTAL + BUTTON */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
            
            {/* Quantity Selector */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                {language === "ar" ? "الكمية" : "Quantity"}
              </span>
              <div className="flex items-center border-2 border-gray-300 rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all font-bold text-lg"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            {/* Total Price */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-700">
                {language === "ar" ? "المجموع" : "Total"}
              </span>
              <div className="text-3xl font-black text-amber-600">
                {totalPrice} <span className="text-base">AED</span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full py-4 bg-amber-500 text-white rounded-xl font-bold text-base hover:bg-amber-600 active:scale-98 transition-all shadow-lg hover:shadow-xl"
            >
              {language === "ar" ? "إضافة إلى السلة" : "Add to Cart"}
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .active\\:scale-98:active {
          transform: scale(0.98);
        }

        .active\\:scale-95:active {
          transform: scale(0.95);
        }
      `}</style>
    </div>
  );
};

export default ServiceDetailsModal;