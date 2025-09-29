import React, { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import useNotificationStore from "../store/notificationStore";
import "../css/NotificationsBell.css";

const NotificationsBell = () => {
  const {
    notifications,
    unreadCount,
    loadNotifications,
    refreshUnread,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const handleToggle = () => {
    setOpen(!open);
    if (!open) loadNotifications();
  };

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // Auto refresh unread count every 30s
  useEffect(() => {
    refreshUnread();
    const interval = setInterval(refreshUnread, 30_000);
    return () => clearInterval(interval);
  }, [refreshUnread]);

  // Relative time formatter
  const timeAgo = (dateString) => {
    const diff = (Date.now() - new Date(dateString)) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="notifications-container" ref={containerRef}>
      <button className="bell-btn" onClick={handleToggle}>
        <Bell size={22} />
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="dropdown">
          <div className="dropdown-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className="mark-all" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <ul className="notif-list">
            {notifications.length > 0 ? (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className={`notif-item ${n.is_read ? "read" : "unread"}`}
                  onClick={() => markAsRead(n.id)}
                >
                  <p className="mb-1">{n.message}</p>
                  <small className="text-muted">{timeAgo(n.created_at)}</small>
                </li>
              ))
            ) : (
              <li className="empty">No notifications</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;
