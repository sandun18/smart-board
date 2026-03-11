import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../../context/admin/AdminAuthContext';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: 'fa-tachometer-alt' },
    { id: 'users', label: 'Users', icon: 'fa-users' },
    { id: 'ads', label: 'Ads', icon: 'fa-home' },
    { id: 'reports', label: 'Reports', icon: 'fa-flag' },
    { id: 'analytics', label: 'Analytics', icon: 'fa-chart-bar' },
    { id: 'settings', label: 'Settings', icon: 'fa-cogs' },
  ];

  const handleNavigate = (page) => {
    setActivePage(page);
    if (page === 'dashboard') {
      navigate('/admin/dashboard');
    } else {
      navigate(`/admin/${page}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background-light font-sans text-text-dark">
      <Sidebar 
        onNavigate={handleNavigate} 
        activePage={activePage} 
        onLogout={handleLogout} 
      />
      
      <main className="w-full p-3 pb-28 lg:p-10 lg:ml-80 lg:pb-10 pt-4 transform scale-[0.98] lg:scale-100 origin-top transition-transform duration-300">
        <Header 
          title={`Welcome back, ${currentUser?.fullName || 'Admin'}!`}
          subtitle="Manage your platform efficiently"
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
        />
        
        <div className="mt-4 lg:mt-6">
           <Outlet />
        </div>
      </main>

      <nav className="lg:hidden fixed bottom-5 left-4 right-4 bg-primary text-white h-16 rounded-[22px] shadow-2xl flex items-center justify-around px-2 z-50 border border-white/10 backdrop-blur-md bg-opacity-95 overflow-x-auto">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 flex-shrink-0 ${
              activePage === item.id 
                ? 'bg-white/20 text-white scale-110 shadow-inner' 
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter hidden">
              {item.label === 'Dashboard' ? 'Home' : item.label.slice(0, 3)}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminLayout;