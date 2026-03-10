import { Routes, Route, Navigate } from "react-router-dom";
import OwnerProtectedRoute from "../components/Owner/common/OwnerProtectedRoute.jsx";
import OwnerLayout from "../layouts/OwnerLayout";

// Owner Pages
import Dashboard from "../pages/owner/Dashboard";
import MyAdsPage from "../pages/owner/MyAdsPage";
import CreateAdPage from "../pages/owner/CreateAdPage";
import EditAdPage from "../pages/owner/EditAdPage";
import AppointmentsPage from "../pages/owner/AppointmentsPage";
import RegistrationPage from "../pages/owner/RegistrationPage.jsx";
import MyBoardingsPage from "../pages/owner/MyBoardingsPage";
import UtilityPage from "../pages/owner/UtilityPage";
import UtilityDetails from "../pages/owner/utilities/UtilityDetails.jsx";
import AddUtility from "../pages/owner/utilities/AddUtility.jsx";
import OwnerPaymentApprovals from "../pages/owner/utilities/OwnerPaymentApprovals";
import MaintenancePage from "../pages/owner/MaintenancePage.jsx";
import ProfilePage from "../pages/owner/ProfilePage";
import ReportsPage from "../pages/owner/ReportsPage";
import ReportStudentPage from "../pages/owner/AddReportPage";
import SubscriptionPlanPage from "../pages/owner/SubscriptionPlanPage";
import PaymentPage from "../pages/owner/PaymentPage";

const OwnerAppRoutes = () => {
  return (
    <Routes>

      {/* ==================== PROTECTED OWNER ROUTES ==================== */}
      <Route element={<OwnerProtectedRoute />}>
        <Route path="/" element={<OwnerLayout />}>

          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="myAds" element={<MyAdsPage />} />
          <Route path="myAds/createAd" element={<CreateAdPage />} />
          <Route path="myAds/editAd/:adId" element={<EditAdPage />} />

          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="registrations" element={<RegistrationPage />} />
          <Route path="myboardings" element={<MyBoardingsPage />} />

          {/* ==================== UTILITIES ==================== */}
          <Route path="utility" element={<UtilityPage />} />
          <Route path="utility/details" element={<UtilityDetails />} />
          <Route path="utility/add" element={<AddUtility />} />
          <Route
            path="utility/payment-verify"
            element={<OwnerPaymentApprovals />}
          />

          {/* ==================== OTHER ==================== */}
          <Route path="maintenance" element={<MaintenancePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="payment" element={<PaymentPage />} />

          <Route path="reports" element={<ReportsPage />} />
          <Route path="reports/add" element={<ReportStudentPage />} />

          <Route
            path="subscriptions/:adId"
            element={<SubscriptionPlanPage />}
          />

        </Route>
      </Route>

      {/* ==================== FALLBACK ==================== */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default OwnerAppRoutes;
