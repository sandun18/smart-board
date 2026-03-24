import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../../context/admin/AdminAuthContext';
import AdminService from '../../../api/admin/AdminService';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [badgeCounts, setBadgeCounts] = useState({ ads: 0, reports: 0, thirdparty: 0 });
  
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: 'fa-tachometer-alt' },
    { id: 'subscription-plans', label: 'Plans', icon: 'fa-crown' },
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

  const handleBrandClick = () => {
    navigate('/');
  };

  useEffect(() => {
    const loadPendingCounts = async () => {
      try {
        const [boardings, reports, submissions] = await Promise.all([
          AdminService.getAllBoardings(),
          AdminService.getReports('PENDING'),
          AdminService.getSubmissions()
        ]);

        const pendingAds = (Array.isArray(boardings) ? boardings : []).filter(
          (b) => String(b?.status || '').toUpperCase() === 'PENDING'
        ).length;

        const pendingReports = Array.isArray(reports) ? reports.length : 0;
        const pendingThirdParty = (Array.isArray(submissions) ? submissions : []).filter(
          (s) => String(s?.status || '').toUpperCase() === 'PENDING'
        ).length;

        setBadgeCounts({ ads: pendingAds, reports: pendingReports, thirdparty: pendingThirdParty });
      } catch (error) {
        console.error('Failed to load sidebar pending counts', error);
      }
    };

    loadPendingCounts();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background-light">
      {/* Persistent Sidebar */}
      <Sidebar 
        onNavigate={handleNavigate} 
        activePage={activePage} 
        onLogout={handleLogout} 
        onBrandClick={handleBrandClick}
        badgeCounts={badgeCounts}
      />
      
      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-6 lg:p-8 pt-4 pb-24 lg:pb-8 md:pb-28">
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

      {/* Mobile Nav - Keeping your logic but updating colors to match student style */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-primary text-white shadow-lg flex items-center justify-around px-2 z-50 h-16 border-t border-white/10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={`flex flex-col items-center justify-center p-2 min-w-[65px] transition-all duration-300 rounded-lg ${
              activePage === item.id 
                ? 'bg-card-bg text-primary shadow-lg scale-105' 
                : 'text-white/90'
            }`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[10px] font-medium mt-0.5">{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminLayout;