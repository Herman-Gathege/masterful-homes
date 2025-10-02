// frontend/src/context/NotificationContexts.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { getUnreadCount } from "../services/notificationsService";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [unread, setUnread] = useState(0);

  const refreshUnread = async () => {
    try {
      const count = await getUnreadCount();
      setUnread(count);
    } catch (err) {
      console.error("❌ Failed to fetch unread count", err);
    }
  };

  // useEffect(() => {
  //   refreshUnread();
  //   const interval = setInterval(refreshUnread, 30000); // refresh every 30s
  //   return () => clearInterval(interval);
  // }, []);

  return (
    <NotificationContext.Provider value={{ unread, refreshUnread }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
