import React, {
  useState,
  useContext,
  useMemo,
  useEffect,
  Suspense,
} from "react";
import moment from "moment";
import { AuthContext } from "../../../context/AuthContext";
import { useShifts } from "../../../services/timeService";
import { useQueryClient } from "@tanstack/react-query";
import ShiftFormModal from "./ShiftFormModal";
import { toast } from "../../../utils/toast";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Lazy-load heavy calendar library for faster initial load
const Calendar = React.lazy(() =>
  import("react-big-calendar").then((mod) => ({
    default: mod.Calendar,
  }))
);
const { momentLocalizer } = await import("react-big-calendar");
const localizer = momentLocalizer(moment);

const ShiftCalendar = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [view, setView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [visibleRange, setVisibleRange] = useState(() => ({
    start: moment().startOf("month").toISOString(),
    end: moment().endOf("month").toISOString(),
  }));

  // ✅ Fetch shifts only for visible range
  const { data: events = [], isLoading, refetch } = useShifts(
    user?.tenant_id,
    visibleRange.start,
    visibleRange.end
  );

  /* ---------------------------
     Compute visible range (debounced)
  ---------------------------- */
  useEffect(() => {
    const timeout = setTimeout(() => {
      const start = moment(currentDate).startOf(view).toISOString();
      const end = moment(currentDate).endOf(view).toISOString();
      setVisibleRange({ start, end });
    }, 200);
    return () => clearTimeout(timeout);
  }, [view, currentDate]);

  /* ---------------------------
     Prefetch next/previous views
  ---------------------------- */
  const prefetchShifts = (direction) => {
    if (!user?.tenant_id) return;
    const nextStart = moment(currentDate)
      [direction === "next" ? "add" : "subtract"](1, view)
      .startOf(view)
      .toISOString();
    const nextEnd = moment(currentDate)
      [direction === "next" ? "add" : "subtract"](1, view)
      .endOf(view)
      .toISOString();

    queryClient.prefetchQuery(["shifts", user.tenant_id, nextStart, nextEnd], {
      queryFn: async () => {
        const params = {
          tenant_id: user.tenant_id,
          start_date: nextStart,
          end_date: nextEnd,
        };
        const res = await fetch(`/api/time/shifts?${new URLSearchParams(params)}`);
        const json = await res.json();
        return json.data ?? [];
      },
    });
  };

  /* ---------------------------
     Memoized calendar events
  ---------------------------- */
  const calendarEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    return events.map((e) => ({
      id: e.id,
      title: e.title || e.description || "Shift",
      start: new Date(e.start),
      end: new Date(e.end),
    }));
  }, [events]);

  /* ---------------------------
     Help tooltip logic
  ---------------------------- */
  useEffect(() => {
    const seen = localStorage.getItem("seenShiftHelp");
    setShowHelp(!seen);
  }, []);

  const dismissHelp = () => {
    localStorage.setItem("seenShiftHelp", "true");
    setShowHelp(false);
  };

  /* ---------------------------
     Permissions & handlers
  ---------------------------- */
  const canManageShifts = ["manager", "admin"].includes(
    user?.role?.toLowerCase()
  );

  const handleSelectSlot = ({ start, end }) => {
    if (!canManageShifts)
      return toast.error("You don't have permission to create shifts");
    if (!user) return;
    if (!end || start >= end) end = moment(start).add(8, "hours").toDate();
    setSelectedRange({ start, end });
  };

  const handleSelectEvent = (event) => {
    if (!canManageShifts)
      return toast.error("You don't have permission to edit shifts");
    setSelectedEvent(event);
  };

  const handleCloseModal = (didUpdate = false) => {
    setSelectedRange(null);
    setSelectedEvent(null);
    if (didUpdate) refetch();
  };

  const handleNavigate = (date, direction) => {
    if (direction) prefetchShifts(direction);
    setCurrentDate(date);
  };

  /* ---------------------------
     UI
  ---------------------------- */
  if (isLoading) return <div>⏳ Loading shifts...</div>;

  return (
    <div className="shift-calendar" style={{ position: "relative" }}>
      {/* 💡 Hint Button */}
      {!showHelp && (
        <button
          onClick={() => setShowHelp(true)}
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

      {/* 🧭 Help Tooltip */}
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
            <li>Click and drag to <b>create a shift</b>.</li>
            <li>Click an existing shift to <b>edit or delete</b> it.</li>
            <li>Use <b>Day / Week / Month</b> views or the navigation arrows.</li>
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
          >
            ✖
          </button>
        </div>
      )}

      {/* 🔹 Calendar Controls */}
      <div
        className="calendar-controls"
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              prefetchShifts("prev");
              setCurrentDate(moment(currentDate).subtract(1, view).toDate());
            }}
          >
            ⬅️
          </button>
          <button onClick={() => setCurrentDate(new Date())}>📅 Today</button>
          <button
            onClick={() => {
              prefetchShifts("next");
              setCurrentDate(moment(currentDate).add(1, view).toDate());
            }}
          >
            ➡️
          </button>
        </div>

        <div style={{ fontWeight: 600, color: "#053f5c" }}>
          {moment(currentDate).format(
            view === "month" ? "MMMM YYYY" : "MMM D, YYYY"
          )}
        </div>

        <div style={{ display: "flex", gap: 8 }}>
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

      {/* 📅 Lazy Calendar */}
      <Suspense fallback={<div>⏳ Loading calendar...</div>}>
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          view={view}
          onView={setView}
          onNavigate={handleNavigate}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          style={{
            height: 600,
            background: "#fff",
            borderRadius: 8,
            padding: "1rem",
          }}
        />
      </Suspense>

      {/* Modal */}
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

export default React.memo(ShiftCalendar);
