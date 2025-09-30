// src/services/authService.jsx
import axiosInstance from "../context/axiosInstance";

// Register (server will decide default role)
export const registerUser = async (userData) => {
  try {
    const res = await axiosInstance.post("/auth/register", userData);
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || "Something went wrong during registration.";
  }
};

// Login
export const loginUser = async (credentials) => {
  try {
    const res = await axiosInstance.post("/auth/login", credentials);
    // expected response: { access_token, refresh_token, user: { id, email, role, ... } }
    return res.data;
  } catch (err) {
    throw err.response?.data?.error || "Login failed.";
  }
};

// Logout (client-side only helper if needed)
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");
};
