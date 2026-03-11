import React from "react";
import { FaBell, FaPlus, FaUser } from "react-icons/fa"; // Added FaPlus for icon consistency
import { useNavigate } from "react-router-dom";
import { useOwnerAuth } from "../../../context/owner/OwnerAuthContext.jsx";

// Added navBtnText and navBtnPath props
const HeaderBar = ({ title, subtitle, rightContent, navBtnText, navBtnPath,onNavBtnClick }) => {
  const { currentOwner } = useOwnerAuth();
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    console.log("Notifications panel would open here");
  };

  const handleUserMenuClick = () => {
    navigate("/owner/profile");
  };

  const getDisplayInfo = () => {
    // Safety check: if no user loaded yet
    if (!currentOwner?.fullName) {
      return { 
        firstName: "Partner", 
        lastInitial: "", 
        displayName: "Partner" 
      };
    }
    
    // Split the name by spaces
    const parts = currentOwner.fullName.trim().split(" ");
    
    // First Name is the first word
    const firstName = parts[0]; 
    
    // Last Initial is the first letter of the last word (if it exists)
    const lastInitial = parts.length > 1 ? parts[parts.length - 1].charAt(0) + "." : "";

    // Full Last Name (for the welcome message)
    const lastName = parts.length > 1 ? parts[parts.length - 1] : "";
    
    return { firstName, lastInitial, lastName };
  };

  const { firstName, lastInitial, lastName } = getDisplayInfo();

  // --- 🛠️ HELPER: Avatar Logic ---
  const userAvatar = currentOwner?.profileImageUrl || // Check API image first
                     currentOwner?.avatar;            // Check local avatar second

    const handlePrimaryAction = () => {
    if (onNavBtnClick) {
      onNavBtnClick(); // Open the modal
    } else if (navBtnPath) {
      navigate(navBtnPath); // Navigate to page
    }
  };

  return (
    <header
        className="
      sticky top-4 z-50
      flex flex-col md:flex-row justify-between items-center
      mb-8 bg-white/70 backdrop-blur-sm p-6 rounded-large
      shadow-custom transition-all duration-500
      hover:shadow-xl
    "
    >
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h1 className="text-primary text-2xl md:text-3xl font-bold mb-1">
          {title || `Welcome back, Mr. ${lastName || "Partner"}!`}
        </h1>
        <p className="text-text-muted">
          {subtitle || "Here's your property overview"}
        </p>
      </div>

      <div className="flex items-center gap-6">
        {/* 🔥 NEW: Dynamic Navigation Button */}
        {/* Only renders if both text and path are provided */}
        {navBtnText && (navBtnPath || onNavBtnClick) && (
          <button
            onClick={handlePrimaryAction}
            className="
              hidden sm:flex items-center gap-2 
              bg-accent text-white px-5 py-2.5 rounded-3xl 
              font-medium shadow-md transition-all duration-300 
              hover:bg-primary-dark hover:shadow-lg hover:-translate-y-0.5
            "
          >
            <FaPlus className="text-sm" /> {/* Optional Icon */}
            {navBtnText}
          </button>
        )}

        {/* Existing Custom Content (if you need something other than a button) */}
        {rightContent && <div className="hidden sm:block">{rightContent}</div>}

        {/* Notification Bell */}
        <div
          className="relative cursor-pointer p-3 rounded-full bg-background-light text-text-dark transition-all duration-300 hover:bg-accent hover:text-white group"
          onClick={handleNotificationClick}
        >
          <FaBell className="text-xl group-hover:animate-pulse" />
          <span
            className="
            absolute -top-1.5 -right-1.5 bg-red-alert text-white 
            rounded-full w-5 h-5 text-xs font-semibold flex items-center justify-center 
            border-2 border-white
          "
          >
            3
          </span>
        </div>

        {/* User Menu */}
        <div
          className="flex items-center gap-3 cursor-pointer p-2 pr-4 rounded-large bg-background-light text-text-dark transition-all duration-300 hover:bg-accent hover:text-white group"
          onClick={handleUserMenuClick}
        >
          {userAvatar ? (
             <img
             src={userAvatar}
             alt="Profile"
             className="w-10 h-10 rounded-full object-cover border-2 border-accent group-hover:border-white transition-colors duration-300"
           />
          ) : (
            // Fallback icon if no image exists
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-accent border-2 border-accent group-hover:border-white group-hover:text-white transition-colors">
               <FaUser />
            </div>
          )}
          <span className="font-semibold text-sm">
              Mr. {lastName || "Partner"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default HeaderBar;
