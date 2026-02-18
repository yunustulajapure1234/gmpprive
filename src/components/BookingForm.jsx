import React, { useState } from "react";
import { useBooking } from "../context/BookingContext";

const BookingForm = ({ onClose, onConfirm }) => {
  const { setBookingDetails } = useBooking();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    date: "",
    time: "",
    address: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setBookingDetails(form);
    onClose();
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">

        <h2 className="text-xl font-bold mb-4">Booking Details</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            name="customerName"
            placeholder="Full Name"
            required
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl"
          />

          <input
            name="phone"
            placeholder="Phone Number"
            required
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl"
          />

          <input
            type="date"
            name="date"
            required
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl"
          />

          <input
            type="time"
            name="time"
            required
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl"
          />

          <textarea
            name="address"
            placeholder="Full Address"
            required
            onChange={handleChange}
            className="w-full border px-4 py-3 rounded-xl"
          />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold"
            >
              Confirm & WhatsApp
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 border rounded-xl"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookingForm;
