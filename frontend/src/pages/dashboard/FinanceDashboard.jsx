import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DashboardOverview from "../../components/DashboardOverview";
import "../../css/FinanceDashboard.css";

function FinanceDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSidebarClick = (section) => {
    if (section === "logout") {
      logout();
      navigate("/login");
      return;
    }
    setActiveSection(section);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li
            onClick={() => handleSidebarClick("overview")}
            className={activeSection === "overview" ? "active" : ""}
          >
            Overview
          </li>
          <li
            onClick={() => handleSidebarClick("reports")}
            className={activeSection === "reports" ? "active" : ""}
          >
            Reports
          </li>
          <li
            onClick={() => handleSidebarClick("invoices")}
            className={activeSection === "invoices" ? "active" : ""}
          >
            Invoices
          </li>
          <li onClick={() => handleSidebarClick("logout")}>Logout</li>
        </ul>
      </div>

      {/* Content */}
      <div className="content">
        <h2>Finance Dashboard</h2>

        {activeSection === "overview" && <DashboardOverview />}

        {activeSection === "reports" && (
          <p>📊 Reports section (e.g., monthly charts, exports) coming soon...</p>
        )}

        {activeSection === "invoices" && (
          <p>💰 Invoice management (CRUD + status updates) coming soon...</p>
        )}
      </div>
    </div>
  );
}

export default FinanceDashboard;
