// frontend/src/modules/Notifications/pages/NotificationDrawer.jsx
import React, { useEffect } from 'react';
import useNotificationStore from '../../../store/notificationStore';
import '../../../css/NotificationsDrawer.css';

function NotificationDrawer({ visible, onClose }) {
  const {
    notifications,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
    loading,
  } = useNotificationStore();

  useEffect(() => {
    if (visible) loadNotifications(); // only load when opened
  }, [visible, loadNotifications]);

  if (!visible) return null; // 👈 don't render unless open

  return (
    <div className="notifications-drawer">
      <div className="drawer-header">
        <h5>Notifications</h5>
        {unreadCount > 0 && !loading && (
          <button onClick={markAllAsRead}>Mark all as read</button>
        )}
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="skeleton"></div>
        </div>
      ) : notifications.length > 0 ? (
        <ul>
          {notifications.map((n) => (
            <li
              key={n.id}
              className={n.is_read ? 'read' : 'unread'}
              onClick={() => markAsRead(n.id)}
            >
              <div>{n.message}</div>
              <small>{new Date(n.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
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
