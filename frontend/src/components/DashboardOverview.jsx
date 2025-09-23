
// frontend/src/components/DashboardOverview.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../context/axiosInstance";
import KPICardsRow from "./KPICardsRow";
import BreakdownTable from "./BreakdownTable";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

function DashboardOverview() {
  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [summaryRes, breakdownRes] = await Promise.all([
        axiosInstance.get("/finance/summary"),
        axiosInstance.get("/finance/breakdown"),
      ]);
      setSummary(summaryRes.data);
      setBreakdown(breakdownRes.data);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <p>Loading dashboard data...</p>;
  if (!summary || !breakdown) return <p>No data available.</p>;

  return (
    <div className="dashboard-overview">
      <h3>Overview</h3>

      {/* KPI Cards */}
      <KPICardsRow
        items={[
          { title: "Total Revenue", value: `$${summary.total_revenue}` },
          { title: "Jobs Completed", value: summary.jobs_completed },
          { title: "Outstanding Jobs", value: summary.outstanding_jobs },
          { title: "Average Price", value: `$${summary.average_price}` },
        ]}
      />

      {/* Chart Section */}
      {summary.monthly_revenue && summary.monthly_revenue.length > 0 && (
        <div className="chart-container">
          <h4>Monthly Revenue Trend</h4>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={summary.monthly_revenue}>
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#1b263b" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#1b263b" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />

              <XAxis
                dataKey="month"
                tickFormatter={(val) => {
                  const [year, month] = val.split("-");
                  return `${new Date(year, month - 1).toLocaleString(
                    "default",
                    {
                      month: "short",
                    }
                  )} ${year}`;
                }}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                tickFormatter={(val) => `$${val.toLocaleString()}`}
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]}
                labelFormatter={(label) => {
                  const [year, month] = label.split("-");
                  return `${new Date(year, month - 1).toLocaleString(
                    "default",
                    {
                      month: "long",
                    }
                  )} ${year}`;
                }}
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                }}
              />

              <Legend verticalAlign="top" height={36} />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="url(#revenueGradient)"
                strokeWidth={3}
                dot={{ r: 4, fill: "#1b263b", strokeWidth: 1 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Breakdown Tables */}
      <div className="breakdowns">
        <BreakdownTable
          title="Revenue by Package"
          data={breakdown.packages}
          columns={[
            { header: "Package", accessor: "package_type" },
            { header: "Revenue", accessor: "revenue" },
          ]}
        />
        <BreakdownTable
          title="Revenue by Technician"
          data={breakdown.technicians}
          columns={[
            { header: "Technician", accessor: "technician_name" },
            { header: "Revenue", accessor: "revenue" },
          ]}
        />
      </div>
    </div>
  );
}

export default DashboardOverview;
