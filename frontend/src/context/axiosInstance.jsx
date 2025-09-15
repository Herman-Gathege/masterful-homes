// context/axiosInstance.jsx
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

// ✅ Utility: check if token looks like a short-lived access token
const isAccessToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const exp = payload.exp * 1000; // convert to ms
    const now = Date.now();

    // Access tokens are short-lived (15m in backend config)
    // Refresh tokens last days (7d), so we filter those out
    return exp > now && (exp - now) <= 60 * 60 * 1000; // less than 1h lifetime
  } catch {
    return false;
  }
};

// 🔐 Request interceptor → attach ONLY access tokens
axiosInstance.interceptors.request.use(
  (config) => {
    if (store.token && isAccessToken(store.token)) {
      config.headers.Authorization = `Bearer ${store.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Response interceptor → handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await store.refreshAccessToken();
        if (newAccessToken && isAccessToken(newAccessToken)) {
          store.token = newAccessToken; // update memory
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.error("Auto refresh failed:", err);
        store.logout();
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
