import React from "react";
import "../css/KPIcard.css";

function KPIcard({ title, value }) {
  return (
    <div className="kpi-card">
      <h4>{title}</h4>
      <p>{value}</p>
    </div>
  );
}

export default KPIcard;
