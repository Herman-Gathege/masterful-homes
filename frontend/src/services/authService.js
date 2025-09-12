import API from "../api/api";

// Admin registering a student or teacher
export const registerUser = async (userData) => {
  try {
    const res = await API.post("/admin-register", userData);
    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Something went wrong during registration.";
  }
};

// Login for all roles
export const loginUser = async (credentials) => {
  try {
    const res = await API.post("/login", credentials);
    const { token, role } = res.data;

    // Save token and role in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    return res.data;
  } catch (err) {
    throw err.response?.data?.message || "Login failed.";
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};


