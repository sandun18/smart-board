import React from 'react';
import logo from '../../../assets/logo.jpg';

const Sidebar = ({ onNavigate, activePage, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-tachometer-alt' },
    { id: 'users', label: 'User Management', icon: 'fa-users' },
    { id: 'ads', label: 'Ad Approvals', icon: 'fa-home', badge: 12 },
    { id: 'reports', label: 'Reports', icon: 'fa-flag', badge: 8 },
    { id: 'analytics', label: 'Analytics', icon: 'fa-chart-bar' },
    { id: 'thirdparty', label: 'Third-Party Ads', icon: 'fa-ad' },
    { id: 'settings', label: 'System Settings', icon: 'fa-cogs' },
  ];

  return (
    <aside className="fixed top-6 left-6 h-[calc(100vh-3rem)] w-72 bg-primary text-white flex flex-col rounded-[25px] shadow-custom overflow-y-auto z-50 hidden lg:flex">
      <div className="p-6 border-b border-white/10 mb-2">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-[50px] w-[50px] rounded-xl object-cover" />
          <div className="flex flex-col">
            <span className="font-bold text-xl tracking-tight leading-none text-white">SmartBoAD</span>
            <span className="text-[10px] opacity-60 uppercase tracking-widest mt-1 text-white">Admin Panel</span>
          </div>
        </div>
      </div>

      <nav className="flex-grow px-3 space-y-2.5">
        <h3 className="px-5 text-[10px] font-bold text-white/40 uppercase tracking-[2px] mb-2 mt-4">ADMIN NAVIGATION</h3>
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-[18px] transition-all duration-300 group ${
              activePage === item.id ? 'bg-white/20 shadow-lg text-white font-bold' : 'text-white/90 hover:bg-white/10 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} text-base w-6 text-center ${activePage === item.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}></i>
            <span className="text-[17px] whitespace-nowrap tracking-tight">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 mb-1 rounded-[15px] hover:bg-white/10 transition-colors cursor-pointer">
          <img src="https://randomuser.me/api/portraits/men/75.jpg" alt="User" className="w-8 h-8 rounded-full border-2 border-white/20 object-cover" />
          <div className="flex flex-col items-start">
            <span className="font-semibold text-xs leading-none text-white">Alex Morgan</span>
            <span className="text-[10px] text-white/50 mt-1 uppercase">Administrator</span>
          </div>
        </div>
        
        {/* Updated text-xs to text-[15px] and added slightly more padding (p-3) */}
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 p-3 rounded-[12px] text-accent hover:bg-white/10 transition-all font-bold text-[15px]"
        >
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;