import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { SidebarContext } from "../../context/SidebarContext";
import Sidebar from "./Sidebar"; // dynamic Sidebar
import "../../css/Admindashboard.css";

function AdminDashboard() {
  const { collapsed, setCollapsed } = useContext(SidebarContext);

  return (
    <div className="dashboard-container">
      {/* Sidebar always visible */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div className="content">
        <h2>Admin Dashboard</h2>
        {/* This is where module pages load */}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashboard;
