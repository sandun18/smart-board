import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTools,
  FaUserShield,
  FaStar,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import {
  getOwnerMaintenanceRequests,
  searchTechnicians,
  assignTechnician,
  reviewTechnician,
  createReport,
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
    reportType: "TECHNICIAN_NO_SHOW", // Default value
    description: "",
  });

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

      // 1. Get correct Tech ID (Already fixed)
      const techId = currentReq.technicianId || currentReq.technician?.id;

      setRequest({
        ...currentReq,
        technicianId: techId,
      });

      // 2. Map Title to Backend Enum Skill for search
      if (currentReq.status?.toLowerCase() === "pending") {
        const title = (currentReq.title || "").toUpperCase();
        let mappedSkill = "OTHER";

        // Simple keyword mapping logic
        if (
          title.includes("PLUMB") ||
          title.includes("TAP") ||
          title.includes("LEAK") ||
          title.includes("WATER")
        ) {
          mappedSkill = "PLUMBING";
        } else if (
          title.includes("ELECT") ||
          title.includes("LIGHT") ||
          title.includes("POWER") ||
          title.includes("WIRE")
        ) {
          mappedSkill = "ELECTRICAL";
        } else if (
          title.includes("FURNIT") ||
          title.includes("BED") ||
          title.includes("CHAIR") ||
          title.includes("TABLE")
        ) {
          mappedSkill = "FURNITURE";
        } else if (
          title.includes("APPLIANCE") ||
          title.includes("FRIDGE") ||
          title.includes("AC") ||
          title.includes("FAN")
        ) {
          mappedSkill = "APPLIANCE";
        } else if (title.includes("CLEANING") || title.includes("WASH")) {
          mappedSkill = "CLEANING";
        }

        // Trigger search with the Mapped Enum
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
      toast.success("Technician assigned!");
      fetchInitialData(); // Refresh to show tracking view
    } catch (err) {
      toast.error("Assignment failed");
    }
  };

  const handlePayment = () => {
    const toastId = toast.loading("Processing payment...");

    // Simulate network delay
    setTimeout(() => {
      toast.success("Payment Successful!", { id: toastId });
      setShowPaymentModal(false);
      // Optionally refresh data if the status should change to 'paid'
      fetchInitialData();
    }, 2000);
  };

  const handleTechnicianProfileClick = (techId) => {
    if (techId) {
      // Assuming your route is /profile/view/:id based on previous conversations
      navigate(`/profile/view/${techId}`);
    } else {
      toast.error("Technician profile ID not found");
    }
  };

  const handleReport = async () => {
    // 1. Check for missing IDs
    if (!request?.technicianId) {
      //
      return toast.error(
        "Cannot report: Technician ID is missing from this record.",
      );
    }
    if (!currentOwner?.id) {
      //
      return toast.error("Session error: Sender ID not found.");
    }

    try {
      const payload = {
        title: `Technician Issue: ${request.technicianName}`,
        description: reportData.description,
        reportType: reportData.reportType,
        severity: reportData.severity || "MEDIUM",
        boardingName: request.boardingTitle || request.boardingName,
        ownerId: currentOwner.id, //
        studentId: request.technicianId, //
        incidentDate: new Date().toISOString().split("T")[0],
        allowContact: true,
      };

      await createReport(payload, []); //
      toast.success("Report submitted!");
      setShowReportModal(false);
    } catch (err) {
      toast.error("Submission failed. Ensure you have permission to report.");
    }
  };

  if (loading)
    return <div className="p-10 text-center">Loading Technician Portal...</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-full shadow-sm"
        >
          <FaChevronLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Manage Professional
          </h1>
          <p className="text-gray-500">
            Incident #{id} - {request.title}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Incident Summary */}
        <div className="space-y-6 lg:col-span-1">
          <div className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <h3 className="mb-4 font-bold text-gray-700">
              Maintenance Details
            </h3>
            <div className="space-y-3 text-sm">
              <p>
                <span className="text-gray-400">Location:</span>{" "}
                {request.boardingTitle}
              </p>
              <p>
                <span className="text-gray-400">Room:</span>{" "}
                {request.roomNumber}
              </p>
              <p>
                <span className="text-gray-400">Urgency:</span>{" "}
                {request.maintenanceUrgency}
              </p>
              <div className="p-3 italic text-blue-700 rounded-lg bg-blue-50">
                "{request.description}"
              </div>
            </div>
          </div>
        </div>

        {/* Right: Dynamic Workflow (Search or Track) */}
        <div className="lg:col-span-2">
          {request.status?.toLowerCase() === "pending" ? (
            <section>
              <h2 className="flex items-center gap-2 mb-4 text-xl font-bold">
                <FaTools className="text-primary" /> Available Experts
              </h2>
              {/* <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {technicians.map((tech) => (
                  <div
                    key={tech.id}
                    className="p-4 transition-all bg-white border rounded-xl hover:border-primary"
                  >
                    <div
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => handleTechnicianProfileClick(tech.id)}
                    >
                      <div className="w-12 h-12 overflow-hidden transition-all bg-gray-200 rounded-full group-hover:ring-2 group-hover:ring-primary">
                        <img
                          src={`https://ui-avatars.com/api/?name=${tech.fullName}`}
                          alt={tech.fullName}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold transition-colors group-hover:text-primary">
                          {tech.fullName}
                        </h4>
                        <p className="text-xs text-gray-500">{tech.city}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <span className="font-bold text-primary">
                        LKR {tech.basePrice}
                      </span>
                      <button
                        onClick={() => handleAssign(tech.id)}
                        className="px-4 py-2 text-sm font-bold text-white rounded-lg bg-slate-900"
                      >
                        Assign Job
                      </button>
                    </div>
                  </div>
                ))}
              </div> */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {technicians.map((tech) => (
                  <div
                    key={tech.id}
                    className="p-4 transition-all bg-white border rounded-xl hover:border-primary"
                  >
                    {/* Profile Section */}
                    <div
                      className="flex items-center gap-3 cursor-pointer group"
                      onClick={() => handleTechnicianProfileClick(tech.id)}
                    >
                      {/* ✅ Better Image Handling */}
                      <div className="w-12 h-12 overflow-hidden transition-all bg-gray-200 rounded-full group-hover:ring-2 group-hover:ring-primary shrink-0">
                        <img
                          src={
                            tech.profileImageUrl &&
                            tech.profileImageUrl.startsWith("http")
                              ? tech.profileImageUrl
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.fullName)}&background=random`
                          }
                          alt={tech.fullName}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.fullName)}&background=0D8ABC&color=fff`;
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold truncate transition-colors group-hover:text-primary">
                          {tech.fullName}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {tech.city || "Area Not Specified"}
                        </p>
                      </div>
                    </div>

                    {/* ✅ NEW: Rating & Price Row */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-600">
                          Rating:
                        </span>
                        <span className="flex items-center gap-1 text-yellow-400">
                          <FaStar size={12} />
                          <span className="text-sm font-bold">
                            {tech.averageRating > 0
                              ? tech.averageRating.toFixed(1)
                              : "NEW"}
                          </span>
                        </span>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        LKR {tech.basePrice?.toLocaleString() || "0"}
                      </span>
                    </div>

                    {/* Assign Button */}
                    <button
                      onClick={() => handleAssign(tech.id)}
                      className="w-full px-4 py-2 mt-4 text-sm font-bold text-white transition-colors rounded-lg bg-slate-900 hover:bg-slate-800"
                    >
                      Assign Job
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <div className="p-8 text-center bg-white border border-gray-100 shadow-sm rounded-2xl">
              <div className="inline-flex p-4 mb-4 text-green-600 rounded-full bg-green-50">
                <FaCheckCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Job Assigned to {request.technicianName}
              </h2>
              <p className="mb-6 text-gray-500">
                Current Status:{" "}
                <span className="font-black uppercase">{request.status}</span>
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-6">
                {/* ✅ The Report button is now accessible even after work is done */}
                <button
                  onClick={() => setShowReportModal(true)}
                  className="flex items-center gap-2 px-6 py-3 font-bold text-red-600 border border-red-200 rounded-xl hover:bg-red-50"
                >
                  <FaExclamationTriangle /> Report Professional
                </button>

                {/* ✅ Payment & Review Section */}
                {["work_done"].includes(request.status?.toLowerCase()) && (
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="flex items-center gap-2 px-6 py-3 font-bold text-white bg-green-600 rounded-xl hover:bg-green-700"
                  >
                    <FaCheckCircle /> Pay Professional
                  </button>
                )}

                {["work_done", "paid"].includes(
                  request.status?.toLowerCase(),
                ) && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="px-6 py-3 font-bold text-white bg-orange-500 rounded-xl hover:bg-orange-600"
                  >
                    Submit Review & Finalize
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl">
            <h3 className="mb-4 text-xl font-bold text-gray-800">
              Report Professional
            </h3>

            {/* --- REPORT TYPE SELECT --- */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Issue Category
              </label>
              <select
                className="w-full p-3 text-sm border outline-none rounded-xl focus:ring-2 focus:ring-red-500/20"
                value={reportData.reportType}
                onChange={(e) =>
                  setReportData({ ...reportData, reportType: e.target.value })
                }
              >
                <option value="TECHNICIAN_NO_SHOW">Technician No Show</option>
                <option value="POOR_WORK_QUALITY">Poor Work Quality</option>
              </select>
            </div>

            {/* --- SEVERITY SELECT --- */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Severity Level
              </label>
              <select
                className="w-full p-3 text-sm border outline-none rounded-xl focus:ring-2 focus:ring-red-500/20"
                value={reportData.severity || "MEDIUM"}
                onChange={(e) =>
                  setReportData({ ...reportData, severity: e.target.value })
                }
              >
                <option value="LOW">Low - Minor Issue</option>
                <option value="MEDIUM">Medium - Significant Delay/Issue</option>
                <option value="HIGH">High - Critical Failure/Safety</option>
              </select>
            </div>

            {/* --- DESCRIPTION --- */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-bold text-gray-700">
                Details
              </label>
              <textarea
                className="w-full p-3 text-sm border outline-none rounded-xl focus:ring-2 focus:ring-red-500/20"
                rows="4"
                placeholder="Describe exactly what happened..."
                value={reportData.description}
                onChange={(e) =>
                  setReportData({ ...reportData, description: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-2 font-semibold text-gray-500 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="flex-1 py-2 font-bold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <ReviewTechnicianModal
          request={request}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            fetchInitialData(); // Refresh the page to show "Completed" status
            setShowReviewModal(false);
          }}
        />
      )}

      {/* Dummy Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl"
          >
            <div className="mb-6 text-center">
              <div className="inline-flex p-3 mb-4 text-green-600 rounded-full bg-green-50">
                <FaTools size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Final Payment</h3>
              <p className="text-sm text-gray-500">
                Service provided by {request.technicianName}
              </p>
            </div>

            <div className="p-4 mb-6 space-y-3 bg-gray-50 rounded-xl">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service Base Price</span>
                <span className="font-mono font-bold text-gray-800">
                  LKR {request.basePrice?.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service Charge (Fixed)</span>
                <span className="font-mono font-bold text-gray-800">
                  LKR 500
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-bold text-gray-800">Total Amount</span>
                <span className="font-mono text-lg font-black text-primary">
                  LKR {((request.basePrice || 0) + 500).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePayment}
                className="w-full py-4 font-bold text-white transition-all shadow-lg bg-slate-900 rounded-xl hover:bg-black active:scale-95"
              >
                Confirm & Pay Now
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-full py-2 text-sm font-semibold text-gray-400 hover:text-gray-600"
              >
                Cancel
              </button>
            </div>

            <p className="text-[10px] text-center text-gray-400 mt-4 uppercase tracking-widest font-bold">
              Secure Encryption Enabled
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TechnicianManagementPage;
