import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaClock, FaCheckCircle, FaMapMarkerAlt, FaShieldAlt,
  FaChevronLeft, FaChevronRight, FaBuilding,
} from "react-icons/fa";

import StudentLayout from "../../components/student/common/StudentLayout";
import useBoardingsLogic from "../../hooks/student/useBoardingsLogic.js";
import BoardingCard from "../../components/student/boardings/BoardingCard";
import InfoCards from "../../components/student/boardings/InfoCards";
import EmptyState from "../../components/student/boardings/EmptyState";
import Notification from "../../components/student/maintenance/Notification";
import ReviewForm from "../../components/student/boardings/ReviewForm";
import LeaveBoardingSection from "../../components/student/boardings/LeaveBoardingSection";

import EmergencyButton from "../../components/emergency/EmergencyButton";

// ─── Status badge helper ───────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    APPROVED:       { label: "Active",         cls: "bg-green-100 text-green-700 border-green-200" },
    PENDING:        { label: "Pending",         cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    LEAVE_REQUESTED:{ label: "Leave Requested", cls: "bg-orange-100 text-orange-700 border-orange-200" },
  };
  const { label, cls } = map[status] || { label: status, cls: "bg-gray-100 text-gray-600" };
  return (
    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${cls}`}>
      {label}
    </span>
  );
};

// ─── Pagination dot/tab bar ────────────────────────────────────────────────────
const BoardingPagination = ({ allBoardings, currentIndex, goToIndex, goToPrev, goToNext }) => {
  if (allBoardings.length <= 1) return null;

  return (
    <div className="flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
      {/* Left arrow */}
      <button
        onClick={goToPrev}
        disabled={currentIndex === 0}
        className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <FaChevronLeft size={12} />
      </button>

      {/* Boarding tabs */}
      <div className="flex items-center gap-2 overflow-x-auto px-2 flex-1 justify-center">
        {allBoardings.map((b, i) => (
          <button
            key={b.registrationId}
            onClick={() => goToIndex(i)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap shrink-0
              ${i === currentIndex
                ? 'bg-accent text-white border-accent shadow-sm'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
              }`}
          >
            <FaBuilding size={10} />
            <span className="max-w-[100px] truncate">{b.name || `Boarding ${i + 1}`}</span>
            <StatusBadge status={b.status} />
          </button>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={goToNext}
        disabled={currentIndex === allBoardings.length - 1}
        className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
      >
        <FaChevronRight size={12} />
      </button>
    </div>
  );
};

