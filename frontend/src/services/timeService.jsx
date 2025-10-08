// frontend/src/services/timeService.jsx
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

// -----------------------------
// Current Status
// -----------------------------
export const useCurrentStatus = (tenantId) =>
  useQuery({
    queryKey: ['currentStatus', tenantId],
    queryFn: async () => {
      const params = {};
      if (tenantId) params.tenant_id = tenantId;
      const { data } = await axiosInstance.get(`${API_BASE}/current-status`, { params });
      // backend returns { data: status }
      return data.data ?? data;
    },
    enabled: !!tenantId,
    refetchInterval: 30000,
  });

// -----------------------------
// Timesheets
// -----------------------------
export const useTimesheet = (userId, tenantId, startDate, endDate) =>
  useQuery({
    queryKey: ['timesheet', userId, tenantId, startDate, endDate],
    queryFn: async () => {
      const params = {};
      if (tenantId) params.tenant_id = tenantId;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const { data } = await axiosInstance.get(`${API_BASE}/timesheets/${userId}`, { params });
      return data.data ?? [];
    },
    enabled: !!userId && !!tenantId,
    refetchOnWindowFocus: false,
  });


// -----------------------------
// Summary Report (Manager/Admin)
// -----------------------------
export const useSummaryReport = (startDate, endDate) =>
  useQuery({
    queryKey: ['summaryReport', startDate, endDate],
    queryFn: async () => {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      const { data } = await axiosInstance.get(`${API_BASE}/reports/summary`, { params });
      return data.data ?? { summary: [], unapproved_count: 0 };
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
      const params = {};
      if (tenantId) params.tenant_id = tenantId;
      const res = await axiosInstance.get(`${API_BASE}/shifts`, { params });
      const arr = (res.data && res.data.data) || [];
      return arr.map((shift) => ({
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
// All Timesheets (Manager/Admin)
// -----------------------------
export const useAllTimesheets = (tenantId, startDate, endDate) =>
  useQuery({
    queryKey: ['allTimesheets', tenantId, startDate, endDate],
    queryFn: async () => {
      const params = {};
      if (tenantId) params.tenant_id = tenantId;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const { data } = await axiosInstance.get(`${API_BASE}/timesheets`, { params });
      return data.data ?? [];
    },
    enabled: !!tenantId && !!startDate && !!endDate,
    refetchOnWindowFocus: false,
  });


  // -----------------------------
// Exceptions
// -----------------------------
export const useExceptions = (tenantId) =>
  useQuery({
    queryKey: ['exceptions', tenantId],
    queryFn: async () => {
      const params = {};
      if (tenantId) params.tenant_id = tenantId;
      // backend route expected: GET /api/time/exceptions
      const { data } = await axiosInstance.get(`${API_BASE}/exceptions`, { params });
      return data.data ?? { missing_clockouts: [], overtime: [] };
    },
    enabled: !!tenantId,
    refetchOnWindowFocus: false,
  });

// optional client call to mark resolved (if you add route)
export const resolveException = () =>
  useMutation({
    mutationFn: async ({ type, id }) => {
      // Example: POST /api/time/exceptions/resolve  { type: "missing_clockout", id: 123 }
      const { data } = await axiosInstance.post(`${API_BASE}/exceptions/resolve`, { type, id });
      return data;
    },
  });
