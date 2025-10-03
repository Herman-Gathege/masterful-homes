import React, { useContext } from "react";
import useTimeStore from "../../../store/timeStore";
import { AuthContext } from "../../../context/AuthContext";
import { useTimesheet } from "../../../services/timeService";

const TimesheetTable = () => {
  const { user } = useContext(AuthContext);
  const { timesheetFilters, setTimesheetFilters } = useTimeStore();

  const {
    data: entries = [],
    isLoading,
    isError,
    error,
  } = useTimesheet(
    user?.id,
    user?.tenant_id, // ✅ pass tenantId
    timesheetFilters.startDate,
    timesheetFilters.endDate
  );

  const handleFilterChange = (e) => {
    setTimesheetFilters({
      ...timesheetFilters,
      [e.target.name]: e.target.value,
    });
  };

  if (!user) return <div>⚠️ Please log in to see timesheets.</div>;
  if (isLoading) return <div>Loading timesheet...</div>;
  if (isError) return <div>Error loading timesheet: {error.message}</div>;

  return (
    <div aria-label="Timesheet Table">
      <div style={{ marginBottom: "1rem" }}>
        <input type="date" name="startDate" onChange={handleFilterChange} />
        <input type="date" name="endDate" onChange={handleFilterChange} />
      </div>

      <table border="1" cellPadding="6" style={{ width: "100%" }}>
        <thead>
          <tr>
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
  );
};

export default TimesheetTable;
