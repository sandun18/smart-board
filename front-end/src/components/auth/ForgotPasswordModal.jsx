import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaKey, FaTimes } from "react-icons/fa";
import api from "../../api/api";




const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // RESET STATE ON CLOSE
  const handleClose = () => {
    setStep(1);
    setEmail("");
    setOtp("");
    setNewPassword("");
    setMessage({ type: "", text: "" });
    onClose();
  };

  // STEP 1: REQUEST OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Calls AuthController.java -> forgotPassword()
      await api.post(`/auth/forgot-password`, { email });
      setMessage({ type: "success", text: "OTP sent to your email!" });
      setStep(2);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data || "User not found or error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: RESET PASSWORD
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // Calls AuthController.java -> resetPassword()
      await api.post(`/auth/reset-password`, {
        email,
        otp,
        newPassword,
      });
      setMessage({
        type: "success",
        text: "Password reset successfully! Please login.",
      });

      // Close modal after 2 seconds on success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data || "Invalid OTP or error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-large"
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute text-gray-400 transition-colors top-4 right-4 hover:text-gray-600"
          >
            <FaTimes size={20} />
          </button>

          <div className="p-8">
            <h2 className="mb-2 text-2xl font-bold text-text-dark">
              {step === 1 ? "Reset Password" : "Enter New Password"}
            </h2>
            <p className="mb-6 text-sm text-text-muted">
              {step === 1
                ? "Enter your email address to receive a verification OTP."
                : `Enter the OTP sent to ${email} and your new password.`}
            </p>

            {/* Error/Success Message */}
            {message.text && (
              <div
                className={`p-3 rounded-lg text-sm mb-4 ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            {step === 1 ? (
              // --- STEP 1 FORM ---
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="relative">
                  <FaEnvelope className="absolute -translate-y-1/2 left-4 top-1/2 text-text-muted" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full py-3 pl-12 pr-4 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 font-bold text-white transition-colors rounded-lg bg-accent hover:bg-primary disabled:bg-gray-400"
                >
                  {isLoading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              // --- STEP 2 FORM ---
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <FaKey className="absolute -translate-y-1/2 left-4 top-1/2 text-text-muted" />
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                    className="w-full py-3 pl-12 pr-4 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute -translate-y-1/2 left-4 top-1/2 text-text-muted" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="w-full py-3 pl-12 pr-4 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 font-bold text-white transition-colors rounded-lg bg-accent hover:bg-primary disabled:bg-gray-400"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-sm underline text-text-muted hover:text-text-dark"
                >
                  Back to Email
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
