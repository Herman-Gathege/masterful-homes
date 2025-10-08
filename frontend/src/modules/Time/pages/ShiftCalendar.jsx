import React, { useState, useContext, useMemo, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { AuthContext } from "../../../context/AuthContext";
import { useShifts } from "../../../services/timeService";
import ShiftFormModal from "./ShiftFormModal";

const localizer = momentLocalizer(moment);

const ShiftCalendar = () => {
  const { user } = useContext(AuthContext);
  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showHelp, setShowHelp] = useState(false); // usage hint
  const { data: events = [], isLoading, refetch } = useShifts(user?.tenant_id);

  // Build events for react-big-calendar
  const calendarEvents = useMemo(
    () =>
      events.map((e) => ({
        id: e.id,
        title: e.title || e.description || "Shift",
        start: new Date(e.start),
        end: new Date(e.end),
        raw: e,
      })),
    [events]
  );

  // Show hint if never seen
  useEffect(() => {
    const seen = localStorage.getItem("seenShiftHelp");
    setShowHelp(!seen);
  }, []);

  // Dismiss hint
  const dismissHelp = () => {
    localStorage.setItem("seenShiftHelp", "true");
    setShowHelp(false);
  };

  // Reopen hint manually
  const reopenHelp = () => {
    setShowHelp(true);
  };

  // Slot selection
  const handleSelectSlot = ({ start, end }) => {
    if (!user) return;
    if (!end || start >= end) {
      const fallbackEnd = moment(start).add(8, "hours").toDate();
      setSelectedRange({ start, end: fallbackEnd });
    } else {
      setSelectedRange({ start, end });
    }
  };

  // Event click
  const handleSelectEvent = (event) => {
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end,
    });
  };

  // Close modal and optionally refresh
  const handleCloseModal = (didUpdate = false) => {
    setSelectedRange(null);
    setSelectedEvent(null);
    if (didUpdate) refetch();
  };

  // Navigation helpers
  const handleNavigate = (newDate) => setCurrentDate(newDate);
  const goToToday = () => setCurrentDate(new Date());
  const goToPrev = () => {
    const diff = view === "month" ? "month" : view === "week" ? "week" : "day";
    setCurrentDate(moment(currentDate).subtract(1, diff).toDate());
  };
  const goToNext = () => {
    const diff = view === "month" ? "month" : view === "week" ? "week" : "day";
    setCurrentDate(moment(currentDate).add(1, diff).toDate());
  };

  if (isLoading) return <div>⏳ Loading shifts...</div>;

  return (
    <div className="shift-calendar" style={{ position: "relative" }}>
      {/* 💡 Reopen Hint Button */}
      {!showHelp && (
        <button
          onClick={reopenHelp}
          style={{
            position: "absolute",
            top: 3,
            right: 210,
            background: "#e9f4fb",
            color: "#053f5c",
            border: "2px solid #677985ff",
            borderRadius: "20px",
            padding: "4px 10px",
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          💡 Hint
        </button>
      )}

      {/* ===== Usage hint (dismissible) ===== */}
      {showHelp && (
        <div
          style={{
            background: "#e9f4fb",
            border: "1px solid #b6d9ef",
            borderRadius: 8,
            padding: "0.85rem 1rem",
            marginBottom: "1rem",
            color: "#053f5c",
            position: "relative",
          }}
        >
          <strong>💡 How to use:</strong>
          <ul style={{ margin: "0.5rem 0 0.5rem 1rem" }}>
            <li>Click and drag on the calendar to <b>create a shift</b>.</li>
            <li>Click an existing shift to <b>edit or delete</b> it.</li>
            <li>Use the <b>Day / Week / Month</b> buttons to change views.</li>
            <li>Navigate with the ⬅️ / 📅 Today / ➡️ buttons.</li>
          </ul>
          <button
            onClick={dismissHelp}
            style={{
              position: "absolute",
              top: 8,
              right: 10,
              border: "none",
              background: "none",
              color: "#053f5c",
              fontSize: "16px",
              cursor: "pointer",
            }}
            aria-label="Dismiss help"
          >
            ✖
          </button>
        </div>
      )}

      {/* Top Controls */}
      <div
        className="calendar-controls"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div className="calendar-nav" style={{ display: "flex", gap: 8 }}>
          <button onClick={goToPrev}>⬅️</button>
          <button onClick={goToToday}>📅 Today</button>
          <button onClick={goToNext}>➡️</button>
        </div>

        <div
          className="calendar-title"
          style={{ fontWeight: 600, color: "#053f5c" }}
        >
          {moment(currentDate).format(
            view === "month"
              ? "MMMM YYYY"
              : view === "week"
              ? "[Week of] MMM D, YYYY"
              : "MMMM D, YYYY"
          )}
        </div>

        <div className="calendar-view" style={{ display: "flex", gap: 8 }}>
          {["day", "week", "month"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                background: view === v ? "#053f5c" : "#f2f2f2",
                color: view === v ? "#fff" : "#053f5c",
                border: "none",
                padding: "6px 10px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        style={{
          height: 600,
          background: "#fff",
          borderRadius: 8,
          padding: "1rem",
        }}
        selectable
        date={currentDate}
        onNavigate={handleNavigate}
        defaultView={view}
        view={view}
        onView={(v) => setView(v)}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />

      {/* Modal for add/edit */}
      {(selectedRange || selectedEvent) && (
        <ShiftFormModal
          selectedRange={selectedRange}
          selectedEvent={selectedEvent}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ShiftCalendar;
