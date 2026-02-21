import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  // ❌ REMOVE default Content-Type
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized - Token expired or invalid");
    }
    return Promise.reject(error);
  }
);

export default api;
