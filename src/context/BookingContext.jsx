import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";

const BookingContext = createContext(null);

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) {
    throw new Error("useBooking must be used inside BookingProvider");
  }
  return ctx;
};

export const BookingProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const [bookingDetails, setBookingDetails] = useState({
    customerName: "",
    phone: "",
    gender: "",
    date: "",
    time: "",
    address: "",
    staff: null,
    isBookingInfoSet: false,
  });

  /* ================= ADD TO CART ================= */
  const addToCart = useCallback((service) => {
    const uniqueId = service.selectedDuration
      ? `${service._id}-${service.selectedDuration.minutes}`
      : service._id;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === uniqueId);

      if (existing) {
        return prev.map((item) =>
          item.id === uniqueId
            ? {
                ...item,
                quantity: item.quantity + (service.quantity || 1),
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id: uniqueId,
          _id: service._id,
          name: service.name || service.title,
          nameAr: service.nameAr || service.titleAr,
          image: service.imageUrl || service.image,
          price: service.selectedDuration
            ? service.selectedDuration.price
            : service.price,
          duration: service.selectedDuration
            ? `${service.selectedDuration.minutes} min`
            : service.duration,
          selectedDuration: service.selectedDuration,
          quantity: service.quantity || 1,
        },
      ];
    });
  }, []);

  /* ================= UPDATE QUANTITY ================= */
  const updateQuantity = useCallback((id, qty) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: qty } : item
        )
        .filter((item) => item.quantity > 0) // auto remove if 0
    );
  }, []);

  /* ================= REMOVE ================= */
  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  /* ================= MEMOIZED CALCULATIONS ================= */
  const getTotalAmount = useCallback(() => {
    return cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }, [cart]);



 const getCartCount = useCallback(() => {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}, [cart]);


  /* ================= BOOKING DETAILS ================= */
  const updateBookingDetails = (details) => {
    setBookingDetails((prev) => ({
      ...prev,
      ...details,
      isBookingInfoSet: true,
    }));
  };

  const resetBooking = () => {
    setCart([]);
    setBookingDetails({
      customerName: "",
      phone: "",
      gender: "",
      date: "",
      time: "",
      address: "",
      staff: null,
      isBookingInfoSet: false,
    });
  };

  return (
    <BookingContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        getTotalAmount,
        getCartCount,
        bookingDetails,
        updateBookingDetails,
        resetBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export default BookingContext;
