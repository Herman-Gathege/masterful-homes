// frontend/src/services/authService.jsx

import axiosInstance from "../context/axiosInstance";

// Register (default role = technician unless provided)
export const registerUser = async (userData) => {
  try {
    const res = await axiosInstance.post("/register", userData);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Something went wrong during registration.";
  }
};

// Login
export const loginUser = async (credentials) => {
  try {
    const res = await axiosInstance.post("/login", credentials);
    const { access_token, refresh_token, role } = res.data;

    // Save in localStorage
    localStorage.setItem("token", access_token);
    localStorage.setItem("refresh_token", refresh_token);
    localStorage.setItem("role", role);

    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Login failed.";
  }
};

// Logout (client-side only)
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("role");
};
