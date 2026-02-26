import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/api";
import { toastSuccess, toastError } from "../utils/alert";
import Swal from "sweetalert2";

const InventoryContext = createContext(null);

export const useInventory = () => {
  const ctx = useContext(InventoryContext);
  if (!ctx) throw new Error("useInventory must be used inside InventoryProvider");
  return ctx;
};

const InventoryProvider = ({ children }) => {
  const [products, setProducts]       = useState([]);
  const [staff, setStaff]             = useState([]);
  const [lowStockAlerts, setLowStockAlerts] = useState({ outOfStock: [], critical: [], low: [] });
  const [inventoryStats, setInventoryStats] = useState(null);
  const [loadingInventory, setLoadingInventory] = useState(false);

  /* =========================================================
     📦 PRODUCTS
  ========================================================= */

  const loadProducts = useCallback(async (filters = {}) => {
    try {
      setLoadingInventory(true);
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/inventory${params ? `?${params}` : ""}`);
      setProducts(res.data.data || []);
    } catch (err) {
      toastError("Failed to load inventory");
    } finally {
      setLoadingInventory(false);
    }
  }, []);

  const addProduct = async (data) => {
    try {
      const res = await api.post("/inventory", data);
      setProducts((prev) => [res.data.data, ...prev]);
      toastSuccess("Product added to inventory");
      loadLowStockAlerts();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to add product");
      throw err;
    }
  };

  const updateProduct = async (id, data) => {
    try {
      const res = await api.put(`/inventory/${id}`, data);
      setProducts((prev) => prev.map((p) => (p._id === id ? res.data.data : p)));
      toastSuccess("Product updated");
      loadLowStockAlerts();
    } catch (err) {
      toastError("Failed to update product");
      throw err;
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Product?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/inventory/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toastSuccess("Product deleted");
      loadLowStockAlerts();
    } catch (err) {
      toastError("Delete failed");
    }
  };

  /* =========================================================
     📈 STOCK OPERATIONS
  ========================================================= */

  const addStock = async (id, quantity, reason) => {
    try {
      const res = await api.post(`/inventory/${id}/add-stock`, { quantity, reason });
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, currentStock: res.data.data.currentStock } : p
        )
      );
      toastSuccess(res.data.message);
      loadLowStockAlerts();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to add stock");
      throw err;
    }
  };

  const deductStock = async (id, quantity, reason, type = "usage") => {
    try {
      const res = await api.post(`/inventory/${id}/deduct-stock`, { quantity, reason, type });
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, currentStock: res.data.data.currentStock } : p
        )
      );
      toastSuccess(res.data.message);
      if (res.data.warning) toastError(res.data.warning);
      loadLowStockAlerts();
    } catch (err) {
      toastError(err.response?.data?.message || "Failed to deduct stock");
      throw err;
    }
  };

  /* =========================================================
     ⚠️ LOW STOCK ALERTS
  ========================================================= */

  const loadLowStockAlerts = useCallback(async () => {
    try {
      const res = await api.get("/inventory/low-stock");
      setLowStockAlerts(res.data.data || { outOfStock: [], critical: [], low: [] });
      setInventoryStats((prev) => ({
        ...prev,
        alertSummary: res.data.summary,
      }));
    } catch (err) {
      console.error("Low stock load error:", err);
    }
  }, []);

  const loadInventoryStats = useCallback(async () => {
    try {
      const res = await api.get("/inventory/stats");
      setInventoryStats(res.data.data);
    } catch (err) {
      console.error("Inventory stats error:", err);
    }
  }, []);

  /* =========================================================
     👨‍💼 STAFF
  ========================================================= */

  const loadStaff = useCallback(async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/staff${params ? `?${params}` : ""}`);
      setStaff(res.data.data || []);
    } catch (err) {
      toastError("Failed to load staff");
    }
  }, []);

  const addStaff = async (data) => {
    try {
      const res = await api.post("/staff", data);
      setStaff((prev) => [res.data.data, ...prev]);
      toastSuccess("Staff member added");
    } catch (err) {
      toastError("Failed to add staff");
      throw err;
    }
  };

  const updateStaff = async (id, data) => {
    try {
      const res = await api.put(`/staff/${id}`, data);
      setStaff((prev) => prev.map((s) => (s._id === id ? res.data.data : s)));
      toastSuccess("Staff updated");
    } catch (err) {
      toastError("Failed to update staff");
      throw err;
    }
  };

  const toggleStaffAvailability = async (id) => {
    try {
      const res = await api.patch(`/staff/${id}/toggle-availability`);
      setStaff((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, isAvailable: res.data.data.isAvailable } : s
        )
      );
      toastSuccess(res.data.message);
    } catch (err) {
      toastError("Failed to toggle availability");
    }
  };

  const deleteStaff = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Remove Staff?",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, Remove",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/staff/${id}`);
      setStaff((prev) => prev.filter((s) => s._id !== id));
      toastSuccess("Staff removed");
    } catch (err) {
      toastError("Delete failed");
    }
  };

  /* =========================================================
     🔗 SERVICE LINKING
  ========================================================= */

  const linkServiceToProduct = async (productId, serviceId, serviceName, usagePerSession) => {
    try {
      await api.post(`/inventory/${productId}/link-service`, {
        serviceId,
        serviceName,
        usagePerSession,
      });
      toastSuccess("Service linked to product");
      loadProducts();
    } catch (err) {
      toastError("Failed to link service");
    }
  };

  const unlinkServiceFromProduct = async (productId, serviceId) => {
    try {
      await api.delete(`/inventory/${productId}/unlink-service/${serviceId}`);
      toastSuccess("Service unlinked");
      loadProducts();
    } catch (err) {
      toastError("Failed to unlink service");
    }
  };

  return (
    <InventoryContext.Provider
      value={{
        // products
        products,
        loadingInventory,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,

        // stock
        addStock,
        deductStock,

        // alerts & stats
        lowStockAlerts,
        inventoryStats,
        loadLowStockAlerts,
        loadInventoryStats,

        // staff
        staff,
        loadStaff,
        addStaff,
        updateStaff,
        deleteStaff,
        toggleStaffAvailability,

        // service linking
        linkServiceToProduct,
        unlinkServiceFromProduct,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export default InventoryProvider;