import React, { useState } from "react";
import { Clock4, CalendarDays, Table, AlertCircle, BarChart2 } from "lucide-react";
import ClockWidget from "./pages/ClockWidget";
import ShiftCalendar from "./pages/ShiftCalendar";
import TimesheetTable from "./pages/TimesheetTable";
import ShiftFormModal from "./pages/ShiftFormModal";
import "../../css/TimeModule.css"; // 👈 We'll update this file below
import ExceptionPanel from "./pages/ExceptionPanel";
import ManagerSummary from "./pages/ManagerSummary";

const Time = () => {
  const [activeTab, setActiveTab] = useState("clock");

  const tabs = [
    { key: "clock", label: "Clock", icon: <Clock4 size={18} /> },
    { key: "calendar", label: "Shifts", icon: <CalendarDays size={18} /> },
    { key: "timesheet", label: "Timesheets", icon: <Table size={18} /> },
    { key: "exceptions", label: "Exceptions", icon: <AlertCircle size={18} /> },
    { key: "summary", label: "Summary", icon: <BarChart2 size={18} /> }, 
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "clock":
        return <ClockWidget />;
      case "calendar":
        return <ShiftCalendar />;
      case "timesheet":
        return <TimesheetTable />;
      case "exceptions":
        return <ExceptionPanel />;
      case "summary":
        return <ManagerSummary />;
      default:
        return null;
    }
  };

  return (
    <div className="time-module-container">
      <h1 className="time-header">Time Management</h1>

      {/* ===== Top Tab Bar ===== */}
      <div className="time-topbar">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`time-tab-btn ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="icon">{tab.icon}</span>
            <span className="label">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ===== Tab Content ===== */}
      <div className="time-content">{renderContent()}</div>

      {/* Always-mounted modal */}
      <ShiftFormModal />
    </div>
  );
};

export default Time;
