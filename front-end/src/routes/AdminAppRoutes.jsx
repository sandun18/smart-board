import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import AdminProtectedRoute from "../components/admin/common/AdminProtectedRoute.jsx";
import AdminLayout from "../components/admin/layout/AdminLayout.jsx";

// Admin Pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminAds from "../pages/admin/AdminAds";
import AdminReports from "../pages/admin/AdminReports";
import AdminSettings from "../pages/admin/AdminSettings";
import AdminThirdParty from "../pages/admin/AdminThirdParty";
import AdminAnalytics from "../pages/admin/AdminAnalytics";

const AdminAppRoutes = () => {
  return (
    <Routes>
      {/* ==================== PROTECTED ADMIN ROUTES ==================== */}
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/" index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="ads" element={<AdminAds />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="thirdparty" element={<AdminThirdParty />} />
        </Route>
      </Route>

      {/* ==================== FALLBACK ROUTE ==================== */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AdminAppRoutes;
