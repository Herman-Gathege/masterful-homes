// A simple toast utility for displaying messages
export const toast = {
  success: (msg) => alert(`✅ ${msg}`),
  error: (msg) => alert(`❌ ${msg}`),
  info: (msg) => alert(`ℹ️ ${msg}`),
};
