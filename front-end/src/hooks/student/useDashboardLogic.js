import { useState, useEffect, useCallback } from "react";
import StudentService from "../../api/student/StudentService";
import { useAuth } from "../../context/student/StudentAuthContext";
import {
  FaCalendarCheck,
  FaBan,
  FaHourglassHalf,
} from "react-icons/fa";

const useDashboardLogic = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    upcomingVisit: null,
    pendingPayment: null,
    currentBoarding: null,
    reviewCount: 0,
    reviewAvg: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const getTimeAgo = (date) => {
    if (!date) return "";
    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);
    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return past.toLocaleDateString(); 
  };

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    try {
      // 1. Fetch all data in parallel
      const [appointments, registrations, bills, reviews] =
        await Promise.all([
          StudentService.getAllAppointments(currentUser.id).catch(() => []),
          StudentService.getRegistrations(currentUser.id).catch(() => []),
          StudentService.getStudentBills().catch(() => []), // ✅ Now calls MonthlyBillController
          StudentService.getMyReviews(currentUser.id).catch(() => []),
        ]);

      // --- PROCESS APPOINTMENTS ---
      const processedAppointments = appointments.map((appt) => {
        const rawDate = appt.requestedStartTime || appt.appointmentDate || appt.visitDate;
        const status = (appt.status || "PENDING").toUpperCase();
        return {
          ...appt,
          rawDate,
          normalizedDate: new Date(rawDate),
          status,
          notificationContent: status === "APPROVED" ? `Accepted visit for ${appt.boardingTitle}` : `Requested visit for ${appt.boardingTitle}`,
          icon: status === "APPROVED" ? FaCalendarCheck : FaHourglassHalf,
          widgetDetail: `${appt.ownerName || 'Owner'} @ ${appt.boardingTitle}`,
        };
      });

      const nextVisit = processedAppointments
        .filter(a => (a.status === "APPROVED" || a.status === "ACCEPTED") && new Date(a.rawDate) >= new Date().setHours(0,0,0,0))
        .sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate))[0];

      // --- PROCESS RENT & BILLS ---
      const activeReg = registrations.find((r) => r.status === "APPROVED");
      
      // Look for any unpaid bill from the MonthlyBillController data
      const unpaidBill = bills.find(b => b.status === "UNPAID");
      
      let paymentInfo = null;
      if (unpaidBill) {
        // Option A: There is a real generated bill
        paymentInfo = {
          amount: unpaidBill.totalAmount,
          dueDate: unpaidBill.month, // e.g., "MARCH 2026"
        };
      } else if (activeReg) {
        // Option B: Fallback to the default rent from the approved boarding
        paymentInfo = {
          amount: activeReg.monthlyRent || 0,
          dueDate: "Current Month",
        };
      }

      // --- PROCESS REVIEWS ---
      const reviewAvg = reviews.length > 0
          ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
          : 0;

      // --- UPDATE STATS ---
      setStats({
        upcomingVisit: nextVisit,
        pendingPayment: paymentInfo,
        currentBoarding: activeReg,
        reviewCount: reviews.length,
        reviewAvg: reviewAvg,
      });

      // --- ACTIVITY FEED ---
      setRecentActivity(
        processedAppointments
          .filter(a => new Date(a.rawDate) >= new Date().setDate(new Date().getDate() - 14))
          .map(a => ({
            id: `apt-${a.id}`,
            content: a.notificationContent,
            icon: a.icon,
            timeAgo: getTimeAgo(a.rawDate),
            rawDate: a.rawDate
          }))
          .sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate))
      );
      
    } catch (error) {
      console.error("Dashboard Load Error:", error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return { stats, recentActivity, loading, currentUser };
};

export default useDashboardLogic;