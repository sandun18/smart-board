import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./ScrollToTop";
import Home from "./Home.jsx";

// --- CONTEXT PROVIDERS ---
import { StudentAuthProvider } from "./context/student/StudentAuthContext.jsx";
import { OwnerAuthProvider } from "./context/owner/OwnerAuthContext.jsx";
import { TechnicianAuthProvider } from "./context/technician/TechnicianAuthContext.jsx";
import { AdminAuthProvider } from "./context/admin/AdminAuthContext.jsx";

// --- ROUTE FILES ---
import StudentAppRoutes from "./routes/StudentAppRoutes.jsx";
import OwnerAppRoutes from "./routes/OwnerAppRoutes";
import TechnicianAppRoutes from "./routes/TechnicianAppRoutes.jsx";
import AdminAppRoutes from "./routes/AdminAppRoutes";

// --- AUTH PAGES ---
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

// --- PUBLIC PROFILE ---
import PublicProfileView from "./pages/common/PublicProfileView.jsx";

// --- CHATBOT OVERLAY ---
import ChatOverlay from "./components/chatbot/ChatOverlay";

function App() {
  return (
    <>
      <StudentAuthProvider>
        <OwnerAuthProvider>
          <TechnicianAuthProvider>
            <AdminAuthProvider>

              <ScrollToTop />

              <Toaster
                position="top-right"
                toastOptions={{
                  style: {
                    background: "#333",
                    color: "#fff",
                    borderRadius: "10px",
                    fontSize: "14px",
                  },
                }}
              />

              {/* ==================== ROUTES ==================== */}

              <Routes>

                {/* GLOBAL AUTH */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* STUDENT */}
                <Route path="/student/*" element={<StudentAppRoutes />} />

                {/* OWNER */}
                <Route path="/owner/*" element={<OwnerAppRoutes />} />

                {/* TECHNICIAN */}
                <Route path="/technician/*" element={<TechnicianAppRoutes />} />

                {/* ADMIN */}
                <Route path="/admin/*" element={<AdminAppRoutes />} />

                {/* PUBLIC PROFILE */}
                <Route
                  path="/profile/view/:id"
                  element={<PublicProfileView />}
                />

                {/* LANDING PAGE */}
                <Route path="/" element={<Home />} />

              </Routes>

              {/* ==================== GLOBAL CHATBOT ==================== */}
              {/* Always visible bottom-right */}
              <ChatOverlay />

            </AdminAuthProvider>
          </TechnicianAuthProvider>
        </OwnerAuthProvider>
      </StudentAuthProvider>
    </>
  );
}

export default App;