import { useState, useEffect, useCallback } from "react";
// Updated imports to include changePassword
import {
  getOwnerProfile,
  updateOwnerProfile,
  changePassword,
} from "../../api/owner/service";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext";

const useProfileLogic = () => {
  const { currentOwner } = useOwnerAuth();

  const [ownerData, setOwnerData] = useState({
    id: null,
    businessName: "",
    email: "",
    phone: "",
    avatar: "https://randomuser.me/api/portraits/men/40.jpg",
    address: "",
    paymentMethod: "",
    nicNumber: "",
    verifiedOwner: false,
    preferences: {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
    },
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 1. FETCH DATA ---
  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getOwnerProfile();

      setOwnerData((prev) => ({
        ...prev,
        id: data.id,
        businessName: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        avatar: data.profileImageUrl || prev.avatar,
        paymentMethod: data.accNo,
        nicNumber: data.nicNumber,
        verifiedOwner: data.verifiedOwner,
        preferences: prev.preferences,
      }));
    } catch (err) {
      console.error("Failed to load profile", err);
      setError("Could not load profile data.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // --- Internal Helper: Update Profile Backend ---
  const handleServiceUpdate = async (payload) => {
    const backendPayload = {
      fullName: payload.businessName || ownerData.businessName,
      phone: payload.phone || ownerData.phone,
      accNo: payload.paymentMethod || ownerData.paymentMethod,
      profileImageUrl: payload.avatar || ownerData.avatar,
      address:
        payload.address !== undefined ? payload.address : ownerData.address,
    };

    const updated = await updateOwnerProfile(backendPayload);

    setOwnerData((prev) => ({
      ...prev,
      businessName: updated.fullName,
      phone: updated.phone,
      paymentMethod: updated.accNo,
      avatar: updated.profileImageUrl,
      address: updated.address,
    }));
  };

  // --- 2. EXPOSED ACTIONS ---

  // A. Update Business Info
  const updateBusinessInfo = async (data) => {
    await handleServiceUpdate({
      businessName: data.businessName,
      phone: data.phone,
      address: data.address,
      paymentMethod: data.paymentMethod,
    });
  };

  // B. Update Avatar
  const updateAvatar = async (avatarUrl) => {
    await handleServiceUpdate({ avatar: avatarUrl });
  };

  // C. Update Account Settings (Bank + Password) -> Logic moved here
  const updateAccountSettings = async (formData) => {
    // 1. Update Bank Account if changed
    if (formData.accNo !== ownerData.paymentMethod) {
      await handleServiceUpdate({
        paymentMethod: formData.accNo,
      });
    }

    // 2. Update Password if requested
    if (formData.isPasswordChange) {
      await changePassword(formData.currentPassword, formData.newPassword);
    }
  };

  // D. Update Preferences (Local)
  const updatePreferences = (key, value) => {
    setOwnerData((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, [key]: value },
    }));
  };

  return {
    ownerData,
    isLoading,
    error,
    updateBusinessInfo,
    updateAvatar,
    updateAccountSettings, // ✅ Exposed to component
    updatePreferences,
  };
};

export default useProfileLogic;
