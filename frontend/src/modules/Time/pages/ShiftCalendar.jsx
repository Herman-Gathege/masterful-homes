import React, { useContext } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { AuthContext } from "../../../context/AuthContext";
import {
  useShifts,
  useCreateShift,
  useDeleteShift,
} from "../../../services/timeService";
import interactionPlugin from "@fullcalendar/interaction";

const ShiftCalendar = () => {
  const { user } = useContext(AuthContext);
  const { data: events = [], refetch } = useShifts(user?.tenant_id);
  const createShift = useCreateShift();
  const deleteShift = useDeleteShift();

  const handleDateClick = (arg) => {
    if (!user) return;
    const start = new Date(arg.date);
    const end = new Date(arg.date);
    end.setHours(17, 0, 0, 0);

    createShift.mutate(
      {
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      },
      { onSuccess: () => refetch() }
    );
  };

  const handleEventClick = (arg) => {
    if (window.confirm(`Delete shift ${arg.event.title}?`)) {
      deleteShift.mutate(arg.event.id, { onSuccess: () => refetch() });
    }
  };

  return (
    <div aria-label="Shift Calendar">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={events} // ✅ no more `.data`
      />
    </div>
  );
};

export default ShiftCalendar;
