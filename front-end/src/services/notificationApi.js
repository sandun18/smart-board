import api from "../api/api";

export const getNotifications = async () => {
  const res = await api.get("/notifications");
  return res.data;
};

export const getUnreadCount = async () => {
  const res = await api.get("/notifications/unread-count");
  return res.data;
};

export const markAsRead = async (id) => {
  await api.put(`/notifications/${id}/read`);
};

export const markAllRead = async () => {
  await api.put(`/notifications/read-all`);
};