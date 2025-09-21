// frontend/src/services/customersService.js
import axiosInstance from "../context/axiosInstance";

// 🔹 Get all customers with pagination + optional status filter
export const getCustomers = async (page = 1, perPage = 10, status = null) => {
  try {
    let url = `/customers?page=${page}&per_page=${perPage}`;
    if (status) url += `&status=${status}`;

    const response = await axiosInstance.get(url);
    return response.data; // { items, total, page, pages }
  } catch (error) {
    console.error("❌ Error fetching customers:", error);
    throw error;
  }
};

// 🔹 Get full 360° customer profile
export const getCustomer360 = async (customerId) => {
  try {
    const response = await axiosInstance.get(`/customers/${customerId}`);
    return response.data; // { profile, installations, invoices, tickets }
  } catch (error) {
    console.error("❌ Error fetching customer 360:", error);
    throw error;
  }
};
