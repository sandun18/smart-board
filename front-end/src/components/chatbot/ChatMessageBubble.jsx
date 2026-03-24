import SuggestedReplyButtons from "./SuggestedReplyButtons";

export default function ChatMessageBubble({ message, onSuggestionPress }) {

  const isUser = message.sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>

      <div
        className={`
        max-w-[75%]
        px-4 py-2
        text-sm
        rounded-xl
        shadow-sm
        ${
          isUser
            ? "bg-accent text-white"
            : "bg-light border border-light text-text"
        }
        `}
      >

        {message.text}

        {message.explanation && !isUser && (
          <div className="text-xs text-muted mt-2 italic">
            {message.explanation}
          </div>
        )}

        {message.confidence != null && !isUser && (
          <div className="text-[11px] text-muted mt-1">
            Confidence {(message.confidence * 100).toFixed(0)}%
          </div>
        )}

        {!isUser && (
          <SuggestedReplyButtons
            suggestions={message.suggestions}
            onSelect={onSuggestionPress}
          />
        )}

      </div>

    </div>
  );
}