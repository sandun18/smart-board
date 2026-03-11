import api from "./api";

/**
 * GET /api/chats
 */
export const getChatList = async () => {
  const res = await api.get("/chats");
  console.log("📦 CHAT LIST:", res.data);
  return res.data;
};

/**
 * GET /api/chats/{roomId}/messages
 */
export const getMessages = async (roomId, page = 0, size = 50) => {
  const res = await api.get(
    `/chats/${roomId}/messages?page=${page}&size=${size}`
  );
  console.log("📦 MESSAGES:", res.data);
  return res.data;
};

/**
 * PATCH /api/chats/{roomId}/read
 */
export const markAsRead = async (roomId) => {
  await api.patch(`/chats/${roomId}/read`);
};
