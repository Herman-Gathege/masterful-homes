// frontend/src/store/notificationStore.jsx
import { create } from "zustand";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllAsRead as markAllService,
} from "../services/notificationsService";

const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  // Load notifications
  loadNotifications: async () => {
    set({ loading: true });
    try {
      const data = await fetchNotifications();
      set({ notifications: data, loading: false });
    } catch (err) {
      console.error("❌ Failed to load notifications", err);
      set({ loading: false });
    }
  },

  // Refresh unread count only
  refreshUnread: async () => {
    try {
      const count = await fetchUnreadCount();
      set({ unreadCount: count });
    } catch (err) {
      console.error("❌ Failed to fetch unread count", err);
    }
  },

  // Mark single notification
  markAsRead: async (id) => {
    try {
      await markNotificationAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(state.unreadCount - 1, 0),
      }));
    } catch (err) {
      console.error("❌ Failed to mark notification as read", err);
    }
  },

  // Mark all
  markAllAsRead: async () => {
    try {
      await markAllService();
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          is_read: true,
        })),
        unreadCount: 0,
      }));
    } catch (err) {
      console.error("❌ Failed to mark all notifications as read", err);
    }
  },
}));

export default useNotificationStore;
