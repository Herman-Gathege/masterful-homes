// src/services/adminService.js
import axiosInstance from "../context/axiosInstance";

// Fetch all users
export const fetchUsers = async () => {
  const res = await axiosInstance.get("/admin/users");
  return res.data;
};

// Delete a user
export const deleteUser = async (userId) => {
  const res = await axiosInstance.delete(`/admin/users/${userId}`);
  return res.data;
};

// Update a user
export const updateUser = async (userId, updatedData) => {
  const res = await axiosInstance.put(`/admin/users/${userId}`, updatedData);
  return res.data;
};
