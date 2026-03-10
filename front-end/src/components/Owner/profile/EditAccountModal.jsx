import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaSave,
  FaSpinner,
  FaLock,
  FaUniversity,
} from "react-icons/fa";

const EditAccountModal = ({ isOpen, onClose, currentAccNo, onSubmit }) => {
  const [formData, setFormData] = useState({
    accNo: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        accNo: currentAccNo || "", // Pre-fill current bank account
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setError(null);
      setSuccessMsg(null);
    }
  }, [isOpen, currentAccNo]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const isPasswordChange = formData.newPassword.length > 0;

    // Validation
    if (isPasswordChange) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match.");
        return;
      }
      if (formData.newPassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (!formData.currentPassword) {
        setError("Please enter your current password to save changes.");
        return;
      }
    }

    setIsLoading(true);
    try {
      // Pass data to parent to handle API calls
      await onSubmit({
        accNo: formData.accNo,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        isPasswordChange, // Flag to tell parent if password needs updating
      });

      setSuccessMsg("Changes saved successfully!");
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to update account settings.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg overflow-hidden shadow-2xl bg-card-bg rounded-large"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 bg-white border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-xl font-bold text-primary">
                <FaLock /> Account Settings
              </h3>
              <button
                onClick={onClose}
                className="transition-colors text-text-muted hover:text-text-dark"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 rounded-btn">
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="p-3 text-sm text-green-700 bg-green-100 rounded-btn">
                  {successMsg}
                </div>
              )}

              {/* Section 1: Bank Details */}
              <div className="space-y-3">
                <label className="flex items-center block gap-2 text-sm font-semibold text-text-dark">
                  <FaUniversity className="text-accent" /> Bank Account Number
                </label>
                <input
                  type="text"
                  name="accNo"
                  value={formData.accNo}
                  onChange={handleChange}
                  placeholder="Enter Account Number"
                  className="w-full p-3 transition-colors border-2 border-gray-200 rounded-btn focus:border-accent focus:outline-none"
                />
                <p className="text-xs text-text-muted">
                  Used for receiving payments from students.
                </p>
              </div>

              <hr className="border-gray-100" />

              {/* Section 2: Password Change */}
              <div className="space-y-4">
                <h4 className="text-sm font-semibold tracking-wider uppercase text-text-muted">
                  Change Password
                </h4>

                <div>
                  <label className="block mb-1 text-sm text-text-dark">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Required only if changing password"
                    className="w-full p-3 border-2 border-gray-200 rounded-btn focus:border-accent focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-sm text-text-dark">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-btn focus:border-accent focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm text-text-dark">
                      Confirm New
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full p-3 border-2 border-gray-200 rounded-btn focus:border-accent focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-large font-semibold text-white transition-all duration-300 shadow-lg ${
                    isLoading ? "bg-gray-400" : "bg-primary hover:bg-accent"
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditAccountModal;
