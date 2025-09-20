// frontend/src/services/notificationsService.jsx
import axiosInstance from "../context/axiosInstance";

export const getNotifications = async (page = 1, per_page = 10) => {
  const res = await axiosInstance.get(`/notifications?page=${page}&per_page=${per_page}`);
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await axiosInstance.get("/notifications/unread_count");
  return res.data.unread;
};

export const markAsRead = async (id) => {
  await axiosInstance.post(`/notifications/read/${id}`);
};

export const markAllAsRead = async () => {
  await axiosInstance.post("/notifications/read_all");
};
