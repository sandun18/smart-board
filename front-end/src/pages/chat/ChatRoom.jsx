import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  connectChatSocket,
  sendMessage,
  disconnectChatSocket,
} from "../../api/chatSocket";
import { getMessages, markAsRead } from "../../api/chatApi";
import ChatInput from "../../components/chat/ChatInput";
import ChatBubble from "../../components/chat/ChatBubble";
import { getChatAuth } from "../../auth/chatAuthAdapter";

export default function ChatRoom() {

  const { roomId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = getChatAuth();

  const [messages, setMessages] = useState([]);
  const [wsReady, setWsReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const listRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {

        console.log("🔄 INIT CHAT ROOM:", roomId);

        const data = await getMessages(roomId);

        if (!mounted) return;

        setMessages(data.content.reverse());

        await markAsRead(roomId);

        await connectChatSocket({
          roomId,
          onMessage: (msg) => {
            console.log("📨 Incoming message:", msg);
            setMessages((prev) => [...prev, msg]);
          },
          onConnected: setWsReady,
        });

      } catch (err) {
        console.error("❌ Chat init failed", err);
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;
      disconnectChatSocket();
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

  if (loading) {
    return (
      <div className="bg-light min-h-screen flex items-center justify-center text-muted">
        Loading chat...
      </div>
    );
  }

  return (
    <div className="pt-4 bg-light min-h-screen flex flex-col">

      {/* HEADER */}

      <div className="
        bg-card-bg
        border border-light
        shadow-custom
        rounded-report
        mx-4 mb-4
        px-6 py-4
        flex items-center gap-4
      ">

        <button
          onClick={() => navigate(-1)}
          className="text-primary font-black"
        >
          ←
        </button>

        <h2 className="font-black text-primary text-lg">
          {state?.name || "Chat"}
        </h2>

      </div>

      {/* CHAT BODY */}

      <div className="flex-1 px-4">

        <div
          ref={listRef}
          className="
          bg-card-bg
          border border-light
          shadow-custom
          rounded-report
          p-6
          h-[65vh]
          overflow-y-auto
          space-y-3
        "
        >

          {messages.map((msg) => {
            const isMe = msg.senderId === user.id;

            return (
              <ChatBubble
                key={msg.id}
                message={msg}
                isMe={isMe}
              />
            );
          })}

        </div>

      </div>

      {/* INPUT */}

      <div className="px-4 pb-6 pt-4">
        <ChatInput onSend={handleSend} disabled={!wsReady} />
      </div>

    </div>
  );
}