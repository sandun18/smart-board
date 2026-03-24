import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTools,
  FaStar,
  FaChevronLeft,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaDoorOpen,
  FaExclamationCircle,
  FaClipboardList,
} from "react-icons/fa";
import {
  getOwnerMaintenanceRequests,
  searchTechnicians,
  assignTechnician,
  reviewTechnician,
  // createReport,
} from "../../api/owner/service";
import toast from "react-hot-toast";
import ReviewTechnicianModal from "../../components/Owner/Maintenance/ReviewTechnicianModal.jsx";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext";

const TechnicianManagementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentOwner } = useOwnerAuth();

  const [request, setRequest] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [reportData, setReportData] = useState({
    reportType: "TECHNICIAN_NO_SHOW",
    description: "",
    severity: "MEDIUM",
  });

  // --- Framer Motion Variants ---
  const pageVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
    hover: { y: -4, shadow: "0px 10px 20px rgba(0,0,0,0.08)" },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  useEffect(() => {
    fetchInitialData();
  }, [id]);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const allRequests = await getOwnerMaintenanceRequests();
      const currentReq = allRequests.find((r) => r.id === parseInt(id));

      if (!currentReq) {
        toast.error("Request not found");
        return navigate("/owner/maintenance");
      }

      const techId = currentReq.technicianId || currentReq.technician?.id;
      setRequest({ ...currentReq, technicianId: techId });

      if (currentReq.status?.toLowerCase() === "pending") {
        const title = (currentReq.title || "").toUpperCase();
        let mappedSkill = "OTHER";

        if (
          title.includes("PLUMB") ||
          title.includes("TAP") ||
          title.includes("LEAK")
        )
          mappedSkill = "PLUMBING";
        else if (
          title.includes("ELECT") ||
          title.includes("LIGHT") ||
          title.includes("WIRE")
        )
          mappedSkill = "ELECTRICAL";
        else if (
          title.includes("FURNIT") ||
          title.includes("BED") ||
          title.includes("TABLE")
        )
          mappedSkill = "FURNITURE";
        else if (
          title.includes("APPLIANCE") ||
          title.includes("AC") ||
          title.includes("FRIDGE")
        )
          mappedSkill = "APPLIANCE";
        else if (title.includes("CLEANING") || title.includes("WASH"))
          mappedSkill = "CLEANING";

        handleSearch(mappedSkill);
      }
    } catch (err) {
      toast.error("Error loading page data");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (skill) => {
    setSearchLoading(true);
    try {
      const data = await searchTechnicians(skill);
      setTechnicians(data);
    } catch (err) {
      toast.error("Failed to find technicians");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAssign = async (techId) => {
    try {
      await assignTechnician(id, techId);
      toast.success("Technician assigned successfully!");
      fetchInitialData();
    } catch (err) {
      toast.error("Assignment failed");
    }
  };

  const handlePayment = () => {
    const toastId = toast.loading("Processing payment...");
    setTimeout(() => {
      toast.success("Payment Successful!", { id: toastId });
      setShowPaymentModal(false);
      setShowReviewModal(true);
      fetchInitialData();
    }, 2000);
  };

  const handleTechnicianProfileClick = (techId) => {
    if (techId) navigate(`/profile/view/${techId}`);
    else toast.error("Technician profile ID not found");
  };

  const handleReport = async () => {
    if (!request?.technicianId)
      return toast.error("Cannot report: Technician ID is missing.");
    if (!currentOwner?.id)
      return toast.error("Session error: Sender ID not found.");

    try {
      const payload = {
        title: `Technician Issue: ${request.technicianName}`,
        description: reportData.description,
        reportType: reportData.reportType,
        severity: reportData.severity,
        boardingName: request.boardingTitle || request.boardingName,
        ownerId: currentOwner.id,
        studentId: request.technicianId,
        incidentDate: new Date().toISOString().split("T")[0],
        allowContact: true,
      };

      await createReport(payload, []);
      toast.success("Report submitted successfully!");
      setShowReportModal(false);
    } catch (err) {
      toast.error("Submission failed. Ensure you have permission.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        <p className="mt-4 font-medium text-slate-500 animate-pulse">
          Loading Workspace...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen p-6 "
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-3 transition-colors bg-white border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600"
        >
          <FaChevronLeft size={14} />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            Manage Professional
          </h1>
          <p className="flex items-center gap-2 mt-1 text-sm text-slate-500">
            <FaClipboardList className="text-slate-400" />
            Incident #{id} <span className="text-slate-300">•</span>{" "}
            {request.title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:items-start">
        {/* Left: Sticky Incident Summary */}
        <div className="space-y-6 lg:col-span-1 lg:sticky lg:top-6">
          <div className="p-6 bg-white border shadow-sm border-slate-100 rounded-2xl">
            <h3 className="mb-5 text-lg font-bold text-slate-800">
              Maintenance Details
            </h3>

            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="p-2 mt-1 text-blue-600 rounded-lg bg-blue-50 shrink-0">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                    Location
                  </p>
                  <p className="font-medium text-slate-700">
                    {request.boardingTitle || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 mt-1 text-purple-600 rounded-lg bg-purple-50 shrink-0">
                  <FaDoorOpen />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                    Room
                  </p>
                  <p className="font-medium text-slate-700">
                    {request.roomNumber || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div
                  className={`p-2 mt-1 rounded-lg shrink-0 ${request.maintenanceUrgency?.toLowerCase() === "high" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"}`}
                >
                  <FaExclamationCircle />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                    Urgency
                  </p>
                  <p className="font-medium capitalize text-slate-700">
                    {request.maintenanceUrgency || "Normal"}
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <p className="mb-2 text-xs font-semibold tracking-wider uppercase text-slate-400">
                  Description
                </p>
                <div className="p-4 leading-relaxed border text-slate-700 rounded-xl bg-slate-50 border-slate-100">
                  "{request.description}"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Workflow (Search or Track) */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {request.status?.toLowerCase() === "pending" ? (
              <motion.section
                key="pending"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={pageVariants}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
                    <FaTools className="text-blue-600" /> Available Experts
                  </h2>
                  <span className="px-3 py-1 text-sm font-medium rounded-full text-slate-500 bg-slate-200">
                    {technicians.length} Found
                  </span>
                </div>

                {searchLoading ? (
                  <div className="p-8 text-center bg-white border shadow-sm border-slate-100 rounded-2xl animate-pulse">
                    Loading specialists...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {technicians.map((tech) => (
                      <motion.div
                        variants={cardVariants}
                        whileHover="hover"
                        key={tech.id}
                        className="p-5 transition-colors bg-white border shadow-sm border-slate-100 rounded-2xl hover:border-blue-200"
                      >
                        {/* Profile Section */}
                        <div
                          className="flex items-center gap-4 cursor-pointer group"
                          onClick={() => handleTechnicianProfileClick(tech.id)}
                        >
                          <div className="overflow-hidden transition-all border-2 border-transparent rounded-full w-14 h-14 bg-slate-100 group-hover:border-blue-500 shrink-0">
                            <img
                              src={
                                tech.profileImageUrl &&
                                tech.profileImageUrl.startsWith("http")
                                  ? tech.profileImageUrl
                                  : `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.fullName)}&background=f1f5f9&color=334155`
                              }
                              alt={tech.fullName}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.fullName)}&background=0D8ABC&color=fff`;
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold truncate transition-colors text-slate-800 group-hover:text-blue-600">
                              {tech.fullName}
                            </h4>
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                              <FaMapMarkerAlt size={10} />{" "}
                              {tech.city || "Area Not Specified"}
                            </p>
                          </div>
                        </div>

                        {/* Rating & Price */}
                        <div className="flex items-center justify-between pt-4 mt-5 border-t border-slate-100">
                          <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 px-2 py-1 text-sm font-bold text-yellow-700 rounded-lg bg-yellow-50">
                              <FaStar className="text-yellow-500" size={12} />
                              {tech.averageRating > 0
                                ? tech.averageRating.toFixed(1)
                                : "NEW"}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-slate-400">
                              Base Price
                            </p>
                            <span className="text-lg font-black text-blue-600">
                              LKR {tech.basePrice?.toLocaleString() || "0"}
                            </span>
                          </div>
                        </div>

                        {/* Assign Button */}
                        <button
                          onClick={() => handleAssign(tech.id)}
                          className="w-full py-3 mt-5 text-sm font-bold text-white transition-all rounded-xl bg-slate-800 hover:bg-blue-600 hover:shadow-md active:scale-[0.98]"
                        >
                          Assign Job
                        </button>
                      </motion.div>
                    ))}
                    {technicians.length === 0 && (
                      <div className="p-8 text-center border-2 border-dashed col-span-full text-slate-500 border-slate-200 rounded-2xl">
                        No technicians found for this category in your area.
                      </div>
                    )}
                  </div>
                )}
              </motion.section>
            ) : (
              <motion.section
                key="assigned"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={pageVariants}
              >
                <div className="overflow-hidden bg-white border shadow-sm border-slate-100 rounded-3xl">
                  {/* Status Banner */}
                  <div className="p-8 text-center border-b bg-gradient-to-b from-slate-50 to-white border-slate-100">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="inline-flex p-5 mb-5 text-green-600 rounded-full bg-green-100/50 ring-8 ring-green-50"
                    >
                      <FaCheckCircle size={36} />
                    </motion.div>
                    <h2 className="text-2xl font-black text-slate-800">
                      Job Assigned to{" "}
                      <span className="text-blue-600">
                        {request.technicianName}
                      </span>
                    </h2>
                    <div className="inline-flex items-center gap-2 px-4 py-2 mt-4 text-sm font-bold tracking-wider uppercase rounded-full bg-slate-100 text-slate-600">
                      Status:{" "}
                      <span className="text-slate-800">
                        {request.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Action Dashboard */}
                  <div className="p-8">
                    <p className="mb-8 text-center text-slate-500">
                      Manage your interaction, process payments, or report
                      issues below.
                    </p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                      {/* Dynamic Payment/Review Workflow */}
                      {request.status?.toLowerCase() === "paid" ? (
                        <button
                          disabled
                          className="flex items-center justify-center w-full gap-2 px-8 py-4 font-bold text-white bg-green-500 cursor-default rounded-xl sm:w-auto"
                        >
                          <FaCheckCircle /> Payment Completed
                        </button>
                      ) : request.status?.toLowerCase() === "work_done" ? (
                        <button
                          onClick={() => setShowPaymentModal(true)}
                          className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-white transition-all bg-blue-600 shadow-lg shadow-blue-600/20 rounded-xl hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
                        >
                          <FaClock /> Proceed to Payment
                        </button>
                      ) : null}

                      {/* Report Button */}
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="flex items-center justify-center w-full gap-2 px-8 py-4 font-bold text-red-600 transition-colors bg-white border-2 border-red-100 rounded-xl hover:bg-red-50 hover:border-red-200 sm:w-auto"
                      >
                        <FaExclamationTriangle /> Report Issue
                      </button>
                    </div>
                  </div>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {/* Report Modal */}
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-md p-6 bg-white shadow-2xl rounded-3xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 text-red-600 bg-red-100 rounded-xl">
                  <FaExclamationTriangle size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Report Professional
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-1.5 text-sm font-bold text-slate-700">
                    Issue Category
                  </label>
                  <select
                    className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 outline-none rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    value={reportData.reportType}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        reportType: e.target.value,
                      })
                    }
                  >
                    <option value="TECHNICIAN_NO_SHOW">
                      Technician No Show
                    </option>
                    <option value="POOR_WORK_QUALITY">Poor Work Quality</option>
                    <option value="UNPROFESSIONAL_BEHAVIOR">
                      Unprofessional Behavior
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 text-sm font-bold text-slate-700">
                    Severity Level
                  </label>
                  <select
                    className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 outline-none rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
                    value={reportData.severity}
                    onChange={(e) =>
                      setReportData({ ...reportData, severity: e.target.value })
                    }
                  >
                    <option value="LOW">Low - Minor Issue</option>
                    <option value="MEDIUM">
                      Medium - Significant Delay/Issue
                    </option>
                    <option value="HIGH">High - Critical Failure/Safety</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1.5 text-sm font-bold text-slate-700">
                    Details
                  </label>
                  <textarea
                    className="w-full p-3.5 text-sm bg-slate-50 border border-slate-200 outline-none rounded-xl focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all resize-none"
                    rows="4"
                    placeholder="Describe exactly what happened..."
                    value={reportData.description}
                    onChange={(e) =>
                      setReportData({
                        ...reportData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-3.5 font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReport}
                  className="flex-1 py-3.5 font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all"
                >
                  Submit Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full max-w-sm p-8 bg-white shadow-2xl rounded-3xl"
            >
              <div className="mb-6 text-center">
                <div className="inline-flex p-4 mb-4 text-blue-600 rounded-full bg-blue-50 ring-4 ring-blue-50/50">
                  <FaTools size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-800">Checkout</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Service by {request.technicianName}
                </p>
              </div>

              <div className="p-5 mb-8 space-y-4 border border-slate-100 bg-slate-50 rounded-2xl">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-500">
                    Service Fee
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    LKR {request.technicianFee?.toLocaleString() || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-500">
                    Platform Charge
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    LKR 100.00
                  </span>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-dashed border-slate-200">
                  <span className="font-bold text-slate-800">Total</span>
                  <span className="font-mono text-xl font-black text-blue-600">
                    LKR {((request.technicianFee || 0) + 100).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handlePayment}
                  className="w-full py-4 font-bold text-white transition-all shadow-lg bg-slate-800 rounded-xl hover:bg-blue-600 hover:shadow-blue-600/20 active:scale-[0.98]"
                >
                  Confirm & Pay
                </button>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-3 text-sm font-bold text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showReviewModal && (
        <ReviewTechnicianModal
          request={request}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            fetchInitialData();
            setShowReviewModal(false);
          }}
        />
      )}
    </motion.div>
  );
};

export default TechnicianManagementPage;
