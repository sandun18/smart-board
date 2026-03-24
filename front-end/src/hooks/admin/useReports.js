import { useState, useMemo, useEffect, useCallback } from 'react';
import AdminService from '../../api/admin/AdminService';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ pending: 0, urgent: 0, resolved: 0, dismissed: 0, total: 0 });
  const [currentTab, setCurrentTab] = useState('PENDING'); // PENDING, RESOLVED, DISMISSED
  const [category, setCategory] = useState('all'); 
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statuses = ['PENDING', 'RESOLVED', 'DISMISSED'];
      const responses = await Promise.allSettled(
        statuses.map((status) => AdminService.getReports(status))
      );

      const byStatus = statuses.reduce((acc, status, idx) => {
        const value = responses[idx]?.status === 'fulfilled' && Array.isArray(responses[idx].value)
          ? responses[idx].value
          : [];
        acc[status] = value;
        return acc;
      }, {});

      const reportsArray = byStatus[currentTab] || [];
      const allReports = statuses.flatMap((status) => byStatus[status] || []);

      setStats({
        pending: (byStatus.PENDING || []).length,
        resolved: (byStatus.RESOLVED || []).length,
        dismissed: (byStatus.DISMISSED || []).length,
        urgent: allReports.filter((r) => String(r?.severity || '').toUpperCase() === 'HIGH').length,
        total: allReports.length,
      });
      
      // Map Backend DTO to Frontend UI structure
      const mapped = reportsArray.map(r => ({
        // Preserve raw joined-date values; UI formatter handles string/array/timestamp variants.
        ...r,
        id: r.id,
        title: r.title || 'Untitled Report',
        priority: r.severity || 'LOW',
        date: r.submissionDate ? new Date(r.submissionDate).toLocaleDateString() : 'N/A',
        senderJoinedDate:
          r.senderJoinedDate ||
          r.sender_joined_date ||
          r.senderCreatedAt ||
          r.sender?.joinedDate ||
          r.sender?.createdAt ||
          null,
        reportedUserJoinedDate:
          r.reportedUserJoinedDate ||
          r.reported_user_joined_date ||
          r.reportedUserCreatedAt ||
          r.reportedUser?.joinedDate ||
          r.reportedUser?.createdAt ||
          null,
        reporter: {
          name: r.senderName || 'Unknown',
          role: 'USER',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.senderName || 'User')}&background=random`,
          joinedDate:
            r.senderJoinedDate ||
            r.sender_joined_date ||
            r.senderCreatedAt ||
            r.sender?.joinedDate ||
            r.sender?.createdAt ||
            null,
        }
      }));
      
      setReports(mapped);
    } catch (error) {
      console.error('❌ [AdminReports] Error fetching reports:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.config?.headers ? { Authorization: error.config.headers.Authorization ? '✅ Present' : '❌ Missing' } : 'N/A'
      });
      
      setError(`Failed to load reports: ${error.response?.status === 401 ? 'Unauthorized - Please login again' : error.response?.status === 403 ? 'Forbidden - Admin access required' : error.message}`);
      setReports([]);
      setStats({ pending: 0, urgent: 0, resolved: 0, dismissed: 0, total: 0 });
      showToast("Could not load reports: " + (error.message || 'Unknown error'), "error");
    } finally {
      setLoading(false);
    }
  }, [currentTab]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const filteredReports = useMemo(() => {
    if (category === 'all') return reports;
    return reports.filter(r => r.reporter.role.toLowerCase() === category.slice(0, -1));
  }, [reports, category]);

  const totalItems = filteredReports.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab, category, pageSize]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const pagedReports = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredReports.slice(start, end);
  }, [filteredReports, currentPage, pageSize]);

  const handleResolve = async (id, solutionData) => {
    try {
      await AdminService.resolveReport(id, solutionData);
      showToast(`Report #${id} resolved successfully`, 'success');
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      showToast("Failed to resolve report", "error");
    }
  };

  const handleDismiss = async (id, reason) => {
    try {
      // Wrap reason in ReportDecisionDTO format expected by backend
      const decisionData = {
        dismissalReason: reason
      };
      await AdminService.dismissReport(id, decisionData);
      showToast(`Report #${id} dismissed`, 'warning');
      setSelectedReport(null);
      fetchReports();
    } catch (error) {
      showToast("Failed to dismiss report", "error");
    }
  };

  return {
    stats,
    filteredReports: pagedReports,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    currentTab,
    setCurrentTab,
    category,
    setCategory,
    selectedReport, setSelectedReport, toast, loading, error,
    handleDismiss, handleResolve, refresh: fetchReports
  };
};
