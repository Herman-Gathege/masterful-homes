// src/pages/dashboard/AdminDashboard.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import UserRegistrationForm from "../../components/UserRegistrationForm";
import UserTable from "../../components/UserTable";
import "../../css/Admindashboard.css";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleSidebarClick = (section) => {
    if (section === "logout") {
      logout();
      navigate("/login");
      return;
    }
    setActiveSection(section);
    if (section !== "user-management") {
      setShowModal(false);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li
            onClick={() => handleSidebarClick("dashboard")}
            className={activeSection === "dashboard" ? "active" : ""}
          >
            Dashboard
          </li>
          <li
            onClick={() => handleSidebarClick("user-management")}
            className={activeSection === "user-management" ? "active" : ""}
          >
            User Management
          </li>
          <li onClick={() => handleSidebarClick("logout")}>Logout</li>
        </ul>
      </div>

      {/* Content */}
      <div className="content">
        <h2>Admin Dashboard</h2>

        {activeSection === "dashboard" && (
          <p>Welcome, Admin! Select a section from the sidebar.</p>
        )}

        {activeSection === "user-management" && (
          <>
            <button className="open-modal-btn" onClick={handleOpenModal}>
              Register New User
            </button>

            {showModal && (
              <UserRegistrationForm handleCloseModal={handleCloseModal} />
            )}

            <UserTable />
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
