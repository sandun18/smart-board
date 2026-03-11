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
      pending: safeAds.filter(ad => ad.status?.toLowerCase() === 'pending').length,
      approved: safeAds.filter(ad => ad.status?.toLowerCase() === 'approved').length,
      rejected: safeAds.filter(ad => ad.status?.toLowerCase() === 'rejected').length,
    };
  }, [ads]);

  const filteredAds = useMemo(() => 
    (Array.isArray(ads) ? ads : []).filter(ad => ad.status?.toLowerCase() === currentTab), 
  [ads, currentTab]);

  const handleApprove = async (id) => {
    try {
      await api.put(`/admin/boardings/${id}/approve`);
      setAds(prev => prev.map(ad => ad.id === id ? { ...ad, status: 'approved' } : ad));
      showToast("Ad approved successfully!", "success");
    } catch (error) {
      showToast("Approval failed", "error");
    }
  };

  const handleReject = async (id, reason) => {
    try {
      await api.put(`/admin/boardings/${id}/reject`, null, { params: { reason } });
      setAds(prev => prev.map(ad => ad.id === id ? { ...ad, status: 'rejected' } : ad));
      showToast("Ad rejected", "error");
    } catch (error) {
      showToast("Rejection failed", "error");
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