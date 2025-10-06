import { create } from "zustand";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllAsRead,
} from "../services/notificationsService";

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  hasMore: true, // 👈 track pagination
  offset: 0,
  limit: 10,

  // ------------------
  // Helpers
  // ------------------
  setLoading: (loading) => set({ loading }),
  reset: () =>
    set({ notifications: [], unreadCount: 0, hasMore: true, offset: 0 }),

  // ------------------
  // API Actions
  // ------------------
  loadNotifications: async (limit = get().limit, offset = 0, append = false) => {
    if (get().loading) return; // 👈 prevent duplicate calls
    set({ loading: true });

    try {
      const data = await fetchNotifications(limit, offset);
      const current = get().notifications;

      // If less data returned than limit, no more available
      const hasMore = data.length === limit;

      set({
        notifications: append ? [...current, ...data] : data,
        unreadCount: [...(append ? current : []), ...data].filter(
          (n) => !n.is_read
        ).length,
        hasMore,
        offset,
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
      console.error(`❌ Failed to mark notification ${id} as read`, err);
    }
  },

  markAllAsRead: async () => {
    try {
      await markAllAsRead();
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
