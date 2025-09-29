// frontend/src/services/notificationsService.jsx
import axiosInstance from "../context/axiosInstance";

export const fetchNotifications = async (limit = 20, offset = 0) => {
  const res = await axiosInstance.get(`/notifications/`, {
    params: { limit, offset },
  });
  return res.data;
};

export const fetchUnreadCount = async () => {
  const res = await axiosInstance.get(`/notifications/unread_count`);
  return res.data.unread_count;
};

export const markNotificationAsRead = async (id) => {
  await axiosInstance.post(`/notifications/read/${id}`);
};

export const markAllAsRead = async () => {
  await axiosInstance.post(`/notifications/read_all`);
};
