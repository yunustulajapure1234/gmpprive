import React, { useEffect, useState } from "react";
import { useInventory } from "../../context/InventoryContext";
import { useAdmin } from "../../context/AdminContext";

/* ─── Constants ─────────────────────────────────────────── */
const CATEGORIES = [
  "Hair Care", "Skin Care", "Nail Care",
  "Waxing & Threading", "Massage Oils",
  "Grooming", "Equipment", "Disposables", "Other",
];
const UNITS = ["ml", "g", "piece", "bottle", "box", "pack", "litre", "kg"];
const GENDERS = ["both", "women", "men"];

const EMPTY_FORM = {
  name: "", nameAr: "", category: "Hair Care", gender: "both",
  unit: "ml", currentStock: "", lowStockThreshold: 10,
  costPerUnit: "", supplier: { name: "", contact: "" }, notes: "",
};

/* ─── Stock Badge ────────────────────────────────────────── */
const StockBadge = ({ product }) => {
  const isOut      = product.currentStock === 0;
  const isCritical = !isOut && product.currentStock <= product.lowStockThreshold / 2;
  const isLow      = !isOut && !isCritical && product.currentStock <= product.lowStockThreshold;

  if (isOut)      return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400">OUT OF STOCK</span>;
  if (isCritical) return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-500/20 text-orange-400">CRITICAL</span>;
  if (isLow)      return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-yellow-500/20 text-yellow-400">LOW STOCK</span>;
  return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-500/20 text-green-400">OK</span>;
};

