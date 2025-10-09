// src/layouts/DashboardLayout.jsx
import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../modules/Sidebar/Sidebar";
import { SidebarProvider, SidebarContext } from "../context/SidebarContext";
import "../css/DashboardLayout.css";

function DashboardLayout({ onLogout }) {
  return (
    <SidebarProvider>
      <DashboardContent onLogout={onLogout} />
    </SidebarProvider>
  );
}

function DashboardContent({ onLogout }) {
  const { collapsed } = useContext(SidebarContext);

  return (
    <div className="dashboard-container">
      {/* Sidebar with logout */}
      <Sidebar tenantId="tenant_abc" onLogout={onLogout} />

      {/* Main content area */}
      <main className={`content ${collapsed ? "collapsed" : ""}`}>
        {/* Nested routes will render here */}
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
