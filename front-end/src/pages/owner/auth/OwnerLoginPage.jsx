import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useOwnerAuth } from "../../../context/owner/OwnerAuthContext.jsx";
import LoginForm from "../../../components/Owner/auth/OwnerLoginForm.jsx";
import { motion } from "framer-motion";
import logo from "../../../assets/logo.png";
import backgroundImage from "../../../assets/s5.jpg";

const OwnerLoginPage = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, isLoading: authLoading } = useOwnerAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate("/owner/dashboard", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError("");

    // --- REAL BACKEND CONNECTION ---
    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Success: Redirect happens automatically via useEffect or manually here
      navigate("/owner/dashboard", { replace: true });
    } else {
      // Failure: Show error from Backend
      setError(result.message);
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: "blur(8px)",
          transform: "scale(1.1)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/30 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/95 backdrop-blur-md rounded-large shadow-2xl p-8 md:p-12 border border-white/20"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.img
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                src={logo}
                alt="SmartBoAD Logo"
                className="w-[80px] h-[80px]"
              />
              <motion.h1
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              >
                SmartBoAD
              </motion.h1>
            </div>
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-text-dark mb-2"
            >
              Partner Portal
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-text-muted"
            >
              Sign in to manage your properties
            </motion.p>
          </div>

          {/* Login Form */}
          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoading}
            error={error}
          />

          {/* Signup Link */}
          <div className="mt-8 text-center">
            <p className="text-text-muted">
              Want to list a property?{" "}
              <Link
                to="/owner/signup"
                className="text-accent hover:text-primary font-semibold transition-colors"
              >
                Register
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white text-sm mt-8 drop-shadow-lg"
        >
          © 2024 SmartBoAD. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
};

export default OwnerLoginPage;
