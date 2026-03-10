import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../api/api";
import AdminService from "../../api/admin/AdminService";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Check for logged-in user on load
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user_data");

      if (token && savedUser) {
        try {
          const user = JSON.parse(savedUser);

          // 🔒 Security Check: Ensure the saved user is an ADMIN
          if (user.role === "ADMIN") {
            setCurrentUser(user);
            setIsAuthenticated(true);
          } else {
            localStorage.clear();
          }
        } catch (e) {
          console.error("Failed to parse user data", e);
          localStorage.clear();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // 2. Login
  const login = async (email, password) => {
    try {
      const response = await api.post(
        "/auth/login",
        { email, password },
        {
          headers: {
            Authorization: undefined,
          },
        }
      );
      const { token, refreshToken, user } = response.data;

      if (user.role !== "ADMIN") {
        return {
          success: false,
          message:
            "Access Denied: This account is not registered as an Admin.",
        };
      }

      localStorage.setItem("token", token);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_data", JSON.stringify(user));

      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Login Error:", error);
      const msg =
        error.response?.status === 401 ? "Invalid credentials" : "Login failed";
      return { success: false, message: msg };
    }
  };

  // 3. Signup Step 1: Request OTP
  const signup = async (userData) => {
    try {
      const payload = {
        ...userData,
        role: "ADMIN",
      };

      // 🚀 CRITICAL FIX: Force Authorization header to undefined
      // This ensures the request is sent as "Public" even if an old token exists
      const config = {
        headers: {
          Authorization: undefined,
        },
      };

      // ✅ Using the endpoint: /auth/register/request
      const response = await api.post(
        "/auth/register/request",
        payload,
        config
      );

      return {
        success: true,
        message: response.data?.message || "OTP sent successfully!",
      };
    } catch (error) {
      console.error("Signup Error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed.",
      };
    }
  };

  // 4. Verify OTP
  const verifyRegistration = async (email, otp) => {
    try {
      const response = await api.post("/auth/register/verify", { email, otp });
      const { token, refreshToken, user } = response.data;

      if (user.role !== "ADMIN") {
        return {
          success: false,
          message: "Role mismatch during verification.",
        };
      }

      localStorage.setItem("token", token);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_data", JSON.stringify(user));

      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || "Invalid OTP Code",
      };
    }
  };

  const logout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  // --- 5. PROFILE UPDATE ACTIONS ---

  // Update Profile
  const updateProfile = async (updatedData) => {
    try {
      // ✅ FIX: No ID needed. Controller uses Token.
      // Pass the DTO (fullName, phone, etc.)
      const responseUser = await AdminService.updateProfile(updatedData);

      // Merge response with current state
      const newUser = { ...currentUser, ...responseUser };

      localStorage.setItem("user_data", JSON.stringify(newUser));
      setCurrentUser(newUser);

      return { success: true };
    } catch (error) {
      console.error("Profile Update Failed:", error);
      return { success: false, message: "Failed to update profile." };
    }
  };

  // Update Avatar
  const updateAvatar = async (fileOrUrl) => {
    try {
      let newAvatarUrl = fileOrUrl;

      // 1. If it's a File object, upload it to get a URL
      if (fileOrUrl instanceof File) {
        // ✅ FIX: Use service to upload and get string URL back
        const response = await AdminService.uploadAvatar(fileOrUrl);
        newAvatarUrl = response; // Assuming backend returns raw string URL
      }

      // 2. Save the new URL to the profile
      // We re-use updateProfile to save just the image URL
      const payload = {
        // We must send other required fields if your DTO validation is strict,
        // but usually patch updates or full objects work.
        // Safest is to spread current user data that matches DTO:
        fullName: currentUser.fullName,
        phone: currentUser.phone,
        profileImageUrl: newAvatarUrl,
        // Add others to be safe if backend overwrites nulls
        address: currentUser.address,
        gender: currentUser.gender,
        dob: currentUser.dob,
      };

      await AdminService.updateProfile(payload);

      // 3. Update State
      const newUserState = {
        ...currentUser,
        profileImageUrl: newAvatarUrl,
        avatar: newAvatarUrl,
      };
      localStorage.setItem("user_data", JSON.stringify(newUserState));
      setCurrentUser(newUserState);

      return { success: true };
    } catch (error) {
      console.error("Avatar Update Failed", error);
      return { success: false };
    }
  };

  // Update Preferences (Mock implementation if no backend endpoint yet)
  const updatePreferences = (key, value) => {
    const newPreferences = { ...(currentUser.preferences || {}), [key]: value };
    const newUserState = { ...currentUser, preferences: newPreferences };

    // Update Local & State
    localStorage.setItem("user_data", JSON.stringify(newUserState));
    setCurrentUser(newUserState);

    // Ideally call backend API here to save preference
  };

  // Check if admins exist in the system
  const checkAdminExists = async () => {
    try {
      const response = await api.get("/auth/admin-check");
      return response.data.adminExists;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    login,
    logout,
    signup,
    verifyRegistration,
    updateProfile,
    updateAvatar,
    updatePreferences,
    checkAdminExists,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AdminAuthProvider");
  return context;
};
