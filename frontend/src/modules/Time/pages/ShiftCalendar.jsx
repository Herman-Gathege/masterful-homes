// // frontend/src/modules/Time/pages/ShiftCalendar.jsx
// import React, { useContext } from "react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import { AuthContext } from "../../../context/AuthContext";
// import {
//   useShifts,
//   useCreateShift,
//   useDeleteShift,
// } from "../../../services/timeService";
// import interactionPlugin from "@fullcalendar/interaction";

// const ShiftCalendar = () => {
//   const { user } = useContext(AuthContext);
//   const { data: events = [], isLoading, refetch } = useShifts(user?.tenant_id);
//   const createShift = useCreateShift();
//   const deleteShift = useDeleteShift();

//   if (isLoading) return <div>Loading shifts...</div>;


//   const handleDateClick = (arg) => {
//     if (!user) return;
//     const start = new Date(arg.date);
//     const end = new Date(arg.date);
//     end.setHours(17, 0, 0, 0);

//     createShift.mutate(
//       {
//         start_time: start.toISOString(),
//         end_time: end.toISOString(),
//       },
//       { onSuccess: () => refetch() }
//     );
//   };

//   const handleEventClick = (arg) => {
//     if (window.confirm(`Delete shift ${arg.event.title}?`)) {
//       deleteShift.mutate(arg.event.id, { onSuccess: () => refetch() });
//     }
//   };




//   return (
//     <div aria-label="Shift Calendar">
//       <FullCalendar
//         plugins={[dayGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         dateClick={handleDateClick}
//         eventClick={handleEventClick}
//         events={events} // ✅ no more `.data`
//       />
//     </div>
//   );
// };

// export default ShiftCalendar;


import React, { useState, useContext, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { AuthContext } from "../../../context/AuthContext";
import { useShifts, useCreateShift, useDeleteShift } from "../../../services/timeService";

const localizer = momentLocalizer(moment);

const ShiftCalendar = () => {
  const { user } = useContext(AuthContext);
  const [view, setView] = useState("week");
  const { data: events = [], isLoading, refetch } = useShifts(user?.tenant_id);
  const createShift = useCreateShift();
  const deleteShift = useDeleteShift();

  const calendarEvents = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title,
        start: new Date(e.start),
        end: new Date(e.end),
      })),
    [events]
  );

  const handleSelectSlot = ({ start, end }) => {
    if (!user) return;
    const confirm = window.confirm("Create a new shift for this slot?");
    if (confirm) {
      createShift.mutate(
        { start_time: start.toISOString(), end_time: end.toISOString() },
        { onSuccess: () => refetch() }
      );
    }
  };

  const handleSelectEvent = (event) => {
    const confirm = window.confirm(`Delete shift "${event.title}"?`);
    if (confirm) {
      deleteShift.mutate(event.id, { onSuccess: () => refetch() });
    }
  };

  if (isLoading) return <div>⏳ Loading shifts...</div>;

  return (
    <div className="shift-calendar">
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
        <div>
          <button onClick={() => setView("day")}>Day</button>
          <button onClick={() => setView("week")}>Week</button>
          <button onClick={() => setView("month")}>Month</button>
        </div>
        <button onClick={() => refetch()}>🔄 Refresh</button>
      </div>

      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        selectable
        defaultView={view}
        view={view}
        onView={setView}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default ShiftCalendar;
