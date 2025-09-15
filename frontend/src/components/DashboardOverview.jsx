//frontend/src/components/DashboardOverview.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../context/axiosInstance";
import KPICardsRow from "./KPICardsRow";
import BreakdownTable from "./BreakdownTable";

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

      <KPICardsRow
        items={[
          { title: "Total Revenue", value: `$${summary.total_revenue}` },
          { title: "Jobs Completed", value: summary.jobs_completed },
          { title: "Outstanding Jobs", value: summary.outstanding_jobs },
          { title: "Average Price", value: `$${summary.average_price}` },
        ]}
      />

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
