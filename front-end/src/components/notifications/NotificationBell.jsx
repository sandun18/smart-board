import { useState } from "react";
import { FaBell } from "react-icons/fa";

import useNotifications from "../../hooks/useNotifications";
import NotificationDropdown from "./NotificationDropdown";

export default function NotificationBell() {

  const {
    notifications,
    unread,
    reload,
    setUnread
  } = useNotifications();

  const [open, setOpen] = useState(false);

  return (

    <div className="relative">

      <button
        onClick={() => setOpen(!open)}
        className="relative text-xl text-primary"
      >
        <FaBell />

        {unread > 0 && (
          <span className="
          absolute
          -top-2
          -right-2
          bg-red-500
          text-white
          text-[10px]
          px-1.5
          rounded-full
          ">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <NotificationDropdown
          notifications={notifications}
          reload={reload}
          setUnread={setUnread}
        />
      )}

    </div>
  );
}