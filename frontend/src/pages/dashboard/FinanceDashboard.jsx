// // frontend/src/pages/dashboard/FinanceDashboard.jsx

// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import DashboardOverview from "../../components/DashboardOverview";
// import SearchBar from "../../components/SearchBar";
// import "../../css/FinanceDashboard.css";

// function FinanceDashboard() {
//   const [activeSection, setActiveSection] = useState("overview");
//   const { logout, user } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSidebarClick = (section) => {
//     if (section === "logout") {
//       logout();
//       navigate("/login");
//       return;
//     }
//     setActiveSection(section);
//   };

//   // 🚫 Role-based guard
//   if (!user || !["finance", "admin", "manager"].includes(user.role)) {
//     return (
//       <div className="dashboard-container">
//         <div className="content">
//           <h2>🚫 Access Denied</h2>
//           <p>You do not have permission to view the Finance Dashboard.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <ul>
//           <li
//             onClick={() => handleSidebarClick("overview")}
//             className={activeSection === "overview" ? "active" : ""}
//           >
//             Overview
//           </li>
//           <li
//             onClick={() => handleSidebarClick("reports")}
//             className={activeSection === "reports" ? "active" : ""}
//           >
//             Reports
//           </li>
//           <li
//             onClick={() => handleSidebarClick("invoices")}
//             className={activeSection === "invoices" ? "active" : ""}
//           >
//             Invoices
//           </li>
//           <li onClick={() => handleSidebarClick("logout")}>Logout</li>
//         </ul>
//       </div>

//       {/* Content */}
//       <div className="content">
//         <h2>Finance Dashboard</h2>

//         <SearchBar />

//         {activeSection === "overview" && <DashboardOverview />}

//         {activeSection === "reports" && (
//           <p>
//             📊 Reports section (e.g., monthly charts, exports) coming soon...
//           </p>
//         )}

//         {activeSection === "invoices" && (
//           <p>💰 Invoice management (CRUD + status updates) coming soon...</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default FinanceDashboard;

// frontend/src/pages/dashboard/FinanceDashboard.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import DashboardOverview from "../../components/DashboardOverview";
import InvoiceTable from "../../components/InvoiceTable";
import { SidebarContext } from "../../context/SidebarContext";
import CustomerList from "../../components/CustomerList";

import {
  FaHome,
  FaChartBar,
  FaFileInvoiceDollar,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaUserCog
} from "react-icons/fa";

import "../../css/Admindashboard.css";

function FinanceDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const { collapsed, setCollapsed } = useContext(SidebarContext);

  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSidebarClick = (section) => {
    if (section === "logout") {
      logout();
      navigate("/login");
      return;
    }
    setActiveSection(section);
  };

  // 🚫 Role-based guard
  if (!user || !["finance", "admin", "manager"].includes(user.role)) {
    return (
      <div className="dashboard-container">
        <div className="content">
          <h2>🚫 Access Denied</h2>
          <p>You do not have permission to view the Finance Dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
        <ul>
          <li
            onClick={() => handleSidebarClick("overview")}
            className={activeSection === "overview" ? "active" : ""}
          >
            <FaHome className="icon" />
            {!collapsed && "Overview"}
          </li>
          <li
            onClick={() => handleSidebarClick("invoices")}
            className={activeSection === "invoices" ? "active" : ""}
          >
            <FaFileInvoiceDollar className="icon" />
            {!collapsed && "Invoices"}
          </li>
          <li
            onClick={() => handleSidebarClick("reports")}
            className={activeSection === "reports" ? "active" : ""}
          >
            <FaChartBar className="icon" />
            {!collapsed && "Reports"}
          </li>
          <li
            onClick={() => handleSidebarClick("customers")}
            className={activeSection === "customers" ? "active" : ""}
          >
            <FaUserCog className="icon" />
            {!collapsed && "Customers"}
          </li>

          <li onClick={() => handleSidebarClick("logout")}>
            <FaSignOutAlt className="icon" />
            {!collapsed && "Logout"}
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="content">
        <h2>Finance Dashboard</h2>

        {activeSection === "overview" && <DashboardOverview />}
        {activeSection === "invoices" && <InvoiceTable />}
        {activeSection === "customers" && <CustomerList />}
        {activeSection === "reports" && (
          <p>📊 Reports section coming soon...</p>
        )}
      </div>
    </div>
  );
}

export default FinanceDashboard;
