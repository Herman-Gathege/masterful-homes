import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import axiosInstance from "../context/axiosInstance";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../css/TechnicianSchedule.css";
import enUS from "date-fns/locale/en-US";

const locales = { "en-US": enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

function TechnicianSchedule() {
  const [events, setEvents] = useState([]);
  const [resources, setResources] = useState([]);
  const [date, setDate] = useState(new Date());   // 👈 track current view date
  const [view, setView] = useState("month");      // 👈 track current view (month/week/day/agenda)

  const loadInstallations = async () => {
    try {
      const res = await axiosInstance.get("/installations");

      // Extract technicians (unique list for resources)
      const techs = Array.from(
        new Set(res.data.map((i) => i.technician_name || "Unassigned"))
      ).map((name) => ({
        id: name,
        title: name,
      }));
      setResources(techs);

      // Map installations into events
      const mapped = res.data
        .filter((i) => i.scheduled_date)
        .map((i) => ({
          id: i.id,
          title: `${i.customer_name} (${i.package_type})`,
          start: new Date(i.scheduled_date),
          end: i.end_date ? new Date(i.end_date) : new Date(i.scheduled_date),
          resourceId: i.technician_name || "Unassigned",
        }));

      setEvents(mapped);
    } catch (err) {
      console.error("Failed to fetch installations", err);
    }
  };

  useEffect(() => {
    loadInstallations();
  }, []);

  const moveEvent = async ({ event, start, end }) => {
    try {
      await axiosInstance.put(`/installations/${event.id}`, {
        scheduled_date: start.toISOString(),
        end_date: end.toISOString(),
      });
      setEvents(events.map((e) => (e.id === event.id ? { ...e, start, end } : e)));
    } catch (err) {
      console.error("Failed to update schedule", err);
    }
  };

  return (
    <div className="schedule-container">
      <h3>Technician Scheduling</h3>
      <Calendar
        localizer={localizer}
        events={events}
        resources={resources}
        resourceIdAccessor="id"
        resourceTitleAccessor="title"
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        resizable
        draggableAccessor={() => true}
        onEventDrop={moveEvent}
        onEventResize={moveEvent}
        date={date}                     // 👈 controlled date
        view={view}                     // 👈 controlled view
        onNavigate={(newDate) => setDate(newDate)}   // 👈 handle prev/next/today
        onView={(newView) => setView(newView)}       // 👈 handle view switch
        defaultView="month"
        views={["month", "week", "day", "agenda"]}
        toolbar={true}
      />
    </div>
  );
}
export default TechnicianSchedule;