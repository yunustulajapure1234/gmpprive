import axios from "axios";

/*
=================================================
  BASE URL CONFIG
=================================================
*/

// Production me VITE_API_URL set hona chahiye
// Example:
// VITE_API_URL = https://your-backend-domain.com

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/*
=================================================
  AXIOS INSTANCE
=================================================
*/

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
=================================================
  REQUEST INTERCEPTOR
  🔥 ALWAYS ATTACH TOKEN
=================================================
*/

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

/*
=================================================
  RESPONSE INTERCEPTOR (OPTIONAL BUT SAFE)
=================================================
*/

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
