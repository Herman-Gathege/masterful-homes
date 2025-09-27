// frontend/src/services/configService.js
import axiosInstance from "../context/axiosInstance";

export function getConfig(tenantId = "tenant_abc") {
  return axiosInstance.get(`/config?tenant_id=${tenantId}`);
}
