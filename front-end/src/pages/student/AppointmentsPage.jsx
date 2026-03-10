import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/student/common/StudentLayout";
import useAppointmentsLogic from "../../hooks/student/useAppointmentsLogic.js";
import AppointmentTab from "../../components/student/appointments/AppointmentTab";
import AppointmentCard from "../../components/student/appointments/AppointmentCard";
import ScheduleModal from "../../components/student/appointments/ScheduleModal";
import DecisionModal from "../../components/student/appointments/DecisionModal";
import RegistrationModal from "../../components/student/appointments/RegistrationModal";
import CancelModal from "../../components/student/appointments/CancelModal.jsx";
import StudentService from "../../api/student/StudentService";
import { useAuth } from "../../context/student/StudentAuthContext";

import { FaPlus } from "react-icons/fa";

const AppointmentsPage = () => {
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const {
    activeCategory,
    counts,
    categorizedAppointments,
    getAppointmentById,
    setActiveCategory,
    handleStatusChange,
    handleScheduleSubmit,
    handleRegistrationSubmit,
  } = useAppointmentsLogic();

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  
  const [modalContent, setModalContent] = useState({});
  const [currentAppointmentId, setCurrentAppointmentId] = useState(null);

  const currentAppointment = getAppointmentById(currentAppointmentId);

  const categories = ['upcoming', 'visited', 'selected', 'cancelled', 'rejected'];

  const openDecisionConfirmation = (id, decision) => {
    const appointment = getAppointmentById(id);
    if (!appointment) return;

    setCurrentAppointmentId(id);

    let title, message, actionLabel, isSuccess;

    if (decision === 'markVisited') {
        title = "Confirm Visit";
        message = `Have you visited **${appointment.boardingName}**? This will move it to your 'Visited' tab.`;
        actionLabel = "Yes, Mark as Visited";
        isSuccess = true; // ✅ Makes it GREEN
    } else if (decision === 'select') {
        title = "Confirm Selection";
        message = `Are you sure you want to select **${appointment.boardingName}**?`;
        actionLabel = "Yes, Select";
        isSuccess = true; // ✅ Makes it GREEN
    } else if (decision === 'reject') {
        title = "Confirm Rejection";
        message = `Are you sure you want to reject **${appointment.boardingName}**?`;
        actionLabel = "Yes, Reject";
        isSuccess = false; // ✅ Makes it RED
    } else {
        // Fallback
        title = "Confirm Action";
        message = "Are you sure?";
        actionLabel = "Yes";
        isSuccess = false;
    }

    setModalContent({
      title,
      message,
      actionLabel,
      // ✅ Connects to handleStatusChange from the hook
      action: async () => {
        await handleStatusChange(id, decision);
        setIsDecisionModalOpen(false);
      },
      isSuccess,
    });
    setIsDecisionModalOpen(true);
  };

  const handleScheduleClose = () => {
    setIsScheduleModalOpen(false);
    setCurrentAppointmentId(null); 
  };

  const handleRegistrationFlow = (id, action) => {
    setCurrentAppointmentId(id);
    const appointment = getAppointmentById(id);

    if (action === "register") {
      setIsRegistrationModalOpen(true);
    } else if (action === "view") {
      navigate('/student/my-boardings');
    } else if (action === "reschedule") {
      setCurrentAppointmentId(id); 
      setIsScheduleModalOpen(true); 
    } else if (action === "cancel") {
      // ✅ FIXED: Open Custom Modal instead of window.confirm
      if (!appointment) return;
      setIsCancelModalOpen(true);
    } else {
      openDecisionConfirmation(id, action);
    }
  };

  const handleCancelConfirm = async (reason) => {
      if (currentAppointmentId) {
          await handleStatusChange(currentAppointmentId, 'cancel', reason || "No reason provided.");
          setIsCancelModalOpen(false);
          setCurrentAppointmentId(null);
      }
  };

  const finalizeRegistration = async (regData) => {

    if (!currentUser?.id) {
        alert("User session invalid. Please log in again.");
        return;
    }
    
    try {
        const payload = {
            boardingId: currentAppointment.boardingId,
            numberOfStudents: 1,
            studentNote: "Registered via App",
            keyMoneyPaid: true,
            // Form Data
            moveInDate: regData.moveInDate,
            contractDuration: regData.contractDuration,
            emergencyContact: regData.emergencyContact,
            emergencyPhone: regData.emergencyPhone,
            specialRequirements: regData.specialRequirements,
            paymentMethod: "CARD",
            paymentTransactionRef: regData.transactionId
        };

        // 1. Send to Backend
        const response = await StudentService.registerBoarding(currentUser.id, payload);
        
        // 2. Download Receipt PDF
        if (response.id) {
            await StudentService.downloadReceipt(response.id);
        }

        setModalContent({
            title: "Registration Successful! 🎉",
            message: "Payment confirmed. Receipt downloaded.",
            actionLabel: "Go to My Boarding",
            action: () => navigate('/student/my-boardings'),
            isSuccess: true,
            isRegistrationSuccess: true,
            details: [
               { label: "Contract", value: regData.contractDuration },
               { label: "Receipt", value: "Downloaded" }
            ]
        });
        setIsRegistrationModalOpen(false);
        setIsDecisionModalOpen(true);
        setActiveCategory("selected");
        
    } catch (error) {
        console.error(error);
        alert("Registration Failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  const renderAppointmentList = (category) => {
    const list = categorizedAppointments[category] || [];

    if (list.length === 0) {
      return (
        <div className="text-center p-8 sm:p-12 bg-white rounded-2xl shadow-sm mt-4 sm:mt-8 animate-fadeIn border border-gray-100">
          <i className="fas fa-calendar-times text-4xl sm:text-5xl text-gray-300 mb-4"></i>
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">
            No {category} Appointments
          </h3>
          {/* {(category !== "cancelled" && category !== "rejected") && (
            <button
              className="flex items-center gap-2 py-2 px-4 sm:py-3 sm:px-6 rounded-large font-semibold transition-all duration-300 bg-orange-600 text-white shadow-md hover:bg-orange-700 hover:-translate-y-0.5 mx-auto mt-4 text-sm sm:text-base"
              onClick={() => {
                setCurrentAppointmentId(null);
                setIsScheduleModalOpen(true);
              }}
            >
              <FaPlus /> Schedule Your First Visit
            </button>
          )} */}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        {list.map((app) => (
          <AppointmentCard
            key={app.id}
            appointment={app}
            onAction={handleRegistrationFlow}
          />
        ))}
      </div>
    );
  };

  

  return (
    <StudentLayout
      title="My Appointments"
      subtitle="Manage your boarding visits and selections"
      // headerRightContent={
      //   <motion.button
      //     whileHover={{ scale: 1.05 }}
      //     whileTap={{ scale: 0.95 }}
      //     className="hidden sm:flex items-center gap-2 py-3 px-5 rounded-large font-semibold transition-all duration-300 bg-orange-600 text-white shadow-md hover:bg-orange-700 whitespace-nowrap"
      //     onClick={() => {
      //       setCurrentAppointmentId(null);
      //       setIsScheduleModalOpen(true);
      //     }}
      //   >
      //     <FaPlus />
      //     Schedule Visit
      //   </motion.button>
      // }
    >
      {/* ✅ UPDATED TABS SECTION */}
      <section className="bg-white p-3 sm:p-6 rounded-2xl shadow-sm mb-6 sm:mb-8 border border-gray-100">
        <div className="
            flex lg:grid lg:grid-cols-5 
            overflow-x-auto lg:overflow-visible 
            gap-2 sm:gap-4 
            pb-2 lg:pb-0 
            snap-x
            scrollbar-hide
        ">
          {categories.map((category) => (
            <div key={category} className="min-w-[90px] sm:min-w-0 snap-start flex-1"> 
                {/* min-w-[90px]: Ensures buttons don't get crushed on mobile 
                   sm:min-w-0: Resets width on larger screens for grid
                */}
                <AppointmentTab
                  category={category}
                  icon={`fas fa-${
                    category === "upcoming" ? "clock"
                    : category === "visited" ? "eye"
                    : category === "selected" ? "check-circle"
                    : category === "rejected" ? "ban"
                    : "times-circle"
                  }`}
                  label={category.charAt(0).toUpperCase() + category.slice(1)}
                  count={counts[category] || 0}
                  active={activeCategory === category}
                  onClick={setActiveCategory}
                />
            </div>
          ))}
        </div>
      </section>

      {/* Appointments List */}
      <section className="mb-8 min-h-[50vh]">
        <div className="appointments-container">
          {categories.map((category) => (
            <div
              key={`list-${category}`}
              className={`transition-opacity duration-500 ${
                activeCategory === category ? "block animate-fadeIn" : "hidden"
              }`}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 capitalize">
                  {category} {category !== "selected" ? "Visits" : "Boardings"}
                </h3>
                <p className="text-gray-500 text-xs sm:text-base">
                  {category === "upcoming" && "Scheduled visits awaiting action."}
                  {category === "visited" && "Decide on places you've seen!"}
                  {category === "selected" && "Boardings you chose."}
                  {category === "cancelled" && "Visits cancelled by you."}
                  {category === "rejected" && "Visits declined by owner."}
                </p>
              </div>
              {renderAppointmentList(category)}
            </div>
          ))}
        </div>
      </section>
      
      {/* Mobile Button and Modals */}
       {/* <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setCurrentAppointmentId(null);
          setIsScheduleModalOpen(true);
        }}
        className="fixed bottom-24 right-8 h-14 w-14 rounded-full bg-orange-600 text-white shadow-xl flex items-center justify-center sm:hidden z-50 hover:bg-orange-700 transition-colors"
        aria-label="Schedule Visit"
      >
        <FaPlus size={24} />
      </motion.button> */}

      <ScheduleModal
        isOpen={isScheduleModalOpen}
        onClose={handleScheduleClose} 
        onSubmit={handleScheduleSubmit}
        currentAppointmentId={currentAppointmentId} 
        getAppointmentById={getAppointmentById} 
      />

      <DecisionModal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        content={modalContent}
      />

      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelConfirm}
        appointmentName={currentAppointment?.boardingName || "this appointment"}
      />

      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={() => setIsRegistrationModalOpen(false)}
        onSubmit={finalizeRegistration}
        appointment={getAppointmentById(currentAppointmentId)}
      />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </StudentLayout>
  );
};

export default AppointmentsPage;