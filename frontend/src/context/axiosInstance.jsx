// frontend/src/context/axiosInstance.jsx
import axios from "axios";

let store = {
  token: null,
  refreshAccessToken: null,
  logout: null,
};

export const setAuthStore = (authContext) => {
  store.token = authContext.token;
  store.refreshAccessToken = authContext.refreshAccessToken;
  store.logout = authContext.logout;
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// // Request interceptor → attach access token only
// axiosInstance.interceptors.request.use(
//   (config) => {
//     if (store.token) {
//       config.headers.Authorization = `Bearer ${store.token}`;
//     }
//     // NEVER send refresh token in headers
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Request interceptor → attach access token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor → attempt refresh on 401 and retry once
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await store.refreshAccessToken();
        if (newAccessToken) {
          // update header and retry
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
