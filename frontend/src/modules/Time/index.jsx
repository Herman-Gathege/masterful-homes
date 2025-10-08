import React, { useState } from "react";
import ClockWidget from "./pages/ClockWidget";
import ShiftCalendar from "./pages/ShiftCalendar";
import TimesheetTable from "./pages/TimesheetTable";
import ShiftFormModal from "./pages/ShiftFormModal";

function Time() {
  const [activeTab, setActiveTab] = useState("clock");

  const renderTabContent = () => {
    switch (activeTab) {
      case "clock":
        return <ClockWidget />;
      case "calendar":
        return <ShiftCalendar />;
      case "timesheet":
        return <TimesheetTable />;
      default:
        return null;
    }
  };

  return (
    <div className="time-module" style={{ padding: "1rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>⏱️ Time Module</h1>

      {/* --- Tab Navigation --- */}
      <div
        className="tab-buttons"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "1rem",
          borderBottom: "1px solid #ccc",
        }}
      >
        <button
          onClick={() => setActiveTab("clock")}
          style={{
            background: activeTab === "clock" ? "#007bff" : "#f5f5f5",
            color: activeTab === "clock" ? "white" : "black",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px 6px 0 0",
            cursor: "pointer",
          }}
        >
          🕒 Clock
        </button>

        <button
          onClick={() => setActiveTab("calendar")}
          style={{
            background: activeTab === "calendar" ? "#007bff" : "#f5f5f5",
            color: activeTab === "calendar" ? "white" : "black",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px 6px 0 0",
            cursor: "pointer",
          }}
        >
          📅 Shifts
        </button>

        <button
          onClick={() => setActiveTab("timesheet")}
          style={{
            background: activeTab === "timesheet" ? "#007bff" : "#f5f5f5",
            color: activeTab === "timesheet" ? "white" : "black",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px 6px 0 0",
            cursor: "pointer",
          }}
        >
          📊 Timesheets
        </button>
      </div>

      {/* --- Tab Content --- */}
      <div
        className="tab-content"
        style={{
          background: "#fff",
          padding: "1rem",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {renderTabContent()}
      </div>

      
    </div>
  );
}

export default Time;
