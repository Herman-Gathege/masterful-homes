import axios from "axios";

let store = {
  token: null,
  refreshAccessToken: null,
  logout: null,
};

export const setAuthStore = (authContext) => {
  // Keep references to the latest functions and token
  store = {
    token: authContext.token,
    refreshAccessToken: authContext.refreshAccessToken,
    logout: authContext.logout,
  };
};

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  withCredentials: true,
});

// ----------------------------
// REQUEST INTERCEPTOR
// ----------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const latestToken =
      store.token || localStorage.getItem("token") || null;

    if (latestToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${latestToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ----------------------------
// RESPONSE INTERCEPTOR (auto-refresh on 401)
// ----------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken =
          (await store.refreshAccessToken?.()) ||
          localStorage.getItem("token");

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
