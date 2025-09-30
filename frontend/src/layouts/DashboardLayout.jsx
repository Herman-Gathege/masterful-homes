import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../modules/Sidebar/Sidebar";
import { SidebarProvider, SidebarContext } from "../context/SidebarContext"; 
import "../css/DashboardLayout.css"; // 👈 import new CSS

function DashboardLayout({ onLogout }) {
  return (
    <SidebarProvider>
      <LayoutContent onLogout={onLogout} />
    </SidebarProvider>
  );
}

function LayoutContent({ onLogout }) {
  const { collapsed } = useContext(SidebarContext);

  return (
    <div className="dashboard-container">
      <Sidebar tenantId="tenant_abc" onLogout={onLogout} />
      <div className={`content ${collapsed ? "collapsed" : ""}`}>
        <Outlet />
      </div>
    </div>
  );
}

export default DashboardLayout;
