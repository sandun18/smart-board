import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChatList } from "../../api/chatApi";

export default function ChatList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getChatList();
      setChats(data);
    } catch (e) {
      console.error("❌ Failed to load chat list", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-400 flex items-center justify-center">
        Loading chats...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <h1 className="text-3xl font-extrabold mb-6">Chats</h1>

      <div className="space-y-4">
        {chats.map((c) => (
          <div
            key={c.chatRoomId}
            onClick={() =>
              navigate(`/student/chat/${c.chatRoomId}`, {
                state: { name: c.otherUserName },
              })
            }
            className="p-4 rounded-2xl border border-slate-800 bg-slate-950 cursor-pointer
                       hover:bg-slate-900 transition"
          >
            <div className="font-bold text-lg">
              {c.otherUserName}
            </div>
            <div className="text-sm text-slate-400">
              {c.boardingTitle}
            </div>
            <div className="text-sm text-slate-300 mt-1 truncate">
              {c.lastMessage || "No messages yet"}
            </div>
          </div>
        ))}

        {chats.length === 0 && (
          <p className="text-slate-400 text-center mt-10">
            No chats yet
          </p>
        )}
      </div>
    </div>
  );
}
