import React, { useEffect, useContext } from "react";
import useTimeStore from "../../../store/timeStore";
import { AuthContext } from "../../../context/AuthContext";
import {
  useClockIn,
  useClockOut,
  useCurrentStatus,
} from "../../../services/timeService";

const ClockWidget = () => {
  const { user } = useContext(AuthContext);
  const { data: status, refetch } = useCurrentStatus(user?.tenant_id);
  const clockIn = useClockIn();
  const clockOut = useClockOut();
  const { setClockStatus, clockStatus } = useTimeStore();

  useEffect(() => {
    if (status) {
      setClockStatus(status); // ✅ already unwrapped in service
    }
  }, [status, setClockStatus]);

  const handleClockIn = () => {
    if (!user) return;
    clockIn.mutate(
      { start_time: new Date().toISOString() }, // ✅ only start_time
      { onSuccess: () => refetch() }
    );
  };

  const handleClockOut = () => {
    if (!user) return;
    clockOut.mutate(
      { end_time: new Date().toISOString() }, // ✅ only end_time
      { onSuccess: () => refetch() }
    );
  };

  return (
    <div aria-label="Clock Widget" className="clock-widget">
      <p>
        Status:{" "}
        {clockStatus.is_clocked_in
          ? `Clocked In (${clockStatus.current_entry?.elapsed_hours.toFixed(1)}h)`
          : "Clocked Out"}
      </p>

      {clockStatus.is_clocked_in ? (
        <button onClick={handleClockOut} aria-label="Clock Out">
          Clock Out
        </button>
      ) : (
        <button onClick={handleClockIn} aria-label="Clock In">
          Clock In
        </button>
      )}
    </div>
  );
};

export default ClockWidget;
