//frontend/src/modules/Notifications/pages/NotificationDrawer.jsx
import React, { useEffect } from 'react';
import useNotificationStore from '../../../store/notificationStore';
import { useMarkNotificationAsRead, useMarkAllAsRead } from '../../../services/timeService';
import '../../../css/NotificationsDrawer.css';

function NotificationDrawer() {
  const { notifications, loadNotifications, markAsRead, markAllAsRead, unreadCount, loading } = useNotificationStore();
  const markReadMutation = useMarkNotificationAsRead();
  const markAllMutation = useMarkAllAsRead();

  useEffect(() => {
    if (!loading) loadNotifications();
  }, [loadNotifications, loading]);

  return (
    <div className="notifications-drawer">
      <div className="drawer-header">
        <h5>Notifications</h5>
        {unreadCount > 0 && !loading && <button onClick={() => markAllMutation.mutate()}>Mark all as read</button>}
      </div>
      {loading ? (
        <div className="loading-state"><div className="skeleton"></div></div>
      ) : notifications.length > 0 ? (
        <ul>
          {notifications.map((n) => (
            <li key={n.id} className={n.is_read ? 'read' : 'unread'} onClick={() => markReadMutation.mutate(n.id)}>
              <div>{n.message}</div><small>{new Date(n.created_at).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state"><i className="bi bi-bell-slash"></i><p>No notifications yet</p></div>
      )}
    </div>
  );
}

export default NotificationDrawer;