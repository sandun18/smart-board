import api from "../../src/api/api";
import { getChatSessionId } from "../utils/chatbotSession";

export async function sendChatMessage(message) {

  const payload = {
    message,
    sessionId: getChatSessionId(),
  };

  const res = await api.post("/chatbot/chat", payload);

  return res.data;
}