// ─── Main page ─────────────────────────────────────────────────────────────────
const MyBoardingsPage = () => {
  const navigate = useNavigate();
  const {
    currentBoarding,
    allBoardings,
    totalBoardings,
    currentIndex,
    goToNext,
    goToPrev,
    goToIndex,
    hasBoarding,
    loading,
    downloadReceipt,
  } = useBoardingsLogic();

  const [notification, setNotification] = useState(null);
  const [isPayingRent, setIsPayingRent] = useState(false);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleViewDetails  = () => showNotification("Opening boarding details...");
  const handleManage       = () => showNotification("Opening boarding management panel...");
  const handleRequestMaintenance = () => navigate("/student/maintenance");
  const handleContactOwner = () => showNotification("Opening contact form...");

  const handlePayRent = async () => {
    setIsPayingRent(true);
    showNotification("Redirecting to billing...", "info");
    setTimeout(() => { setIsPayingRent(false); navigate("/student/billing"); }, 800);
  };

  const handleReviewSubmit = () => {
    showNotification("Review submitted successfully!", "success");
  };

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <StudentLayout title="My Boardings">
      <div className="flex h-64 justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600" />
      </div>
    </StudentLayout>
  );

  return (
    <StudentLayout
      title="My Boardings"
      subtitle={
        totalBoardings > 1
          ? `You have ${totalBoardings} boardings — showing ${currentIndex + 1} of ${totalBoardings}`
          : "Manage your current boarding place"
      }
    >
      <AnimatePresence mode="wait">
        {hasBoarding ? (
          <motion.div
            key="has-boarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* ✅ Pagination tab bar — only visible when 2+ boardings */}
            <BoardingPagination
              allBoardings={allBoardings}
              currentIndex={currentIndex}
              goToIndex={goToIndex}
              goToPrev={goToPrev}
              goToNext={goToNext}
            />

            {/* ✅ Animated boarding switcher */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentBoarding.registrationId}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
              >

                {/* CASE 1: PENDING */}
                {currentBoarding.status === "PENDING" && (
                  <div className="w-full max-w-3xl mx-auto mt-4">
                    <div className="bg-white border border-yellow-200 rounded-2xl overflow-hidden shadow-xl">
                      <div className="bg-yellow-50 p-6 border-b border-yellow-100 flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full animate-pulse">
                          <FaClock size={24} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">Registration Pending</h3>
                          <p className="text-sm text-gray-500">
                            The owner needs to review and approve your request.
                          </p>
                        </div>
                      </div>
                      <div className="p-8">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/3">
                            <img
                              src={currentBoarding.image}
                              alt="Boarding"
                              className="w-full h-48 object-cover rounded-xl shadow-md"
                            />
                          </div>
                          <div className="w-full md:w-2/3 space-y-4">
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900">{currentBoarding.name}</h2>
                              <p className="text-gray-500 flex items-center gap-2 mt-1">
                                <FaMapMarkerAlt className="text-gray-400" /> {currentBoarding.address}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-400 uppercase font-bold">Key Money</p>
                                <p className="text-green-600 font-bold flex items-center gap-2 mt-1">
                                  <FaCheckCircle /> Paid
                                </p>
                                <button
                                  onClick={downloadReceipt}
                                  className="text-xs text-blue-600 underline mt-1 hover:text-blue-800"
                                >
                                  Download Receipt
                                </button>



                              </div>
                              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-400 uppercase font-bold">Monthly Rent</p>
                                <p className="text-gray-700 font-bold mt-1">
                                  LKR {currentBoarding.monthlyRent?.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">
                              <FaShieldAlt /> Features like "Pay Rent" and "Maintenance" are locked until approval.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* CASE 2: LEAVE_REQUESTED */}
                {currentBoarding.status === "LEAVE_REQUESTED" && (
                  <div className="flex flex-col min-[1400px]:grid min-[1400px]:grid-cols-3 gap-6 items-start">
                    <div className="w-full min-[1400px]:col-span-2 space-y-6">
                      <LeaveBoardingSection boarding={currentBoarding} />
                      <BoardingCard
                        boarding={currentBoarding}
                        onViewDetails={handleViewDetails}
                        onManage={handleManage}
                        onPayRent={handlePayRent}
                        onRequestMaintenance={handleRequestMaintenance}
                        onContactOwner={handleContactOwner}
                        onViewDocuments={downloadReceipt}
                        isPayingRent={isPayingRent}
                      />
                    </div>
                    <div className="w-full min-[1400px]:col-span-1">
                      <InfoCards boarding={currentBoarding} onContactOwner={handleContactOwner} />
                    </div>
                  </div>
                )}

                {/* CASE 3: APPROVED */}
                {currentBoarding.status === "APPROVED" && (
                  <div className="flex flex-col min-[1400px]:grid min-[1400px]:grid-cols-3 gap-6 items-start">
                    <div className="w-full min-[1400px]:col-span-2 space-y-6">
                      <BoardingCard
                        boarding={currentBoarding}
                        onViewDetails={handleViewDetails}
                        onManage={handleManage}
                        onPayRent={handlePayRent}
                        onRequestMaintenance={handleRequestMaintenance}
                        onContactOwner={handleContactOwner}
                        onViewDocuments={downloadReceipt}
                        isPayingRent={isPayingRent}
                      />
                      <ReviewForm
                        boardingId={currentBoarding?.id || "default-boarding-id"}
                        onSubmitSuccess={handleReviewSubmit}
                      />
                      <LeaveBoardingSection boarding={currentBoarding} />
                    </div>
                    <div className="w-full min-[1400px]:col-span-1">
                      <InfoCards boarding={currentBoarding} onContactOwner={handleContactOwner} />
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState key="empty-state" />
        )}
      </AnimatePresence>

      <Notification notification={notification} />
    </StudentLayout>
  );
};

export default MyBoardingsPage;