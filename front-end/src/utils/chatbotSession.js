const SESSION_KEY = "SBMS_CHAT_SESSION_ID";

export function getChatSessionId() {

  let session = localStorage.getItem(SESSION_KEY);

  if (!session) {
    session = `session_${Date.now()}`;
    localStorage.setItem(SESSION_KEY, session);
  }

  return session;
}