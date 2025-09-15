import React from "react";
import "../css/BreakdownTable.css";

function BreakdownTable({ title, data, columns }) {
  return (
    <div className="breakdown-table">
      <h4>{title}</h4>
      <table>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {columns.map((col, i) => (
                <td key={i}>{row[col.accessor]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BreakdownTable;
