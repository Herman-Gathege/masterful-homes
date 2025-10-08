import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useSummaryReport } from "../../../services/timeService";
import useTimeStore from "../../../store/timeStore";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "../../../css/TimeModule.css";

const COLORS = ["#053f5c", "#2e8bc0", "#f5a623", "#e94f37"];

const ManagerSummary = () => {
  const { user } = useContext(AuthContext);
  const { reportFilters, setReportFilters } = useTimeStore();

  // Default range → this week
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const defaultStart = reportFilters.startDate || weekStart.toISOString().slice(0, 10);
  const defaultEnd = reportFilters.endDate || today.toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);

  const applyFilter = () => {
    setReportFilters({
      startDate: `${startDate}T00:00:00Z`,
      endDate: `${endDate}T23:59:59Z`,
    });
  };

  const { data: summaryData = {}, isLoading, refetch } = useSummaryReport(
    reportFilters.startDate || `${defaultStart}T00:00:00Z`,
    reportFilters.endDate || `${defaultEnd}T23:59:59Z`
  );

  useEffect(() => {
    refetch();
  }, [reportFilters, refetch]);

  if (!["manager", "admin", "superadmin"].includes(user?.role?.toLowerCase())) {
    return <div className="notice">⚠️ Manager or Admin access only.</div>;
  }

  if (isLoading) return <div className="loading">⏳ Loading summary...</div>;

  // ---- Data Calculations ----
  const totalHours = summaryData.summary?.reduce((sum, s) => sum + s.total_hours, 0) || 0;
  const overtimeHours = summaryData.summary
    ?.filter((s) => s.kind === "overtime")
    ?.reduce((sum, s) => sum + s.total_hours, 0) || 0;
  const regularHours = totalHours - overtimeHours;
  const unapprovedCount = summaryData.unapproved_count || 0;

  // ---- Chart Data ----
  const barData = [
    { name: "Regular Hours", hours: regularHours },
    { name: "Overtime Hours", hours: overtimeHours },
  ];

  const pieData = [
    { name: "Regular", value: regularHours },
    { name: "Overtime", value: overtimeHours },
  ];

  return (
    <div className="manager-summary">
      {/* Header + Filters */}
      <div className="summary-header">
        <h2>📊 Team Summary Report</h2>
        <div className="summary-filters">
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span>→</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          <button onClick={applyFilter}>Apply</button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <h3>{totalHours.toFixed(1)}</h3>
          <p>Total Hours</p>
        </div>
        <div className="summary-card">
          <h3>{regularHours.toFixed(1)}</h3>
          <p>Regular Hours</p>
        </div>
        <div className="summary-card">
          <h3>{overtimeHours.toFixed(1)}</h3>
          <p>Overtime Hours</p>
        </div>
        <div className="summary-card">
          <h3>{unapprovedCount}</h3>
          <p>Unapproved Entries</p>
        </div>
      </div>

      {/* Charts */}
      <div className="summary-charts">
        {/* <div className="chart-box">
          <h4>📈 Hours Breakdown</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="hours" fill="#053f5c" radius={[8, 8, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div> */}

        <div className="chart-box">
          <h4>🕒 Distribution</h4>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ManagerSummary;
