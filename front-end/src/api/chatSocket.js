import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

/* ===============================
   BUILD WS URL
================================ */

const API_BASE = import.meta.env.VITE_API_BASE;
const WS_BASE = API_BASE.replace(/\/api\/?$/, "");
const WS_URL = `${WS_BASE}/ws`;

console.log("🔥 CHAT SOCKET FILE LOADED");
console.log("🔗 WS URL =", WS_URL);

/* ===============================
   SOCKET STATE
================================ */

let client = null;
let subscription = null;
let isConnected = false;
let connectedRoomId = null;

/* ===============================
   CONNECT
================================ */

export const connectChatSocket = async ({
  roomId,
  onMessage,
  onConnected,
}) => {
  console.log("🟡 connectChatSocket CALLED for room:", roomId);

  const token = localStorage.getItem("token");

  console.log("🟡 WS TOKEN =", token ? "FOUND" : "MISSING");

  if (!token) {
    console.warn("❌ No JWT token for WS");
    return;
  }

  // destroy old client
  if (client) {
    console.log("🟠 Existing WS client → deactivating");
    try {
      client.deactivate();
    } catch (e) {}
  }

  connectedRoomId = roomId;

  client = new Client({
    webSocketFactory: () => {
      console.log("🟢 Creating SockJS connection");
      return new SockJS(WS_URL);
    },

    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },

    reconnectDelay: 5000,
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    connectionTimeout: 10000,

    debug: (msg) => console.log("🧵 STOMP:", msg),

    onConnect: () => {
      console.log("✅ STOMP CONNECTED");

      isConnected = true;
      onConnected?.(true);

      console.log("🔔 Subscribing → /topic/chat/" + roomId);

      subscription = client.subscribe(
        `/topic/chat/${roomId}`,
        (frame) => {
          console.log("📩 RAW WS FRAME:", frame.body);

          try {
            const payload = JSON.parse(frame.body);
            console.log("📩 WS MESSAGE PARSED:", payload);
            onMessage?.(payload);
          } catch (err) {
            console.error("❌ Failed to parse WS message", err);
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

    onWebSocketClose: () => {
      console.warn("🔴 WS CLOSED");
      isConnected = false;
      connectedRoomId = null;
      onConnected?.(false);
    },

    onStompError: (frame) => {
      console.error("❌ STOMP ERROR:", frame.headers["message"]);
      console.error(frame.body);
    },
  });

  console.log("🚀 Activating STOMP client");
  client.activate();
};

/* ===============================
   SEND MESSAGE
================================ */

export const sendMessage = (payload) => {
  console.log("➡️ sendMessage CALLED", payload);

  if (!client || !isConnected) {
    console.warn("❌ WS not connected — cannot send");
    return;
  }

  console.log("🚀 WS SEND → /app/chat.send");

  client.publish({
    destination: "/app/chat.send",
    body: JSON.stringify(payload),
  });
};

/* ===============================
   DISCONNECT
================================ */

export const disconnectChatSocket = () => {
  console.log("🛑 disconnectChatSocket CALLED");

  if (subscription) {
    subscription.unsubscribe();
    subscription = null;
  }

  if (client) {
    client.deactivate();
    client = null;
  }

  isConnected = false;
  connectedRoomId = null;
};