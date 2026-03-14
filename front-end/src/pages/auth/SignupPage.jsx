import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";

// --- CONTEXT IMPORTS ---
import { useAuth as useStudentAuth } from "../../context/student/StudentAuthContext";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext";
import { useAuth as useAdminAuth } from "../../context/admin/AdminAuthContext";

// --- COMPONENT IMPORTS ---
import StudentSignupForm from "../../components/student/auth/StudentSignupForm";
import OwnerSignupForm from "../../components/Owner/auth/OwnerSignupForm";
import AdminSignupForm from "../../components/admin/auth/AdminSignupForm";

// --- ASSETS ---
import backgroundImage from "../../assets/s5.jpg";
import logo from "../../assets/logo.png";

const SignupPage = () => {
  const navigate = useNavigate();

  // UI States
  const [role, setRole] = useState("student"); // 'student' or 'owner'
  const [step, setStep] = useState(1); // 1 = Details, 2 = OTP
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Logic States
  const [emailForOtp, setEmailForOtp] = useState("");
  const [otpCode, setOtpCode] = useState("");

  // --- AUTH HOOKS ---
  // We alias the functions to avoid naming collisions
  const { signup: signupStudent, verifyRegistration: verifyStudent } =
    useStudentAuth();

  const { signup: signupOwner, verifyRegistration: verifyOwner } =
    useOwnerAuth();

  const { signup: signupAdmin, verifyRegistration: verifyAdmin } =
    useAdminAuth();

  // --- HANDLER: Step 1 (Submit Details) ---
  const handleSignup = async (formData) => {
    setIsLoading(true);
    setError("");

    try {
      let result;
      // Store email for Step 2
      setEmailForOtp(formData.email);

      if (role === "student") {
        // Call Student Context
        result = await signupStudent(formData);
      } else if (role === "owner") {
        // Call Owner Context
        result = await signupOwner(formData);
      } else if (role === "admin") {
        // Call Admin Context
        result = await signupAdmin(formData);
      }

      if (result && result.success) {
        // Success: Move to OTP Step
        setStep(2);
      } else {
        setError(result?.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- HANDLER: Step 2 (Verify OTP) ---
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let result;

      if (role === "student") {
        // Verify Student
        result = await verifyStudent(emailForOtp, otpCode);
        if (result && result.success) {
          navigate("/student", { replace: true });
        }
      } else if (role === "owner") {
        // Verify Owner
        result = await verifyOwner(emailForOtp, otpCode);
        if (result && result.success) {
          navigate("/owner/dashboard", { replace: true });
        }
      } else if (role === "admin") {
        // Verify Admin
        result = await verifyAdmin(emailForOtp, otpCode);
        if (result && result.success) {
          navigate("/admin/dashboard", { replace: true });
        }
      }

      if (!result?.success) {
        setError(result?.message || "Invalid OTP code");
      }
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 py-8 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "blur(8px)",
          transform: "scale(1.1)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 backdrop-blur-sm" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-4xl">
        {/* Back to Login Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
        >
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 mb-6 font-semibold drop-shadow-lg bg-white/10 backdrop-blur-sm px-4 py-2 rounded-large hover:bg-white/20 transition-all"
          >
            <FaArrowLeft /> Back to Login
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-md rounded-large shadow-2xl p-6 md:p-12 border border-white/20 max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SmartBoAD
            </h1>
            <h2 className="text-xl font-bold text-text-dark mt-2">
              {step === 2 ? "Verify Email" : "Create Account"}
            </h2>
            {step === 2 && (
              <p className="text-sm text-text-muted mt-1">
                We sent a code to {emailForOtp}
              </p>
            )}
          </div>

          {/* Role Toggle (Only show if in Step 1) */}
          {step === 1 && (
            <div className="flex max-w-xs mx-auto p-1 bg-gray-100 rounded-lg mb-8 shadow-inner">
              <button
                onClick={() => {
                  setRole("student");
                  setError("");
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  role === "student"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Student
              </button>
              <button
                onClick={() => {
                  setRole("owner");
                  setError("");
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  role === "owner"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Owner
              </button>
              <button
                onClick={() => {
                  setRole("admin");
                  setError("");
                }}
                className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${
                  role === "admin"
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Admin
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200 text-center animate-pulse">
              {error}
            </div>
          )}

          {/* DYNAMIC CONTENT AREA */}
          <AnimatePresence mode="wait">
            {/* STEP 2: OTP VERIFICATION (Shared for both roles) */}
            {step === 2 ? (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="max-w-md mx-auto"
              >
                <form
                  onSubmit={handleOtpVerification}
                  className="space-y-6 text-center"
                >
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) =>
                      setOtpCode(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    className="w-full text-center text-3xl tracking-[0.5em] font-bold py-4 border-2 border-gray-200 rounded-xl focus:border-accent focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={isLoading || otpCode.length < 6}
                    className="w-full py-3 bg-accent text-white font-bold rounded-lg hover:bg-primary transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Verifying..." : "Complete Registration"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError("");
                    }}
                    className="text-sm text-gray-500 underline hover:text-gray-800"
                  >
                    Wrong email? Go back
                  </button>
                </form>
              </motion.div>
            ) : (
              /* STEP 1: REGISTRATION FORMS */
              <motion.div
                key="forms"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {role === "student" ? (
                  <StudentSignupForm
                    onSubmit={handleSignup}
                    isLoading={isLoading}
                  />
                ) : role === "owner" ? (
                  <OwnerSignupForm
                    onSubmit={handleSignup}
                    isLoading={isLoading}
                  />
                ) : (
                  <AdminSignupForm
                    onSubmit={handleSignup}
                    isLoading={isLoading}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer Link (Hide if in OTP mode) */}
          {step === 1 && (
            <div className="mt-8 text-center">
              <p className="text-text-muted text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-accent hover:text-primary font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default SignupPage;
