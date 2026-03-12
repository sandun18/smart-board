import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const submit = () => {
    if (!text.trim()) return;

    onSend(text);
    setText("");
  };

  return (
    <div className="
      bg-card-bg
      border border-light
      shadow-custom
      rounded-report
      px-4 py-3
      flex items-center gap-3
    ">

      {/* INPUT */}

      <input
        className="
        flex-1
        bg-light
        border border-light
        rounded-full
        px-4 py-2
        text-text
        placeholder:text-muted
        focus:outline-none
        focus:border-accent
        focus:ring-1
        focus:ring-accent/30
        transition-all
        "
        value={text}
        disabled={disabled}
        placeholder={disabled ? "Connecting..." : "Type a message..."}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
      />

      {/* SEND BUTTON */}

      <button
        onClick={submit}
        disabled={disabled}
        className={`
        flex items-center justify-center
        w-10 h-10
        rounded-full
        shadow-md
        transition-all
        ${
          disabled
            ? "bg-muted cursor-not-allowed"
            : "bg-accent hover:shadow-lg hover:-translate-y-[1px] active:scale-95"
        }
        text-white
        `}
      >
        <FaPaperPlane className="text-sm" />
      </button>

    </div>
  );
}