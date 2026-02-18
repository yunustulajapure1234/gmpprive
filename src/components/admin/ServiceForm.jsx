import React, { useState } from "react";
import { useAdmin } from "../../context/AdminContext";

const ServiceForm = ({ gender, service, onClose }) => {
  const { addService, updateService } = useAdmin();
  const isEdit = Boolean(service?._id);

  const [preview, setPreview] = useState(
    service?.imageUrl || service?.image || null
  );

  const [form, setForm] = useState({
    name: service?.name || "",
    nameAr: service?.nameAr || "",
    description: service?.description || "",
    descriptionAr: service?.descriptionAr || "",
    category: service?.category || "",
    categoryAr: service?.categoryAr || "",
    price: service?.price || "",
    duration: service?.duration || "",
    image: null,
    isMassage: service?.durations?.length > 0,
    durations:
      service?.durations?.length > 0
        ? service.durations
        : [
            { minutes: 60, price: 0 },
            { minutes: 90, price: 0 },
            { minutes: 120, price: 0 },
          ],
  });

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      const file = files[0];
      setForm({ ...form, image: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  /* =========================
     HANDLE SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();

    fd.append("name", form.name);
    fd.append("nameAr", form.nameAr);
    fd.append("description", form.description);
    fd.append("descriptionAr", form.descriptionAr);
    fd.append("category", form.category);
    fd.append("categoryAr", form.categoryAr);
    fd.append("gender", gender);

    if (form.isMassage) {
      const cleanDurations = form.durations.map((d) => ({
        minutes: Number(d.minutes),
        price: Number(d.price),
      }));

      fd.append("durations", JSON.stringify(cleanDurations));
    } else {
      fd.append("price", Number(form.price));
      fd.append("duration", form.duration || "");
    }

    if (form.image) {
      fd.append("image", form.image);
    }

    try {
      if (isEdit) {
        await updateService(service._id, fd);
      } else {
        await addService(fd);
      }

      onClose();
    } catch (err) {
      console.error("Submit Error:", err);
    }
  };

  /* =========================
     UI
  ========================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-amber-500 to-yellow-600">
          <h2 className="text-xl font-bold text-white">
            {isEdit ? "✏️ Update Service" : "➕ Add New Service"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition"
          >
            ✕
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Service Name (English)"
              className="border-2 border-gray-200 rounded-lg px-4 py-3"
              required
            />
            <input
              name="nameAr"
              value={form.nameAr}
              onChange={handleChange}
              placeholder="اسم الخدمة"
              dir="rtl"
              className="border-2 border-gray-200 rounded-lg px-4 py-3 text-right"
              required
            />
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
              rows="3"
              className="border-2 border-gray-200 rounded-lg px-4 py-3"
            />
            <textarea
              name="descriptionAr"
              value={form.descriptionAr}
              onChange={handleChange}
              placeholder="الوصف"
              dir="rtl"
              rows="3"
              className="border-2 border-gray-200 rounded-lg px-4 py-3 text-right"
            />
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="border-2 border-gray-200 rounded-lg px-4 py-3"
            />
            <input
              name="categoryAr"
              value={form.categoryAr}
              onChange={handleChange}
              placeholder="التصنيف"
              dir="rtl"
              className="border-2 border-gray-200 rounded-lg px-4 py-3 text-right"
            />
          </div>

          {/* Massage Toggle */}
          <label className="flex items-center space-x-3 bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
            <input
              type="checkbox"
              checked={form.isMassage}
              onChange={(e) =>
                setForm({ ...form, isMassage: e.target.checked })
              }
            />
            <span className="font-semibold text-amber-700">
              🧖 SPA / Massage Service
            </span>
          </label>

          {/* Pricing */}
          {form.isMassage ? (
            <div className="grid grid-cols-3 gap-3">
              {form.durations.map((d, i) => (
                <div key={i} className="border-2 border-gray-200 rounded-lg p-3">
                  <p className="text-center font-semibold mb-2">
                    {d.minutes} min
                  </p>
                  <input
                    type="number"
                    value={d.price}
                    onChange={(e) => {
                      const copy = [...form.durations];
                      copy[i].price = Number(e.target.value);
                      setForm({ ...form, durations: copy });
                    }}
                    className="w-full border px-3 py-2 rounded text-center"
                    required
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                placeholder="Price (AED)"
                className="border-2 border-gray-200 rounded-lg px-4 py-3"
                required
              />
              <input
                name="duration"
                value={form.duration}
                onChange={handleChange}
                placeholder="Duration (minutes)"
                className="border-2 border-gray-200 rounded-lg px-4 py-3"
              />
            </div>
          )}

          {/* Image Upload */}
          <div>
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-60 object-cover rounded-xl mb-4"
              />
            )}

            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 rounded-xl py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl py-3"
            >
              {isEdit ? "💾 Update" : "➕ Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
