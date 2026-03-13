import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/admin/AdminAuthContext';
import AdminService from '../../api/admin/AdminService';
import Toast from '../../components/admin/common/Toast';

const AdminProfile = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateProfile, updateAvatar } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    profileImageUrl: '',
    bio: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        fullName: currentUser.fullName || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        profileImageUrl: currentUser.profileImageUrl || '',
        bio: currentUser.bio || ''
      });
    }
  }, [currentUser]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.fullName.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    if (!formData.email.trim()) {
      showToast('Email cannot be empty', 'error');
      return;
    }

    setIsSaving(true);
    try {
      // If a new file is selected, upload it via context helper
      if (selectedFile) {
        const res = await updateAvatar(selectedFile);
        if (!res || res.success === false) {
          throw new Error('Avatar upload failed');
        }
      }

      // Update other profile fields via context helper
      const resp = await updateProfile({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
      });

      if (!resp || resp.success === false) {
        throw new Error(resp?.message || 'Failed to update profile');
      }

      showToast('Profile updated successfully', 'success');
      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast(error.response?.data?.message || error.message || 'Failed to update profile', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showToast('All password fields are required', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await AdminService.changeAdminPassword(currentUser.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      showToast('Password changed successfully', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordForm(false);
    } catch (error) {
      console.error('Error changing password:', error);
      showToast(error.response?.data?.message || 'Failed to change password', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login', { replace: true });
    }
  };

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-dark mb-2">Profile Settings</h1>
        <p className="text-text-muted">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[25px] shadow-custom p-8 border border-gray-100 sticky top-24">
              <div className="text-center">
              <img 
                src={previewUrl || formData.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=random&size=200`}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary/20 object-cover"
              />
              {isEditing && (
                <div className="mt-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background-light border border-gray-200">
                    <i className="fas fa-upload text-sm"></i>
                    <span className="text-sm font-medium">Change Photo</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              )}
              <h2 className="text-2xl font-bold text-text-dark mb-1">{formData.fullName}</h2>
              <p className="text-text-muted text-sm mb-2">{formData.email}</p>
              <div className="bg-primary/10 text-primary inline-block px-3 py-1 rounded-full text-xs font-bold uppercase mb-6">
                Administrator
              </div>

              {/* Quick Stats */}
              <div className="space-y-2 text-sm border-t border-gray-100 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Account Status</span>
                  <span className="font-semibold text-success-green">Active</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Last Login</span>
                  <span className="font-semibold">{currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <button
              onClick={handleLogout}
              className="w-full mt-8 py-2.5 px-4 bg-red-alert/10 text-red-alert font-bold rounded-lg hover:bg-red-alert hover:text-white transition-colors active:scale-95"
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>

        {/* Right: Form Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Information Card */}
          <div className="bg-white rounded-[25px] shadow-custom p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-text-dark">Personal Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  isEditing
                    ? 'bg-red-alert/10 text-red-alert hover:bg-red-alert hover:text-white'
                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                }`}
              >
                <i className={`fas fa-${isEditing ? 'times' : 'edit'} mr-2`}></i>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-bold text-text-dark mb-2">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                    isEditing ? 'bg-white cursor-text' : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-text-dark mb-2">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                    isEditing ? 'bg-white cursor-text' : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Enter your email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-text-dark mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all ${
                    isEditing ? 'bg-white cursor-text' : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-bold text-text-dark mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none ${
                    isEditing ? 'bg-white cursor-text' : 'bg-gray-50 cursor-not-allowed'
                  }`}
                  placeholder="Enter a short bio"
                />
              </div>

              {isEditing && (
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-2.5 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save"></i>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 px-4 bg-gray-200 text-text-dark font-bold rounded-lg hover:bg-gray-300 transition-all active:scale-95"
                  >
                    Discard
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Security Card */}
          <div className="bg-white rounded-[25px] shadow-custom p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-text-dark">Security</h3>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  showPasswordForm
                    ? 'bg-red-alert/10 text-red-alert hover:bg-red-alert hover:text-white'
                    : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                }`}
              >
                <i className={`fas fa-${showPasswordForm ? 'times' : 'lock'} mr-2`}></i>
                {showPasswordForm ? 'Cancel' : 'Change Password'}
              </button>
            </div>

            {!showPasswordForm ? (
              <div className="text-center py-8">
                <i className="fas fa-shield-alt text-5xl text-primary/20 mb-4"></i>
                <p className="text-text-muted font-medium">Click "Change Password" to update your security</p>
              </div>
            ) : (
              <form onSubmit={handleChangePassword} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-sm font-bold text-text-dark mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-sm font-bold text-text-dark mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Enter new password (min 8 characters)"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-bold text-text-dark mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 py-2.5 px-4 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-lock"></i>
                        Update Password
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(false)}
                    className="flex-1 py-2.5 px-4 bg-gray-200 text-text-dark font-bold rounded-lg hover:bg-gray-300 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
