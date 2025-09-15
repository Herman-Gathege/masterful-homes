// src/api/api.js
import axios from "axios";

// This is your backend base URL. Change it when deployed.
const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token if available (for protected routes later)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
