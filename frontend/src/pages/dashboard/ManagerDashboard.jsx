// // frontend/src/pages/dashboard/ManagerDashboard.jsx

// import React, { useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import { AuthContext } from "../../context/AuthContext";
// import InstallationsTable from "../../components/InstallationsTable";
// import Modal from "../../components/Modal";
// import TechnicianSchedule from "../../components/TechnicianSchedule";
// import InstallationForm from "../../components/InstallationForm";
// import SearchBar from "../../components/SearchBar";
// import "../../css/ManagerDashboard.css";

// function ManagerDashboard() {
//   const [activeSection, setActiveSection] = useState("dashboard");
//   const [showModal, setShowModal] = useState(false);
//   const { logout } = useContext(AuthContext);
//   const navigate = useNavigate();

//   const handleSidebarClick = (section) => {
//     if (section === "logout") {
//       logout();
//       navigate("/login");
//       return;
//     }
//     setActiveSection(section);
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <ul>
//           <li
//             onClick={() => handleSidebarClick("dashboard")}
//             className={activeSection === "dashboard" ? "active" : ""}
//           >
//             Dashboard
//           </li>
//           <li
//             onClick={() => handleSidebarClick("installations")}
//             className={activeSection === "installations" ? "active" : ""}
//           >
//             Installations & Pipeline
//           </li>
//           <li
//             onClick={() => handleSidebarClick("scheduling")}
//             className={activeSection === "scheduling" ? "active" : ""}
//           >
//             Technician Scheduling
//           </li>
//           <li onClick={() => handleSidebarClick("logout")}>Logout</li>
//         </ul>
//       </div>

//       {/* Content */}
//       <div className="content">
//         <h2>Manager Dashboard</h2>
//         <SearchBar />

//         {activeSection === "dashboard" && (
//           <p>Welcome, Manager! Select a section from the sidebar.</p>
//         )}

//         {activeSection === "installations" && (
//           <>
//             <button
//               className="open-modal-btn"
//               onClick={() => setShowModal(true)}
//             >
//               New Installation
//             </button>

//             <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
//               <InstallationForm onSuccess={() => window.location.reload()} />
//             </Modal>

//             <InstallationsTable />
//           </>
//         )}

//         {activeSection === "scheduling" && <TechnicianSchedule />}

//       </div>
//     </div>
//   );
// }

// export default ManagerDashboard;


// frontend/src/pages/dashboard/ManagerDashboard.jsx

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import InstallationsTable from "../../components/InstallationsTable";
import Modal from "../../components/Modal";
import TechnicianSchedule from "../../components/TechnicianSchedule";
import InstallationForm from "../../components/InstallationForm";

import { FaHome, FaTools, FaCalendarAlt, FaSignOutAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

import "../../css/Admindashboard.css";

function ManagerDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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
          <li onClick={() => handleSidebarClick("logout")}>
            <FaSignOutAlt className="icon" />
            {!collapsed && "Logout"}
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="content">
        <h2>Manager Dashboard</h2>

        {activeSection === "dashboard" && (
          <p>Welcome, Manager! Select a section from the sidebar.</p>
        )}

        {activeSection === "installations" && (
          <>
            <button
              className="open-modal-btn"
              onClick={() => setShowModal(true)}
            >
              New Installation
            </button>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
              <InstallationForm onSuccess={() => window.location.reload()} />
            </Modal>

            <InstallationsTable />
          </>
        )}

        {activeSection === "scheduling" && <TechnicianSchedule />}
      </div>
    </div>
  );
}

export default ManagerDashboard;
