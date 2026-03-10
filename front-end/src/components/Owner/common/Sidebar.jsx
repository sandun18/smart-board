import React, { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../../assets/logo.png";
import {
  FaHome,
  FaBullhorn,
  FaCalendarAlt,
  FaBuilding,
  FaCogs,
  FaCreditCard,
  FaFileAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useOwnerAuth } from "../../../context/owner/OwnerAuthContext.jsx";

const navItems = [
  {
    path: "/owner/dashboard",
    icon: FaHome,
    label: "Dashboard",
    key: "Dashboard",
  },
  { path: "/owner/myAds", icon: FaBullhorn, label: "My Ads", key: "My Ads" },
  {
    path: "/owner/appointments",
    icon: FaCalendarAlt,
    label: "Appointments",
    key: "Appointments",
  },
  {
    path: "/owner/registrations",
    icon: FaFileAlt,
    label: "Registrations",
    key: "Registrations",
  },
  {
    path: "/owner/myboardings",
    icon: FaBuilding,
    label: "My Boardings",
    key: "My Boardings",
  },
  { path: "/owner/utility", icon: FaCogs, label: "Utility", key: "Utility" },
  {
    path: "/owner/maintenance",
    icon: FaCogs,
    label: "Maintenance",
    key: "Maintenance",
  },
  {
    path: "/owner/payment",
    icon: FaCreditCard,
    label: "Payment",
    key: "Payment",
  },
  { path: "/owner/reports", icon: FaFileAlt, label: "Reports", key: "Reports" },
];

const SidebarItem = ({ path, Icon, label, currentPath }) => {
  const isActive =
    currentPath === path.replace(/^\/|\/$/g, "").toLowerCase() ||
    currentPath.startsWith(path.replace(/^\/|\/$/g, "").toLowerCase());

  return (
    <Link
      to={path}
      // CHANGED: Reduced padding (p-2) and vertical margin (my-0.5)
      className={`
        flex items-center gap-3 p-2 mx-2 my-0.5 rounded-btn transition-all duration-300
        ${
          isActive
            ? "bg-card-bg text-primary shadow-md transform scale-[1.01]"
            : "text-white hover:bg-white/20"
        }
      `}
    >
      {/* CHANGED: Slightly smaller icon size */}
      <Icon className="w-4 h-4 text-lg text-center" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { currentOwner, logout } = useOwnerAuth();

  const getLastName = () => {
    if (!currentOwner?.fullName) return null;
    const parts = currentOwner.fullName.split(" ");
    return parts[parts.length - 1];
  };

  const displayLastName = getLastName();
  const currentPath = location.pathname.replace(/^\/|\/$/g, "").toLowerCase();
  const mobileNavRef = useRef(null);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const isProfileActive = currentPath.includes("profile");

  useEffect(() => {
    if (mobileNavRef.current) {
      const activeLink = mobileNavRef.current.querySelector(".mobile-active");
      if (activeLink) {
        activeLink.scrollIntoView({
          behavior: "smooth",
          inline: "center",
          block: "nearest",
        });
      }
    }
  }, [currentPath]);

  return (
    <>
      {/* Desktop Sidebar */}
      {/* CHANGED: Reduced outer padding from p-6 to p-4 */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 bg-primary w-64 text-white p-4 rounded-large m-4 shadow-custom sticky top-4 h-[calc(100vh-2rem)] z-20">
        {/* LOGO HEADER */}
        {/* CHANGED: Reduced bottom margin/padding */}
        <div className="flex-shrink-0 pb-3 mb-2 border-b border-white/10">
          <Link
            to="/owner/dashboard"
            className="flex items-center gap-3 text-white"
          >
            {/* CHANGED: Smaller Logo (50px instead of 70px) */}
            <img
              src={logo}
              alt="SmartBoAD Logo"
              className="w-[50px] h-[50px] rounded-lg object-cover"
            />
            <div className="flex flex-col">
              <strong className="text-lg font-bold leading-tight">
                SmartBoAD
              </strong>
              <small className="text-[10px] opacity-80 mt-0.5">
                Owner Dashboard
              </small>
            </div>
          </Link>
        </div>

        {/* NAVIGATION AREA */}
        <nav className="flex flex-col justify-start flex-1 overflow-y-auto custom-scrollbar">
          {/* CHANGED: Reduced section header padding */}
          <h3 className="px-4 pb-1 pt-1 uppercase text-[11px] tracking-wider text-orange-200 border-b border-white/10 mb-1 font-semibold opacity-90">
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

          {/* Visual Divider - CHANGED: Reduced margin */}
          <div className="mx-2 my-2 border-t border-white/10"></div>

          <h3 className="px-4 pb-1 uppercase text-[11px] tracking-wider text-orange-200 font-semibold opacity-90">
            ACCOUNT
          </h3>

          {/* Profile Link */}
          <Link
            to="/owner/profile"
            // CHANGED: Compact padding/margin to match items
            className={`flex items-center gap-3 p-2 mx-2 my-0.5 rounded-btn transition-all duration-300 ${
              isProfileActive
                ? "bg-card-bg text-primary shadow-md"
                : "text-white hover:bg-white/20"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center bg-white/20 border-2 transition-colors duration-300 ${
                isProfileActive
                  ? "border-primary text-primary bg-white"
                  : "border-accent text-white"
              }`}
            >
              {currentOwner?.avatar ? (
                <img
                  src={currentOwner.avatar}
                  alt="Profile"
                  className="object-cover w-full h-full rounded-full"
                />
              ) : (
                <FaUser className="text-[10px]" />
              )}
            </div>
            <span className="text-sm font-medium truncate">
              {displayLastName ? `Mr. ${displayLastName}` : "Profile"}
            </span>
          </Link>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 p-2 mx-2 my-0.5 w-[calc(100%-1rem)] rounded-btn text-white hover:bg-red-500/20 hover:text-red-200 transition-all duration-300 text-left"
          >
            <FaSignOutAlt className="w-4 text-lg text-center" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </nav>
      </aside>

      {/* Mobile/Tablet Navigation (Kept exactly the same) */}
      <nav
        ref={mobileNavRef}
        className="fixed bottom-0 left-0 z-50 w-full overflow-x-auto text-white shadow-lg lg:hidden bg-primary scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex min-w-full px-2 md:justify-center">
          <div className="flex gap-2 p-2">
            {navItems.map((item) => {
              const isActive =
                currentPath ===
                  item.path.replace(/^\/|\/$/g, "").toLowerCase() ||
                currentPath.startsWith(
                  item.path.replace(/^\/|\/$/g, "").toLowerCase()
                );
              const IconComponent = item.icon;

              return (
                <Link
                  key={`mobile-${item.key}`}
                  to={item.path}
                  className={`
                    flex flex-col items-center justify-center p-2 min-w-[75px] flex-shrink-0
                    text-center transition-all duration-300 rounded-lg whitespace-nowrap
                    ${
                      isActive
                        ? "bg-card-bg text-primary shadow-lg scale-105 mobile-active"
                        : "hover:bg-white/10 text-white/90"
                    }
                  `}
                >
                  <IconComponent className="mb-1 text-xl" />
                  <span className="text-[10px] font-medium leading-tight">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }
      `}</style>
    </>
  );
};

export default Sidebar;
