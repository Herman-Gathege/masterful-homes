//frontend/src/components/KPICardsRow.jsx

import React from "react";
import "../css/KPICards.css";

function KPICardsRow({ items }) {
  return (
    <div className="kpi-cards-row">
      {items.map((item, idx) => (
        <div key={idx} className="kpi-card">
          <h4>{item.title}</h4>
          <p>{item.value}</p>
        </div>
      ))}
    </div>
  );
}

export default KPICardsRow;
