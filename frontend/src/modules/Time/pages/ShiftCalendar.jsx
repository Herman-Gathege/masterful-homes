import React, { useState, useContext, useMemo } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { AuthContext } from "../../../context/AuthContext";
import { useShifts, useCreateShift, useDeleteShift } from "../../../services/timeService";

const localizer = momentLocalizer(moment);

const ShiftCalendar = () => {
  const { user } = useContext(AuthContext);
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const { data: events = [], isLoading, refetch } = useShifts(user?.tenant_id);
  const createShift = useCreateShift();
  const deleteShift = useDeleteShift();

  const calendarEvents = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title || "Shift",
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

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const goToToday = () => setCurrentDate(new Date());
  const goToPrev = () => {
    if (view === "month") setCurrentDate(moment(currentDate).subtract(1, "month").toDate());
    else if (view === "week") setCurrentDate(moment(currentDate).subtract(1, "week").toDate());
    else if (view === "day") setCurrentDate(moment(currentDate).subtract(1, "day").toDate());
  };
  const goToNext = () => {
    if (view === "month") setCurrentDate(moment(currentDate).add(1, "month").toDate());
    else if (view === "week") setCurrentDate(moment(currentDate).add(1, "week").toDate());
    else if (view === "day") setCurrentDate(moment(currentDate).add(1, "day").toDate());
  };

  if (isLoading) return <div>⏳ Loading shifts...</div>;

  return (
    <div className="shift-calendar">
      {/* Top Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", gap: "6px" }}>
          <button onClick={goToPrev}>⬅️ Back</button>
          <button onClick={goToToday}>📅 Today</button>
          <button onClick={goToNext}>➡️ Next</button>
        </div>

        <div style={{ fontWeight: 600, color: "#053f5c" }}>
          {moment(currentDate).format(
            view === "month" ? "MMMM YYYY" : view === "week" ? "[Week of] MMM D, YYYY" : "MMMM D, YYYY"
          )}
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          <button
            style={{ background: view === "day" ? "#053f5c" : "#f2f2f2", color: view === "day" ? "#fff" : "#053f5c" }}
            onClick={() => setView("day")}
          >
            Day
          </button>
          <button
            style={{ background: view === "week" ? "#053f5c" : "#f2f2f2", color: view === "week" ? "#fff" : "#053f5c" }}
            onClick={() => setView("week")}
          >
            Week
          </button>
          <button
            style={{
              background: view === "month" ? "#053f5c" : "#f2f2f2",
              color: view === "month" ? "#fff" : "#053f5c",
            }}
            onClick={() => setView("month")}
          >
            Month
          </button>
          <button onClick={() => refetch()}>🔄 Refresh</button>
        </div>
      </div>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600, background: "#fff", borderRadius: 8, padding: "1rem" }}
        selectable
        date={currentDate}
        onNavigate={handleNavigate}
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
