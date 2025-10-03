// frontend/src/services/timeService.jsx
import axiosInstance from '../context/axiosInstance';
import { useQuery, useMutation } from '@tanstack/react-query';

const API_BASE = '/time';

// -----------------------------
// Clock-In/Out
// -----------------------------
export const useClockIn = () =>
  useMutation({
    // Backend uses JWT for user/tenant, so only optional start_time
    mutationFn: (data) => axiosInstance.post(`${API_BASE}/clock-in`, data),
  });

export const useClockOut = () =>
  useMutation({
    // Backend uses JWT for user/tenant, so only optional end_time/notes
    mutationFn: (data) => axiosInstance.post(`${API_BASE}/clock-out`, data),
  });

// -----------------------------
// Current Status
// -----------------------------
export const useCurrentStatus = () =>
  useQuery({
    queryKey: ['currentStatus'],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/time/current-status`);
      return data.data;
    },
    refetchInterval: 30000,
  });


// -----------------------------
// Timesheets
// -----------------------------
export const useTimesheet = (userId, tenantId, startDate, endDate) =>
  useQuery({
    queryKey: ['timesheet', userId, tenantId, startDate, endDate],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_BASE}/timesheets/${userId}`, {
        params: {
          tenant_id: tenantId, // ✅ still required here
          start_date: startDate,
          end_date: endDate,
        },
      });
      return data.data; // unwrap -> list of entries
    },
    enabled: !!userId && !!tenantId,
  });

// -----------------------------
// Summary Report (Manager/Admin)
// -----------------------------
export const useSummaryReport = (startDate, endDate) =>
  useQuery({
    queryKey: ['summaryReport', startDate, endDate],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`${API_BASE}/reports/summary`, {
        params: { start_date: startDate, end_date: endDate },
      });
      return data.data; // unwrap -> { summary: [...], unapproved_count }
    },
    enabled: !!startDate && !!endDate,
  });

// -----------------------------
// Shifts
// -----------------------------
export const useShifts = (tenantId) =>
  useQuery({
    queryKey: ['shifts', tenantId],
    queryFn: async () => {
      const res = await axiosInstance.get(`${API_BASE}/shifts`, {
        params: { tenant_id: tenantId },
      });
      // 🔑 Transform backend -> FullCalendar format
      return (res.data.data || []).map((shift) => ({
        id: shift.id,
        title: shift.description || 'Shift',
        start: shift.start_time,
        end: shift.end_time,
      }));
    },
    enabled: !!tenantId,
  });

export const useCreateShift = () =>
  useMutation({
    mutationFn: (data) => axiosInstance.post(`${API_BASE}/shifts`, data),
  });

export const useDeleteShift = () =>
  useMutation({
    mutationFn: (id) => axiosInstance.delete(`${API_BASE}/shifts/${id}`),
  });

// -----------------------------
// Notifications (optional restore)
// -----------------------------
// export const useLoadNotifications = () =>
//   useQuery({
//     queryKey: ['notifications'],
//     queryFn: async () => {
//       const { data } = await axiosInstance.get('/notifications');
//       return data.data; // unwrap -> list of notifications
//     },
//     refetchInterval: 30000, // poll every 30s for updates
//   });

// export const useMarkNotificationAsRead = () =>
//   useMutation({
//     mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
//   });

// export const useMarkAllAsRead = () =>
//   useMutation({
//     mutationFn: () => axiosInstance.put('/notifications/mark-all-read'),
//   });
