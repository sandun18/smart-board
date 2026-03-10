// src/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import AdminService from '../../api/admin/AdminService';

export const useDashboard = () => {
  const [stats, setStats] = useState(null);
  const [approvals, setApprovals] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 1. Fetch Stats from AdminDashboardDTO
      const statsData = await AdminService.getDashboardStats();
      setStats(statsData);

      // 2. Fetch Boardings for PendingApprovals
      const boardings = await AdminService.getAllBoardings();
      setApprovals(boardings.filter(b => b.status === 'PENDING').slice(0, 5));

      // 3. Fetch Reports for RecentReports
      const reports = await AdminService.getReports('PENDING');
      setRecentReports(reports.slice(0, 5));

      setLoading(false);
    } catch (error) {
      // Log detailed error for debugging
      console.error('Dashboard load error:', error);
      console.error('Error response data:', error?.response?.data);
      console.error('Error status:', error?.response?.status);
      showToast('Error loading dashboard data', 'error');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleApproveAd = async (id) => {
    try {
      await AdminService.approveBoarding(id);
      showToast(`Boarding #${id} approved!`, 'success');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      showToast('Approval failed', 'error');
    }
  };

  const handleRejectAd = async (id) => {
    const reason = window.prompt('Reason for rejection:');
    if (reason !== null) {
      try {
        await AdminService.rejectBoarding(id, reason);
        showToast(`Boarding #${id} rejected.`, 'error');
        fetchDashboardData();
      } catch (error) {
        showToast('Rejection failed', 'error');
      }
    }
  };

  return { 
    stats, 
    approvals, 
    recentReports, 
    activities, 
    loading, 
    toast, 
    handleApproveAd, 
    handleRejectAd 
  };
};