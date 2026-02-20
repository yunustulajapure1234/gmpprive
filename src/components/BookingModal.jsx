import React, { useState, useRef, useCallback, memo } from "react";
import api from "../api/api";
import { useBooking } from "../context/BookingContext";
import { useLanguage } from "../context/LanguageContext";
import "./BookingModal.css";

/* ================= MEMOIZED INPUT COMPONENTS ================= */
const InputField = memo(({ name, type = "text", placeholder, label, error, value, onChange, ...props }) => (
  <div className="form-field">
    {label && <label htmlFor={name}>{label}</label>}
    <input
      id={name}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={error ? "error" : ""}
      autoComplete={name === "customerName" ? "name" : name === "phone" ? "tel" : "off"}
      {...props}
    />
    {error && <div className="error-message" role="alert">{error}</div>}
  </div>
));

const SelectField = memo(({ name, label, placeholder, error, value, onChange, children, ...props }) => (
  <div className="form-field">
    {label && <label htmlFor={name}>{label}</label>}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={error ? "error" : ""}
      {...props}
    >
      <option value="">{placeholder}</option>
      {children}
    </select>
    {error && <div className="error-message" role="alert">{error}</div>}
  </div>
));

/* ================= TIME SLOTS (defined outside component to avoid re-creation) ================= */
const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
  "06:00 PM", "06:30 PM", "07:00 PM", "07:30 PM", "08:00 PM", "08:30 PM"
];

/* ================= PHONE VALIDATION ================= */
const validatePhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  if (cleaned.length < 7 || cleaned.length > 15) return false;
  // Must contain at least 7 digits — broad international support
  return /^\d{7,15}$/.test(cleaned);
};

/* ================= DUBAI TIME UTILS ================= */
const getDubaiNow = () =>
  new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Dubai" }));

const getTodayDubai = () =>
  getDubaiNow().toISOString().split("T")[0];

