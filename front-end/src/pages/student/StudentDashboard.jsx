import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/student/common/StudentLayout";
import StatWidget from "../../components/student/dashbord/StatWidget";
import QuickActionsSection from "../../components/student/dashbord/QuickActionsSection";
import RecentActivitySection from "../../components/student/dashbord/RecentActivitySection";
import {
  FaCalendarCheck,
  FaStar,
  FaHome,
  FaFileInvoiceDollar,
  FaComments, // ✅ NEW
} from "react-icons/fa";
import useDashboardLogic from "../../hooks/student/useDashboardLogic";

const StudentDashboard = () => {
  const { stats, recentActivity, loading } = useDashboardLogic();
  const navigate = useNavigate();

  const handlePayNow = () => {
    navigate("/student/billing");
  };

  const goToChats = () => {
    navigate("/student/chats");
  };

  return (
    <StudentLayout subtitle="Here's your boarding overview">
      {/* Stats Overview */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 min-[1400px]:grid-cols-4 gap-4 md:gap-6 items-stretch">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loading ? 0.5 : 1, y: 0 }}
            className="h-full"
          >
            <StatWidget
              icon={<FaCalendarCheck />}
              title="Upcoming Visit"
              mainDetail={
                stats.upcomingVisit
                  ? stats.upcomingVisit.normalizedDate.toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )
                  : "No approved visits"
              }
              subDetail={
                stats.upcomingVisit
                  ? `${stats.upcomingVisit.normalizedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${stats.upcomingVisit.widgetDetail}`
                  : "Check your activity for updates"
              }
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loading ? 0.5 : 1, y: 0 }}
            className="h-full"
          >
            <StatWidget
              icon={<FaFileInvoiceDollar />}
              title="Monthly Rent"
              mainDetail={
                stats.pendingPayment
                  ? `LKR ${stats.pendingPayment.amount.toLocaleString()}`
                  : "No Active Rent"
              }
              subDetail={
                stats.pendingPayment
                  ? `Due: ${stats.pendingPayment.dueDate}`
                  : "All clear"
              }
              actionButton={
                stats.pendingPayment
                  ? { label: "Pay Now", onClick: handlePayNow }
                  : null
              }
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loading ? 0.5 : 1, y: 0 }}
            className="h-full"
          >
            <StatWidget
              icon={<FaHome />}
              title="Current Boarding"
              mainDetail={
                stats.currentBoarding
                  ? stats.currentBoarding.boardingTitle
                  : "Not Registered"
              }
              subDetail={
                stats.currentBoarding
                  ? `Since ${new Date(
                      stats.currentBoarding.startDate,
                    ).toLocaleDateString()}`
                  : "Find a place"
              }
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loading ? 0.5 : 1, y: 0 }}
            className="h-full"
          >
            <StatWidget
              icon={<FaStar />}
              title="My Reviews"
              mainDetail={`${stats.reviewCount} Reviews`}
              subDetail={
                stats.reviewCount > 0
                  ? `${stats.reviewAvg}⭐ Average`
                  : "Start reviewing!"
              }
            />
          </motion.div>
        </div>
      </section>

      {/* ✅ CHAT BUTTON SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={goToChats}
          className="w-full sm:w-auto flex items-center gap-3 px-6 py-3 rounded-xl bg-accent text-white font-semibold shadow-md hover:bg-primary transition-all"
        >
          <FaComments className="text-lg" />
          Open Chats
        </button>
      </motion.div>

      <QuickActionsSection />

      <RecentActivitySection activities={recentActivity} />
    </StudentLayout>
  );
};

export default StudentDashboard;
