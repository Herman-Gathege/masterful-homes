// src/layouts/DashboardLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../modules/Sidebar/Sidebar";
import { SidebarContext } from "../context/SidebarContext";

function DashboardLayout({ onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="dashboard-container">
        <Sidebar
          tenantId="tenant_abc" // later: pull from AuthContext/JWT
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onLogout={onLogout}
        />
        <div
          className={`content ${collapsed ? "collapsed" : ""} `}
        >
          <Outlet />
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

export default DashboardLayout;
