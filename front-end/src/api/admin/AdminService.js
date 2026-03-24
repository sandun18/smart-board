import api from '../api'; // Your central axios instance

const tryRefreshAdminSession = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return false;

  try {
    const response = await api.post(
      '/auth/refresh',
      { refreshToken },
      { headers: { Authorization: undefined } }
    );

    const { token, refreshToken: newRefreshToken, user } = response.data || {};
    if (!token || !newRefreshToken || !user || user.role !== 'ADMIN') {
      return false;
    }

    localStorage.setItem('token', token);
    localStorage.setItem('refresh_token', newRefreshToken);
    localStorage.setItem('user_data', JSON.stringify(user));
    return true;
  } catch {
    return false;
  }
};

const withAdminRetry = async (requestFn) => {
  try {
    return await requestFn();
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      const refreshed = await tryRefreshAdminSession();
      if (refreshed) {
        return requestFn();
      }
    }
    throw error;
  }
};

const AdminService = {
  // ==========================================
  // 1. CORE DASHBOARD & ANALYTICS
  // ==========================================
  
  /**
   * Fetches high-level counts for the main dashboard cards.
   * Path: GET /api/admin/dashboard
   */
  getDashboardStats: async () => {
    const response = await withAdminRetry(() => api.get('/admin/dashboard'));
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
    const response = await withAdminRetry(() => api.get('/admin/boardings'));
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
    const response = await withAdminRetry(() => api.get('/admin/reports', config));
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
    // Map backend PlanDTO to frontend-friendly shape
    return (response.data || []).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      duration: p.durationDays ? `${p.durationDays} Days` : '',
      description: p.description,
      features: p.features || [],
      active: p.active
    }));
  },

  /**
   * Get active plans for public ad submission form
   */
  getPublicPlans: async () => {
    const response = await api.get('/third-party-ads/plans');
    return response.data || [];
  },

  /**
   * Approve a third-party ad submission
   */
  approveAd: async (adId) => {
    const response = await api.patch(`/admin/third-party-ads/${adId}/approve`);
    return response.data;
  },

  /**
   * Reject a third-party ad submission
   */
  rejectAd: async (adId, reason = "") => {
    const response = await api.patch(`/admin/third-party-ads/${adId}/reject`, { reason });
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
    const response = await api.patch(`/admin/third-party-ads/${campaignId}/toggle-status`);
    return response.data;
  },

  replayCampaign: async (campaignId) => {
    const response = await api.patch(`/admin/third-party-ads/${campaignId}/replay`);
    return response.data;
  },

  /**
   * Update campaign details
   */
  updateCampaign: async (campaignId, data) => {
    const response = await api.put(`/admin/third-party-ads/${campaignId}`, data);
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
   * Delete a user by ID
   */
  deleteUser: async (userId) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  },

  /**
   * Add a new pricing plan
   */
  addPlan: async (planData) => {
    const payload = {
      name: planData.name,
      price: Number(planData.price) || 0,
      durationDays: parseInt(String(planData.duration || '').match(/\d+/)?.[0] || '0', 10),
      description: planData.description || '',
      features: planData.features || [],
      active: planData.active !== undefined ? planData.active : true
    };
    const response = await api.post('/admin/third-party-ads/plans', payload);
    return response.data;
  },

  /**
   * Update pricing plan
   */
  updatePlan: async (planId, planData) => {
    const payload = {
      name: planData.name,
      price: Number(planData.price) || 0,
      durationDays: parseInt(String(planData.duration || '').match(/\d+/)?.[0] || '0', 10),
      description: planData.description || '',
      features: planData.features || [],
      active: planData.active !== undefined ? planData.active : true
    };
    const response = await api.put(`/admin/third-party-ads/plans/${planId}`, payload);
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
   * Get public active ads for home page display
   */
  getPublicAds: async () => {
    const response = await api.get('/third-party-ads/public-ads');
    return response.data || [];
  },

  getPublicSystemStatus: async () => {
    const response = await api.get('/public/system-status');
    return response.data || { maintenanceMode: false };
  },

  /**
   * Submit a third-party ad (from home page)
   */
  submitThirdPartyAd: async (formData) => {
    const response = await api.post('/third-party-ads/submit', formData);
    return response.data;
  },

  // ==========================================
  // 6. ADMIN SYSTEM SETTINGS
  // ==========================================

  getSystemSettings: async () => {
    const response = await api.get('/admin/settings/general');
    return response.data;
  },

  updateSystemSettings: async (payload) => {
    const response = await api.put('/admin/settings/general', payload);
    return response.data;
  },

  getSystemHealth: async () => {
    const response = await api.get('/admin/settings/health');
    return response.data;
  },

  getBackups: async () => {
    const response = await api.get('/admin/settings/backups');
    return response.data || [];
  },

  createBackup: async () => {
    const response = await api.post('/admin/settings/backups');
    return response.data;
  },

  downloadBackup: async (backupId) => {
    const response = await api.get(`/admin/settings/backups/${backupId}/download`, {
      responseType: 'blob'
    });
    return {
      blob: response.data,
      filename: response.headers?.['content-disposition']?.split('filename=')?.[1]?.replaceAll('"', '') || `backup-${backupId}.json`
    };
  },

  restoreBackup: async (backupId) => {
    const response = await api.post(`/admin/settings/backups/${backupId}/restore`);
    return response.data;
  },

  deleteBackupFile: async (backupId) => {
    const response = await api.delete(`/admin/settings/backups/${backupId}`);
    return response.data;
  },

  getActivityLogs: async () => {
    const response = await api.get('/admin/settings/logs');
    return response.data || [];
  },

  // ==========================================
  // 7. ADMIN PROFILE MANAGEMENT
  // ==========================================

  /**
   * Get admin profile details
   */
  getAdminProfile: async (adminId) => {
    const response = await api.get('/admin/profile');
    return response.data;
  },

  /**
   * Update admin profile information
   */
  updateAdminProfile: async (adminId, profileData) => {
    const response = await api.put('/admin/profile', profileData);
    return response.data;
  },

  /**
   * Change admin password
   */
  changeAdminPassword: async (adminId, passwordData) => {
    const response = await api.post('/admin/profile/change-password', passwordData);
    return response.data;
  },

  /**
   * Upload avatar image (multipart/form-data)
   * Expects backend to return the uploaded image URL (string) in response.data
   */
  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/files/upload/admin', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    // backend may return either a plain string URL or an object { url: '...' }
    if (!response || !response.data) return null;
    return response.data.url || response.data;
  },

  /**
   * Update profile (uses token to identify admin)
   */
  updateProfile: async (profileData) => {
    const response = await api.put('/admin/profile', profileData);
    return response.data;
  },

};

export default AdminService;
