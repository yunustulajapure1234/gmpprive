import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
});

/* =========================================================
   REQUEST INTERCEPTOR
   🔥 ADMIN + INVENTORY TOKEN SUPPORT
========================================================= */

api.interceptors.request.use(
  (config) => {
    // First check inventory token
    const inventoryToken = localStorage.getItem("inventoryToken");
    const adminToken = localStorage.getItem("adminToken");

    if (inventoryToken) {
      config.headers.Authorization = `Bearer ${inventoryToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================================================
   RESPONSE INTERCEPTOR
========================================================= */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - Token expired or invalid");

      // Optional auto logout logic
      localStorage.removeItem("inventoryToken");
      localStorage.removeItem("adminToken");
    }

    return Promise.reject(error);
  }
);

export default api;
