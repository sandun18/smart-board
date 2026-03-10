/**
 * Universal Auth Adapter for Chat / WebSocket
 * -------------------------------------------
 * Works with BOTH StudentAuthContext & OwnerAuthContext
 * WITHOUT changing existing app architecture.
 */

export const getChatAuth = () => {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user_data");

  if (!token || !userRaw) {
    return {
      isAuthenticated: false,
      token: null,
      user: null,
      role: null,
    };
  }

  try {
    const user = JSON.parse(userRaw);

    return {
      isAuthenticated: true,
      token,
      user,
      role: user.role, // "STUDENT" | "OWNER"
    };
  } catch (e) {
    console.error("❌ Failed to parse user_data for chat", e);
    return {
      isAuthenticated: false,
      token: null,
      user: null,
      role: null,
    };
  }
};
