import axiosInstance from "../context/axiosInstance";

export const fetchNotifications = async (limit = 20, offset = 0) => {
  const res = await axiosInstance.get(`/notifications`, {
    params: { limit, offset },
  });
  return res.data?.data || [];
};

export const fetchUnreadCount = async () => {
  const res = await axiosInstance.get(`/notifications/unread_count`);
  return res.data?.unread_count ?? 0;
};

export const markNotificationAsRead = async (id) => {
  const res = await axiosInstance.post(`/notifications/read/${id}`);
  return res.data;
};

export const markAllAsRead = async () => {
  const res = await axiosInstance.post(`/notifications/read_all`);
  return res.data;
};
