// // frontend/src/modules/Time/pages/TimesheetTable.jsx
// import React, { useContext } from "react";
// import useTimeStore from "../../../store/timeStore";
// import { AuthContext } from "../../../context/AuthContext";
// import { useTimesheet } from "../../../services/timeService";

// const TimesheetTable = () => {
//   const { user } = useContext(AuthContext);
//   const { timesheetFilters, setTimesheetFilters } = useTimeStore();

//   const {
//     data: entries = [],
//     isLoading,
//     isError,
//     error,
//   } = useTimesheet(
//     user?.id,
//     user?.tenant_id, // ✅ pass tenantId
//     timesheetFilters.startDate,
//     timesheetFilters.endDate
//   );

//   const handleFilterChange = (e) => {
//     setTimesheetFilters({
//       ...timesheetFilters,
//       [e.target.name]: e.target.value,
//     });
//   };

//   if (!user) return <div>⚠️ Please log in to see timesheets.</div>;
//   if (isLoading) return <div>Loading timesheet...</div>;
//   if (isError) return <div>Error loading timesheet: {error.message}</div>;

//   return (
//     <div aria-label="Timesheet Table">
//       <div style={{ marginBottom: "1rem" }}>
//         <input
//           type="date"
//           name="startDate"
//           value={timesheetFilters.startDate || ""}
//           onChange={handleFilterChange}
//         />
//         <input
//           type="date"
//           name="endDate"
//           value={timesheetFilters.endDate || ""}
//           onChange={handleFilterChange}
//         />
//       </div>

//       <table border="1" cellPadding="6" style={{ width: "100%" }}>
//         <thead>
//           <tr>
//             <th>Start</th>
//             <th>End</th>
//             <th>Duration (h)</th>
//             <th>Kind</th>
//             <th>Task</th>
//             <th>Notes</th>
//             <th>Approved</th>
//           </tr>
//         </thead>
//         <tbody>
//           {entries.map((entry) => (
//             <tr key={entry.id}>
//               <td>{new Date(entry.start_time).toLocaleString()}</td>
//               <td>
//                 {entry.end_time
//                   ? new Date(entry.end_time).toLocaleString()
//                   : "—"}
//               </td>
//               <td>{entry.duration?.toFixed(2)}</td>
//               <td>{entry.kind}</td>
//               <td>{entry.task_title}</td>
//               <td>{entry.notes}</td>
//               <td>{entry.is_approved ? "✅" : "❌"}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TimesheetTable;

import React, { useContext } from "react";
import useTimeStore from "../../../store/timeStore";
import { AuthContext } from "../../../context/AuthContext";
import { useTimesheet } from "../../../services/timeService";

const TimesheetTable = () => {
  const { user } = useContext(AuthContext);
  const { timesheetFilters, setTimesheetFilters } = useTimeStore();

  const { data: entries = [], isLoading } = useTimesheet(
    user?.id,
    user?.tenant_id,
    timesheetFilters.startDate,
    timesheetFilters.endDate
  );

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

  // ✅ Convert to full ISO datetime before setting
  setTimesheetFilters({
    startDate: `${start}T00:00:00Z`,
    endDate: `${end}T23:59:59Z`,
  });
};


  console.log("🧩 Timesheet Debug:", {
    userId: user?.id,
    tenantId: user?.tenant_id,
    filters: timesheetFilters,
  });

  if (!user) return <div>⚠️ Please log in.</div>;

  return (
    <div className="timesheet-table">
      <p>time sheets below</p>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => changeRange("week")}>This Week</button>
        <button onClick={() => changeRange("month")}>This Month</button>
        <span style={{ marginLeft: 10 }}>
          {timesheetFilters.startDate} → {timesheetFilters.endDate}
        </span>
      </div>

      {isLoading ? (
        <div>⏳ Loading timesheet...</div>
      ) : entries.length === 0 ? (
        <div>No time entries found for this range.</div>
      ) : (
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
      )}
    </div>
  );
};

export default TimesheetTable;
