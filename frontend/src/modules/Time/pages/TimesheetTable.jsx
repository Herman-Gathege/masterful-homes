import React, { useContext, useState } from "react";
import useTimeStore from "../../../store/timeStore";
import { AuthContext } from "../../../context/AuthContext";
import { useTimesheet, useAllTimesheets } from "../../../services/timeService";
import "../../../css/TimeModule.css";

const TimesheetTable = () => {
  const { user } = useContext(AuthContext);
  const { timesheetFilters, setTimesheetFilters } = useTimeStore();

  // Local state for custom date selection
  const [startDate, setStartDate] = useState(timesheetFilters.startDate?.slice(0, 10));
  const [endDate, setEndDate] = useState(timesheetFilters.endDate?.slice(0, 10));

  const isManagerView =
    user?.role === "manager" ||
    user?.role === "admin" ||
    user?.role === "superadmin";

  const { data: entries = [], isLoading, refetch } = isManagerView
    ? useAllTimesheets(user?.tenant_id, timesheetFilters.startDate, timesheetFilters.endDate)
    : useTimesheet(user?.id, user?.tenant_id, timesheetFilters.startDate, timesheetFilters.endDate);

  // 🔹 Predefined quick range buttons
  const changeRange = (range) => {
    const now = new Date();
    let start, end;
    if (range === "week") {
      const first = new Date(now);
      first.setDate(now.getDate() - now.getDay());
      start = first.toISOString().slice(0, 10);
      end = new Date(first.getTime() + 6 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    } else if (range === "month") {
      start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
    }
    setStartDate(start);
    setEndDate(end);
    setTimesheetFilters({
      startDate: `${start}T00:00:00Z`,
      endDate: `${end}T23:59:59Z`,
    });
    refetch();
  };

  // 🔹 Apply custom date range
  const applyCustomRange = () => {
    if (!startDate || !endDate) return alert("Please select both start and end dates");
    setTimesheetFilters({
      startDate: `${startDate}T00:00:00Z`,
      endDate: `${endDate}T23:59:59Z`,
    });
    refetch();
  };

  if (!user) return <div className="notice">⚠️ Please log in.</div>;

  return (
    <div className="timesheet-wrapper">
      <div className="timesheet-header">
        <h2>
          {isManagerView ? "All Employees' Timesheets" : "My Timesheet Records"}
        </h2>

        <div className="timesheet-controls">
          {/* 🔹 Quick range buttons */}
          <button onClick={() => changeRange("week")}>This Week</button>
          <button onClick={() => changeRange("month")}>This Month</button>

          {/* 🔹 Custom range pickers */}
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <span>→</span>
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value)}
          />

          <button onClick={applyCustomRange}>Apply</button>
        </div>

        {/* Current active range display */}
        <div className="active-range">
          Showing: {timesheetFilters.startDate?.slice(0, 10)} →{" "}
          {timesheetFilters.endDate?.slice(0, 10)}
        </div>
      </div>

      {isLoading ? (
        <div className="loading">⏳ Loading timesheet...</div>
      ) : entries.length === 0 ? (
        <div className="empty">No time entries found for this range.</div>
      ) : (
        <div className="table-container">
          <table className="timesheet-table">
            <thead>
              <tr>
                {isManagerView && <th>Employee</th>}
                <th>Start</th>
                <th>End</th>
                <th>Duration (h)</th>
                <th>Kind</th>
                <th>Task</th>
                <th>Notes</th>
                <th>Approved</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id}>
                  {isManagerView && (
                    <td>
                      <strong>{entry.user_name}</strong>
                      <br />
                      <small style={{ color: "#666" }}>{entry.user_email}</small>
                    </td>
                  )}
                  <td>{new Date(entry.start_time).toLocaleString()}</td>
                  <td>
                    {entry.end_time
                      ? new Date(entry.end_time).toLocaleString()
                      : "—"}
                  </td>
                  <td>{entry.duration?.toFixed(2)}</td>
                  <td>{entry.kind}</td>
                  <td>{entry.task_title}</td>
                  <td>{entry.notes}</td>
                  <td>{entry.is_approved ? "✅" : "❌"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TimesheetTable;
