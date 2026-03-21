import { useState, useEffect } from 'react';
import { useAuth } from '../../context/student/StudentAuthContext';
import StudentService from '../../api/student/StudentService';

// Statuses that should still show in My Boardings
const ACTIVE_STATUSES = ['APPROVED', 'PENDING', 'LEAVE_REQUESTED'];

const buildBoardingObject = (activeReg, dashboardData) => {
  const uniqueMemberIds = new Set();
  const uniqueMembers = (dashboardData.members || [])
    .filter(m => {
      if (uniqueMemberIds.has(m.id)) return false;
      uniqueMemberIds.add(m.id);
      return true;
    })
    .map(m => ({
      id: m.id,
      name: m.name,
      joinedDate: m.joinedDate,
      avatar: m.avatar || `https://ui-avatars.com/api/?name=${m.name}&background=random`
    }));

  return {
    id: activeReg.boardingId,
    registrationId: activeReg.id,
    status: activeReg.status,
    joinedDate: activeReg.moveInDate,

    name: dashboardData.boardingTitle,
    address: dashboardData.boardingAddress,
    image: dashboardData.boardingImage,
    monthlyRent: dashboardData.monthlyPrice,

    rating: dashboardData.averageRating || 0,
    boardingSince: dashboardData.boardingCreatedDate || "2024",
    area: 1200,
    responseRate: 95,
    roommates: uniqueMembers.length,

    owner: {
      id: dashboardData.ownerId,
      name: dashboardData.ownerName,
      rating: dashboardData.averageRating || "New",
      reviews: dashboardData.reviewCount || 0,
      avatar: dashboardData.ownerProfileImage
        || `https://ui-avatars.com/api/?name=${dashboardData.ownerName}&background=0D8ABC&color=fff`,
      email: dashboardData.ownerEmail,
      phone: dashboardData.ownerPhone
    },

    members: uniqueMembers,

    nextPayment: {
      amount: dashboardData.currentMonthDue,
      dueDate: dashboardData.dueInDays > 0
        ? `Due in ${dashboardData.dueInDays} days`
        : "Paid"
    }
  };
};

const useBoardingsLogic = () => {
  const { currentUser } = useAuth();

  const [allBoardings, setAllBoardings] = useState([]);   // ✅ ALL active boardings
  const [currentIndex, setCurrentIndex] = useState(0);    // ✅ Pagination index
  const [hasBoarding, setHasBoarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
      fetchMyBoardings(currentUser.id);
    }
  }, [currentUser]);

  const fetchMyBoardings = async (studentId) => {
    try {
      setLoading(true);

      const registrations = await StudentService.getRegistrations(studentId);

      // ✅ Get ALL active registrations (not just one)
      const activeRegs = registrations.filter(r => ACTIVE_STATUSES.includes(r.status));

      if (activeRegs.length === 0) {
        setHasBoarding(false);
        setAllBoardings([]);
        return;
      }

      // ✅ Fetch dashboard for each active registration in parallel
      const boardingObjects = await Promise.all(
        activeRegs.map(async (reg) => {
          try {
            const dashboardData = await StudentService.getDashboard(reg.id);
            return buildBoardingObject(reg, dashboardData);
          } catch (e) {
            console.error(`Failed to fetch dashboard for reg ${reg.id}:`, e);
            return null;
          }
        })
      );

      // Filter out any failed fetches
      const validBoardings = boardingObjects.filter(Boolean);

      if (validBoardings.length > 0) {
        setAllBoardings(validBoardings);
        setCurrentIndex(0);
        setHasBoarding(true);
      } else {
        setHasBoarding(false);
        setAllBoardings([]);
      }

    } catch (e) {
      console.error("Failed to fetch boarding data:", e);
      setHasBoarding(false);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Pagination controls
  const goToNext = () => setCurrentIndex(i => Math.min(i + 1, allBoardings.length - 1));
  const goToPrev = () => setCurrentIndex(i => Math.max(i - 1, 0));
  const goToIndex = (i) => setCurrentIndex(i);

  // Current boarding is the one at the current page index
  const currentBoarding = allBoardings[currentIndex] || null;
  const totalBoardings = allBoardings.length;

  const payRent = () => {
    alert("Payment integration coming soon!");
  };

  const downloadReceipt = async () => {
    if (currentBoarding?.registrationId) {
      try {
        await StudentService.downloadReceipt(currentBoarding.registrationId);
      } catch (error) {
        console.error("Download failed", error);
        alert("Could not download receipt.");
      }
    }
  };

  return {
    currentBoarding,
    allBoardings,
    totalBoardings,
    currentIndex,
    goToNext,
    goToPrev,
    goToIndex,
    hasBoarding,
    payRent,
    downloadReceipt,
    loading,
    refetch: () => currentUser?.id && fetchMyBoardings(currentUser.id),
  };
};

export default useBoardingsLogic;