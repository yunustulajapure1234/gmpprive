import React, { useState, useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import Swal from "sweetalert2";

const PackageForm = ({ pkg, onClose }) => {
  const { addPackage, updatePackage } = useAdmin();
  const isEdit = Boolean(pkg);

  const [form, setForm] = useState({
    title: "",
    titleAr: "",
    price: "",
    items: "",
    itemsAr: "",
  });

  useEffect(() => {
    if (pkg) {
      setForm({
        title: pkg.title || "",
        titleAr: pkg.titleAr || "",
        price: pkg.price || "",
        items: pkg.items?.join("\n") || "",
        itemsAr: pkg.itemsAr?.join("\n") || "",
      });
    }
  }, [pkg]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const items = form.items.split("\n").map(i => i.trim()).filter(Boolean);
    const itemsAr = form.itemsAr.split("\n").map(i => i.trim()).filter(Boolean);

    if (!items.length || !itemsAr.length) {
      Swal.fire("Missing Items", "Add items in both languages", "warning");
      return;
    }

    const payload = {
      title: form.title.trim(),
      titleAr: form.titleAr.trim(),
      price: Number(form.price),
      items,
      itemsAr,
    };

    try {
      isEdit
        ? await updatePackage(pkg._id, payload)
        : await addPackage(payload);

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `Package ${isEdit ? "updated" : "added"} successfully`,
        showConfirmButton: false,
        timer: 2000,
      });

      onClose();
    } catch (err) {
      Swal.fire("Error", "Failed to save package", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-5 max-h-[85vh] overflow-y-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold">
            {isEdit ? "Edit Package" : "Add Package"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">

          <input
            name="title"
            placeholder="Package Title (EN)"
            value={form.title}
            onChange={handleChange}
            className="input-sm"
            required
          />

          <input
            name="titleAr"
            placeholder="اسم الباقة"
            value={form.titleAr}
            onChange={handleChange}
            className="input-sm text-right"
            dir="rtl"
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price (AED)"
            value={form.price}
            onChange={handleChange}
            className="input-sm"
            required
          />

          <textarea
            name="items"
            placeholder="Items (one per line)"
            value={form.items}
            onChange={handleChange}
            className="input-sm h-20"
            required
          />

          <textarea
            name="itemsAr"
            placeholder="العناصر (سطر لكل عنصر)"
            value={form.itemsAr}
            onChange={handleChange}
            className="input-sm h-20 text-right"
            dir="rtl"
            required
          />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg font-semibold"
            >
              {isEdit ? "Update" : "Add"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 border rounded-lg"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PackageForm;
