import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FaClock,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaShieldAlt,
} from "react-icons/fa";

import StudentLayout from "../../components/student/common/StudentLayout";
import useBoardingsLogic from "../../hooks/student/useBoardingsLogic.js";
import BoardingCard from "../../components/student/boardings/BoardingCard";
import InfoCards from "../../components/student/boardings/InfoCards";
import EmptyState from "../../components/student/boardings/EmptyState";
import Notification from "../../components/student/maintenance/Notification";
import ReviewForm from "../../components/student/boardings/ReviewForm";
import LeaveBoardingSection from "../../components/student/boardings/LeaveBoardingSection";

const MyBoardingsPage = () => {
  const navigate = useNavigate();
  const { currentBoarding, hasBoarding, payRent, loading, downloadReceipt } =
    useBoardingsLogic();
  const [notification, setNotification] = useState(null);
  const [isPayingRent, setIsPayingRent] = useState(false);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleViewDetails = () => {
    showNotification("Opening boarding details...");
    // navigate('/boarding-details');
  };

  const handleManage = () => {
    showNotification("Opening boarding management panel...");
  };

  const handlePayRent = async () => {
    setIsPayingRent(true);
    // Simulate payment processing
    setTimeout(() => {
      payRent();
      setIsPayingRent(false);
      showNotification("Payment processed successfully!", "success");
    }, 2000);
  };

  const handleRequestMaintenance = () => {
    navigate("/student/maintenance");
  };

  const handleContactOwner = () => {
    showNotification("Opening contact form...");
  };

  const handleViewDocuments = () => {
    showNotification("Opening documents panel...");
  };

  const handleReviewSubmit = () => {
    showNotification(
      "Review submitted successfully! It will appear on the boarding details page.",
      "success"
    );
  };

  if (loading)
    return (
      <StudentLayout title="My Boardings">
        <div className="flex h-64 justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
        </div>
      </StudentLayout>
    );

  return (
    <StudentLayout
      title="My Boardings"
      subtitle="Manage your current boarding place"
    >
      <AnimatePresence mode="wait">
        {hasBoarding ? (
          // 🟡 CASE 1: PENDING (Show Limited Details)
          currentBoarding.status === "PENDING" ? (
            <motion.div
              key="pending-boarding"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-3xl mx-auto mt-8"
            >
              <div className="bg-white border border-yellow-200 rounded-2xl overflow-hidden shadow-xl">
                {/* Header */}
                <div className="bg-yellow-50 p-6 border-b border-yellow-100 flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full animate-pulse">
                    <FaClock size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      Registration Pending
                    </h3>
                    <p className="text-sm text-gray-500">
                      The owner needs to review and approve your request.
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="w-full md:w-1/3">
                      <img
                        src={currentBoarding.image}
                        alt="Boarding"
                        className="w-full h-48 object-cover rounded-xl shadow-md"
                      />
                    </div>

                    {/* Details */}
                    <div className="w-full md:w-2/3 space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          {currentBoarding.name}
                        </h2>
                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                          <FaMapMarkerAlt className="text-gray-400" />{" "}
                          {currentBoarding.address}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-400 uppercase font-bold">
                            Key Money
                          </p>
                          <p className="text-green-600 font-bold flex items-center gap-2 mt-1">
                            <FaCheckCircle /> Paid
                          </p>
                          {/* ✅ Button to download receipt even while pending */}
                          <button
                            onClick={downloadReceipt}
                            className="text-xs text-blue-600 underline mt-1 hover:text-blue-800"
                          >
                            Download Receipt
                          </button>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <p className="text-xs text-gray-400 uppercase font-bold">
                            Monthly Rent
                          </p>
                          <p className="text-gray-700 font-bold mt-1">
                            LKR {currentBoarding.monthlyRent?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-2 rounded-lg">
                        <FaShieldAlt /> Features like "Pay Rent" and
                        "Maintenance" are locked until approval.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            // 🟢 CASE 2: APPROVED (Show Full Dashboard)
            <motion.div
              key="active-boarding"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col min-[1400px]:grid min-[1400px]:grid-cols-3 gap-6 items-start"
            >
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
                {/* Review Form - Full width on mobile/tablet, left column on desktop */}
                <ReviewForm
                  boardingId={currentBoarding?.id || "default-boarding-id"}
                  onSubmitSuccess={handleReviewSubmit}
                />

                <LeaveBoardingSection boarding={currentBoarding} />
                
              </div>
              <div className="w-full min-[1400px]:col-span-1">
                <InfoCards
                  boarding={currentBoarding}
                  onContactOwner={handleContactOwner}
                />
              </div>
            </motion.div>
          )
        ) : (
          <EmptyState key="empty-state" />
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <Notification notification={notification} />
    </StudentLayout>
  );
};

export default MyBoardingsPage;
//
