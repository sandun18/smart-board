import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../../assets/logo.png';
import { 
  FaTachometerAlt, 
  FaUsers, 
  FaHome, 
  FaFlag, 
  FaChartBar, 
  FaAd, 
  FaCogs, 
  FaSignOutAlt 
} from 'react-icons/fa'; // Matching the react-icons usage
import { useAuth } from '../../../context/admin/AdminAuthContext';

const Sidebar = ({ onNavigate, activePage, onLogout, onBrandClick, badgeCounts = {} }) => {
  const { currentUser } = useAuth();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: FaTachometerAlt },
    { id: 'users', label: 'User Management', icon: FaUsers },
    { id: 'ads', label: 'Ad Approvals', icon: FaHome, badge: badgeCounts.ads || 0 },
    { id: 'reports', label: 'Reports', icon: FaFlag, badge: badgeCounts.reports || 0 },
    { id: 'analytics', label: 'Analytics', icon: FaChartBar },
    { id: 'thirdparty', label: 'Third-Party Ads', icon: FaAd, badge: badgeCounts.thirdparty || 0 },
    { id: 'settings', label: 'System Settings', icon: FaCogs },
  ];

  return (
    <aside className="hidden lg:flex flex-col flex-shrink-0 bg-primary w-70 text-white p-6 rounded-large m-6 shadow-custom sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto z-20">
      {/* Brand Header */}
      <div className="pb-6 mb-4 border-b border-white/10">
        <button
          onClick={onBrandClick}
          className="flex items-center gap-3 text-white w-full text-left"
        >
          <img src={logo} alt="SmartBoAD Logo" className="w-[60px] h-[60px] rounded-lg object-cover" />
          <div className="flex flex-col">
            <strong className="text-xl font-bold leading-tight">SmartBoAD</strong>
            <small className="text-xs opacity-80 mt-0.5">Admin Panel</small>
          </div>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <h3 className="px-6 pb-2 pt-1 uppercase text-[10px] tracking-wider text-orange-200 border-b border-white/10 mb-2 font-semibold">
          ADMIN NAVIGATION
        </h3>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                flex items-center gap-3 p-3 mx-3 my-1 rounded-btn transition-all duration-300 w-[calc(100%-1.5rem)]
                ${isActive ? "bg-card-bg text-primary shadow-lg transform scale-[1.01]" : "text-white hover:bg-white/20"}
              `}
            >
              <Icon className="w-5 text-center text-xl" />
              <span className="text-sm font-medium">{item.label}</span>
              {Number(item.badge) > 0 && (
                <span className="ml-auto bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="pt-4 mt-auto border-t border-white/10">
        <button
          onClick={() => onNavigate('profile')}
          className={`flex items-center gap-3 p-3 rounded-btn transition-all duration-300 w-full text-left ${activePage === 'profile' ? "bg-card-bg text-primary shadow-lg" : "text-white hover:bg-white/10"}`}
        >
          <img 
            src={currentUser?.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser?.fullName || 'Admin')}`} 
            alt="User"
            className={`w-8 h-8 rounded-full object-cover border-2 transition-colors duration-300 ${activePage === 'profile' ? "border-primary" : "border-accent"}`}
          />
          <div className="flex flex-col">
            <span className="font-medium text-sm leading-none">
              {currentUser?.fullName || 'Admin'}
            </span>
            <small className={`text-[10px] mt-1 uppercase ${activePage === 'profile' ? "text-primary/70" : "text-white/50"}`}>
                Administrator
            </small>
          </div>
        </button>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-3 p-3 rounded-btn text-accent hover:bg-white/10 transition-colors duration-300 mt-1 w-full text-left"
        >
          <FaSignOutAlt className="text-xl" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;