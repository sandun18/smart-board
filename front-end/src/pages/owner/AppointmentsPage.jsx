import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import HeaderBar from "../../components/Owner/common/HeaderBar";
import StatusTab from "../../components/Owner/common/StatusTab";
import AppointmentRow from "../../components/Owner/appointments/AppointmentRow";
import SkeletonAppointmentRow from "../../components/Owner/appointments/SkeletonAppointmentRow";
import DecisionModal from "../../components/Owner/appointments/DecisionModal";
import useDecisionModal from "../../hooks/owner/useDecisionModal";
import useAppointmentsLogic from "../../hooks/owner/useAppointmentsLogic";
import { Toaster } from "react-hot-toast";
import { FaSearch, FaSortAmountDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AppointmentsPage = () => {
  const {
    filteredAppointments,
    counts,
    ownerData,
    filter,
    setFilter,
    handleAction,
    formatDate,
    formatTime,
    getStatusStyle,
    loading,
    error,
    // ✅ Destructure new tools
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  } = useAppointmentsLogic();

  const navigate = useNavigate();

  const { isOpen, selectedItem, actionType, openModal, closeModal } =
    useDecisionModal();

  // 3. Handler to determine if we need the modal or not
  const handleModalTrigger = (id, action) => {
    // Case A: Immediate Action (Visited) - No Modal needed yet
    if (action === "visited") {
      handleAction(id, action);
      return;
    }

    // Case B: Actions requiring Modal (Confirm/Reject)
    const app = filteredAppointments.find((a) => a.id === id);
    if (app) {
      openModal(app, action); // ✅ Use the hook's open function
    }
  };

  const handleStudentProfileClick = (studentId) => {
    if (studentId) {
      navigate(`/profile/view/${studentId}`);
    } else {
      console.error("Student ID is missing");
    }
  };

  // 4. Error State
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light">
        <div className="p-6 text-center bg-white rounded-lg shadow-lg">
          <h3 className="mb-2 text-xl font-black text-error">
            Connection Error
          </h3>
          <p className="mb-4 text-muted">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 font-bold text-white rounded bg-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Notification Toaster */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            border: "1px solid #E5E7EB",
            padding: "12px 16px",
            color: "#1F2937",
            fontSize: "14px",
            fontWeight: "600",
            borderRadius: "12px",
            background: "#FFFFFF",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          },
        }}
      />

      {/* Main Content */}
      <div className="min-h-screen pt-4 pb-10 space-y-8 bg-light">
        <HeaderBar
          title="Appointments"
          subtitle="Manage student visit requests and track arrivals."
          notificationCount={counts.pending}
          userAvatar={ownerData.avatar}
          userName={ownerData.firstName}
        />

        {/* Filter Tabs */}
        <section className="p-2 mx-2 border md:p-6 rounded-report shadow-custom bg-card-bg border-light">
          <div className="grid grid-cols-3 gap-2 md:grid-cols-5 md:gap-4">
            {Object.keys(counts).map((status) => (
              <StatusTab
                key={status}
                status={status}
                count={counts[status]}
                currentFilter={filter}
                setFilter={setFilter}
                config={getStatusStyle(status)}
              />
            ))}
          </div>
        </section>

        {/* List Section */}
        <section className="px-2 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-col justify-between gap-4 ml-2 mr-2 md:flex-row md:items-center">
            <motion.h3
              layout
              className="text-2xl font-black tracking-tight uppercase text-primary"
            >
              {filter} Requests
            </motion.h3>

            <div className="flex flex-col w-full gap-2 md:flex-row md:gap-4 md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <FaSearch className="absolute text-xs -translate-y-1/2 left-4 top-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search student or property..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-full border border-light bg-white text-xs font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm placeholder:text-muted/70"
                />
              </div>

              {/* Sort */}
              <div className="relative md:w-48">
                <FaSortAmountDown className="absolute text-xs -translate-y-1/2 left-4 top-1/2 text-muted" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 rounded-full border border-light bg-white text-xs font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none shadow-sm cursor-pointer"
                >
                  <option value="nearest">Nearest Date First</option>
                  <option value="furthest">Furthest Date First</option>
                </select>
                <div className="absolute -translate-y-1/2 pointer-events-none right-4 top-1/2">
                  <svg
                    className="w-2.5 h-2.5 text-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <>
                <SkeletonAppointmentRow />
                <SkeletonAppointmentRow />
                <SkeletonAppointmentRow />
              </>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((app) => (
                    <AppointmentRow
                      key={app.id}
                      appointment={app}
                      config={getStatusStyle(app.status)}
                      onAction={handleModalTrigger} // ✅ Pass the trigger
                      onProfileClick={handleStudentProfileClick}
                      formatDate={formatDate}
                      formatTime={formatTime}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-xs font-bold tracking-widest text-center uppercase text-muted"
                  >
                    No appointments found matching your filters.
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>

      {/* ✅ Decision Modal - Controlled by Hook */}
      <DecisionModal
        isOpen={isOpen}
        onClose={closeModal}
        actionType={actionType}
        appointment={selectedItem}
        onConfirm={handleAction} // Logic Hook handles the API Call
      />
    </>
  );
};

export default AppointmentsPage;
