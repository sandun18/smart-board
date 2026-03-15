import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/admin/AdminAuthContext';

const Header = ({ 
  title = "Welcome back!", 
  subtitle = "Manage your platform efficiently", 
  onNavigate,
  onLogout 
}) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const handleProfileClick = () => {
    navigate('/admin/profile');
    setShowProfileMenu(false);
  };
  return (
    <header className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white/70 backdrop-blur-sm py-4 px-6 lg:py-8 lg:px-10 rounded-[25px] shadow-custom sticky top-4 z-40 border border-white/20">
      
      <div className="mb-4 md:mb-0 text-center md:text-left">
        <h1 className="text-primary text-lg lg:text-2xl font-bold mb-0.5 lg:mb-2 leading-tight">{title}</h1>
        <p className="text-text-muted text-[10px] lg:text-sm">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 md:gap-4 lg:gap-6">
        {/* MOBILE ONLY: Third Party Ads Shortcut */}
        <button 
          onClick={() => onNavigate?.('thirdparty')}
          className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full border border-accent/20 active:scale-95 transition-transform"
        >
          <i className="fas fa-ad text-xs"></i>
          <span className="text-[10px] font-bold uppercase">Ads</span>
        </button>

        {/* Notifications */}
        <div className="relative p-2.5 lg:p-3 rounded-full bg-background-light hover:bg-accent hover:text-white transition-colors cursor-pointer group shadow-sm">
          <i className="fas fa-bell text-sm lg:text-xl"></i>
          <span className="absolute -top-1 -right-1 bg-red-alert text-white rounded-full w-4 h-4 lg:w-5 lg:h-5 text-[9px] lg:text-[10px] flex items-center justify-center font-bold shadow-md">5</span>
        </div>

        {/* User Profile Section */}
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 pr-2 lg:px-4 lg:py-2 bg-background-light rounded-full lg:rounded-[25px] border border-white/50 shadow-sm hover:border-accent transition-colors active:scale-95"
          >
            <img 
              src={currentUser?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'Admin')}&background=random`}
              alt="User" 
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border-2 border-accent object-cover" 
            />
            <div className="hidden md:flex flex-col">
              <span className="font-bold text-sm leading-tight text-text-dark">{currentUser?.fullName || 'Admin'}</span>
              <span className="text-[10px] opacity-60 uppercase font-medium">Admin</span>
            </div>

            {/* LOGOUT BUTTON - MOBILE ONLY (lg:hidden) */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onLogout();
              }}
              className="lg:hidden ml-1 w-8 h-8 flex items-center justify-center rounded-full bg-red-alert/10 text-red-alert active:bg-red-alert active:text-white transition-all"
              title="Logout"
            >
              <i className="fas fa-sign-out-alt text-xs"></i>
            </button>
          </button>
      </div>
          {/* Desktop Profile Dropdown Menu */}
          {showProfileMenu && (
            <div className="hidden lg:block absolute right-0 mt-2 w-48 bg-white rounded-[15px] shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 bg-primary/5 border-b border-gray-100">
                <p className="text-xs text-text-muted uppercase font-bold">Logged in as</p>
                <p className="font-bold text-text-dark">{currentUser?.email}</p>
              </div>
              <button
                onClick={handleProfileClick}
                className="w-full px-4 py-3 text-left font-bold text-text-dark hover:bg-primary/10 transition-colors flex items-center gap-2 border-b border-gray-50"
              >
                <i className="fas fa-user-circle text-primary"></i>
                Profile Settings
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setShowProfileMenu(false);
                }}
                className="w-full px-4 py-3 text-left font-bold text-red-alert hover:bg-red-alert/10 transition-colors flex items-center gap-2"
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          )}
        </div>
    </header>
  );
};

export default Header;