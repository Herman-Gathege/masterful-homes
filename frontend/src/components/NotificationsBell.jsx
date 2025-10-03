// frontend/src/components/NotificationsBell.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import useNotificationStore from '../store/notificationStore';
import NotificationDrawer from '../modules/Notifications/pages/NotificationDrawer';
import '../css/NotificationsBell.css';

const NotificationsBell = () => {
  const { unreadCount, loading } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const handleToggle = () => setOpen(!open);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className="notifications-container" ref={containerRef}>
      <button className="bell-btn" onClick={handleToggle} aria-label="Toggle Notifications">
        <Bell size={22} />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        {loading && <span className="loading-icon">⏳</span>}
      </button>

      {/* Drawer is mounted here */}
      <NotificationDrawer visible={open} onClose={() => setOpen(false)} />
    </div>
  );
};

export default NotificationsBell;
