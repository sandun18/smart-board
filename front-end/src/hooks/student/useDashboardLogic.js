import { useState, useEffect, useCallback } from "react";
import StudentService from "../../api/student/StudentService";
import { useAuth } from "../../context/student/StudentAuthContext";
import {
  FaCalendarCheck,
  FaCreditCard,
  FaStar,
  FaHome,
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
      const [appointments, registrations, payments, reviews] =
        await Promise.all([
          StudentService.getAllAppointments(currentUser.id).catch(() => []),
          StudentService.getAllRegistrations(currentUser.id).catch(() => []),
          StudentService.getPaymentHistory().catch(() => []),
          StudentService.getMyReviews(currentUser.id).catch(() => []),
        ]);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // --- 1. PROCESS APPOINTMENTS FOR WIDGET & NOTIFICATIONS ---
      const processedAppointments = appointments.map((appt) => {
        const rawDate = appt.requestedStartTime || appt.appointmentDate || appt.visitDate || appt.date || appt.createdDate;
        const status = (appt.status || appt.appointmentStatus || "PENDING").toUpperCase();

        const ownerName = appt.ownerName || "Owner";
        const boardingTitle = appt.boardingTitle || appt.boardingName || "Boarding";

        let notificationMessage = `You requested a visit for ${boardingTitle}`;
        let activityIcon = FaHourglassHalf;

        if (status === "APPROVED" || status === "ACCEPTED") {
          notificationMessage = `${ownerName} accepted your visit for ${boardingTitle}`;
          activityIcon = FaCalendarCheck;
        } else if (status === "REJECTED" || status === "DECLINED") {
          notificationMessage = `${ownerName} declined your visit for ${boardingTitle}`;
          activityIcon = FaBan;
        }

        return {
          ...appt,
          rawDate: rawDate, 
          normalizedDate: new Date(rawDate),
          status: status,
          notificationContent: notificationMessage,
          icon: activityIcon,
          widgetDetail: `${ownerName} @ ${boardingTitle}`,
        };
      });

      // --- WIDGET 1: Next Approved Visit ---
      const nextVisit = processedAppointments
        .filter((a) => {
          // 1. Validation: Date must be valid
          if (isNaN(a.normalizedDate.getTime())) return false;
          
          
          const isConfirmed = a.status === "APPROVED" || a.status === "ACCEPTED";
          
          // 3. DATE FILTER: Must be today or in the future
          const startOfToday = new Date().setHours(0, 0, 0, 0);
          const isUpcoming = a.normalizedDate.getTime() >= startOfToday;

          return isConfirmed && isUpcoming;
        })
        // 4. SORT: Put the earliest date at index 0
        .sort((a, b) => a.normalizedDate - b.normalizedDate)[0]; 

      // Update state
      setStats(prev => ({
        ...prev,
        upcomingVisit: nextVisit 
      }));

      // --- Widgets 2, 3, 4 (No changes) ---
      const activeReg = registrations.find((r) => r.status === "APPROVED");
      let paymentInfo = null;
      if (activeReg) {
        paymentInfo = {
          amount: activeReg.monthlyRent || 0,
          location: activeReg.boardingTitle || "Your Boarding",
          dueDate: "5th of Month",
        };
      }
      const reviewAvg =
        reviews.length > 0
          ? (
              reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
            ).toFixed(1)
          : 0;

      setStats({
        upcomingVisit: nextVisit,
        pendingPayment: paymentInfo,
        currentBoarding: activeReg,
        reviewCount: reviews.length,
        reviewAvg: reviewAvg,
      });

      // --- 2. CONSTRUCT RECENT ACTIVITY FEED (STRICT FILTER APPLIED) ---
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      // Filter only for Appointments within the last 14 days
      const appointmentOnlyActivity = processedAppointments
        .filter((a) => {
          const activityDate = new Date(a.rawDate);
          return activityDate >= fourteenDaysAgo;
        })
        .map((a) => ({
          id: `apt-${a.id}`,
          type: "appointment",
          rawDate: a.rawDate,
          content: a.notificationContent,
          icon: a.icon,
          status: a.status,
          timeAgo: getTimeAgo(a.rawDate),
        }));

      // Sort and update activity feed using only appointment-based notifications
      setRecentActivity(appointmentOnlyActivity.sort((a, b) => new Date(b.rawDate) - new Date(a.rawDate)));
      
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