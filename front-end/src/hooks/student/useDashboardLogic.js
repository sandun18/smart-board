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

  // ✅ IMPROVED TimeAgo Logic with Better Date Parsing
  const getTimeAgo = (date) => {
    if (!date) return "Recently";
    
    // Handle different date formats
    let past;
    if (typeof date === 'string') {
      // If it's an ISO string without 'Z', assume UTC
      past = date.endsWith('Z') ? new Date(date) : new Date(date + 'Z');
    } else {
      past = new Date(date);
    }
    
    if (isNaN(past.getTime())) return "Recently";

    const now = new Date();
    const diffInSeconds = Math.floor((now - past) / 1000);
    
    // ✅ DEBUG LOG (Remove after testing)
    console.log('Time calculation:', {
      now: now.toISOString(),
      past: past.toISOString(),
      diffInSeconds,
      diffInMinutes: Math.floor(diffInSeconds / 60)
    });
    
    // Handle future dates (server clock slightly ahead)
    if (diffInSeconds < -60) return "Recently";
    if (diffInSeconds < 60) return "Just now";
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    // For older dates, show formatted date
    return past.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: past.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    }); 
  };

  const fetchDashboardData = useCallback(async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    try {
      const [appointments, registrations, bills, reviews] =
        await Promise.all([
          StudentService.getAllAppointments(currentUser.id).catch(() => []),
          StudentService.getRegistrations(currentUser.id).catch(() => []),
          StudentService.getStudentBills().catch(() => []),
          StudentService.getMyReviews(currentUser.id).catch(() => []),
        ]);

      // ✅ DEBUG: Check what dates we're receiving
      console.log('Sample Appointment Data:', appointments[0]);
      console.log('Appointment Date Fields:', {
        updatedAt: appointments[0]?.updatedAt,
        createdAt: appointments[0]?.createdAt,
        requestedStartTime: appointments[0]?.requestedStartTime
      });

      // --- PROCESS APPOINTMENTS ---
      const processedAppointments = appointments.map((appt) => {
        // For scheduling (future events)
        const scheduledDate = appt.requestedStartTime || appt.appointmentDate || appt.visitDate;
        
        // ✅ FIX: For activity feed, prefer updatedAt, but ensure it's valid
        let activityDate = appt.updatedAt || appt.modifiedAt || appt.lastModified || appt.createdAt || appt.createdDate || scheduledDate;
        
        // ✅ FIX: Ensure we're using a valid date
        if (!activityDate || activityDate === 'null') {
          activityDate = scheduledDate;
        }
        
        const status = (appt.status || appt.appointmentStatus || "PENDING").toUpperCase();
        const isApproved = status === "APPROVED" || status === "ACCEPTED";
        const isRejected = status === "REJECTED" || status === "DECLINED";

        let content = `You requested a visit for ${appt.boardingTitle || 'a boarding'}`;
        let icon = FaHourglassHalf;

        if (isApproved) {
          content = `Visit Accepted for ${appt.boardingTitle || 'a boarding'}`;
          icon = FaCalendarCheck;
        } else if (isRejected) {
          content = `Visit Declined for ${appt.boardingTitle || 'a boarding'}`;
          icon = FaBan;
        }

        return {
          ...appt,
          scheduledDate: new Date(scheduledDate),
          activityDate: activityDate, // ✅ Keep as string for now, parse in getTimeAgo
          status,
          isApproved,
          isRejected,
          notificationContent: content,
          icon: icon,
          widgetDetail: `${appt.ownerName || 'Owner'} @ ${appt.boardingTitle || 'Boarding'}`,
        };
      });

      // Stats: Filter for future confirmed visits
      const nextVisit = processedAppointments
        .filter(a => a.isApproved && a.scheduledDate >= new Date().setHours(0,0,0,0))
        .sort((a, b) => a.scheduledDate - b.scheduledDate)[0];

      // --- RENT & BILLS ---
      const activeReg = registrations.find((r) => r.status === "APPROVED" || r.status === "ACCEPTED");
      const unpaidBill = bills.find(b => b.status === "UNPAID" || b.status === "PENDING");
      
      let paymentInfo = null;
      if (unpaidBill) {
        paymentInfo = { amount: unpaidBill.totalAmount, dueDate: unpaidBill.month };
      } else if (activeReg) {
        paymentInfo = { amount: activeReg.monthlyRent || 0, dueDate: "Current Month" };
      }

      const reviewAvg = reviews.length > 0
          ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
          : 0;

      setStats({
        upcomingVisit: nextVisit ? { ...nextVisit, normalizedDate: nextVisit.scheduledDate } : null,
        pendingPayment: paymentInfo,
        currentBoarding: activeReg,
        reviewCount: reviews.length,
        reviewAvg: reviewAvg,
      });

      // --- ACTIVITY FEED ---
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const feed = processedAppointments
        .map(a => {
          // ✅ Parse the date here for filtering
          const actDate = typeof a.activityDate === 'string' 
            ? (a.activityDate.endsWith('Z') ? new Date(a.activityDate) : new Date(a.activityDate + 'Z'))
            : new Date(a.activityDate);
          
          return {
            id: `apt-${a.id}`,
            content: a.notificationContent,
            icon: a.icon,
            timeAgo: getTimeAgo(a.activityDate), // Pass raw date string
            rawDate: actDate,
            status: a.status
          };
        })
        .filter(item => item.rawDate >= twoWeeksAgo) // Filter after parsing
        .sort((a, b) => b.rawDate - a.rawDate);

      setRecentActivity(feed);
      
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