import api from '../api'; // Your central axios instance

const AdminService = {
  // ==========================================
  // 1. CORE DASHBOARD & ANALYTICS
  // ==========================================
  
  /**
   * Fetches high-level counts for the main dashboard cards.
   * Path: GET /api/admin/dashboard
   */
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  /**
   * Fetches data for charts and trends.
   * Path: GET /api/admin/analytics?range=30d
   */
  getAnalytics: async (range = '30d') => {
    try {
      const response = await api.get('/admin/analytics', { 
        params: { range } 
      });
      return response.data;
    } catch (error) {
      console.error("API Error in getAnalytics:", error);
      throw error;
    }
  },

  // ==========================================
  // 2. USER MANAGEMENT
  // ==========================================

  /**
   * Fetches all users for the management table.
   */
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data; 
  },

  /**
   * Updates owner verification status.
   * Matches UserVerificationDTO on backend.
   */
  verifyOwner: async (userId, isApproved, reason = "") => {
    const response = await api.put(`/admin/users/${userId}/verify-owner`, {
      approved: isApproved,
      reason: reason
    });
    return response.data;
  },

  // ==========================================
  // 3. BOARDING & PROPERTY APPROVALS
  // ==========================================

  /**
   * Fetches all boarding listings for admin review.
   */
  getAllBoardings: async () => {
    const response = await api.get('/admin/boardings');
    return response.data;
  },

  /**
   * Approves a specific boarding listing.
   */
  approveBoarding: async (boardingId) => {
    const response = await api.put(`/admin/boardings/${boardingId}/approve`);
    return response.data;
  },

  /**
   * Rejects a boarding listing.
   * Note: Sent as a RequestParam as per your AdminController.java
   */
  rejectBoarding: async (boardingId, reason) => {
    const response = await api.put(`/admin/boardings/${boardingId}/reject`, null, {
      params: { reason: reason }
    });
    return response.data;
  },

  // ==========================================
  // 4. REPORT HANDLING
  // ==========================================

  /**
   * Fetches reports, optionally filtered by status (PENDING, RESOLVED, etc.)
   */
  getReports: async (status = null) => {
    const config = status ? { params: { status } } : {};
    const response = await api.get('/admin/reports', config);
    return response.data;
  },

  /**
   * Resolves a report with specific action details.
   * Matches ReportDecisionDTO.
   */
  resolveReport: async (reportId, decisionData) => {
    const response = await api.put(`/admin/reports/${reportId}/resolve`, decisionData);
    return response.data;
  },

  /**
   * Dismisses a report without taking action.
   */
  dismissReport: async (reportId, decisionData) => {
    const response = await api.put(`/admin/reports/${reportId}/dismiss`, decisionData);
    return response.data;
  },

  // ==========================================
  // 5. THIRD-PARTY ADS MANAGEMENT
  // ==========================================

  /**
   * Get all third-party ad submissions
   */
  getSubmissions: async () => {
    const response = await api.get('/admin/third-party-ads/submissions');
    return response.data;
  },

  /**
   * Get all active campaigns
   */
  getCampaigns: async () => {
    const response = await api.get('/admin/third-party-ads/campaigns');
    return response.data;
  },

  /**
   * Get all pricing plans
   */
  getPlans: async () => {
    const response = await api.get('/admin/third-party-ads/plans');
    return response.data;
  },

  /**
   * Approve a third-party ad submission
   */
  approveAd: async (adId) => {
    const response = await api.put(`/admin/third-party-ads/${adId}/approve`);
    return response.data;
  },

  /**
   * Reject a third-party ad submission
   */
  rejectAd: async (adId, reason = "") => {
    const response = await api.put(`/admin/third-party-ads/${adId}/reject`, { reason });
    return response.data;
  },

  /**
   * Publish a third-party ad as campaign
   */
  publishAd: async (adData) => {
    const response = await api.post('/admin/third-party-ads/publish', adData);
    return response.data;
  },

  /**
   * Toggle campaign status (ACTIVE/INACTIVE)
   */
  toggleCampaignStatus: async (campaignId) => {
    const response = await api.put(`/admin/third-party-ads/campaigns/${campaignId}/toggle-status`);
    return response.data;
  },

  /**
   * Update campaign details
   */
  updateCampaign: async (campaignId, data) => {
    const response = await api.put(`/admin/third-party-ads/campaigns/${campaignId}`, data);
    return response.data;
  },

  /**
   * Delete a third-party ad
   */
  deleteAd: async (adId) => {
    const response = await api.delete(`/admin/third-party-ads/${adId}`);
    return response.data;
  },

  /**
   * Add a new pricing plan
   */
  addPlan: async (planData) => {
    const response = await api.post('/admin/third-party-ads/plans', planData);
    return response.data;
  },

  /**
   * Update pricing plan
   */
  updatePlan: async (planId, planData) => {
    const response = await api.put(`/admin/third-party-ads/plans/${planId}`, planData);
    return response.data;
  },

  /**
   * Delete pricing plan
   */
  deletePlan: async (planId) => {
    const response = await api.delete(`/admin/third-party-ads/plans/${planId}`);
    return response.data;
  },

  /**
   * Submit a third-party ad (from home page)
   */
  submitThirdPartyAd: async (formData) => {
    const response = await api.post('/third-party-ads/submit', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

};

export default AdminService;