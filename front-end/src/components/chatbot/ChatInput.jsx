import { useState } from "react";

export default function ChatInput({ onSend }) {

  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;

    onSend(text.trim());
    setText("");
  };

  return (
    <div className="flex gap-2 border-t border-light p-3 bg-card-bg">

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type a message..."
        className="
        flex-1
        bg-light
        border border-light
        rounded-full
        px-4 py-2
        text-sm
        focus:outline-none
        focus:border-accent
        "
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />

      <button
        onClick={submit}
        className="
        bg-accent text-white
        px-4 py-2
        rounded-full
        text-sm
        font-bold
        hover:opacity-90
        "
      >
        Send
      </button>

    </div>
  );
}