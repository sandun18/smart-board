import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/student/common/ProtectedRoute";

import ChatList from "../pages/chat/ChatList";
import ChatRoom from "../pages/chat/ChatRoom";

// Student Pages
import StudentDashboard from "../pages/student/StudentDashboard";
import AppointmentsPage from "../pages/student/AppointmentsPage";
import SearchBoardingsPage from "../pages/student/SearchBoardingsPage";
import BoardingDetailsPage from "../pages/student/BoardingDetailsPage";
import MyBoardingsPage from "../pages/student/MyBoardingsPage";
import BillingPage from "../pages/student/BillingPage";
import MaintenancePage from "../pages/student/MaintenancePage";
import ReportsPage from "../pages/student/ReportsPage";
import ProfilePage from "../pages/student/ProfilePage";

// Payment Pages
import SelectPaymentMethod from "../pages/student/payments/pay/select-method/SelectPaymentMethod";
import BankSlipPayment from "../pages/student/payments/pay/bank-slip/BankSlipPayment";
import CashPayment from "../pages/student/payments/pay/cash/CashPayment";
import CardPayment from "../pages/student/payments/pay/card/CardPayment";
import PaymentSuccess from "../pages/student/payments/pay/success/PaymentSuccess";

const StudentAppRoutes = () => {
  return (
    <Routes>

      {/* ==================== PROTECTED ROUTES ==================== */}
      <Route path="/" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />

      <Route path="appointmentpage" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
      <Route path="search-boardings" element={<ProtectedRoute><SearchBoardingsPage /></ProtectedRoute>} />
      <Route path="boarding-details/:id" element={<ProtectedRoute><BoardingDetailsPage /></ProtectedRoute>} />
      <Route path="my-boardings" element={<ProtectedRoute><MyBoardingsPage /></ProtectedRoute>} />
      <Route path="billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
      <Route path="maintenance" element={<ProtectedRoute><MaintenancePage /></ProtectedRoute>} />
      <Route path="reports" element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/chats" element={<ChatList />} />
      <Route path="/chat/:roomId" element={<ChatRoom />} />
      {/* ==================== PAYMENT ROUTES (PROTECTED) ==================== */}
      <Route
        path="payments/pay/select-method/:intentId"
        element={
          <ProtectedRoute>
            <SelectPaymentMethod />
          </ProtectedRoute>
        }
      />

      <Route
        path="payments/pay/bank-slip/:intentId"
        element={
          <ProtectedRoute>
            <BankSlipPayment />
          </ProtectedRoute>
        }
      />

      <Route
        path="payments/pay/card/:intentId"
        element={<ProtectedRoute><CardPayment /></ProtectedRoute>}
      />

      <Route
        path="payments/success/payment-success"
        element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>}
      />

      <Route
        path="payments/pay/cash/:intentId"
        element={
          <ProtectedRoute>
            <CashPayment />
          </ProtectedRoute>
        }
      />
      

      {/* ==================== FALLBACK ==================== */}
      <Route path="*" element={<Navigate to="/login" replace />} />

    </Routes>
  );
};

export default StudentAppRoutes;
