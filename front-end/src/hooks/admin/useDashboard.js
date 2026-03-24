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

  const mapActivityType = (log) => {
    const status = String(log?.status || '').toLowerCase();
    const action = String(log?.action || '').toLowerCase();

    if (status.includes('success')) return 'success';
    if (status.includes('fail') || status.includes('error')) return 'warning';
    if (action.includes('delete') || action.includes('reject')) return 'warning';
    if (action.includes('approve') || action.includes('create') || action.includes('publish')) return 'primary';
    return 'info';
  };

  const formatActivityTime = (createdAt) => {
    if (!createdAt) return 'N/A';
    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return 'N/A';
    return date.toLocaleString();
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, boardingsRes, reportsRes, activityRes] = await Promise.allSettled([
        AdminService.getDashboardStats(),
        AdminService.getAllBoardings(),
        AdminService.getReports('PENDING'),
        AdminService.getActivityLogs()
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value);
      } else {
        setStats(null);
      }

      if (boardingsRes.status === 'fulfilled') {
        const boardings = Array.isArray(boardingsRes.value) ? boardingsRes.value : [];
        setApprovals(boardings.filter(b => b?.status === 'PENDING').slice(0, 5));
      } else {
        setApprovals([]);
      }

      if (reportsRes.status === 'fulfilled') {
        const reports = Array.isArray(reportsRes.value) ? reportsRes.value : [];
        setRecentReports(reports.slice(0, 5));
      } else {
        setRecentReports([]);
      }

      if (activityRes.status === 'fulfilled') {
        const logs = Array.isArray(activityRes.value) ? activityRes.value : [];
        const mappedActivities = logs
          .map((log, index) => ({
            id: log.eventId || `activity-${index}`,
            user: log.user || 'System',
            action: log.action || 'performed an action',
            time: formatActivityTime(log.createdAt),
            icon: log.icon || 'fa-history',
            type: mapActivityType(log)
          }))
          .slice(0, 6);

        setActivities(mappedActivities);
      } else {
        setActivities([]);
      }

      if ([statsRes, boardingsRes, reportsRes, activityRes].some(r => r.status === 'rejected')) {
        showToast('Some dashboard sections failed to load', 'error');
      }

      setLoading(false);
    } catch (error) {
      console.error('Dashboard load error:', error);
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
      fetchDashboardData();
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