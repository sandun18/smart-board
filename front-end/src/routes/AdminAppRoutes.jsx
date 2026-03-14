import { Routes, Route, Navigate } from "react-router-dom";
import AdminProtectedRoute from "../components/admin/AdminProtectedRoute.jsx";
import AdminLayout from "../layouts/AdminLayout";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import SubscriptionPlansMovedPage from "../pages/admin/SubscriptionPlansMovedPage";

const AdminAppRoutes = () => {
  return (
    <Routes>
      {/* ==================== PROTECTED ADMIN ROUTES ==================== */}
      <Route element={<AdminProtectedRoute />}>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route
            path="subscription-plans"
            element={<SubscriptionPlansMovedPage />}
          />
        </Route>
      </Route>

      {/* ==================== FALLBACK ==================== */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AdminAppRoutes;
