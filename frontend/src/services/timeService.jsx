import axiosInstance from "../context/axiosInstance";
import { useQuery, useMutation } from "@tanstack/react-query";

const API_BASE = "/time";

/* -----------------------------
   Clock-In / Clock-Out
----------------------------- */
export const useClockIn = () =>
  useMutation({
    mutationFn: (data) => axiosInstance.post(`${API_BASE}/clock-in`, data),
  });

export const useClockOut = () =>
  useMutation({
    mutationFn: (data) => axiosInstance.post(`${API_BASE}/clock-out`, data),
  });

/* -----------------------------
   Current Status
----------------------------- */
export const useCurrentStatus = (tenantId) =>
  useQuery({
    queryKey: ["currentStatus", tenantId],
    queryFn: async () => {
      const params = tenantId ? { tenant_id: tenantId } : {};
      const { data } = await axiosInstance.get(`${API_BASE}/current-status`, {
        params,
      });
      return data?.data ?? data ?? null;
    },
    enabled: !!tenantId,
    refetchInterval: 30000,
  });

/* -----------------------------
   Single User Timesheet
----------------------------- */
export const useTimesheet = (userId, tenantId, startDate, endDate) =>
  useQuery({
    queryKey: ["timesheet", userId, tenantId, startDate, endDate],
    queryFn: async () => {
      const params = {};
      if (tenantId) params.tenant_id = tenantId;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const { data } = await axiosInstance.get(
        `${API_BASE}/timesheets/${userId}`,
        { params }
      );
      // backend returns { data: [...] }
      return Array.isArray(data?.data) ? data.data : [];
    },
    enabled: !!userId && !!tenantId,
    refetchOnWindowFocus: false,
  });

/* -----------------------------
   All Timesheets (Manager/Admin)
----------------------------- */
export const useAllTimesheets = (tenantId, startDate, endDate) =>
  useQuery({
    queryKey: ["allTimesheets", tenantId, startDate, endDate],
    queryFn: async () => {
      const params = {};
      if (tenantId) params.tenant_id = tenantId;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const { data } = await axiosInstance.get(`${API_BASE}/timesheets`, {
        params,
      });
      return Array.isArray(data?.data) ? data.data : [];
    },
    enabled: !!tenantId && !!startDate && !!endDate,
    refetchOnWindowFocus: false,
  });

/* -----------------------------
   Summary Report
----------------------------- */
export const useSummaryReport = (startDate, endDate) =>
  useQuery({
    queryKey: ["summaryReport", startDate, endDate],
    queryFn: async () => {
      const params = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const { data } = await axiosInstance.get(`${API_BASE}/reports/summary`, {
        params,
      });
      // Safe fallback: even if route missing, return structured defaults
      return data?.data ?? { summary: [], unapproved_count: 0 };
    },
    enabled: !!startDate && !!endDate,
  });

/* -----------------------------
   Shifts
----------------------------- */
export const useShifts = (tenantId, startDate, endDate) =>
  useQuery({
    queryKey: ["shifts", tenantId, startDate, endDate],
    queryFn: async () => {
      const params = {};
      if (tenantId) params.tenant_id = tenantId;
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const res = await axiosInstance.get(`${API_BASE}/shifts`, { params });
      const arr = res?.data?.data ?? [];
      return arr.map((shift) => ({
        id: shift.id,
        title: shift.description || "Shift",
        start: shift.start_time,
        end: shift.end_time,
      }));
    },
    enabled: !!tenantId && !!startDate && !!endDate,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // cache for 5 mins
    keepPreviousData: true, // prevents flicker on navigation
  });

export const useCreateShift = () =>
  useMutation({
    mutationFn: (data) => axiosInstance.post(`${API_BASE}/shifts`, data),
  });

export const useDeleteShift = () =>
  useMutation({
    mutationFn: (id) => axiosInstance.delete(`${API_BASE}/shifts/${id}`),
  });

/* -----------------------------
   Exceptions
----------------------------- */
export const useExceptions = (tenantId) =>
  useQuery({
    queryKey: ["exceptions", tenantId],
    queryFn: async () => {
      const params = tenantId ? { tenant_id: tenantId } : {};
      const { data } = await axiosInstance.get(`${API_BASE}/exceptions`, {
        params,
      });
      return data?.data ?? { missing_clockouts: [], overtime: [] };
    },
    enabled: !!tenantId,
    refetchOnWindowFocus: false,
  });

export const resolveException = () =>
  useMutation({
    mutationFn: async ({ type, id }) => {
      const { data } = await axiosInstance.post(
        `${API_BASE}/exceptions/resolve`,
        { type, id }
      );
      return data;
    },
  });

/* -----------------------------
   Direct Axios Utilities
----------------------------- */
export const clockIn = (payload) =>
  axiosInstance.post(`${API_BASE}/clock-in`, payload);
export const clockOut = (payload) =>
  axiosInstance.post(`${API_BASE}/clock-out`, payload);
export const getCurrentStatus = () =>
  axiosInstance.get(`${API_BASE}/current-status`);
export const getTimesheet = (userId, params = {}) =>
  axiosInstance.get(`${API_BASE}/timesheets/${userId}`, { params });
export const getExceptions = (params = {}) =>
  axiosInstance.get(`${API_BASE}/exceptions`, { params });
export const getShifts = (params = {}) =>
  axiosInstance.get(`${API_BASE}/shifts`, { params });
export const createShift = (payload) =>
  axiosInstance.post(`${API_BASE}/shifts`, payload);
export const assignShift = (shiftId, payload) =>
  axiosInstance.post(`${API_BASE}/shifts/${shiftId}/assign`, payload);
export const getSummaryReport = (params = {}) =>
  axiosInstance.get(`${API_BASE}/reports/summary`, { params });
