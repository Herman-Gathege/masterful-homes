// frontend/src/modules/Time/index.js
import React from "react";
import ClockWidget from "./pages/ClockWidget";
import ShiftCalendar from "./pages/ShiftCalendar";
import TimesheetTable from "./pages/TimesheetTable";
import ShiftFormModal from "./pages/ShiftFormModal";

function Time() {
  return(
    <div>
      <h1>Time Module</h1>
      <ClockWidget />
      <ShiftCalendar />
      <TimesheetTable />
      <ShiftFormModal />
    </div>
  )

}

export default Time;
