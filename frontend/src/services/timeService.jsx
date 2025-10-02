//frontend/src/services/timeService.jsx
import axiosInstance from '../context/axiosInstance';
import { useQuery, useMutation } from '@tanstack/react-query';

const API_BASE = '/time';

// -----------------------------
// Clock-In/Out
// -----------------------------
export const useClockIn = () =>
  useMutation({
    mutationFn: (data) => axiosInstance.post(`${API_BASE}/clock-in`, data),
  });

export const useClockOut = () =>
  useMutation({
    mutationFn: (data) => axiosInstance.post(`${API_BASE}/clock-out`, data),
  });

// Fetch current status (clocked in/out)
export const useCurrentStatus = (tenantId) =>
  useQuery({
    queryKey: ['currentStatus', tenantId],
    queryFn: () =>
      axiosInstance.get(`/time/current-status`, { params: { tenant_id: tenantId } }),
    enabled: !!tenantId,
    refetchInterval: 30000,
  });


// -----------------------------
// Timesheets
// -----------------------------
export const useTimesheet = (userId, startDate, endDate) =>
  useQuery({
    queryKey: ['timesheet', userId, startDate, endDate],
    queryFn: () =>
      axiosInstance.get(`${API_BASE}/timesheets/${userId}`, {
        params: { start_date: startDate, end_date: endDate },
      }),
    enabled: !!userId, // only run if userId is set
  });

// -----------------------------
// Summary Report
// -----------------------------
export const useSummaryReport = (startDate, endDate) =>
  useQuery({
    queryKey: ['summaryReport', startDate, endDate],
    queryFn: () =>
      axiosInstance.get(`${API_BASE}/reports/summary`, {
        params: { start_date: startDate, end_date: endDate },
      }),
    enabled: !!startDate && !!endDate,
  });

// -----------------------------
// Shifts
// -----------------------------
export const useShifts = (tenantId) =>
  useQuery({
    queryKey: ['shifts', tenantId],
    queryFn: () =>
      axiosInstance.get(`${API_BASE}/shifts`, {
        params: { tenant_id: tenantId },
      }),
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
// Notifications
// -----------------------------
export const useLoadNotifications = () =>
  useMutation({
    mutationFn: () => axiosInstance.get('/notifications'),
  });

export const useMarkNotificationAsRead = () =>
  useMutation({
    mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
  });

export const useMarkAllAsRead = () =>
  useMutation({
    mutationFn: () => axiosInstance.put('/notifications/mark-all-read'),
  });
