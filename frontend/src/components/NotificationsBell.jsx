import React, { useEffect, useRef, useState } from "react";
import useNotificationStore from "../store/notificationStore";
import "../css/NotificationsBell.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

function NotificationsBell() {
  const { unread, items, refreshUnread, loadNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const handleOpen = () => {
    setOpen(!open);
    if (!open) loadNotifications();
  };

  // Close on outside click
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

  // Auto refresh unread every 30s
  useEffect(() => {
    refreshUnread();
    const interval = setInterval(refreshUnread, 30000);
    return () => clearInterval(interval);
  }, [refreshUnread]);

  return (
    <div className="notifications-container" ref={containerRef}>
      <button className="bell-btn" onClick={handleOpen}>
        <FontAwesomeIcon icon={faBell} size="lg" />
        {unread > 0 && <span className="badge">{unread}</span>}
      </button>

      {open && (
        <div className="dropdown">
          <div className="dropdown-header">
            <span>Notifications</span>
            {unread > 0 && (
              <button className="mark-all" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>

          <ul className="notif-list">
            {items.length > 0 ? (
              items.map((n) => (
                <li
                  key={n.id}
                  className={`notif-item ${n.is_read ? "read" : "unread"}`}
                  onClick={() => markAsRead(n.id)}
                >
                  <p>{n.message}</p>
                  <small>{new Date(n.created_at).toLocaleString()}</small>
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
}

export default NotificationsBell;
