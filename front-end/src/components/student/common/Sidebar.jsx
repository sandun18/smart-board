import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logo.png";
import {
  FaHome,
  FaSearch,
  FaCalendarAlt,
  FaBuilding,
  FaCreditCard,
  FaTools,
  FaFlag,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from '../../../context/student/StudentAuthContext.jsx';

const navItems = [
  { path: "/student", icon: FaHome, label: "Dashboard", key: "Dashboard" },
  { path: "/student/appointmentpage", icon: FaCalendarAlt, label: "My Appointments", key: "My Appointments" },
  { path: "/student/search-boardings", icon: FaSearch, label: "Search Boardings", key: "Search Boardings" },
  { path: "/student/my-boardings", icon: FaBuilding, label: "My Boardings", key: "My Boardings" },
  { path: "/student/billing", icon: FaCreditCard, label: "Billing & Payments", key: "Billing" },
  { path: "/student/maintenance", icon: FaTools, label: "Maintenance", key: "Maintenance" },
  { path: "/student/reports", icon: FaFlag, label: "Report Issues", key: "Reports" },
];

const SidebarItem = ({ path, Icon, label, currentPath }) => {
  const isActive = currentPath === path.replace(/^\/|\/$/g, "").toLowerCase();

  return (
    <Link
      to={path}
      className={`
        flex items-center gap-3 p-3 mx-3 my-1 rounded-btn transition-all duration-300
        ${isActive ? "bg-card-bg text-primary shadow-lg transform scale-[1.01]" : "text-white hover:bg-white/20"}
      `}
    >
      <Icon className="w-5 text-center text-xl" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  const currentPath = location.pathname.replace(/^\/|\/$/g, "").toLowerCase();
  const mobileNavRef = useRef(null);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  const isProfileActive = currentPath === "profile";

  // Helper to safely get display name from 'fullName'
  const getDisplayName = () => {
    if (!currentUser || !currentUser.fullName) return "Guest User";
    const parts = currentUser.fullName.split(" ");
    if (parts.length === 1) return parts[0];
    // Returns "John D."
    return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
  };

  useEffect(() => {
    if (mobileNavRef.current) {
      const activeLink = mobileNavRef.current.querySelector('.mobile-active');
      if (activeLink) {
        activeLink.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [currentPath]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 bg-primary w-70 text-white p-6 rounded-large m-6 shadow-custom sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto z-20">
        <div className="pb-6 mb-4 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3 text-white">
            <img src={logo} alt="SmartBoAD Logo" className="w-[70px] h-[70px] rounded-lg object-cover" />
            <div className="flex flex-col">
              <strong className="text-xl font-bold leading-tight">SmartBoAD</strong>
              <small className="text-xs opacity-80 mt-0.5">Student Dashboard</small>
            </div>
          </Link>
        </div>

        <nav className="flex-1">
          <h3 className="px-6 pb-2 pt-1 uppercase text-sm tracking-wider text-orange-200 border-b border-white/10 mb-2 font-semibold">
            MAIN NAVIGATION
          </h3>
          {navItems.map((item) => (
            <SidebarItem
              key={item.key}
              currentPath={currentPath}
              path={item.path}
              Icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>

        <div className="pt-4 mt-auto border-t border-white/10">
          <Link
            to="/student/profile"
            className={`flex items-center gap-3 p-3 rounded-btn transition-all duration-300 ${isProfileActive ? "bg-card-bg text-primary shadow-lg transform scale-[1.01]" : "text-white hover:bg-white/10"}`}
          >
            <img 
              // Fix: Use profileImageUrl mapped from backend
              src={currentUser?.profileImageUrl || 'https://randomuser.me/api/portraits/women/50.jpg'} 
              alt="User"
              className={`w-8 h-8 rounded-full object-cover border-2 transition-colors duration-300 ${isProfileActive ? "border-primary" : "border-accent"}`}
            />
            <span className="font-medium">
              {getDisplayName()}
            </span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-btn text-accent hover:bg-white/10 transition-colors duration-300 mt-1 w-full text-left"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile/Tablet Navigation */}
      <nav
        ref={mobileNavRef}
        className="lg:hidden w-full bg-primary text-white shadow-lg fixed bottom-0 left-0 z-50 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex min-w-full px-2 md:justify-center">
          <div className="flex gap-2 p-2">
            {navItems.map((item) => {
              const isActive = currentPath === item.path.replace(/^\/|\/$/g, "").toLowerCase();
              const IconComponent = item.icon; 

              return (
                <Link
                  key={`mobile-${item.key}`}
                  to={item.path}
                  className={`
                    flex flex-col items-center justify-center p-2 min-w-[75px] flex-shrink-0
                    text-center transition-all duration-300 rounded-lg whitespace-nowrap
                    ${isActive ? "bg-card-bg text-primary shadow-lg scale-105 mobile-active" : "hover:bg-white/10 text-white/90"}
                  `}
                >
                  <IconComponent className="text-xl mb-1" />
                  <span className="text-[10px] font-medium leading-tight">{item.label}</span>
                </Link>
              );
            })}

            <button
               onClick={handleLogout}
               className="
                 flex flex-col items-center justify-center p-2 min-w-[75px] flex-shrink-0
                 text-center transition-all duration-300 rounded-lg whitespace-nowrap
                 hover:bg-white/10 text-accent
               "
             >
               <FaSignOutAlt className="text-xl mb-1" />
               <span className="text-[10px] font-medium leading-tight">Logout</span>
             </button>
          </div>
        </div>
      </nav>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default Sidebar;