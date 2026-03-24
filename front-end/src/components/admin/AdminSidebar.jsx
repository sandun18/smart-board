import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCreditCard,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { useAdminAuth } from "../../context/admin/AdminAuthContext.jsx";

const navItems = [
  {
    path: "/admin/dashboard",
    icon: FaHome,
    label: "Dashboard",
    key: "Dashboard",
  },
  {
    path: "/admin/subscription-plans",
    icon: FaCreditCard,
    label: "Subscription Plans",
    key: "SubscriptionPlans",
  },
];

const SidebarItem = ({ path, Icon, label, currentPath }) => {
  const isActive =
    currentPath === path.replace(/^\/|\/$/g, "").toLowerCase() ||
    currentPath.startsWith(path.replace(/^\/|\/$/g, "").toLowerCase());

  return (
    <Link
      to={path}
      className={`
        flex items-center gap-3 p-2 mx-2 my-0.5 rounded-btn transition-all duration-300
        ${
          isActive
            ? "bg-card-bg text-primary shadow-md transform scale-[1.01]"
            : "text-white hover:bg-white/20"
        }
      `}
    >
      <Icon className="w-4 h-4 text-lg text-center" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
};

const AdminSidebar = () => {
  const location = useLocation();
  const { currentAdmin, logout } = useAdminAuth();
  const currentPath = location.pathname.replace(/^\/|\/$/g, "").toLowerCase();

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const getDisplayName = () => {
    if (!currentAdmin?.fullName) return "Admin";
    const parts = currentAdmin.fullName.split(" ");
    return parts[0];
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col flex-shrink-0 bg-primary w-64 text-white p-4 rounded-large m-4 shadow-custom sticky top-4 h-[calc(100vh-2rem)] z-20">
        {/* HEADER */}
        <div className="flex-shrink-0 pb-3 mb-2 border-b border-white/10">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 text-white"
          >
            <div className="w-[50px] h-[50px] rounded-lg bg-white/20 flex items-center justify-center">
              <FaUser className="text-2xl text-white" />
            </div>
            <div className="flex flex-col">
              <strong className="text-lg font-bold leading-tight">
                SmartBoAD
              </strong>
              <small className="text-[10px] opacity-80 mt-0.5">
                Admin Panel
              </small>
            </div>
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col justify-start flex-1 overflow-y-auto custom-scrollbar">
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

          <div className="mx-2 my-2 border-t border-white/10"></div>

          <h3 className="px-4 pb-1 uppercase text-[11px] tracking-wider text-orange-200 font-semibold opacity-90">
            ACCOUNT
          </h3>

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

      {/* Mobile Navigation */}
      <nav className="fixed bottom-0 left-0 z-50 w-full overflow-x-auto text-white shadow-lg lg:hidden bg-primary scrollbar-hide">
        <div className="flex min-w-full px-2 md:justify-center">
          <div className="flex gap-2 p-2">
            {navItems.map((item) => {
              const isActive =
                currentPath === item.path.replace(/^\/|\/$/g, "").toLowerCase() ||
                currentPath.startsWith(item.path.replace(/^\/|\/$/g, "").toLowerCase());
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
                        ? "bg-card-bg text-primary shadow-lg scale-105"
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

            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center p-2 min-w-[75px] flex-shrink-0 text-center transition-all duration-300 rounded-lg whitespace-nowrap hover:bg-red-500/20 text-white/90"
            >
              <FaSignOutAlt className="mb-1 text-xl" />
              <span className="text-[10px] font-medium leading-tight">Logout</span>
            </button>
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

export default AdminSidebar;
