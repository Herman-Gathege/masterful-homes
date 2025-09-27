// frontend/src/pages/dashboard/Sidebar.jsx
import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { getConfig } from "../../services/configService";
import "../../css/Admindashboard.css";

import {
  FaHome,
  FaUsers,
  FaTools,
  FaCalendarAlt,
  FaBell,
  FaCog,
  FaUser,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

import { AuthContext } from "../../context/AuthContext";

export default function Sidebar({ collapsed, setCollapsed }) {
  const [modules, setModules] = useState([]);
  const [branding, setBranding] = useState({});
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    getConfig()
      .then((res) => {
        const data = res.data || {};
        setModules(data.enabled_modules || []);
        setBranding(data.branding || {});
        if (data.branding?.theme) {
          document.documentElement.setAttribute(
            "data-theme",
            data.branding.theme
          );
        }
      })
      .catch(() => {
        setModules([]);
        setBranding({});
      });
  }, []);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Logo + Collapse button */}
      <div className="sidebar-top">
        {branding.logo_url && !collapsed ? (
          <img src={branding.logo_url} alt="logo" className="sidebar-logo" />
        ) : !collapsed ? (
          <div className="logo">Company</div>
        ) : null}

        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Core Modules */}
      <div className="section-header">Core Modules</div>
      <ul>
        {modules.includes("dashboard") && (
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaHome className="icon" /> {!collapsed && "Dashboard"}
            </NavLink>
          </li>
        )}

        {modules.includes("hr") && (
          <li>
            <NavLink to="/hr" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaUsers className="icon" /> {!collapsed && "HR & People"}
            </NavLink>
          </li>
        )}

        {modules.includes("tasks") && (
          <li>
            <NavLink to="/tasks" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaTools className="icon" /> {!collapsed && "Tasks"}
            </NavLink>
          </li>
        )}

        {modules.includes("time") && (
          <li>
            <NavLink to="/time" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaCalendarAlt className="icon" /> {!collapsed && "Time & Attendance"}
            </NavLink>
          </li>
        )}

        {modules.includes("notifications") && (
          <li>
            <NavLink to="/notifications" className={({ isActive }) => (isActive ? "active" : "")}>
              <FaBell className="icon" /> {!collapsed && "Notifications"}
            </NavLink>
          </li>
        )}
      </ul>

      {/* Admin Section */}
      <div className="section-header">Admin</div>
      <ul>
        <li>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaCog className="icon" /> {!collapsed && "Settings"}
          </NavLink>
        </li>
      </ul>

      {/* Profile + Logout */}
      <div className="section-header">Profile</div>
      <div className="sidebar-bottom">
        <li>
          <NavLink to="/profile" className={({ isActive }) => (isActive ? "active" : "")}>
            <FaUser className="icon" /> {!collapsed && "Profile"}
          </NavLink>
        </li>
        <li onClick={logout}>
          <FaSignOutAlt className="icon" /> {!collapsed && "Logout"}
        </li>
      </div>
    </div>
  );
}
