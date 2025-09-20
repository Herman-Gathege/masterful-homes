// src/services/invoiceService.js
import axiosInstance from "../context/axiosInstance";
// Fetch all invoices
export const fetchInvoices = async () => {
  const res = await axiosInstance.get("/invoices");
  return res.data;
};

// Create invoice
export const createInvoice = async (invoiceData) => {
  const res = await axiosInstance.post("/invoices", invoiceData);
  return res.data;
};

// Update invoice
export const updateInvoice = async (id, updates) => {
  const res = await axiosInstance.put(`/invoices/${id}`, updates);
  return res.data;
};

// Delete invoice
export const deleteInvoice = async (id) => {
  const res = await axiosInstance.delete(`/invoices/${id}`);
  return res.data;
};
