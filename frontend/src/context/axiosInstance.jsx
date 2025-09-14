// axiosInstance.jsx
import axios from "axios";

let store = {
  token: null,
  refreshToken: null,
  refreshAccessToken: null,
  logout: null,
};

export const setAuthStore = (authContext) => {
  store.token = authContext.token;
  store.refreshToken = authContext.refreshToken;
  store.refreshAccessToken = authContext.refreshAccessToken;
  store.logout = authContext.logout;
};

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor to attach token
axiosInstance.interceptors.request.use(
  async (config) => {
    if (store.token) {
      config.headers.Authorization = `Bearer ${store.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // try {
      //   const newAccessToken = await store.refreshAccessToken();
      //   if (newAccessToken) {
      //     axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
      //     originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      //     return axiosInstance(originalRequest);
      //   }
      // } catch (err) {
      //   console.log("Auto refresh failed:", err);
      //   store.logout();
      //   return Promise.reject(err);
      // }
      try {
        const response = await axios.post("http://localhost:5000/api/refresh", {
          refresh_token: store.refreshToken,
        });
        const newAccessToken = response.data.access_token;
      
        if (newAccessToken) {
          store.token = newAccessToken; // Update the token in the store
          axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (err) {
        console.log("Auto refresh failed:", err);
        store.logout();
        return Promise.reject(err);
      }
      
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
