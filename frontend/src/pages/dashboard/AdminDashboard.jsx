// frontend/src/pages/dashboard/AdminDashboard.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import UserRegistrationForm from "../../components/UserRegistrationForm";
import UserTable from "../../components/UserTable";
import InstallationsTable from "../../components/InstallationsTable";
import InstallationForm from "../../components/InstallationForm";
import TechnicianSchedule from "../../components/TechnicianSchedule";
import CustomerList from "../../components/CustomerList";
import Modal from "../../components/Modal";
import DashboardOverview from "../../components/DashboardOverview";
import { SidebarContext } from "../../context/SidebarContext";

import {
  FaHome,
  FaUsers,
  FaTools,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaFileInvoiceDollar,
  FaUserCog
} from "react-icons/fa";

import "../../css/Admindashboard.css";
import InvoiceTable from "../../components/InvoiceTable";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const { collapsed, setCollapsed } = useContext(SidebarContext);


  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSidebarClick = (section) => {
    if (section === "logout") {
      logout();
      navigate("/login");
      return;
    }
    setActiveSection(section);
    if (section !== "user-management") setShowUserModal(false);
    if (section !== "installations") setShowInstallModal(false);
  };

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
            onClick={() => handleSidebarClick("dashboard")}
            className={activeSection === "dashboard" ? "active" : ""}
          >
            <FaHome className="icon" />
            {!collapsed && "Dashboard"}
          </li>
          <li
            onClick={() => handleSidebarClick("user-management")}
            className={activeSection === "user-management" ? "active" : ""}
          >
            <FaUsers className="icon" />
            {!collapsed && "User Management"}
          </li>
          <li
            onClick={() => handleSidebarClick("installations")}
            className={activeSection === "installations" ? "active" : ""}
          >
            <FaTools className="icon" />
            {!collapsed && "Installations"}
          </li>
          <li
            onClick={() => handleSidebarClick("scheduling")}
            className={activeSection === "scheduling" ? "active" : ""}
          >
            <FaCalendarAlt className="icon" />
            {!collapsed && "Scheduling"}
          </li>
          <li
            onClick={() => handleSidebarClick("invoices")}
            className={activeSection === "invoices" ? "active" : ""}
          >
            <FaFileInvoiceDollar className="icon" />
            {!collapsed && "Invoices"}
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

      {/* Main Content */}
      <div className="content">
        <h2>Admin Dashboard</h2>

        {activeSection === "dashboard" && <DashboardOverview />}

        {/* User Management */}
        {activeSection === "user-management" && (
          <>
            <button
              className="open-modal-btn"
              onClick={() => setShowUserModal(true)}
            >
              Register New User
            </button>

            <Modal
              isOpen={showUserModal}
              onClose={() => setShowUserModal(false)}
            >
              <UserRegistrationForm
                handleCloseModal={() => setShowUserModal(false)}
              />
            </Modal>

            <UserTable />
          </>
        )}

        {/* Installations */}
        {activeSection === "installations" && (
          <>
            <button
              className="open-modal-btn"
              onClick={() => setShowInstallModal(true)}
            >
              New Installation
            </button>

            <Modal
              isOpen={showInstallModal}
              onClose={() => setShowInstallModal(false)}
            >
              <InstallationForm onSuccess={() => window.location.reload()} />
            </Modal>

            <InstallationsTable />
          </>
        )}

        {/* Scheduling */}
        {activeSection === "scheduling" && <TechnicianSchedule />}

        {/* Invoice */}
        {activeSection === "invoices" && <InvoiceTable />}

        {/* Customers */}
        {activeSection === "customers" && <CustomerList />}
      </div>
    </div>
  );
}

export default AdminDashboard;
