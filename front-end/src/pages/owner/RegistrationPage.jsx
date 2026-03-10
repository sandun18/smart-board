import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { FaSearch, FaSortAmountDown } from "react-icons/fa";

// Components
import HeaderBar from "../../components/Owner/common/HeaderBar";
import StatusTab from "../../components/Owner/common/StatusTab";
import RegistrationRow from "../../components/Owner/registrations/RegistrationRow";
import RegistrationProofModal from "../../components/Owner/registrations/RegistrationProofModal";

// Hook
import useRegistrationsLogic from "../../hooks/owner/useRegistrationsLogic";

const RegistrationPage = () => {
  const {
    registrations,
    counts,
    loading,
    error,
    filter,
    setFilter,
    handleDecision,
    getStatusStyle,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    ownerData,
  } = useRegistrationsLogic();

  // Modal State
  const [selectedReg, setSelectedReg] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const TABS = ["PENDING", "APPROVED", "REJECTED"];

  const openProofModal = (reg) => {
    setSelectedReg(reg);
    setIsModalOpen(true);
  };

  const closeProofModal = () => {
    setIsModalOpen(false);
    setSelectedReg(null);
  };

  // Connection Error State
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
      <Toaster position="top-center" reverseOrder={false} />

      <div className="min-h-screen pt-4 pb-10 space-y-8 bg-light">
        <HeaderBar
          title="Tenant Registrations"
          subtitle="Review key money payments and accept new tenants."
          notificationCount={counts.PENDING}
          userAvatar={ownerData.avatar}
          userName={ownerData.firstName}
        />

        {/* Filter Tabs */}
        <section className="p-2 mx-2 border md:p-6 rounded-report shadow-custom bg-card-bg border-light">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {TABS.map((status) => (
              <StatusTab
                key={status}
                status={status}
                count={counts[status] || 0}
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
              {filter} Applications
            </motion.h3>

            <div className="flex flex-col w-full gap-2 md:flex-row md:gap-4 md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:w-64">
                <FaSearch className="absolute text-xs -translate-y-1/2 left-4 top-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Search student or boarding..."
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
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-4">
            {loading ? (
              <div className="py-10 text-sm font-bold text-center uppercase text-muted animate-pulse">
                Loading registrations...
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {registrations.length > 0 ? (
                  registrations.map((reg) => (
                    <RegistrationRow
                      key={reg.id}
                      registration={reg}
                      config={getStatusStyle(reg.status)}
                      onViewProof={openProofModal}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-12 text-xs font-bold tracking-widest text-center uppercase text-muted"
                  >
                    No applications found matching your filters.
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </section>
      </div>

      <RegistrationProofModal
        isOpen={isModalOpen}
        onClose={closeProofModal}
        registration={selectedReg}
        onDecide={handleDecision}
      />
    </>
  );
};

export default RegistrationPage;
