export default function ChatBubble({ message, isMe }) {

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>

      <div
        className={`
        max-w-[70%]
        px-4 py-2
        text-sm
        leading-relaxed
        rounded-xl
        shadow-sm
        transition-all
        ${
          isMe
            ? "bg-accent text-white rounded-br-sm"
            : "bg-light border border-light text-text rounded-bl-sm"
        }
        `}
      >

        {message.content}

      </div>

    </div>
  );
}