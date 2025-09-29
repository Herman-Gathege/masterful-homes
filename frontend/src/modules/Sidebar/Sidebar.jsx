import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaTasks,
  FaClock,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";
import { getTenantConfig } from "../../services/configService";
import { AuthContext } from "../../context/AuthContext";
import { SidebarContext } from "../../context/SidebarContext"; 
import "./Sidebar.css";

const Sidebar = ({ tenantId = "tenant_abc" }) => {
  const [modules, setModules] = useState([]);
  const [branding, setBranding] = useState({ logo: "", theme: "light" });
  const [loading, setLoading] = useState(true);

  const { logout } = useContext(AuthContext);
  const { collapsed, setCollapsed } = useContext(SidebarContext);
  const navigate = useNavigate();

  // 👇 moduleMap now defines "end" explicitly
  const moduleMap = {
    dashboard: { label: "Dashboard", icon: <FaHome />, path: "/dashboard", end: true },
    hr: { label: "HR", icon: <FaUsers />, path: "/dashboard/hr", end: false },
    tasks: { label: "Tasks", icon: <FaTasks />, path: "/dashboard/tasks", end: false },
    time: { label: "Time", icon: <FaClock />, path: "/dashboard/time", end: false },
    notifications: { label: "Notifications", icon: <FaBell />, path: "/dashboard/notifications", end: false },
  };

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await getTenantConfig(tenantId);
        setModules(config.enabled_modules || []);
        setBranding(config.branding || {});
      } catch (err) {
        console.error("Sidebar config load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, [tenantId]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <p className="loading">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={`sidebar ${branding.theme || "light"} ${
        collapsed ? "collapsed" : ""
      }`}
    >
      {/* Logo */}
      <div className="sidebar-logo">
        {branding.logo && <img src={branding.logo} alt="Company Logo" />}
      </div>

      {/* Collapse Button */}
      <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>
        {collapsed ? "»" : "«"}
      </button>

      {/* Menu */}
      <ul>
        {modules.map((mod) => {
          const item = moduleMap[mod];
          if (!item) return null;
          return (
            <li key={mod}>
              <NavLink
                to={item.path}
                end={item.end} // 👈 uses config from moduleMap
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icon">{item.icon}</span>
                {!collapsed && item.label}
              </NavLink>
            </li>
          );
        })}

        {/* Logout button always at bottom */}
        <li className="logout-item">
          <button onClick={handleLogout}>
            <span className="icon">
              <FaSignOutAlt />
            </span>
            {!collapsed && "Logout"}
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
