//frontend/src/modules/Time/pages/ClockWidget.jsx
import React, { useEffect, useContext } from 'react';
import useTimeStore from '../../../store/timeStore';
import { AuthContext } from '../../../context/AuthContext';
import { useClockIn, useClockOut, useCurrentStatus } from '../../../services/timeService';

const ClockWidget = () => {
  const { user } = useContext(AuthContext); // 👈 get logged in user
  const { data: status, refetch } = useCurrentStatus();
  const clockIn = useClockIn();
  const clockOut = useClockOut();
  const { setClockStatus, clockStatus } = useTimeStore();

  useEffect(() => {
    if (status?.data) {
      setClockStatus(status.data);
    }
  }, [status, setClockStatus]);

  const handleClockIn = () => {
    if (!user) return;
    clockIn.mutate(
      {
        user_id: user.id,
        tenant_id: user.tenant_id,
        start_time: new Date().toISOString(),
      },
      { onSuccess: () => refetch() }
    );
  };

  const handleClockOut = () => {
    if (!user) return;
    clockOut.mutate(
      {
        user_id: user.id,
        end_time: new Date().toISOString(),
      },
      { onSuccess: () => refetch() }
    );
  };

  return (
    <div aria-label="Clock Widget" className="clock-widget">
      <p>
        Status:{' '}
        {clockStatus.is_clocked_in
          ? `Clocked In (${clockStatus.elapsed_hours.toFixed(1)}h)`
          : 'Clocked Out'}
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
