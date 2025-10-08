// frontend/src/store/timeStore.jsx
import { create } from 'zustand';

const todayIso = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const sevenDaysAgoIso = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const useTimeStore = create((set) => ({
  clockStatus: { is_clocked_in: false, current_entry: null, elapsed_hours: 0 },
  timesheetFilters: { startDate: sevenDaysAgoIso, endDate: todayIso },
  reportFilters: { startDate: null, endDate: null },
  selectedShift: null,
  notifications: [],
  unreadCount: 0,

  setClockStatus: (status) => set({ clockStatus: status }),
  setTimesheetFilters: (filters) => set({ timesheetFilters: filters }),
  setReportFilters: (filters) => set({ reportFilters: filters }),
  setSelectedShift: (shift) => set({ selectedShift: shift }),
  setNotifications: (notifications) => set({ notifications, unreadCount: notifications.filter((n) => !n.is_read).length }),
}));

export default useTimeStore;
