import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/* ===============================
   BUILD WS URL FROM ENV
   =============================== */

// Example:
// VITE_API_BASE = http://localhost:8086/api
// RESULT        = http://localhost:8086/ws
const API_BASE = import.meta.env.VITE_API_BASE;

// remove trailing /api if exists
const WS_BASE = API_BASE.replace(/\/api\/?$/, "");

const WS_URL = `${WS_BASE}/ws`;

console.log("🔗 WS URL =", WS_URL);

/* ===============================
   SOCKET STATE
   =============================== */

let client = null;
let subscription = null;
let isConnected = false;
let connectedRoomId = null;

/* ===============================
   CONNECT
   =============================== */

export const connectChatSocket = async ({
  roomId,
  onMessage,
  onConnected,
}) => {
  // already connected to same room
  if (isConnected && connectedRoomId === roomId) {
    return;
  }

  // connected to another room
  if (isConnected && connectedRoomId !== roomId) {
    disconnectChatSocket();
  }

  const token = localStorage.getItem("token");
  if (!token) return;

  connectedRoomId = roomId;

  client = new Client({
    webSocketFactory: () => new SockJS(WS_URL),

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,

    debug: (msg) => console.log("🧵 STOMP:", msg),

    onConnect: () => {
      console.log("✅ STOMP CONNECTED");
      isConnected = true;
      onConnected?.(true);

      subscription = client.subscribe(
        `/topic/chat/${roomId}`,
        (frame) => {
          try {
            onMessage(JSON.parse(frame.body));
          } catch (e) {
            console.error("❌ WS parse error", e);
          }
        }
      );
    },

    onDisconnect: () => {
      console.warn("🟠 STOMP DISCONNECTED");
      isConnected = false;
      connectedRoomId = null;
      onConnected?.(false);
    },

    onStompError: (frame) => {
      console.error("❌ STOMP ERROR:", frame.headers["message"]);
      console.error(frame.body);
    },
  });

  client.activate();
};

/* ===============================
   SEND MESSAGE
   =============================== */

export const sendMessage = (payload) => {
  if (!client || !isConnected) return;

  client.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(payload),
  });
};

/* ===============================
   DISCONNECT
   =============================== */

export const disconnectChatSocket = () => {
  if (subscription) subscription.unsubscribe();
  if (client) client.deactivate();

  subscription = null;
  client = null;
  isConnected = false;
  connectedRoomId = null;
};
