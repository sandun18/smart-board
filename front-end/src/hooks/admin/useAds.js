import { useState, useMemo, useEffect, useCallback } from 'react';
import api from '../../api/api'; 

export const useAds = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('pending');
  const [selectedAd, setSelectedAd] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/boardings');
      setAds(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Fetch error:", error);
      setAds([]); // Fallback to empty array
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // SAFE STATS CALCULATION
  const stats = useMemo(() => {
    const safeAds = Array.isArray(ads) ? ads : [];
    return {
      total: safeAds.length,
      pending: safeAds.filter(ad => ad.status === 'PENDING' || ad.status?.toLowerCase() === 'pending').length,
      approved: safeAds.filter(ad => ad.status === 'APPROVED' || ad.status?.toLowerCase() === 'approved').length,
      rejected: safeAds.filter(ad => ad.status === 'REJECTED' || ad.status?.toLowerCase() === 'rejected').length,
    };
  }, [ads]);

  const filteredAds = useMemo(() => 
    (Array.isArray(ads) ? ads : []).filter(ad => {
      const status = ad.status || '';
      const compareTab = currentTab.toUpperCase();
      return status.toUpperCase() === compareTab;
    }), 
  [ads, currentTab]);

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/boardings/${id}/approve`);
      setAds(prev => prev.map(ad => ad.id === id ? { ...ad, status: 'APPROVED' } : ad));
      showToast("Ad approved successfully!", "success");
      fetchAds(); // Refresh the list after approval
    } catch (error) {
      console.error("Approval error:", error);
      showToast("Approval failed: " + (error.response?.data?.message || error.message), "error");
    }
  };

  const handleReject = async (id, reason) => {
    try {
      await api.put(`/admin/boardings/${id}/reject`, {}, { 
        params: { reason: reason || "Rejected by admin" } 
      });
      setAds(prev => prev.map(ad => ad.id === id ? { ...ad, status: 'REJECTED', rejectionReason: reason } : ad));
      showToast("Ad rejected successfully", "error");
      fetchAds(); // Refresh the list after rejection
    } catch (error) {
      console.error("Rejection error:", error);
      showToast("Rejection failed: " + (error.response?.data?.message || error.message), "error");
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return {
    ads: filteredAds,
    stats,
    loading,
    currentTab,
    setCurrentTab,
    selectedAd,
    setSelectedAd,
    toast,
    handleApprove,
    handleReject
  };
};