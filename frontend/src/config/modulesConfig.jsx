// frontend/src/config/modulesConfig.js
export const MODULES_CONFIG = {
  dashboard: {
    label: "Dashboard",
    path: "/dashboard",
    roles: ["superadmin", "admin", "manager", "finance", "technician", "employee"],
  },
  hr: {
    label: "HR",
    path: "/dashboard/hr",
    roles: ["superadmin", "manager", "admin"],
  },
  time: {
    label: "Time Tracking",
    path: "/dashboard/time",
    roles: ["superadmin", "manager", "employee", "technician", "admin"],
  },
  tasks: {
    label: "Tasks",
    path: "/dashboard/tasks",
    roles: ["superadmin", "manager", "employee", "technician", "admin"],
  },
  notifications: {
    label: "Notifications",
    path: "/dashboard/notifications",
    roles: ["superadmin", "manager", "finance", "employee", "technician", "admin"],
  },
};
