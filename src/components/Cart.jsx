import React, { useState, useMemo, useCallback } from "react";
import { useBooking } from "../context/BookingContext";
import { useLanguage } from "../context/LanguageContext";
import BookingModal from "./BookingModal";

const Cart = ({ onClose }) => {
  const {
    cart,
    bookingDetails,
    updateQuantity,
    removeFromCart,
  } = useBooking();

  const { language } = useLanguage();
  const [showBookingModal, setShowBookingModal] = useState(false);

  /* ================= SAFE TOTAL ================= */
  const totalAmount = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  }, [cart]);

  /* ================= SAFE DATE FORMAT ================= */
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  /* ================= SAFE QUANTITY ================= */
  const handleIncrease = useCallback(
    (id, qty) => {
      updateQuantity(id, qty + 1);
    },
    [updateQuantity]
  );

  const handleDecrease = useCallback(
    (id, qty) => {
      if (qty <= 1) {
        removeFromCart(id);
      } else {
        updateQuantity(id, qty - 1);
      }
    },
    [updateQuantity, removeFromCart]
  );

  const handleRemove = useCallback(
    (id) => {
      removeFromCart(id);
    },
    [removeFromCart]
  );

  const handleCheckoutClick = () => {
    setShowBookingModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end animate-fadeIn">
        <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-slideInRight">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {language === "ar" ? "سلة التسوق" : "Your Cart"}
              </h2>
              <button
                onClick={onClose}
                className="text-white text-xl font-bold hover:scale-110 transition"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-sm font-semibold">
              {cart.length} {language === "ar" ? "عناصر" : "Items"}
            </p>
          </div>

          {/* BOOKING SUMMARY */}
          {bookingDetails?.isBookingInfoSet && (
            <div className="bg-amber-50 p-4 text-sm border-b">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Booking Info</span>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="text-amber-600 text-xs font-bold hover:underline"
                >
                  Edit
                </button>
              </div>

              <p><b>Name:</b> {bookingDetails.customerName}</p>
              <p><b>Phone:</b> {bookingDetails.phone}</p>
              <p><b>Date:</b> {formatDate(bookingDetails.date)}</p>
              <p><b>Time:</b> {bookingDetails.time}</p>
              <p><b>Address:</b> {bookingDetails.address}</p>
            </div>
          )}

          {/* CART ITEMS */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">

            {cart.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                Cart is empty
              </div>
            ) : (
              cart.map((item, index) => {

                // ✅ FIXED UNIQUE KEY
                const uniqueKey = `${item._id}-${index}`;

                const displayName =
                  language === "ar"
                    ? item.nameAr || item.name
                    : item.name;

                return (
                  <div
                    key={uniqueKey}
                    className="border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold text-gray-800">
                          {displayName}
                        </h4>
                        {item.duration && (
                          <p className="text-xs text-gray-500">
                            ⏱ {item.duration}
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="text-red-500 text-sm font-semibold hover:text-red-700 transition"
                      >
                        Remove
                      </button>
                    </div>

                    {/* QUANTITY CONTROL */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border rounded-lg overflow-hidden">
                        <button
                          onClick={() => handleDecrease(item._id, item.quantity)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                        >
                          -
                        </button>

                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => handleIncrease(item._id, item.quantity)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 transition"
                        >
                          +
                        </button>
                      </div>

                      <div className="font-bold text-amber-600">
                        AED {item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* FOOTER */}
          {cart.length > 0 && (
            <div className="border-t p-6 bg-gray-50">
              <div className="flex justify-between mb-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-amber-600">
                  AED {totalAmount}
                </span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold hover:scale-105 transition"
              >
                {language === "ar"
                  ? "احجز الآن"
                  : "Proceed to Booking"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* BOOKING MODAL */}
      {showBookingModal && (
        <BookingModal onClose={() => setShowBookingModal(false)} />
      )}
    </>
  );
};

export default Cart;
