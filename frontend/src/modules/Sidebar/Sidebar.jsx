// frontend/src/modules/Sidebar/Sidebar.jsx
import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaTasks, FaClock, FaBell, FaSignOutAlt } from "react-icons/fa";
import { getTenantConfig } from "../../services/configService";
import { AuthContext } from "../../context/AuthContext"; // 👈 bring in AuthContext
import "./Sidebar.css";

const Sidebar = ({ tenantId = "tenant_abc", collapsed, setCollapsed }) => {
  const [modules, setModules] = useState([]);
  const [branding, setBranding] = useState({ logo: "", theme: "light" });
  const [loading, setLoading] = useState(true);

  const { logout } = useContext(AuthContext); // 👈 access logout
  const navigate = useNavigate();

  // Map backend modules to sidebar items
  const moduleMap = {
    dashboard: { label: "Dashboard", icon: <FaHome />, path: "/dashboard" },
    hr: { label: "HR", icon: <FaUsers />, path: "/dashboard/hr" },
    tasks: { label: "Tasks", icon: <FaTasks />, path: "/dashboard/tasks" },
    time: { label: "Time", icon: <FaClock />, path: "/dashboard/time" },
    notifications: {
      label: "Notifications",
      icon: <FaBell />,
      path: "/dashboard/notifications",
    },
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
    logout(); // clear auth state + localStorage
    navigate("/login"); // redirect
  };

  if (loading) {
    return (
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <p className="loading">Loading...</p>
      </div>
    );
  }

  return (
    <div className={`sidebar ${branding.theme || "light"} ${collapsed ? "collapsed" : ""}`}>
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
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="icon">{item.icon}</span>
                {!collapsed && item.label}
              </NavLink>
            </li>
          );
        })}

        {/* Logout button always at bottom */}
        <li className="logout-item" onClick={handleLogout}>
          <span className="icon">
            <FaSignOutAlt />
          </span>
          {!collapsed && "Logout"}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
