// frontend/src/modules/HR/services/hrService.js
import axios from "../../../context/axiosInstance";

export const fetchUsers = ({ limit=25, offset=0, role, department, team, search, tenant_id }={}) =>
  axios.get("/hr/users", { params: { limit, offset, role, department, team, search, tenant_id } });

export const getUser = (id, params={}) => axios.get(`/hr/users/${id}`, { params });

export const createUser = (payload) => axios.post("/hr/users", payload);

export const updateUser = (id, payload) => axios.put(`/hr/users/${id}`, payload);

export const deleteUser = (id) => axios.delete(`/hr/users/${id}`);

export const inviteUser = (payload) => axios.post("/hr/users/invite", payload);

export const bulkImport = (formData) => axios.post("/hr/users/bulk", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});
