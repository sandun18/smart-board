import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useOwnerAuth } from '../../../context/owner/OwnerAuthContext.jsx';

const OwnerProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useOwnerAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light">
        <div className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/owner/login" replace />;
  }

  // ✅ FIX: Render children if they exist, otherwise render Outlet
  return children ? children : <Outlet />;
};

export default OwnerProtectedRoute;