import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChatList } from "../../api/chatApi";
import { getChatAuth } from "../../auth/chatAuthAdapter";
import HeaderBar from "../../components/Owner/common/HeaderBar";

export default function ChatList() {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  const { role, user } = getChatAuth();

  const basePath =
    role === "OWNER" ? "/owner/chat/" : "/student/chat/";

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      console.log("📥 Loading chat list");

      setLoading(true);
      const data = await getChatList();

      console.log("📥 Chats loaded:", data);

      setChats(data);
    } catch (e) {
      console.error("❌ Failed to load chat list", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-4 space-y-6 bg-light min-h-screen pb-10">

      {/* HEADER */}

      <HeaderBar
        title="Chats"
        subtitle="Conversations with students and owners"
        userAvatar={user?.avatar}
        userName={user?.firstName}
      />

      <section className="px-4 md:px-0 max-w-4xl mx-auto">

        {loading ? (
          <div className="bg-card-bg p-10 rounded-report shadow-custom border border-light text-center text-muted">
            Loading chats...
          </div>
        ) : chats.length === 0 ? (
          <div className="bg-card-bg p-10 rounded-report shadow-custom border border-light text-center text-muted">
            No chats yet
          </div>
        ) : (
          <div className="space-y-4">

            {chats.map((c) => (
              <div
                key={c.chatRoomId}
                onClick={() =>
                  navigate(`${basePath}${c.chatRoomId}`, {
                    state: { name: c.otherUserName },
                  })
                }
                className="
                bg-card-bg p-6 rounded-report shadow-custom border border-light
                hover:shadow-lg hover:-translate-y-[2px] transition-all duration-200
                cursor-pointer
                "
              >
                <div className="flex justify-between items-center">

                  <div>
                    <h3 className="text-primary font-black text-lg">
                      {c.otherUserName}
                    </h3>

                    <p className="text-muted text-sm mt-1">
                      {c.boardingTitle}
                    </p>

                    <p className="text-text text-sm mt-2 truncate">
                      {c.lastMessage || "No messages yet"}
                    </p>
                  </div>

                  {c.unreadCount > 0 && (
                    <div className="bg-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow">
                      {c.unreadCount}
                    </div>
                  )}

                </div>
              </div>
            ))}

          </div>
        )}
      </section>
    </div>
  );
}