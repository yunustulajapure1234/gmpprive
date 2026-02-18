import React, { useState } from "react";
import api from "../api/api";
import { useBooking } from "../context/BookingContext";
import { useLanguage } from "../context/LanguageContext";

const BookingModal = ({ onClose }) => {
  const { updateBookingDetails, bookingDetails, cart, getTotalAmount } =
    useBooking();
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    customerName: bookingDetails.customerName || "",
    phone: bookingDetails.phone || "",
    date: bookingDetails.date || "",
    time: bookingDetails.time || "",
    building: "",
    apartment: "",
    area: "",
  });

  const [errors, setErrors] = useState({});

  const timeSlots = [
    "09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM",
    "12:00 PM","12:30 PM","01:00 PM","01:30 PM","02:00 PM","02:30 PM",
    "03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM","05:30 PM",
    "06:00 PM","06:30 PM","07:00 PM","07:30 PM","08:00 PM","08:30 PM"
  ];

  /* ================= DUBAI TIME ================= */
  const getDubaiNow = () => {
    return new Date(
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Dubai",
      })
    );
  };

  const getTodayDubai = () => {
    const dubaiNow = getDubaiNow();
    return dubaiNow.toISOString().split("T")[0];
  };

  const isTodaySelected = () => {
    return formData.date === getTodayDubai();
  };

  const isTimeSlotDisabled = (slot) => {
    if (!isTodaySelected()) return false;

    const dubaiNow = getDubaiNow();

    const [time, modifier] = slot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const slotTime = new Date(dubaiNow);
    slotTime.setHours(hours, minutes, 0, 0);

    return slotTime <= dubaiNow;
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim())
      newErrors.customerName = "Name is required";
    if (!formData.phone.trim())
      newErrors.phone = "Phone is required";
    if (!formData.date)
      newErrors.date = "Date is required";
    if (!formData.time)
      newErrors.time = "Time is required";
    if (!formData.building.trim())
      newErrors.building = "Building required";
    if (!formData.apartment.trim())
      newErrors.apartment = "Apartment required";
    if (!formData.area.trim())
      newErrors.area = "Area required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ================= WHATSAPP ================= */
  const handleWhatsAppBooking = async (finalData, bookingNumber) => {
    const phone = "917796413908";

    const fullAddress = `
Building: ${finalData.building}
Apartment/Villa: ${finalData.apartment}
Area: ${finalData.area}
`;

    const mapQuery = `${finalData.building}, ${finalData.apartment}, ${finalData.area}, UAE`;

    const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      mapQuery
    )}`;

    const servicesList = cart
      .map((item, index) => {
        const name =
          language === "ar"
            ? item.nameAr || item.name
            : item.name || item.nameAr;

        const duration =
          item.selectedDuration?.minutes
            ? `(${item.selectedDuration.minutes} min)\n`
            : item.duration
            ? `(${item.duration})\n`
            : "";

        return `${index + 1}. ${name}
${duration}Qty: ${item.quantity} | Price: AED ${
          item.price * item.quantity
        }`;
      })
      .join("\n\n");

    const message = `Booking ID: ${bookingNumber}

Date: ${finalData.date}

Customer Name: ${finalData.customerName}
Phone: ${finalData.phone}

Selected Services:
${servicesList}

Time: ${finalData.time}

Address:
${fullAddress}

Payment Method: Cash / Card
Total Amount: AED ${getTotalAmount()}

Google Maps Link:
${mapLink}

Please confirm the booking.`;

    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formattedServices = cart.map((item) => ({
        itemId: item._id,
        type: item.type || "service",
        name: item.name,
        nameAr: item.nameAr || "",
        price: item.price,
        quantity: item.quantity || 1,
        duration:
          item.selectedDuration?.minutes || item.duration || null,
        packageItems: item.items || [],
      }));

      const response = await api.post("/bookings", {
        customerName: formData.customerName,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        address: {
          building: formData.building,
          apartment: formData.apartment,
          area: formData.area,
        },
        services: formattedServices,
        totalAmount: getTotalAmount(),
      });

      const bookingNumber = response.data.data.bookingNumber;

      await handleWhatsAppBooking(formData, bookingNumber);

      updateBookingDetails(formData);
      onClose();
    } catch (error) {
      console.error("Booking save error:", error);
      alert("Booking failed");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

        <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-6 rounded-t-3xl">
          <h2 className="text-2xl font-bold">Booking Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="customerName"
              placeholder="Full Name"
              value={formData.customerName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200"
            />

            <input
              type="tel"
              name="phone"
              placeholder="+971 XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="date"
              name="date"
              value={formData.date}
              min={getTodayDubai()}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200"
            />

            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200"
            >
              <option value="">Select Time</option>
              {timeSlots.map((slot) => {
                const disabled = isTimeSlotDisabled(slot);
                return (
                  <option
                    key={slot}
                    value={slot}
                    disabled={disabled}
                  >
                    {disabled ? `${slot} (Unavailable)` : slot}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="text"
              name="building"
              placeholder="Building Name"
              value={formData.building}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200"
            />

            <input
              type="text"
              name="apartment"
              placeholder="Apartment / Villa / Street"
              value={formData.apartment}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200"
            />
          </div>

          <input
            type="text"
            name="area"
            placeholder="Area (JVC / Marina / Downtown)"
            value={formData.area}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200"
          />

          <button
            type="submit"
            className="w-full py-4 bg-green-600 text-white font-bold rounded-xl hover:scale-105 transition-all"
          >
            Confirm & Book via WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