/* ─── Product Form Modal ─────────────────────────────────── */
const ProductFormModal = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useInventory();
  const isEdit = !!product;
  const [form, setForm] = useState(
    isEdit
      ? {
          name: product.name || "",
          nameAr: product.nameAr || "",
          category: product.category || "Hair Care",
          gender: product.gender || "both",
          unit: product.unit || "ml",
          currentStock: product.currentStock ?? "",
          lowStockThreshold: product.lowStockThreshold ?? 10,
          costPerUnit: product.costPerUnit ?? "",
          supplier: product.supplier || { name: "", contact: "" },
          notes: product.notes || "",
        }
      : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));
  const setSupplier = (key, val) =>
    setForm((p) => ({ ...p, supplier: { ...p.supplier, [key]: val } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        currentStock: Number(form.currentStock),
        lowStockThreshold: Number(form.lowStockThreshold),
        costPerUnit: Number(form.costPerUnit) || 0,
      };
      if (isEdit) await updateProduct(product._id, payload);
      else await addProduct(payload);
      onClose();
    } catch (_) {}
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3">
      <div className="bg-gray-900 border border-amber-500/30 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h3 className="text-amber-400 font-bold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Name */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Name *</label>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="e.g. Argan Oil Shampoo" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Name (Arabic)</label>
              <input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} dir="rtl"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="الاسم بالعربي" />
            </div>
          </div>

          {/* Category + Gender */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Category *</label>
              <select required value={form.category} onChange={(e) => set("category", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none">
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">For</label>
              <select value={form.gender} onChange={(e) => set("gender", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none">
                {GENDERS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Stock + Unit */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Current Stock *</label>
              <input required type="number" min="0" value={form.currentStock}
                onChange={(e) => set("currentStock", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="0" />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Unit *</label>
              <select required value={form.unit} onChange={(e) => set("unit", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none">
                {UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Low Stock Alert</label>
              <input type="number" min="0" value={form.lowStockThreshold}
                onChange={(e) => set("lowStockThreshold", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="10" />
            </div>
          </div>

          {/* Cost */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Cost per Unit (AED)</label>
            <input type="number" min="0" step="0.01" value={form.costPerUnit}
              onChange={(e) => set("costPerUnit", e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none"
              placeholder="0.00" />
          </div>

          {/* Supplier */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Supplier</label>
            <div className="grid grid-cols-2 gap-2">
              <input value={form.supplier.name} onChange={(e) => setSupplier("name", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="Supplier name" />
              <input value={form.supplier.contact} onChange={(e) => setSupplier("contact", e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none"
                placeholder="+971..." />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-gray-400 block mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => set("notes", e.target.value)} rows={2}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none resize-none"
              placeholder="Any additional notes..." />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold rounded transition disabled:opacity-50">
              {saving ? "Saving..." : isEdit ? "Update" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Stock Action Modal (Add / Deduct) ──────────────────── */
const StockModal = ({ product, mode, onClose }) => {
  const { addStock, deductStock } = useInventory();
  const [quantity, setQuantity] = useState("");
  const [reason, setReason]     = useState("");
  const [type, setType]         = useState("usage");
  const [saving, setSaving]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || Number(quantity) <= 0) return;
    setSaving(true);
    try {
      if (mode === "add") await addStock(product._id, Number(quantity), reason);
      else await deductStock(product._id, Number(quantity), reason, type);
      onClose();
    } catch (_) {}
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3">
      <div className="bg-gray-900 border border-amber-500/30 rounded-xl w-full max-w-sm">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h3 className={`font-bold ${mode === "add" ? "text-green-400" : "text-red-400"}`}>
            {mode === "add" ? "➕ Add Stock" : "➖ Deduct Stock"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-white text-sm font-semibold">{product.name}</p>
            <p className="text-gray-400 text-xs mt-0.5">
              Current: <span className="text-amber-400 font-bold">{product.currentStock} {product.unit}</span>
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Quantity ({product.unit}) *</label>
            <input required type="number" min="1" value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none"
              placeholder="0" autoFocus />
          </div>

          {mode === "deduct" && (
            <div>
              <label className="text-xs text-gray-400 block mb-1">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none">
                <option value="usage">Usage</option>
                <option value="adjustment">Adjustment</option>
                <option value="expired">Expired</option>
                <option value="return">Return</option>
              </select>
            </div>
          )}

          <div>
            <label className="text-xs text-gray-400 block mb-1">Reason</label>
            <input value={reason} onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none"
              placeholder={mode === "add" ? "e.g. Monthly restock" : "e.g. Used for client"} />
          </div>

          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className={`flex-1 py-2 text-sm font-bold rounded transition disabled:opacity-50 ${
                mode === "add"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}>
              {saving ? "..." : mode === "add" ? "Add Stock" : "Deduct"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

/* ─── Main InventoryTab ──────────────────────────────────── */
const InventoryTab = () => {
  const { products, loadProducts, deleteProduct, loadingInventory, lowStockAlerts, loadLowStockAlerts, inventoryStats, loadInventoryStats } = useInventory();
  const { admin } = useAdmin();

  const [showForm, setShowForm]       = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [stockModal, setStockModal]   = useState(null); // { product, mode }
  const [filterCat, setFilterCat]     = useState("");
  const [filterStock, setFilterStock] = useState("");
  const [search, setSearch]           = useState("");
  const [activeView, setActiveView]   = useState("products"); // products | alerts

  useEffect(() => {
    loadProducts();
    loadLowStockAlerts();
    loadInventoryStats();
  }, []);

  const handleFilter = () => {
    const filters = {};
    if (filterCat) filters.category = filterCat;
    if (filterStock === "low") filters.lowStock = true;
    if (search) filters.search = search;
    loadProducts(filters);
  };

  useEffect(() => {
    const t = setTimeout(handleFilter, 400);
    return () => clearTimeout(t);
  }, [filterCat, filterStock, search]);

  const totalAlerts =
    (lowStockAlerts.outOfStock?.length || 0) +
    (lowStockAlerts.critical?.length || 0) +
    (lowStockAlerts.low?.length || 0);

  return (
    <div>
      {/* ── Top Stats ── */}
      {inventoryStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <div className="bg-gray-800 border border-amber-500/20 rounded-lg p-3">
            <p className="text-xs text-gray-400">Total Products</p>
            <p className="text-2xl font-bold text-white">{inventoryStats.totalProducts}</p>
          </div>
          <div className="bg-gray-800 border border-amber-500/20 rounded-lg p-3">
            <p className="text-xs text-gray-400">Stock Value</p>
            <p className="text-2xl font-bold text-amber-400">
              AED {inventoryStats.totalStockValue?.toLocaleString() || 0}
            </p>
          </div>
          <div className={`rounded-lg p-3 border ${inventoryStats.lowStockCount > 0 ? "bg-yellow-900/20 border-yellow-500/30" : "bg-gray-800 border-gray-700"}`}>
            <p className="text-xs text-gray-400">Low Stock</p>
            <p className={`text-2xl font-bold ${inventoryStats.lowStockCount > 0 ? "text-yellow-400" : "text-white"}`}>
              {inventoryStats.lowStockCount}
            </p>
          </div>
          <div className={`rounded-lg p-3 border ${inventoryStats.outOfStockCount > 0 ? "bg-red-900/20 border-red-500/30" : "bg-gray-800 border-gray-700"}`}>
            <p className="text-xs text-gray-400">Out of Stock</p>
            <p className={`text-2xl font-bold ${inventoryStats.outOfStockCount > 0 ? "text-red-400" : "text-white"}`}>
              {inventoryStats.outOfStockCount}
            </p>
          </div>
        </div>
      )}

      {/* ── Sub Tabs ── */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveView("products")}
          className={`px-3 py-1.5 text-sm rounded font-medium transition ${activeView === "products" ? "bg-amber-500 text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
          Products
        </button>
        <button onClick={() => setActiveView("alerts")}
          className={`px-3 py-1.5 text-sm rounded font-medium transition flex items-center gap-1.5 ${activeView === "alerts" ? "bg-amber-500 text-black" : "bg-gray-800 text-gray-300 hover:bg-gray-700"}`}>
          ⚠️ Alerts
          {totalAlerts > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {totalAlerts}
            </span>
          )}
        </button>
      </div>

      {/* ── PRODUCTS VIEW ── */}
      {activeView === "products" && (
        <>
          {/* Filters + Add */}
          <div className="flex flex-wrap gap-2 mb-3">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product..."
              className="flex-1 min-w-[140px] px-3 py-1.5 bg-gray-800 border border-amber-500/30 text-white text-sm rounded focus:ring-1 focus:ring-amber-500 outline-none" />

            <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 text-white text-sm rounded outline-none">
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>

            <select value={filterStock} onChange={(e) => setFilterStock(e.target.value)}
              className="px-3 py-1.5 bg-gray-800 border border-gray-700 text-white text-sm rounded outline-none">
              <option value="">All Stock</option>
              <option value="low">Low Stock Only</option>
            </select>

            <button onClick={() => { setEditProduct(null); setShowForm(true); }}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-black text-sm font-bold rounded transition">
              + Add
            </button>
          </div>

          {/* Products List */}
          {loadingInventory ? (
            <div className="text-center py-10 text-gray-500 text-sm">Loading inventory...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-sm">No products found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {products.map((product) => (
                <div key={product._id} className="bg-gray-900 border border-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                        <StockBadge product={product} />
                      </div>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400">
                        <span>{product.category}</span>
                        <span className="capitalize">{product.gender}</span>
                        {product.supplier?.name && <span>🏪 {product.supplier.name}</span>}
                      </div>
                    </div>

                    {/* Stock Display */}
                    <div className="text-right shrink-0">
                      <p className={`text-xl font-bold ${product.currentStock === 0 ? "text-red-400" : product.currentStock <= product.lowStockThreshold ? "text-yellow-400" : "text-white"}`}>
                        {product.currentStock}
                      </p>
                      <p className="text-gray-500 text-[10px]">{product.unit}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        product.currentStock === 0 ? "bg-red-500" :
                        product.currentStock <= product.lowStockThreshold ? "bg-yellow-500" :
                        "bg-green-500"
                      }`}
                      style={{
                        width: `${Math.min(100, (product.currentStock / Math.max(product.currentStock, product.lowStockThreshold * 3)) * 100)}%`
                      }}
                    />
                  </div>
                  <p className="text-gray-600 text-[10px] mt-0.5">Alert threshold: {product.lowStockThreshold} {product.unit}</p>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setStockModal({ product, mode: "add" })}
                      className="flex-1 py-1.5 bg-green-600/20 hover:bg-green-600/40 text-green-400 text-xs font-semibold rounded transition">
                      + Add Stock
                    </button>
                    <button onClick={() => setStockModal({ product, mode: "deduct" })}
                      className="flex-1 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-semibold rounded transition">
                      - Deduct
                    </button>
                    <button onClick={() => { setEditProduct(product); setShowForm(true); }}
                      className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs rounded transition">
                      Edit
                    </button>
                    {admin?.role === "super-admin" && (
                      <button onClick={() => deleteProduct(product._id)}
                        className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs rounded transition">
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── ALERTS VIEW ── */}
      {activeView === "alerts" && (
        <div className="space-y-4">
          {totalAlerts === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-2">✅</p>
              <p className="text-green-400 font-semibold">All stock levels are good!</p>
            </div>
          ) : (
            <>
              {lowStockAlerts.outOfStock?.length > 0 && (
                <AlertSection title="Out of Stock" color="red" items={lowStockAlerts.outOfStock} />
              )}
              {lowStockAlerts.critical?.length > 0 && (
                <AlertSection title="Critical" color="orange" items={lowStockAlerts.critical} />
              )}
              {lowStockAlerts.low?.length > 0 && (
                <AlertSection title="Low Stock" color="yellow" items={lowStockAlerts.low} />
              )}
            </>
          )}
        </div>
      )}

      {/* ── Modals ── */}
      {showForm && (
        <ProductFormModal
          product={editProduct}
          onClose={() => { setShowForm(false); setEditProduct(null); }}
        />
      )}
      {stockModal && (
        <StockModal
          product={stockModal.product}
          mode={stockModal.mode}
          onClose={() => setStockModal(null)}
        />
      )}
    </div>
  );
};

/* ─── Alert Section Helper ───────────────────────────────── */
const AlertSection = ({ title, color, items }) => {
  const colorMap = {
    red:    { border: "border-red-500/30",    bg: "bg-red-900/10",    text: "text-red-400"    },
    orange: { border: "border-orange-500/30", bg: "bg-orange-900/10", text: "text-orange-400" },
    yellow: { border: "border-yellow-500/30", bg: "bg-yellow-900/10", text: "text-yellow-400" },
  };
  const c = colorMap[color];

  return (
    <div className={`border ${c.border} ${c.bg} rounded-lg p-3`}>
      <p className={`text-xs font-bold ${c.text} mb-2`}>{title} ({items.length})</p>
      <div className="space-y-2">
        {items.map((p) => (
          <div key={p._id} className="flex justify-between items-center text-sm">
            <div>
              <p className="text-white text-xs font-medium">{p.name}</p>
              <p className="text-gray-500 text-[10px]">{p.category} {p.supplier?.name ? `• ${p.supplier.name}` : ""}</p>
            </div>
            <div className="text-right">
              <p className={`font-bold text-sm ${c.text}`}>{p.currentStock} {p.unit}</p>
              <p className="text-gray-500 text-[10px]">min: {p.lowStockThreshold}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryTab;