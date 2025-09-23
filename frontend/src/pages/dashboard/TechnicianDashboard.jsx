
// frontend/src/pages/dashboard/TechnicianDashboard.jsx

import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../context/axiosInstance";
import TechnicianSchedule from "../../components/TechnicianSchedule";
import { SidebarContext } from "../../context/SidebarContext";

import {
  FaHome,
  FaBriefcase,
  FaCalendarAlt,
  FaSignOutAlt,
  FaChevronLeft, FaChevronRight
} from "react-icons/fa";

import "../../css/Admindashboard.css";

function TechnicianDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [myInstallations, setMyInstallations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { collapsed, setCollapsed } = useContext(SidebarContext);


  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const loadMyInstallations = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/installations");
      let rows = Array.isArray(res.data) ? res.data : [];
      const userIdStr = user.id ? String(user.id) : null;

      if (userIdStr) {
        rows = rows.filter((i) => String(i.technician_id) === userIdStr);
      }

      setMyInstallations(rows);
    } catch (err) {
      console.error("Failed to fetch technician installations", err);
      setMyInstallations([]);
    } finally {
      setIsLoading(false);
    }
  };

  const updateJobStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`/installations/${id}`, { status: newStatus });
      // optimistic refresh
      await loadMyInstallations();
    } catch (err) {
      console.error("Failed to update job status", err);
    }
  };

  useEffect(() => {
    if (activeSection === "my-jobs") loadMyInstallations();
  }, [activeSection, user]);

  const handleSidebarClick = (section) => {
    if (section === "logout") {
      logout();
      navigate("/login");
      return;
    }
    setActiveSection(section);
  };

  if (!user) {
    return (
      <div className="dashboard-container">
        <div className="content">
          <h2>Technician Dashboard</h2>
          <p>Loading your profile...</p>
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
            onClick={() => handleSidebarClick("dashboard")}
            className={activeSection === "dashboard" ? "active" : ""}
          >
            <FaHome className="icon" />
            {!collapsed && "Dashboard"}
          </li>
          <li
            onClick={() => handleSidebarClick("my-jobs")}
            className={activeSection === "my-jobs" ? "active" : ""}
          >
            <FaBriefcase className="icon" />
            {!collapsed && "My Jobs"}
          </li>
          <li
            onClick={() => handleSidebarClick("schedule")}
            className={activeSection === "schedule" ? "active" : ""}
          >
            <FaCalendarAlt className="icon" />
            {!collapsed && "My Schedule"}
          </li>
          <li onClick={() => handleSidebarClick("logout")}>
            <FaSignOutAlt className="icon" />
            {!collapsed && "Logout"}
          </li>
        </ul>
      </div>

      {/* Content */}
      <div className="content">
        <h2>Technician Dashboard</h2>

        {activeSection === "dashboard" && (
          <p>Welcome, {user.username}! Select a section from the sidebar.</p>
        )}

        {activeSection === "my-jobs" && (
          <>
            <h3>My Assigned Installations</h3>
            {isLoading ? (
              <p>Loading jobs...</p>
            ) : myInstallations.length === 0 ? (
              <p>No assigned installations found.</p>
            ) : (
              <table className="jobs-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Package</th>
                    <th>Status</th>
                    <th>Scheduled</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myInstallations.map((job) => (
                    <tr key={job.id}>
                      <td>{job.id}</td>
                      <td>{job.customer_name}</td>
                      <td>{job.package_type}</td>
                      <td>{job.status}</td>
                      <td>
                        {job.scheduled_date
                          ? new Date(job.scheduled_date).toLocaleString()
                          : "Not Scheduled"}
                      </td>
                      <td>
                        {job.status !== "Completed" && (
                          <>
                            {job.status !== "In Progress" && (
                              <button
                                onClick={() => updateJobStatus(job.id, "In Progress")}
                              >
                                Start
                              </button>
                            )}
                            <button onClick={() => updateJobStatus(job.id, "Completed")}>
                              Complete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {activeSection === "schedule" && (
          <TechnicianSchedule technicianId={user.id} />
        )}
      </div>
    </div>
  );
}

export default TechnicianDashboard;
