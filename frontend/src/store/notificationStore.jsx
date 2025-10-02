//frontend/src/store/notificationStore.jsx
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

  // Helpers
  setLoading: (loading) => set({ loading }),
  setNotifications: (notifications) =>
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.is_read).length,
    }),
  setUnreadCount: (count) => set({ unreadCount: count }),

  // API-driven actions
  loadNotifications: async () => {
    set({ loading: true });
    try {
      const data = await fetchNotifications();
      set({
        notifications: data,
        unreadCount: data.filter((n) => !n.is_read).length,
        loading: false,
      });
    } catch (err) {
      console.error("❌ Failed to load notifications", err);
      set({ loading: false });
    }
  },

  refreshUnread: async () => {
    try {
      const count = await fetchUnreadCount();
      set({ unreadCount: count });
    } catch (err) {
      console.error("❌ Failed to fetch unread count", err);
    }
  },

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
