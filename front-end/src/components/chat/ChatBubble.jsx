export default function ChatBubble({ message, isMe }) {
  return (
    <div className={`bubble ${isMe ? "me" : "other"}`}>
      {message.content}
    </div>
  );
}
