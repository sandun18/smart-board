import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { connectChatSocket, sendMessage } from "../../api/chatSocket";
import { getMessages, markAsRead } from "../../api/chatApi";
import ChatInput from "../../components/chat/ChatInput";
import { getChatAuth } from "../../auth/chatAuthAdapter";

export default function ChatRoom() {
  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = getChatAuth();

  const [messages, setMessages] = useState([]);
  const [wsReady, setWsReady] = useState(false);

  const listRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    console.log("🔄 INIT CHAT ROOM:", roomId);

    let active = true;

    const init = async () => {
      const data = await getMessages(roomId);
      if (!active) return;

      setMessages(data.content.reverse());
      await markAsRead(roomId);

      connectChatSocket({
        roomId,
        onMessage: (msg) => {
          if (!active) return;
          setMessages((prev) => [...prev, msg]);
        },
        onConnected: setWsReady,
      });
    };

    init();

    // ❌ DO NOT DISCONNECT SOCKET HERE
    return () => {
      active = false;
      console.log("🧹 CHAT ROOM CLEANUP (UI only):", roomId);
    };
  }, [roomId]);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = (text) => {
    sendMessage({
      chatRoomId: Number(roomId),
      content: text,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100">
      <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-800">
        <button onClick={() => navigate(-1)}>←</button>
        <span className="font-bold truncate">
          {state?.name || "Chat"}
        </span>
      </div>

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-3 py-4 space-y-2"
      >
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;

          return (
            <div
              key={msg.id}
              className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${
                isMe
                  ? "ml-auto bg-blue-600 rounded-br-md"
                  : "mr-auto bg-slate-800 rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          );
        })}
      </div>

      <ChatInput onSend={handleSend} disabled={!wsReady} />
    </div>
  );
}
