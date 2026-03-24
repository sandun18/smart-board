import { useEffect, useState } from "react";
import {
  getNotifications,
  getUnreadCount,
} from "../services/notificationApi";

export default function useNotifications() {

  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.log("load notifications error", err);
    }
  };

  const loadUnread = async () => {
    try {
      const count = await getUnreadCount();
      setUnread(count);
    } catch {}
  };

  useEffect(() => {

    loadNotifications();
    loadUnread();

    const interval = setInterval(() => {
      loadUnread();
    }, 10000); // refresh every 10s

    return () => clearInterval(interval);

  }, []);

  return {
    notifications,
    unread,
    reload: loadNotifications,
    setNotifications,
    setUnread,
  };
}