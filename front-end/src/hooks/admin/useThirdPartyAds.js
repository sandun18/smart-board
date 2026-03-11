import { useState, useMemo, useEffect, useCallback } from 'react';
import AdminService from '../../api/admin/AdminService';

export const useThirdPartyAds = () => {
    // 1. STATE MANAGEMENT
    const [submissions, setSubmissions] = useState([]);
    const [campaigns, setCampaigns] = useState([]);
    const [plans, setPlans] = useState([]); 
    const [loading, setLoading] = useState(true); 
    const [activeTab, setActiveTab] = useState('submissions');
    const [prefillAdData, setPrefillAdData] = useState(null); 
    const [toast, setToast] = useState(null);
    const [isOffline, setIsOffline] = useState(false); // Track connection health

    // 2. NOTIFICATION HELPER
    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    // 3. DATA FETCHING (Resilient to Backend Failure)
    const fetchData = useCallback(async () => {
        setLoading(true);
        setIsOffline(false);
        try {
            // Promise.all with individual catches to ensure the UI loads even if one endpoint fails
            const [subData, campData, planData] = await Promise.all([
                AdminService.getSubmissions().catch(() => { throw new Error("Submissions failed"); }),
                AdminService.getCampaigns().catch(() => { throw new Error("Campaigns failed"); }),
                AdminService.getPlans().catch(() => { throw new Error("Plans failed"); })
            ]);
            
            setSubmissions(subData || []);
            setCampaigns(campData || []);
            setPlans(planData || []);
        } catch (err) {
            console.error("Connection Error:", err);
            setIsOffline(true);
            showToast("Backend connection failed. Showing offline mode.", "error");
            
            // Default to empty state instead of breaking the UI
            setSubmissions([]);
            setCampaigns([]);
            setPlans([]);
        } finally {
            // ALWAYS set loading to false to remove the blank/syncing screen
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 4. STATS CALCULATION (Safe from undefined/null data)
    const stats = useMemo(() => ({
        pending: (submissions || []).filter(s => s?.status === 'PENDING').length,
        activeCampaigns: (campaigns || []).filter(c => c?.status === 'ACTIVE').length,
        totalRevenue: (campaigns || []).reduce((acc, curr) => acc + (curr?.planPrice || 0), 0)
    }), [submissions, campaigns]);

    // 5. REVIEW ACTIONS
    const handleApprove = async (id) => {
        try {
            await AdminService.approveAd(id);
            showToast("Ad approved successfully");
            fetchData();
        } catch (err) { showToast("Approval failed", "error"); }
    };

    const handleReject = async (id) => {
        try {
            await AdminService.rejectAd(id);
            showToast("Ad rejected");
            fetchData();
        } catch (err) { showToast("Rejection failed", "error"); }
    };

    // 6. CAMPAIGN ACTIONS
    const startPublishWorkflow = (ad) => {
        setPrefillAdData(ad);
        setActiveTab('create');
    };

    const createAd = async (data) => {
        try {
            await AdminService.publishAd(data);
            showToast("Campaign is now LIVE!");
            setPrefillAdData(null);
            setActiveTab('campaigns');
            fetchData();
        } catch (err) { showToast("Failed to publish", "error"); }
    };

    const toggleCampaignStatus = async (id) => {
        try {
            await AdminService.toggleCampaignStatus(id);
            showToast("Status updated");
            fetchData();
        } catch (err) { showToast("Update failed", "error"); }
    };

    const updateCampaign = async (id, data) => {
        try {
            await AdminService.updateCampaign(id, data);
            showToast("Campaign updated");
            fetchData();
        } catch (err) { showToast("Update failed", "error"); }
    };

    const deleteAd = async (id) => {
        try {
            await AdminService.deleteAd(id);
            showToast("Ad deleted");
            fetchData();
        } catch (err) { showToast("Delete failed", "error"); }
    };

    // 7. PLAN ACTIONS
    const addPlan = async (data) => {
        try {
            await AdminService.addPlan(data);
            showToast("New plan added");
            fetchData();
        } catch (err) { showToast("Could not add plan", "error"); }
    };

    const updatePlan = async (id, data) => {
        try {
            await AdminService.updatePlan(id, data);
            showToast("Plan updated");
            fetchData();
        } catch (err) { showToast("Update failed", "error"); }
    };

    const deletePlan = async (id) => {
        try {
            await AdminService.deletePlan(id);
            showToast("Plan deleted");
            fetchData();
        } catch (err) { showToast("Delete failed", "error"); }
    };

    return {
        submissions, campaigns, plans, activeTab, setActiveTab,
        toast, stats, loading, prefillAdData, isOffline, fetchData,
        handleApprove, handleReject, startPublishWorkflow,
        createAd, toggleCampaignStatus, updateCampaign, deleteAd,
        addPlan, updatePlan, deletePlan
    };
};