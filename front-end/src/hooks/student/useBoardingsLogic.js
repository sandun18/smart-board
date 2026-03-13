import { useState, useEffect } from 'react';
import { useAuth } from '../../context/student/StudentAuthContext';
import StudentService from '../../api/student/StudentService';

const useBoardingsLogic = () => {
  const { currentUser } = useAuth(); 
  
  const [currentBoarding, setCurrentBoarding] = useState(null);
  const [hasBoarding, setHasBoarding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser?.id) {
        fetchMyBoarding(currentUser.id);
    }
  }, [currentUser]);

  const fetchMyBoarding = async (studentId) => {
      try {
          setLoading(true);
          
          // 1. Get All Registrations to check status
          const registrations = await StudentService.getRegistrations(studentId);
          
          // 2. Find the relevant registration (Approved takes priority, then Pending)
          const activeReg = registrations.find(r => r.status === 'APPROVED') 
                         || registrations.find(r => r.status === 'PENDING');

          if (activeReg) {
              // 3. Fetch Dashboard Data (Contains Boarding Info, Owner, Members)
              // Note: The backend 'getDashboard' endpoint works for both Pending and Approved
              // but returns limited info for Pending if you set it up that way.
              const dashboardData = await StudentService.getDashboard(activeReg.id);

              // FIX: Deduplicate members to prevent "same key" error
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

              setCurrentBoarding({
                  // --- Status & ID ---
                  id: activeReg.boardingId,
                  registrationId: activeReg.id,
                  status: activeReg.status, // "PENDING" or "APPROVED"
                  joinedDate: activeReg.moveInDate,

                  // --- Basic Info (Visible in both states) ---
                  name: dashboardData.boardingTitle,
                  address: dashboardData.boardingAddress,
                  image: dashboardData.boardingImage ,
                  monthlyRent: dashboardData.monthlyPrice,

                  rating: dashboardData.averageRating || 0,
                  boardingSince: dashboardData.boardingCreatedDate || "2024",
                  joinedDate: activeReg.moveInDate || new Date().toISOString().split('T')[0],
                  area: 1200, 
                  responseRate: 95,
                  roommates: dashboardData.members ? dashboardData.members.length : 0,

                  // --- Owner Info ---
                  owner: {
                      id: dashboardData.ownerId,
                      name: dashboardData.ownerName,
                      rating: dashboardData.averageRating || "New", 
                      reviews: dashboardData.reviewCount || 0,
                      avatar: dashboardData.ownerProfileImage || `https://ui-avatars.com/api/?name=${dashboardData.ownerName}&background=0D8ABC&color=fff`,
                      email: dashboardData.ownerEmail,
                      phone: dashboardData.ownerPhone
                  },

                  // --- Members (Empty if pending usually) ---
                  members: dashboardData.members?.map(m => ({
                      id: m.id,
                      name: m.name,
                      joinedDate: m.joinedDate,
                      // Use DB avatar, or fallback to generated one
                      avatar: m.avatar || `https://ui-avatars.com/api/?name=${m.name}&background=random`
                  })) || [],

                  // --- Payment Info ---
                  nextPayment: { 
                      amount: dashboardData.currentMonthDue, 
                      dueDate: dashboardData.dueInDays > 0 
                        ? `Due in ${dashboardData.dueInDays} days` 
                        : "Paid"
                  }
              });
              setHasBoarding(true);
          } else {
              setHasBoarding(false);
              setCurrentBoarding(null);
          }
      } catch (e) {
          console.error("Failed to fetch boarding data:", e);
          setHasBoarding(false);
      } finally {
          setLoading(false);
      }
  };

  const payRent = () => {
    alert("Payment integration coming soon!");
  };

  // ✅ NEW FUNCTION: Downloads the Key Money PDF
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
    hasBoarding,
    payRent,
    downloadReceipt,
    loading
  };
};

export default useBoardingsLogic;