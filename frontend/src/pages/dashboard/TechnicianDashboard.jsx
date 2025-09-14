// src/pages/dashboard/TechnicianDashboard.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../context/axiosInstance";
import TechnicianSchedule from "../../components/TechnicianSchedule";
import "../../css/TechnicianDashboard.css";

function TechnicianDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [myInstallations, setMyInstallations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Robust loader: handles missing user, differing API shapes, and type mismatches
  const loadMyInstallations = async () => {
    if (!user) {
      console.warn("loadMyInstallations: user not ready yet");
      return;
    }

    setIsLoading(true);
    try {
      // Try the straightforward call first (your backend may already filter by token)
      const res = await axiosInstance.get("/installations");
      console.log("Installations API response:", res.data);
      console.log("Current user (from AuthContext):", user);

      // Normalize possible technician id fields for each installation
      const normalizeTechId = (item) => {
        // try a few common variants
        const idCandidates = [
          item.technician_id,
          item.technicianId,
          item.technician && item.technician.id,
          item.technician && item.technician_id, // defensive
        ];
        for (const cand of idCandidates) {
          if (cand !== undefined && cand !== null) return String(cand);
        }
        return null;
      };

      // Prefer backend filtering (if backend already returns only the tech's jobs)
      let rows = Array.isArray(res.data) ? res.data : [];

      // If there are items but none match the user (or API returned all installs),
      // filter client-side as a fallback.
      const userIdStr = user.id !== undefined && user.id !== null ? String(user.id) : null;

      if (userIdStr) {
        const filtered = rows.filter((i) => {
          const techIdStr = normalizeTechId(i);
          return techIdStr === userIdStr;
        });

        // If filtered has items, use that. If not, maybe the backend already returned only the tech's jobs,
        // so if rows includes scheduled_date items and their technician_name equals user.username, accept rows.
        if (filtered.length > 0) {
          rows = filtered;
        } else {
          // second-pass: match by technician_name if available
          const byName = rows.filter(
            (i) =>
              (i.technician_name && i.technician_name === user.username) ||
              (i.technician && i.technician.username && i.technician.username === user.username)
          );
          if (byName.length > 0) rows = byName;
        }
      } else {
        // user.id missing — don't filter (but log so you can fix AuthContext)
        console.warn("User object has no id. Ensure AuthContext provides user.id.");
      }

      // If still empty and userId exists, try the query param (backend filter)
      if ((rows.length === 0 || !Array.isArray(rows)) && userIdStr) {
        try {
          console.log("Trying backend query param /installations?technician_id=...", userIdStr);
          const res2 = await axiosInstance.get(`/installations?technician_id=${userIdStr}`);
          console.log("Response for query param:", res2.data);
          rows = Array.isArray(res2.data) ? res2.data : rows;
        } catch (err2) {
          console.warn("Backend query param attempt failed:", err2);
        }
      }

      setMyInstallations(rows);
    } catch (err) {
      console.error("Failed to fetch technician installations", err);
      setMyInstallations([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Reload when we switch to My Jobs or when user becomes available
    if (activeSection === "my-jobs") {
      loadMyInstallations();
    }
    // also run if user changes while we are on the my-jobs tab
  }, [activeSection, user]);

  const handleSidebarClick = (section) => {
    if (section === "logout") {
      logout();
      navigate("/login");
      return;
    }
    setActiveSection(section);
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

  // Guard: user must exist (prevents crash on first render)
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
      <div className="sidebar">
        <ul>
          <li
            onClick={() => handleSidebarClick("dashboard")}
            className={activeSection === "dashboard" ? "active" : ""}
          >
            Dashboard
          </li>
          <li
            onClick={() => handleSidebarClick("my-jobs")}
            className={activeSection === "my-jobs" ? "active" : ""}
          >
            My Jobs
          </li>
          <li
            onClick={() => handleSidebarClick("schedule")}
            className={activeSection === "schedule" ? "active" : ""}
          >
            My Schedule
          </li>
          <li onClick={() => handleSidebarClick("logout")}>Logout</li>
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

        {activeSection === "schedule" && <TechnicianSchedule technicianId={user.id} />}
      </div>
    </div>
  );
}

export default TechnicianDashboard;
