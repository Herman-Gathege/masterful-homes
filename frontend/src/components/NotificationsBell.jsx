import React, { useEffect, useState } from "react";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "../services/notificationsService";
import { useNotifications } from "../context/NotificationContext";
import "../css/NotificationsBell.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

function NotificationsBell() {
  const { unread, refreshUnread } = useNotifications();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setItems(data.items);
    } catch (err) {
      console.error("❌ Failed to load notifications", err);
    }
  };

  const handleOpen = () => {
    setOpen(!open);
    if (!open) loadNotifications();
  };

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
    refreshUnread();
    loadNotifications();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    refreshUnread();
    loadNotifications();
  };

  return (
    <div className="notifications-container">
      <button className="bell-btn" onClick={handleOpen}>
        <FontAwesomeIcon icon={faBell} size="lg" />
        {unread > 0 && <span className="badge">{unread}</span>}
      </button>

      {open && (
        <div className="dropdown">
          <div className="dropdown-header">
            <span>Notifications</span>
            {unread > 0 && (
              <button className="mark-all" onClick={handleMarkAllAsRead}>
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
                  onClick={() => handleMarkAsRead(n.id)}
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
