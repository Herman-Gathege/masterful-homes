import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { SidebarContext } from "../../context/SidebarContext";
import Sidebar from "./Sidebar";

import "../../css/Admindashboard.css";

function TechnicianDashboard() {
  const { collapsed, setCollapsed } = useContext(SidebarContext);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content */}
      <div className="content">
        <h2>Technician Dashboard</h2>
        <Outlet /> {/* Module routes load here */}
      </div>
    </div>
  );
}

export default TechnicianDashboard;
