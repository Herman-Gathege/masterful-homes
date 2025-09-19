import { create } from "zustand";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "../services/notificationsService";

const useNotificationStore = create((set, get) => ({
  unread: 0,
  items: [],

  // Load unread count
  refreshUnread: async () => {
    try {
      const count = await getUnreadCount();
      set({ unread: count });
    } catch (err) {
      console.error("❌ Failed to fetch unread count", err);
    }
  },

  // Load notifications list
  loadNotifications: async () => {
    try {
      const data = await getNotifications();
      set({ items: data.items });
    } catch (err) {
      console.error("❌ Failed to load notifications", err);
    }
  },

  // Mark one as read
  markAsRead: async (id) => {
    try {
      await markAsRead(id);
      await get().refreshUnread();
      await get().loadNotifications();
    } catch (err) {
      console.error("❌ Failed to mark as read", err);
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      await markAllAsRead();
      await get().refreshUnread();
      await get().loadNotifications();
    } catch (err) {
      console.error("❌ Failed to mark all as read", err);
    }
  },
}));

export default useNotificationStore;
