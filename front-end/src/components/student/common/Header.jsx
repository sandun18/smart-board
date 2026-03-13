import React from 'react';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/student/StudentAuthContext.jsx';

const Header = ({ title, subtitle, rightContent }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleNotificationClick = () => {
    console.log('Notifications panel would open here'); 
  }

  const handleUserMenuClick = () => {
    navigate('/student/profile');
  }

  // Helper to safely get display name from 'fullName'
  const getDisplayName = () => {
    if (!currentUser || !currentUser.fullName) return "Guest User";
    const parts = currentUser.fullName.split(" ");
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  };

  // Helper to get First Name only for Welcome message
  const getFirstName = () => {
    if (!currentUser || !currentUser.fullName) return "Guest";
    return currentUser.fullName.split(" ")[0];
  }

  return (
    <header className="
      flex flex-col md:flex-row justify-between items-center 
      mb-8 bg-white/70 backdrop-blur-sm p-6 rounded-large 
      shadow-custom
      static md:sticky top-0 md:top-6 z-10
      transition-all duration-500
      hover:shadow-xl
    ">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h1 className="text-primary text-2xl md:text-3xl font-bold mb-1">
          {title || `Welcome back, ${getFirstName()}!`}
        </h1>
        <p className="text-text-muted">{subtitle || "Here's your boarding overview"}</p>
      </div>
      
      <div className="flex items-center gap-6">
        
        {rightContent && <div className="hidden sm:block">{rightContent}</div>}

        {/* Notification Bell */}
        <div 
          className="relative cursor-pointer p-3 rounded-full bg-background-light text-text-dark transition-all duration-300 hover:bg-accent hover:text-white group"
          onClick={handleNotificationClick}
        >
          <FaBell className="text-xl group-hover:animate-pulse" />
          <span className="
            absolute -top-1.5 -right-1.5 bg-red-alert text-white 
            rounded-full w-5 h-5 text-xs font-semibold flex items-center justify-center 
            border-2 border-white
          ">
            3
          </span>
        </div>
        
        {/* User Menu */}
        <div 
          className="flex items-center gap-3 cursor-pointer p-2 pr-4 rounded-large bg-background-light text-text-dark transition-all duration-300 hover:bg-accent hover:text-white group"
          onClick={handleUserMenuClick}
        >
          <img 
            // Fix: Use profileImageUrl mapped from backend
            src={currentUser?.profileImageUrl || 'https://randomuser.me/api/portraits/women/50.jpg'} 
            alt={currentUser?.fullName || 'User'} 
            className="w-10 h-10 rounded-full object-cover border-2 border-accent group-hover:border-white transition-colors duration-300"
          />
          <span className="font-semibold text-sm">
            {getDisplayName()}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;