import React, { useMemo, useCallback } from "react";
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
  const [showBookingModal, setShowBookingModal] = React.useState(false);

  /* ================= TOTAL ================= */
  const totalAmount = useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price * item.quantity;
    }, 0);
  }, [cart]);

  /* ================= HANDLERS ================= */
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

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 flex justify-end">
        <div className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl">

          {/* HEADER */}
          <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {language === "ar" ? "سلة التسوق" : "Your Cart"}
              </h2>
              <button onClick={onClose} className="text-xl">✕</button>
            </div>
            <p className="mt-2 text-sm">{cart.length} Items</p>
          </div>

          {/* CART ITEMS */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-400 mt-20">
                Cart is empty
              </div>
            ) : (
              cart.map((item) => {
                const displayName =
                  language === "ar"
                    ? item.nameAr || item.name
                    : item.name;

                return (
                  <div
                    key={item.id}
                    className="border rounded-xl p-4 shadow-sm"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-bold">{displayName}</h4>
                      <button
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center border rounded-lg">
                        <button
                          onClick={() =>
                            handleDecrease(item.id, item.quantity)
                          }
                          className="px-3 py-1"
                        >
                          -
                        </button>

                        <span className="px-4 font-semibold">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() =>
                            handleIncrease(item.id, item.quantity)
                          }
                          className="px-3 py-1"
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
                onClick={() => setShowBookingModal(true)}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-bold"
              >
                Proceed to Booking
              </button>
            </div>
          )}
        </div>
      </div>

      {showBookingModal && (
        <BookingModal onClose={() => setShowBookingModal(false)} />
      )}
    </>
  );
};

export default Cart;
