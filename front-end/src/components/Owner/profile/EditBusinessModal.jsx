import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaSave, FaSpinner, FaLock } from "react-icons/fa";

const EditBusinessModal = ({ isOpen, onClose, ownerData, onSubmit }) => {
  const [formData, setFormData] = useState({
    businessName: "",
    phone: "",
    email: "",
    address: "", // ✅ Added Address to state
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        businessName: ownerData.businessName || "",
        phone: ownerData.phone || "",
        email: ownerData.email || "",
        address: ownerData.address || "", // ✅ Load existing address
      });
    }
  }, [isOpen, ownerData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Send updated fields to the parent handler
    await onSubmit({
      businessName: formData.businessName,
      phone: formData.phone,
      address: formData.address, // ✅ Send address
    });

    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card-bg rounded-large shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-100 bg-card-bg">
              <h3 className="text-2xl font-bold text-primary">
                Edit Business Info
              </h3>
              <button
                onClick={onClose}
                className="transition-colors duration-200 text-text-muted hover:text-text-dark"
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Email (Read-Only) */}
                <div>
                  <label className="block mb-2 font-semibold text-text-dark">
                    Email Address{" "}
                    <span className="text-xs font-normal text-text-muted">
                      (Cannot be changed)
                    </span>
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      className="w-full p-3 pl-10 text-gray-500 bg-gray-100 border-2 border-gray-200 cursor-not-allowed rounded-btn focus:outline-none"
                    />
                    <FaLock className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" />
                  </div>
                </div>

                {/* Business Name */}
                <div>
                  <label className="block mb-2 font-semibold text-text-dark">
                    Business / Owner Name <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleChange}
                    required
                    placeholder="Enter full name"
                    className="w-full p-3 transition-colors duration-200 border-2 border-gray-200 rounded-btn focus:border-accent focus:outline-none"
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block mb-2 font-semibold text-text-dark">
                    Phone Number <span className="text-error">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="07XXXXXXXX"
                    className="w-full p-3 transition-colors duration-200 border-2 border-gray-200 rounded-btn focus:border-accent focus:outline-none"
                  />
                </div>

                {/* ✅ Address Field Added Back */}
                <div>
                  <label className="block mb-2 font-semibold text-text-dark">
                    Business Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter main business address"
                    className="w-full p-3 transition-colors duration-200 border-2 border-gray-200 rounded-btn focus:border-accent focus:outline-none resize-vertical"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-4 pt-6 mt-8 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 font-semibold transition-all duration-300 border-2 rounded-large border-text-muted text-text-muted hover:bg-text-muted hover:text-white"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-6 py-3 rounded-large font-semibold transition-all duration-300 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-accent text-white hover:bg-primary shadow-lg"
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

export default EditBusinessModal;
