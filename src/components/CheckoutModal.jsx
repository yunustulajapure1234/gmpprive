import { useBooking } from '../context/BookingContext';

const CheckoutModal = ({ onClose }) => {
  const { cart, bookingDetails, setBookingInfo, getTotalAmount } = useBooking();

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-amber-500 to-yellow-600 p-6 text-white">
          <h2 className="text-2xl font-bold">Checkout</h2>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6">

          {/* USER DETAILS (reuse your BookingModal form here) */}

          {/* CART SUMMARY */}
          <div>
            <h3 className="font-bold mb-3">Selected Services</h3>
            {cart.map((item, i) => (
              <div key={i} className="flex justify-between text-sm mb-2">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-500">⏱ {item.duration} min</p>
                </div>
                <p className="font-bold">AED {item.price}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-green-600">AED {getTotalAmount()}</span>
          </div>

          <button className="w-full bg-green-500 text-white py-4 rounded-xl font-bold">
            Book via WhatsApp
          </button>

        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;
