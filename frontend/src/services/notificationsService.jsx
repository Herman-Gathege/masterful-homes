import axiosInstance from "../context/axiosInstance";

// Fetch notifications (paginated)
export const fetchNotifications = async (limit = 20, offset = 0) => {
  const res = await axiosInstance.get(`/notifications`, {
    params: { limit, offset },
  });
  return res.data.data;
};

// Fetch unread count
export const fetchUnreadCount = async () => {
  const res = await axiosInstance.get(`/notifications/unread_count`);
  return res.data.unread_count;
};

// Mark single notification as read
export const markNotificationAsRead = async (id) => {
  // backend expects POST /notifications/read/<id>
  const res = await axiosInstance.post(`/notifications/read/${id}`);
  return res.data;
};

// Mark all as read
export const markAllAsRead = async () => {
  // backend expects POST /notifications/read_all
  const res = await axiosInstance.post(`/notifications/read_all`);
  return res.data;
};


