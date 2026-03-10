import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../../api/api";
import { updateTechnicianProfile, getTechnicianProfile } from "../../api/technician/technicianService"; // ✅ Fixed Import

const TechnicianAuthContext = createContext(null);

export const TechnicianAuthProvider = ({ children }) => {
  const [currentTech, setCurrentTech] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Check for logged-in user on load (Using LocalStorage for speed)
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user_data");

      if (token && savedUser) {
        try {
          const user = JSON.parse(savedUser);

          //  Security Check: Ensure the saved user is a TECHNICIAN
        
            setCurrentTech(user);
            setIsAuthenticated(true);
          
        } catch (e) {
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
      //  Explicitly remove Auth header for login
      const response = await api.post(
        "/auth/login",
        { email, password },
        { headers: { Authorization: undefined } },
      );

      const { token, refreshToken, user } = response.data;

      // if (user.role !== "TECHNICIAN") {
      //   return {
      //     success: false,
      //     message:
      //       "Access Denied: This account is not registered as a Technician.",
      //   };
      // }

      localStorage.setItem("token", token);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_data", JSON.stringify(user));

      setCurrentTech(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
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
        role: "TECHNICIAN", //  IMPORTANT: Force role here
      };

      const config = {
        headers: { Authorization: undefined },
      };

      const response = await api.post(
        "/auth/register/request",
        payload,
        config,
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

  // 4. Signup Step 2: Verify OTP
  const verifyRegistration = async (email, otp) => {
    try {
      const response = await api.post("/auth/register/verify", { email, otp });
      const { token, refreshToken, user } = response.data;

      if (user.role !== "TECHNICIAN") {
        return {
          success: false,
          message: "Role mismatch during verification.",
        };
      }

      localStorage.setItem("token", token);
      localStorage.setItem("refresh_token", refreshToken);
      localStorage.setItem("user_data", JSON.stringify(user));

      setCurrentTech(user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data || "Invalid OTP Code",
      };
    }
  };

  

  // 5. Update Profile (Uses the Service Function)
  const updateProfile = async (updatedData) => {
    try {
      //  Call the API service
      await updateTechnicianProfile(updatedData);

      //  Merge changes with current state (Optimistic Update)
      const newUser = { ...currentTech, ...updatedData };

      //  Update Storage and State
      localStorage.setItem("user_data", JSON.stringify(newUser));
      setCurrentTech(newUser);

      return { success: true };
    } catch (error) {
      console.error("Profile Update Failed", error);
      return { success: false, message: "Update failed" };
    }
  };


  const refreshUser = async () => {
    try {
      const updatedData = await getTechnicianProfile(); // Fetch fresh data from DB
      
      setCurrentTech(updatedData);
      localStorage.setItem("user_data", JSON.stringify(updatedData)); // Sync local storage
      
      return updatedData;
    } catch (error) {
      console.error("Failed to refresh user context", error);
    }
  };

  const logout = () => {
    localStorage.clear();
    setCurrentTech(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  const value = {
    currentTech,
    isAuthenticated,
    isLoading,
    login,
    logout,
    signup,
    verifyRegistration,
    updateProfile,
    refreshUser
  };

  return (
    <TechnicianAuthContext.Provider value={value}>
      {children}
    </TechnicianAuthContext.Provider>
  );
};

export const useTechAuth = () => {
  const context = useContext(TechnicianAuthContext);
  if (!context)
    throw new Error("useTechAuth must be used within a TechnicianAuthProvider");
  return context;
};
