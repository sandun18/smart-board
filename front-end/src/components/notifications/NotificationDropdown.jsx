import {
  markAsRead,
  markAllRead
} from "../../services/notificationApi";

export default function NotificationDropdown({
  notifications,
  reload,
  setUnread
}) {

  const handleRead = async (id) => {
    await markAsRead(id);
    reload();
  };

  const handleReadAll = async () => {
    await markAllRead();
    setUnread(0);
    reload();
  };

  return (
    <div className="
    absolute
    right-0
    mt-3
    w-[360px]
    max-h-[420px]
    overflow-y-auto
    bg-card-bg
    border border-light
    rounded-xl
    shadow-xl
    z-50
    ">

      <div className="flex justify-between items-center p-4 border-b border-light">
        <h3 className="font-bold text-primary">Notifications</h3>

        <button
          onClick={handleReadAll}
          className="text-xs text-accent font-semibold"
        >
          Mark all read
        </button>
      </div>

      {notifications.length === 0 && (
        <p className="p-6 text-center text-muted">
          No notifications
        </p>
      )}

      {notifications.map((n) => (

        <div
          key={n.notificationId}
          onClick={() => handleRead(n.notificationId)}
          className={`
          p-4 border-b border-light cursor-pointer
          hover:bg-light
          ${!n.read ? "bg-yellow-50" : ""}
          `}
        >

          <p className="font-semibold text-sm">
            {n.title}
          </p>

          <p className="text-xs text-muted mt-1">
            {n.message}
          </p>

          <p className="text-[10px] text-gray-400 mt-2">
            {new Date(n.createdAt).toLocaleString()}
          </p>

        </div>
      ))}

    </div>
  );
}