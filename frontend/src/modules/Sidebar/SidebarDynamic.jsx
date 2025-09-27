import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import {
  FaHome,
  FaUsers,
  FaTasks,
  FaCalendarAlt,
  FaBell,
  FaFileInvoice,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const iconMap = {
  dashboard: <FaHome />,
  hr: <FaUsers />,
  tasks: <FaTasks />,
  time: <FaCalendarAlt />, // renamed to match your module
  notifications: <FaBell />,
  invoices: <FaFileInvoice />,
  customers: <FaUsers />,
  profile: <FaUser />,
  settings: <FaCog />,
  logout: <FaSignOutAlt />,
};

export default function SidebarDynamic() {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    axios
      .get("/api/config")
      .then((res) => setConfig(res.data))
      .catch((err) => console.error("Failed to load config", err));
  }, []);

  if (!config) return null;

  const { branding, enabled_modules } = config;

  // Always keep Dashboard + Logout
  const defaultModules = [
    { name: "Dashboard", path: "/dashboard", icon: iconMap.dashboard },
  ];

  const dynamicModules = enabled_modules.map((mod) => ({
    name: mod.label,
    // ensure all paths are under /dashboard
    path: `/dashboard/${mod.path}`,
    icon: iconMap[mod.icon] || <FaTasks />, // fallback icon
  }));

  const profileSection = [
    { name: "Logout", path: "/logout", icon: iconMap.logout },
  ];

  const allModules = [...defaultModules, ...dynamicModules, ...profileSection];

  return (
    <div className="sidebar">
      <div className="branding">
        <img
          src={branding?.logo || "/default-logo.png"}
          alt="logo"
          className="sidebar-logo"
        />
        <h2>{branding?.companyName || "My App"}</h2>
      </div>

      <nav>
        {allModules.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
