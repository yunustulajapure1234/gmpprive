import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import { toastSuccess, toastError } from "../utils/alert";

const AdminContext = createContext(null);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin must be used inside AdminProvider");
  }
  return context;
};

const AdminProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);

  // 🔥 NEW STATES
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);

  /* =========================================================
     🔐 AUTH
  ========================================================= */

  const login = async (email, password) => {
  const res = await api.post("/admin/login", { email, password });

  const token = res.data.data.token;

  localStorage.setItem("adminToken", token);
  api.defaults.headers.common.Authorization = `Bearer ${token}`;

  await loadAdmin(); // 🔥 directly load admin first
};


  const logout = () => {
    localStorage.removeItem("adminToken");
    delete api.defaults.headers.common.Authorization;

    setAdmin(null);
    setServices([]);
    setPackages([]);
    setBookings([]);
    setStats(null);
  };

  /* =========================================================
     👤 ADMIN
  ========================================================= */

  const loadAdmin = async () => {
    const res = await api.get("/admin/me");
    setAdmin(res.data.data);
  };

  /* =========================================================
     📦 SERVICES
  ========================================================= */

  const loadServices = async () => {
    const res = await api.get("/services");
    setServices(res.data.data || []);
  };

  const addService = async (formData) => {
    try {
      const res = await api.post("/services", formData);
      setServices((prev) => [res.data.data, ...prev]);
      toastSuccess("Service created successfully");
    } catch (err) {
      toastError("Failed to create service");
      throw err;
    }
  };

  const updateService = async (id, formData) => {
    try {
      const res = await api.put(`/services/${id}`, formData);
      setServices((prev) =>
        prev.map((s) => (s._id === id ? res.data.data : s))
      );
      toastSuccess("Service updated successfully");
    } catch (err) {
      toastError("Failed to update service");
      throw err;
    }
  };

  const deleteService = async (id) => {
    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s._id !== id));
      toastSuccess("Service deleted successfully");
    } catch (err) {
      toastError("Delete failed");
      throw err;
    }
  };

  /* =========================================================
     🎁 PACKAGES
  ========================================================= */

  const loadPackages = async () => {
    const res = await api.get("/packages");
    setPackages(res.data.data || []);
  };

  const addPackage = async (data) => {
    try {
      const res = await api.post("/packages", data);
      setPackages((prev) => [res.data.data, ...prev]);
      toastSuccess("Package created successfully");
    } catch (err) {
      toastError("Failed to create package");
      throw err;
    }
  };

  const updatePackage = async (id, data) => {
    try {
      const res = await api.put(`/packages/${id}`, data);
      setPackages((prev) =>
        prev.map((p) => (p._id === id ? res.data.data : p))
      );
      toastSuccess("Package updated successfully");
    } catch (err) {
      toastError("Failed to update package");
      throw err;
    }
  };

  const deletePackage = async (id) => {
    try {
      await api.delete(`/packages/${id}`);
      setPackages((prev) => prev.filter((p) => p._id !== id));
      toastSuccess("Package deleted successfully");
    } catch (err) {
      toastError("Failed to delete package");
      throw err;
    }
  };

  /* =========================================================
     🔥 BOOKINGS
  ========================================================= */

  const loadBookings = async () => {
    try {
      const res = await api.get("/bookings");
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Booking load error:", err);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      const res = await api.put(`/bookings/${id}/status`, { status });

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? res.data.data : b))
      );

      toastSuccess("Booking status updated");
      fetchStats(); // 🔥 auto update stats
    } catch (err) {
      toastError("Failed to update status");
    }
  };

  const deleteBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}`);
      setBookings((prev) => prev.filter((b) => b._id !== id));
      toastSuccess("Booking deleted");
      fetchStats();
    } catch (err) {
      toastError("Delete failed");
    }
  };

  /* =========================================================
     📊 STATS
  ========================================================= */

  const fetchStats = async () => {
    try {
      const res = await api.get("/bookings/stats");
      setStats(res.data.data);
    } catch (err) {
      console.error("Stats error:", err);
    }
  };

  /* =========================================================
     🔍 HELPERS
  ========================================================= */

  const getServicesByGender = (gender) =>
    services.filter((s) => s.gender === gender);

  const getCategories = (gender) =>
    [
      ...new Set(
        services.filter((s) => s.gender === gender).map((s) => s.category)
      )
    ].filter(Boolean);

  /* =========================================================
     🚀 INIT LOAD
  ========================================================= */

  const initLoad = async () => {
    try {
      setLoading(true);

      await Promise.all([
        loadAdmin(),
        loadServices(),
        loadPackages(),
        loadBookings(),
        fetchStats()
      ]);
    } catch (err) {
      console.error("Init load error:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const token = localStorage.getItem("adminToken");

  const loadPublicData = async () => {
    try {
      setLoading(true);

      if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
        await initLoad(); // full admin load
      } else {
        // 🔥 LOAD PUBLIC SERVICES ONLY
        await loadServices();
        await loadPackages();
        setLoading(false);
      }
    } catch (err) {
      console.error("Init load error:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  loadPublicData();
}, []);


  return (
    <AdminContext.Provider
      value={{
        admin,
        loading,

        // auth
        login,
        logout,

        // services
        services,
        addService,
        updateService,
        deleteService,
        getServicesByGender,
        getCategories,

        // packages
        packages,
        addPackage,
        updatePackage,
        deletePackage,

        // bookings 🔥
        bookings,
        loadBookings,
        updateBookingStatus,
        deleteBooking,

        // stats 🔥
        stats,
        fetchStats
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminProvider;
