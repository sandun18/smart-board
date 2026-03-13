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

const TechnicianManagementPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
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

      // Map Java Backend DTO to UI expected keys if needed
      const normalizedReq = {
        ...currentReq,
        title: currentReq.title || "General Maintenance",
        status: currentReq.status?.toLowerCase() || "pending",
      };

      setRequest(normalizedReq);

      // If pending, search for technicians automatically based on mapped Enum skill
      if (normalizedReq.status === "pending") {
        const issue = (normalizedReq.title || "").toUpperCase();
        let mappedSkill = "OTHER";

        // Logic to match titles to MaintenanceIssueType Enum values
        if (
          issue.includes("PLUMB") ||
          issue.includes("TAP") ||
          issue.includes("LEAK") ||
          issue.includes("WATER")
        ) {
          mappedSkill = "PLUMBING";
        } else if (
          issue.includes("ELECT") ||
          issue.includes("LIGHT") ||
          issue.includes("POWER") ||
          issue.includes("WIRE")
        ) {
          mappedSkill = "ELECTRICAL";
        } else if (
          issue.includes("FURNIT") ||
          issue.includes("BED") ||
          issue.includes("CHAIR") ||
          issue.includes("TABLE")
        ) {
          mappedSkill = "FURNITURE";
        } else if (
          issue.includes("APPLIANCE") ||
          issue.includes("FRIDGE") ||
          issue.includes("AC") ||
          issue.includes("FAN")
        ) {
          mappedSkill = "APPLIANCE";
        } else if (issue.includes("CLEANING") || issue.includes("WASH")) {
          mappedSkill = "CLEANING";
        } else if (
          issue.includes("PEST") ||
          issue.includes("BUG") ||
          issue.includes("ANT")
        ) {
          mappedSkill = "PEST";
        }

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

  const handleReport = async () => {
    if (!reportData.description) return toast.error("Please provide details");

    try {
      // Construct payload to match ReportCreateDTO exactly
      const payload = {
        // General Report Fields
        title: `Service Complaint: ${request.technicianName}`,
        description: reportData.description,
        reportType: reportData.reportType, // TECHNICIAN_NO_SHOW or POOR_WORK_QUALITY
        severity: "HIGH",
        boardingName: request.boardingTitle, // Required by backend

        // ID Mapping
        ownerId: currentOwner?.id, // Sender
        studentId: request.technicianId, // Reported User (Technician)

        // Metadata
        incidentDate: new Date().toISOString().split("T")[0],
        allowContact: true,
      };

      // Use existing service.js function with empty evidence array
      await createReport(payload, []);

      toast.success("Technician reported successfully");
      setShowReportModal(false);
    } catch (err) {
      // If 403 occurs here, ensure OWNER role has POST access to /api/reports
      console.error("Report submission failed", err);
      toast.error("Failed to submit report. Please check permissions.");
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
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {technicians.map((tech) => (
                  <div
                    key={tech.id}
                    className="p-4 transition-all bg-white border rounded-xl hover:border-primary"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 overflow-hidden bg-gray-200 rounded-full">
                          <img
                            src={`https://ui-avatars.com/api/?name=${tech.fullName}`}
                            alt=""
                          />
                        </div>
                        <div>
                          <h4 className="font-bold">{tech.fullName}</h4>
                          <p className="text-xs text-gray-500">{tech.city}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 font-bold text-yellow-500">
                        <FaStar /> {tech.averageRating || "New"}
                      </span>
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

                {/* ✅ Add the Review button here so you can trigger the review modal on this page */}
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
    </div>
  );
};

export default TechnicianManagementPage;
