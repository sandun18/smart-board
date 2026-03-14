import React from "react";
import { FaBell } from "react-icons/fa";
import { useTechAuth } from "../../../context/technician/TechnicianAuthContext";
import { useNavigate } from "react-router-dom";

const TechnicianHeader = ({ title, subtitle }) => {
  const { currentTech } = useTechAuth();
  const navigate = useNavigate();

  const displayName = currentTech?.fullName || "Technician";

  const handleProfileClick = () => {
    navigate("/technician/profile");
  };
  
  const getProfileImage = () => {
    if (currentTech?.profileImageUrl) {
        return currentTech.profileImageUrl.startsWith("http") 
            ? currentTech.profileImageUrl 
            : `http://localhost:8086/uploads/${currentTech.profileImageUrl}`;
    }
    return `https://ui-avatars.com/api/?name=${displayName.replace(" ", "+")}&background=random`;
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white/70 backdrop-blur-sm p-6 rounded-large shadow-custom static md:sticky top-0 md:top-6 z-10">
      <div>
        <h1 className="text-primary text-2xl md:text-3xl font-bold mb-1">
          {title}
        </h1>
        <p className="text-text-muted">{subtitle}</p>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer p-3 rounded-full bg-background-light text-text-dark hover:bg-accent hover:text-white transition-all">
          <FaBell className="text-xl" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-alert text-white rounded-full w-5 h-5 text-xs flex items-center justify-center border-2 border-white">
            2
          </span>
        </div>

        {/* Profile Image Area */}
        <div 
            onClick={handleProfileClick}
            className="flex items-center gap-3 cursor-pointer p-2 pr-4 rounded-large bg-background-light text-text-dark transition-all duration-300 hover:bg-accent hover:text-white group"
        >
          <img
            src={getProfileImage()}
            alt="User"
            className="w-10 h-10 rounded-full object-cover border-2 border-accent group-hover:border-white shadow-sm bg-white transition-colors duration-300"
            
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = `https://ui-avatars.com/api/?name=${displayName.replace(" ", "+")}&background=random`;
            }}
          />
          
          <span className="hidden md:block font-bold text-gray-700 text-sm group-hover:text-white transition-colors duration-300">
            {displayName.split(" ")[0]}
          </span>
        </div>
      </div>
    </header>
  );
};

export default TechnicianHeader;
