import React, { useEffect, useState } from "react";
import "../../css/DashboardPage.css";
import axiosInstance from "../../context/axiosInstance"; 
import {
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaBoxes,
  FaDollarSign,
  FaSyncAlt,
} from "react-icons/fa";

export default function DashboardPage() {
  const [kpi, setKpi] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadKpi() {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get("/kpi/overview");
      setKpi(res.data);
    } catch (err) {
      console.warn("KPI fetch failed — fallback to sample data", err);
      setKpi({
        active_employees: 12,
        jobs_completed_today: 8,
        overdue_jobs: 2,
        low_stock: [
          { id: 1, name: "Cement Bags", qty_on_hand: 12, reorder_point: 20 },
          { id: 2, name: "Steel Rods", qty_on_hand: 5, reorder_point: 15 },
        ],
        revenue_today: 1234.56,
      });
      setError("Live KPI load failed — showing sample data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadKpi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = [
    { key: "active_employees", label: "Active Employees", icon: <FaUsers /> },
    { key: "jobs_completed_today", label: "Jobs Completed Today", icon: <FaCheckCircle /> },
    { key: "overdue_jobs", label: "Overdue Jobs", icon: <FaExclamationTriangle /> },
    { key: "low_stock", label: "Low Stock Items", icon: <FaBoxes /> },
    { key: "revenue_today", label: "Revenue Today", icon: <FaDollarSign /> },
  ];

  function formatValue(val, key) {
    if (val === null || val === undefined) return "—";
    if (key === "revenue_today") {
      return Number(val).toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 2,
      });
    }
    if (key === "low_stock") {
      return Array.isArray(val) ? val.length : val;
    }
    return typeof val === "number" ? val.toLocaleString() : String(val);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Overview</h3>
        <button
          onClick={loadKpi}
          style={{ background: "transparent", border: "none", cursor: "pointer" }}
          title="Refresh"
        >
          <FaSyncAlt />
        </button>
      </div>

      {loading && <p>Loading KPIs…</p>}
      {error && <p style={{ color: "orange" }}>{error}</p>}

      <div className="kpi-grid">
        {cards.map((c) => (
          <div key={c.key} className="kpi-card">
            <div className="kpi-left">
              <div className="kpi-icon">{c.icon}</div>
            </div>
            <div className="kpi-right">
              <div className="kpi-value">
                {kpi ? formatValue(kpi[c.key], c.key) : "—"}
              </div>
              <div className="kpi-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Low Stock Table */}
      {kpi && Array.isArray(kpi.low_stock) && kpi.low_stock.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          <h4>Low Stock Details</h4>
          <table className="kpi-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty on Hand</th>
                <th>Reorder Point</th>
              </tr>
            </thead>
            <tbody>
              {kpi.low_stock.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.qty_on_hand}</td>
                  <td>{item.reorder_point}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
