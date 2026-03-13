import { useState } from "react";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="chat-input">
      <input
        value={text}
        disabled={disabled}
        placeholder="Type a message"
        onChange={e => setText(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
      />
      <button onClick={submit} disabled={disabled}>
        Send
      </button>
    </div>
  );
}
