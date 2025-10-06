// frontend/src/modules/Notifications/pages/NotificationDrawer.jsx
import React, { useEffect, useState, useRef } from "react";
import useNotificationStore from "../../../store/notificationStore";
import "../../../css/NotificationsDrawer.css";

function NotificationDrawer({ visible, onClose }) {
  const {
    notifications,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
    loading,
    hasMore,
  } = useNotificationStore();

  

  const [offset, setOffset] = useState(0);
  const limit = 10;
  const scrollRef = useRef(null);

  // Load notifications only when drawer opens
  useEffect(() => {
    if (visible) {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Skipping notifications fetch — user not authenticated");
        return;
      }
      loadNotifications(limit, 0);
      setOffset(0);
    }
  }, [visible, loadNotifications]);

  if (!visible) return null;

  const handleLoadMore = async () => {
    if (!hasMore || loading) return;
    const newOffset = offset + limit;
    await loadNotifications(limit, newOffset, true); // 👈 append results
  };

  // Auto-load more when scrolled to bottom
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 30 && !loading) {
      handleLoadMore();
    }
  };

  return (
    <div className="notifications-drawer">
      <div className="drawer-header">
        <h5>Notifications</h5>
        {unreadCount > 0 && !loading && (
          <button onClick={markAllAsRead} className="mark-all">
            Mark all as read
          </button>
        )}
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : notifications.length > 0 ? (
        <div
          className="notifications-scroll"
          ref={scrollRef}
          onScroll={handleScroll}
        >
          <ul>
            {notifications.map((n) => (
              <li
                key={n.id}
                className={n.is_read ? "read" : "unread"}
                onClick={() => markAsRead(n.id)}
              >
                <div className="notif-message">{n.message}</div>
                <small>{new Date(n.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>

          <div className="load-more">
            <button onClick={handleLoadMore} disabled={!hasMore || loading}>
              {loading
                ? "Loading..."
                : hasMore
                ? "Load More"
                : "No more notifications"}
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-state">
          <i className="bi bi-bell-slash"></i>
          <p>No notifications yet</p>
        </div>
      )}
    </div>
  );
}

export default NotificationDrawer;
