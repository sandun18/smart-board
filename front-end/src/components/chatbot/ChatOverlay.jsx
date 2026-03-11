import { useState } from "react";
import FloatingChatButton from "./FloatingChatButton";
import ChatModal from "./ChatModal";

export default function ChatOverlay() {

  const [open, setOpen] = useState(false);

  return (
    <>
      <FloatingChatButton onClick={() => setOpen(true)} />

      <ChatModal
        visible={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}