/* ================= MAIN COMPONENT ================= */
const BookingModal = ({ onClose }) => {
  const { updateBookingDetails, bookingDetails, cart, getTotalAmount } = useBooking();
  const { language } = useLanguage();

  const [formData, setFormData] = useState({
    customerName: bookingDetails.customerName || "",
    phone: bookingDetails.phone || "",
    date: bookingDetails.date || "",
    time: bookingDetails.time || "",
    building: bookingDetails.building || "",
    apartment: bookingDetails.apartment || "",
    area: bookingDetails.area || "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const formRef = useRef(null);
  const todayDubai = useRef(getTodayDubai()).current;

  /* ================= AUTO-FILL NAME FROM CONTACTS ================= */
  const handlePhoneClick = async () => {
    // Use Contact Picker API if available (Android Chrome, some browsers)
    if ("contacts" in navigator && "ContactsManager" in window) {
      try {
        const contacts = await navigator.contacts.select(["name", "tel"], { multiple: false });
        if (contacts && contacts.length > 0) {
          const contact = contacts[0];
          const name = contact.name?.[0] || "";
          const tel = contact.tel?.[0] || "";

          setFormData((prev) => ({
            ...prev,
            customerName: name || prev.customerName,
            phone: tel ? tel.replace(/\s+/g, "") : prev.phone,
          }));

          // Clear related errors
          setErrors((prev) => ({ ...prev, customerName: "", phone: "" }));
        }
      } catch (err) {
        // User cancelled or API not supported — just focus the field
        console.log("Contact picker dismissed:", err.message);
      }
    }
    // If not supported, browser's native autocomplete (tel) will handle it
  };

  /* ================= TIME SLOT DISABLE CHECK ================= */
  const isTimeSlotDisabled = useCallback((slot) => {
    if (formData.date !== todayDubai) return false;
    const dubaiNow = getDubaiNow();
    const [time, modifier] = slot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const slotTime = new Date(dubaiNow);
    slotTime.setHours(hours, minutes, 0, 0);
    return slotTime <= dubaiNow;
  }, [formData.date, todayDubai]);

  /* ================= VALIDATION ================= */
  const validateStep = useCallback((step) => {
    const newErrors = {};

    if (step === 1) {
      const name = formData.customerName.trim();
      if (!name) newErrors.customerName = "Name is required";
      else if (name.length < 2) newErrors.customerName = "Name must be at least 2 characters";
      else if (!/^[a-zA-Z\u0600-\u06FF\s'-]+$/.test(name)) newErrors.customerName = "Please enter a valid name";

      const phone = formData.phone.trim();
      if (!phone) newErrors.phone = "Phone number is required";
      else if (!validatePhoneNumber(phone)) newErrors.phone = "Enter a valid phone number (7–15 digits)";
    }

    if (step === 2) {
      if (!formData.date) newErrors.date = "Please select a date";
      if (!formData.time) newErrors.time = "Please select a time slot";
    }

    if (step === 3) {
      if (!formData.building.trim()) newErrors.building = "Building name is required";
      if (!formData.apartment.trim()) newErrors.apartment = "Apartment / Villa number is required";
      if (!formData.area.trim()) newErrors.area = "Area is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /* ================= HANDLERS ================= */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }, [errors]);

  const scrollToTop = () => {
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((s) => s + 1);
      scrollToTop();
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((s) => s - 1);
    scrollToTop();
  };

  /* ================= WHATSAPP ================= */
  const handleWhatsAppBooking = (finalData, bookingNumber) => {
    const phone = "917796413908";
    const fullAddress = `Building: ${finalData.building}\nApartment/Villa: ${finalData.apartment}\nArea: ${finalData.area}`;
    const mapQuery = `${finalData.building}, ${finalData.apartment}, ${finalData.area}, UAE`;
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

    const servicesList = cart
      .map((item, i) => {
        const name = language === "ar" ? item.nameAr || item.name : item.name || item.nameAr;
        const duration = item.selectedDuration?.minutes
          ? `(${item.selectedDuration.minutes} min)`
          : item.duration ? `(${item.duration})` : "";
        return `${i + 1}. ${name} ${duration}\nQty: ${item.quantity} | Price: AED ${item.price * item.quantity}`;
      })
      .join("\n\n");

    const message = ` *BOOKING CONFIRMATION*\n\n Booking ID: ${bookingNumber}\n\n Date: ${finalData.date}\n Time: ${finalData.time}\n\n Customer: ${finalData.customerName}\n Phone: ${finalData.phone}\n\n *Services:*\n${servicesList}\n\n *Address:*\n${fullAddress}\n\n Total: AED ${getTotalAmount()}\n Payment: Cash / Card\n\n Maps: ${mapLink}\n\nPlease confirm this booking.`;

    window.location.href = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsLoading(true);

    // ─── Safe duration parser ───────────────────────────────────────────
    // Handles: 30, "30", "30 min", "45 minutes", null, undefined → number | 0
    const parseDuration = (val) => {
      if (val === null || val === undefined || val === "") return 0;
      const num = parseInt(String(val).replace(/\D/g, ""), 10);
      return isNaN(num) ? 0 : num;
    };

    // ─── Build booking number immediately ──────────────────────────────
    const bookingNumber = `BK${Date.now()}`;

    // ─── Build payload ─────────────────────────────────────────────────
    const formattedServices = cart.map((item) => ({
      itemId: item._id || item.id,
      type: item.type === "package" ? "package" : "service",
      name: item.name || "",
      nameAr: item.nameAr || "",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      duration: parseDuration(item.selectedDuration?.minutes ?? item.duration),
      packageItems: Array.isArray(item.items) ? item.items.map(String) : [],
    }));

    const payload = {
      customerName: formData.customerName.trim(),
      phone: formData.phone.trim(),
      date: formData.date,
      time: formData.time,
      address: {
        building: formData.building.trim(),
        apartment: formData.apartment.trim(),
        area: formData.area.trim(),
      },
      services: formattedServices,
      totalAmount: Number(getTotalAmount()) || 0,
      bookingNumber,
    };

    // ─── Step 1: WhatsApp FIRST — instant redirect, no waiting ─────────
    updateBookingDetails(formData);
    handleWhatsAppBooking(formData, bookingNumber);
    onClose();

    // ─── Step 2: Save to DB in background (fire and forget) ────────────
    api.post("/bookings", payload).catch((err) => {
      console.error("⚠️ Background booking save failed:", {
        status: err.response?.status,
        error: err.response?.data,
        payload,
      });
    });
  };

  /* ================= STEP INDICATOR ================= */
  const StepIndicator = memo(() => (
    <div className="step-indicator" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={3}>
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div className="step-indicator-item">
            <div className={`step-indicator-circle ${step === currentStep ? "active" : step < currentStep ? "completed" : "pending"}`}>
              {step < currentStep ? "✓" : step}
            </div>
            <p className="step-indicator-label">
              {step === 1 ? "Personal" : step === 2 ? "Schedule" : "Address"}
            </p>
          </div>
          {step < 3 && (
            <div className={`step-indicator-line ${step < currentStep ? "active" : "pending"}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  ));

  /* ================= UI ================= */
  return (
    <div className="booking-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="booking-modal-content" role="dialog" aria-modal="true" aria-label="Booking Form">

        {/* Header */}
        <div className="booking-modal-header">
          <div>
            <h2>Book a Service</h2>
            <p>Step {currentStep} of 3 — {currentStep === 1 ? "Personal Info" : currentStep === 2 ? "Date & Time" : "Your Address"}</p>
          </div>
          <button onClick={onClose} className="booking-modal-close-btn" aria-label="Close">✕</button>
        </div>

        <StepIndicator />

        <form ref={formRef} onSubmit={handleSubmit} className="booking-form" noValidate>

          {/* STEP 1: Personal Info */}
          {currentStep === 1 && (
            <div className="form-step animate-fadeIn">
              <div className="info-box">
                <p>📝 Enter your personal details</p>
              </div>

              <InputField
                name="customerName"
                placeholder="Full Name"
                label="Your Name"
                value={formData.customerName}
                onChange={handleChange}
                error={errors.customerName}
                autoFocus
              />

              <div className="form-field">
                <label htmlFor="phone">Phone Number</label>
                <div className="phone-input-wrapper">
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+971 50 123 4567"
                    value={formData.phone}
                    onChange={handleChange}
                    onClick={handlePhoneClick}
                    className={errors.phone ? "error" : ""}
                    autoComplete="tel"
                    inputMode="tel"
                  />
                  {/* Contact Picker button — visible only when API is supported */}
                  {"contacts" in navigator && (
                    <button
                      type="button"
                      className="contact-picker-btn"
                      onClick={handlePhoneClick}
                      title="Pick from contacts"
                      aria-label="Select from contacts"
                    >
                      👤
                    </button>
                  )}
                </div>
                {errors.phone && <div className="error-message" role="alert">{errors.phone}</div>}
                <p className="field-hint">📱 Tap to auto-fill from your contacts</p>
              </div>

              <button type="button" onClick={handleNextStep} className="btn btn-single">
                Next: Date &amp; Time →
              </button>
            </div>
          )}

          {/* STEP 2: Date & Time */}
          {currentStep === 2 && (
            <div className="form-step animate-fadeIn">
              <div className="info-box">
                <p>📅 Select your preferred date and time</p>
              </div>

              <InputField
                name="date"
                type="date"
                label="Select Date"
                value={formData.date}
                onChange={handleChange}
                error={errors.date}
                min={todayDubai}
              />

              <SelectField
                name="time"
                label="Select Time Slot"
                placeholder="Choose a time"
                value={formData.time}
                onChange={handleChange}
                error={errors.time}
              >
                {TIME_SLOTS.map((slot) => {
                  const disabled = isTimeSlotDisabled(slot);
                  return (
                    <option key={slot} value={slot} disabled={disabled}>
                      {disabled ? `${slot} — Unavailable` : slot}
                    </option>
                  );
                })}
              </SelectField>

              <div className="button-group">
                <button type="button" onClick={handlePrevStep} className="btn btn-secondary">← Back</button>
                <button type="button" onClick={handleNextStep} className="btn btn-primary">Next: Address →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Address */}
          {currentStep === 3 && (
            <div className="form-step animate-fadeIn">
              <div className="info-box">
                <p>📍 Enter your service address in Dubai/UAE</p>
              </div>

              <InputField
                name="building"
                placeholder="e.g. Marina Heights, Burj View"
                label="Building Name / Number"
                value={formData.building}
                onChange={handleChange}
                error={errors.building}
                autoComplete="address-line1"
              />

              <InputField
                name="apartment"
                placeholder="e.g. Apt 204, Villa 12"
                label="Apartment / Villa"
                value={formData.apartment}
                onChange={handleChange}
                error={errors.apartment}
                autoComplete="address-line2"
              />

              <InputField
                name="area"
                placeholder="e.g. JVC, Marina, Downtown, Deira"
                label="Area"
                value={formData.area}
                onChange={handleChange}
                error={errors.area}
                autoComplete="address-level2"
              />

              {/* Summary */}
              <div className="summary-box">
                <p className="summary-box-title">📋 Booking Summary</p>
                <div className="summary-box-content">
                  {cart.map((item, i) => {
                    const name = language === "ar" ? item.nameAr || item.name : item.name || item.nameAr;
                    return (
                      <div key={i} className="summary-box-item">
                        <span>{name}</span>
                        <span>× {item.quantity} — AED {item.price * item.quantity}</span>
                      </div>
                    );
                  })}
                  <div className="summary-box-total">Total: AED {getTotalAmount()}</div>
                </div>
              </div>

              <div className="button-group">
                <button type="button" onClick={handlePrevStep} className="btn btn-secondary">← Back</button>
                <button type="submit" disabled={isLoading} className="btn btn-primary">
                  {isLoading ? (
                    <><span className="loading-spinner">⏳</span> Processing...</>
                  ) : (
                    <>✓ Confirm &amp; WhatsApp</>
                  )}
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
};

export default BookingModal;