import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import ForgotPasswordModal from "./ForgotPasswordModal";

const UnifiedLoginForm = ({ onSubmit, isLoading, error }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPwOpen, setIsForgotPwOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-text-dark">
            Email Address
          </label>
          <div className="relative">
            <FaEnvelope className="absolute -translate-y-1/2 left-4 top-1/2 text-text-muted" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email address"
              className="w-full py-3 pl-12 pr-4 transition-colors duration-200 border-2 border-gray-200 rounded-large focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block mb-2 text-sm font-semibold text-text-dark">
            Password
          </label>
          <div className="relative">
            <FaLock className="absolute -translate-y-1/2 left-4 top-1/2 text-text-muted" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full py-3 pl-12 pr-12 transition-colors duration-200 border-2 border-gray-200 rounded-large focus:border-accent focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute -translate-y-1/2 right-4 top-1/2 text-text-muted hover:text-text-dark"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 accent-accent"
            />
            <span className="text-sm text-text-dark">Remember me</span>
          </label>

          <button
            type="button"
            onClick={() => setIsForgotPwOpen(true)}
            className="text-sm font-semibold transition-colors text-accent hover:text-primary"
          >
            Forgot Password?
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-3 text-sm border bg-error/10 border-error text-error rounded-large"
          >
            {error}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-4 rounded-large font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-accent text-white hover:bg-primary shadow-lg"
          }`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-white rounded-full border-3 border-t-transparent animate-spin"></div>
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </motion.button>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPwOpen}
        onClose={() => setIsForgotPwOpen(false)}
      />
    </>
  );
};

export default UnifiedLoginForm;
