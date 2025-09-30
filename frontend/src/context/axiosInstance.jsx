// src/context/axiosInstance.jsx
import axios from "axios";

let store = {
  token: null,
  refreshAccessToken: null,
  logout: null,
};

export const setAuthStore = (authContext) => {
  // keep references to the latest functions/values
  store.token = authContext.token;
  store.refreshAccessToken = authContext.refreshAccessToken;
  store.logout = authContext.logout;
};

const axiosInstance = axios.create({
  baseURL: "https://masterful-homes.onrender.com/api",
  withCredentials: true,
});

// Attach access token from in-memory store
axiosInstance.interceptors.request.use(
  (config) => {
    if (store.token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${store.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor -> try refresh on 401 once
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await store.refreshAccessToken?.();
        if (newAccessToken) {
          store.token = newAccessToken;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error("Auto refresh failed:", err);
        if (store.logout) store.logout();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
