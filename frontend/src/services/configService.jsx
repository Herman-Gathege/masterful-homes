// src/services/configService.js
import api from "../context/axiosInstance";

/**
 * Fetch tenant config (branding, enabled modules, trial status).
 * @param {string} tenantId
 * @returns {Promise<Object>} tenant config object
 */
export const getTenantConfig = async (tenantId) => {
  try {
    const response = await api.get(`/config?tenant_id=${tenantId}`);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching tenant config:", error);
    throw error;
  }
};
