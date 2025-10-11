// frontend/src/modules/Dashboard/pages/DashboardHome.jsx
import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../../context/AuthContext";
import { fetchUsers } from "../../../services/hrService";
import { useCurrentStatus, useExceptions } from "../../../services/timeService";
import useNotificationStore from "../../../store/notificationStore";
import { Link } from "react-router-dom";
import "../../../css/DashboardHome.css";
import {
  FaUsers,
  FaUserPlus,
  FaClock,
  FaExclamationTriangle,
  FaBell,
} from "react-icons/fa";

const DashboardHome = () => {
  const { user, role } = useContext(AuthContext);
  const tenantId = user?.tenant_id || "tenant_abc";

  // ---------------------------
  // HR metrics
  // ---------------------------
  const { data: usersData, isLoading: hrLoading } = useQuery({
    queryKey: ["users", tenantId],
    queryFn: async () => {
      const res = await fetchUsers({ tenant_id: tenantId, limit: 100 });
      return res.data.data || [];
    },
    enabled: role === "manager" || role === "superadmin",
    refetchInterval: 30000,
  });

  const activeCount = usersData?.filter((u) => u.is_active)?.length || 0;
  const pendingCount = usersData?.filter((u) => !u.is_active)?.length || 0;

  // ---------------------------
  // Time metrics
  // ---------------------------
  const { data: currentStatus, isLoading: timeLoading } =
    useCurrentStatus(tenantId);

  const { data: exceptionsData, isLoading: exceptionsLoading } =
    useExceptions(tenantId);

  let clockedInToday = 0;

  if (Array.isArray(currentStatus)) {
    clockedInToday = currentStatus.filter(
      (s) => s.status === "clocked_in"
    ).length;
  } else if (currentStatus?.status === "clocked_in") {
    clockedInToday = 1;
  }

  const exceptionCount =
    (exceptionsData?.missing_clockouts?.length || 0) +
    (exceptionsData?.overtime?.length || 0);

  // ---------------------------
  // Notifications
  // ---------------------------
  const { unreadCount } = useNotificationStore();

  const loading = hrLoading || timeLoading || exceptionsLoading;

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading dashboard metrics...
      </div>
    );
  }

  // ---------------------------
  // Quick Actions
  // ---------------------------
  const actions = [];

  if (role === "manager" || role === "superadmin") {
    actions.push({
      label: "Invite New User",
      path: "/dashboard/hr",
    });
    actions.push({
      label: "View Exceptions",
      path: "/dashboard/time",
    });
  }

  if (role === "employee" || role === "technician") {
    actions.push({
      label: "Clock In/Out",
      path: "/dashboard/time",
    });
  }

  return (
    <div className="dashboard-home">
      <h2>Welcome, {user?.full_name || "User"}</h2>

      <div className="kpi-grid">
        {(role === "manager" || role === "superadmin") && (
          <>
            <Link to="/dashboard/hr" className="kpi-card">
              <div className="kpi-icon">
                <FaUsers />
              </div>
              <div>
                <div className="kpi-value">{activeCount}</div>
                <div className="kpi-label">Active Employees</div>
              </div>
            </Link>

            <Link to="/dashboard/hr" className="kpi-card">
              <div className="kpi-icon">
                <FaUserPlus />
              </div>
              <div>
                <div className="kpi-value">{pendingCount}</div>
                <div className="kpi-label">Pending Invites</div>
              </div>
            </Link>
          </>
        )}

        <Link to="/dashboard/time" className="kpi-card">
          <div className="kpi-icon">
            <FaClock />
          </div>
          <div>
            <div className="kpi-value">{clockedInToday}</div>
            <div className="kpi-label">Clocked In Today</div>
          </div>
        </Link>

        {role === "manager" && (
          <Link to="/dashboard/time" className="kpi-card">
            <div className="kpi-icon">
              <FaExclamationTriangle />
            </div>
            <div>
              <div className="kpi-value">{exceptionCount}</div>
              <div className="kpi-label">Time Exceptions</div>
            </div>
          </Link>
        )}

        <Link to="/dashboard/notifications" className="kpi-card">
          <div className="kpi-icon">
            <FaBell />
          </div>
          <div>
            <div className="kpi-value">{unreadCount}</div>
            <div className="kpi-label">Unread Notifications</div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      {actions.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h4>Quick Actions</h4>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {actions.map((a) => (
              <Link key={a.label} to={a.path}>
                <button className="action-btn">{a.label}</button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, value, link, color }) => (
  <Link to={link} className={`stat-card ${color}`}>
    <p>{title}</p>
    <h3>{value}</h3>
  </Link>
);

export default DashboardHome;
