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
          
          const registrations = await StudentService.getRegistrations(studentId);
          
          const activeReg =
            registrations.find(r => r.status === 'APPROVED') ||
            registrations.find(r => r.status === 'PENDING');

          if (activeReg) {

              const dashboardData = await StudentService.getDashboard(activeReg.id);

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
                  id: activeReg.boardingId,
                  registrationId: activeReg.id,
                  status: activeReg.status,

                  agreementPdfPath: activeReg.agreementPdfPath, // ✅ AGREEMENT PATH

                  joinedDate: activeReg.moveInDate,

                  name: dashboardData.boardingTitle,
                  address: dashboardData.boardingAddress,
                  image: dashboardData.boardingImage,
                  monthlyRent: dashboardData.monthlyPrice,

                  rating: dashboardData.averageRating || 0,
                  boardingSince: dashboardData.boardingCreatedDate || "2024",
                  area: 1200, 
                  responseRate: 95,
                  roommates: dashboardData.members ? dashboardData.members.length : 0,

                  owner: {
                      id: dashboardData.ownerId,
                      name: dashboardData.ownerName,
                      rating: dashboardData.averageRating || "New", 
                      reviews: dashboardData.reviewCount || 0,
                      avatar:
                        dashboardData.ownerProfileImage ||
                        `https://ui-avatars.com/api/?name=${dashboardData.ownerName}&background=0D8ABC&color=fff`,
                      email: dashboardData.ownerEmail,
                      phone: dashboardData.ownerPhone
                  },

                  members: uniqueMembers,

                  nextPayment: { 
                      amount: dashboardData.currentMonthDue, 
                      dueDate:
                        dashboardData.dueInDays > 0
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

  // ✅ FIXED AGREEMENT DOWNLOAD
  const downloadReceipt = () => {

    if (!currentBoarding?.agreementPdfPath) {
      alert("Agreement document not available yet.");
      return;
    }

    try {

      const link = document.createElement("a");

      link.href = currentBoarding.agreementPdfPath;
      link.target = "_blank";
      link.download = "Boarding_Agreement.pdf";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {

      console.error("Download failed", error);
      alert("Could not download agreement.");

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