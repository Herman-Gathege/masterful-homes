//frontend/src/store/timeStore.jsx
import { create } from 'zustand';

const useTimeStore = create((set) => ({
  clockStatus: { is_clocked_in: false, current_entry: null, elapsed_hours: 0 },
  timesheetFilters: { startDate: null, endDate: null },
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