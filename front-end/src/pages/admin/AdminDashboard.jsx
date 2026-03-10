import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatsGrid from '../../components/admin/dashboard/StatsGrid';
import PendingApprovals from '../../components/admin/dashboard/PendingApprovals';
import RecentReports from '../../components/admin/dashboard/RecentReports';
import QuickActions from '../../components/admin/dashboard/QuickActions';
import ActivityFeed from '../../components/admin/dashboard/ActivityFeed';
import Toast from '../../components/admin/common/Toast';
import { useDashboard } from '../../hooks/admin/useDashboard';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { 
    stats, approvals, recentReports, activities, loading, toast,
    handleApproveAd, handleRejectAd 
  } = useDashboard();

  const handleNavigate = (page) => {
    navigate(`/admin/${page}`);
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}
      
      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <StatsGrid stats={stats} />
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <div className="flex flex-col gap-6">
              <PendingApprovals 
                approvals={approvals} 
                onApprove={handleApproveAd} 
                onReject={handleRejectAd}
                onNavigate={handleNavigate} 
              />
              <RecentReports 
                reports={recentReports} 
                onNavigate={handleNavigate} 
              />
            </div>
            <div className="flex flex-col gap-6">
              <QuickActions onNavigate={handleNavigate} />
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminDashboard;