import { useState, useRef, useEffect } from "react";
import ChatInput from "./ChatInput";
import ChatMessageBubble from "./ChatMessageBubble";
import { sendChatMessage } from "../../services/chatbotApi";

export default function ChatModal({ visible, onClose }) {

  const [messages, setMessages] = useState([
    {
      id: "init",
      sender: "bot",
      text: "Hi! I am your BoardMate 🤖",
      explanation: "Ask me anything about boardings, payments, or rules.",
      confidence: 0.92
    }
  ]);

  const [loading, setLoading] = useState(false);

  const listRef = useRef();

  useEffect(() => {
    if (listRef.current)
      listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async (text) => {

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text
    };

    setMessages(prev => [...prev, userMsg]);

    setLoading(true);

    try {

      const res = await sendChatMessage(text);

      const botMsg = {
        id: Date.now() + "_bot",
        sender: "bot",
        text: res.reply,
        explanation: res.explanation,
        confidence: res.confidence,
        suggestions: res.suggestions || []
      };

      setMessages(prev => [...prev, botMsg]);

    } catch {

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + "_err",
          sender: "bot",
          text: "Sorry, I couldn't reach the assistant."
        }
      ]);

    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="
    fixed bottom-24 right-6
    w-[350px]
    h-[520px]
    bg-card-bg
    border border-light
    rounded-report
    shadow-custom
    flex flex-col
    z-[9999]
    ">

      {/* Header */}

      <div className="
      h-12
      flex items-center justify-between
      px-4
      border-b border-light
      bg-primary text-white
      rounded-t-report
      ">

        <span className="font-bold">BoardMate 🤖</span>

        <button onClick={onClose}>✕</button>

      </div>

      {/* Messages */}

      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-4"
      >

        {messages.map(msg => (
          <ChatMessageBubble
            key={msg.id}
            message={msg}
            onSuggestionPress={handleSend}
          />
        ))}

        {loading && (
          <div className="text-xs text-muted">
            Assistant is typing...
          </div>
        )}

      </div>

      <ChatInput onSend={handleSend} />

    </div>
  );
}