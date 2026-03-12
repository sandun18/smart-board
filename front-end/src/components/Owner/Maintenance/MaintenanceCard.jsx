import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTools,
  FaStar,
  FaClock,
  FaImage,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
// ✅ Removed unused AssignTechnicianModal import
import ReviewTechnicianModal from "./ReviewTechnicianModal";

const BASE_IMAGE_URL = "http://localhost:8086/uploads/";

const URGENCY_CONFIG = {
  low: { color: "bg-emerald-100 text-emerald-700", icon: null },
  medium: { color: "bg-blue-100 text-blue-700", icon: null },
  high: {
    color: "bg-orange-100 text-orange-700",
    icon: <FaExclamationTriangle />,
  },
  critical: {
    color: "bg-red-100 text-red-700",
    icon: <FaExclamationTriangle />,
  },
};

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-50" },
  assigned: { label: "Assigned", color: "text-purple-600 bg-purple-50" },
  in_progress: { label: "In Progress", color: "text-blue-600 bg-blue-50" },
  work_done: { label: "Work Done", color: "text-orange-600 bg-orange-50" },
  completed: { label: "Resolved", color: "text-green-600 bg-green-50" },
  resolved: { label: "Resolved", color: "text-green-600 bg-green-50" },
};

const MaintenanceCard = ({ request, onUpdateStatus }) => {
  // ✅ Removed unused showAssignModal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const navigate = useNavigate();

  const statusKey = request.status ? request.status.toLowerCase() : "pending";
  const urgencyKey = request.urgency ? request.urgency.toLowerCase() : "low";

  const urgencyStyle = URGENCY_CONFIG[urgencyKey] || URGENCY_CONFIG.low;
  const statusStyle = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getImgSrc = (imgName) => {
    if (!imgName) return "";
    return imgName.startsWith("http") ? imgName : `${BASE_IMAGE_URL}${imgName}`;
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
        className="flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md"
      >
        <div className={`h-2 w-full ${urgencyStyle.color.split(" ")[0]}`} />

        <div className="flex flex-col flex-1 p-5">
          <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FaCalendar className="text-gray-300" />{" "}
              {formatDate(request.date || request.createdDate)}
            </span>
            <span className="font-mono text-[10px]">#{request.id}</span>
          </div>

          <div className="mb-4">
            <h3 className="mb-1 text-lg font-bold text-gray-800 line-clamp-1">
              {request.issueType || "General Maintenance"}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <FaMapMarkerAlt className="text-gray-300" size={12} />
              <span>
                {request.boardingName} • Room {request.roomNumber || "?"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1 ${urgencyStyle.color}`}
            >
              {urgencyStyle.icon} {urgencyKey} Priority
            </span>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${statusStyle.color}`}
            >
              {statusStyle.label}
            </span>
          </div>

          <p className="mb-4 text-sm text-gray-600 line-clamp-2">
            {request.description}
          </p>

          {/* Photo Gallery */}
          {request.image && request.image.length > 0 && (
            <div className="mb-4">
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 flex items-center gap-1">
                <FaImage /> Evidence ({request.image.length})
              </p>
              <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
                {request.image.map((imgName, index) => (
                  <img
                    key={index}
                    src={getImgSrc(imgName)}
                    alt={`Evidence ${index + 1}`}
                    className="object-cover w-20 transition-opacity border border-gray-100 rounded-lg cursor-pointer h-14 hover:opacity-80"
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ Prevents card actions when opening image
                      window.open(getImgSrc(imgName), "_blank");
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/80?text=Error";
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4 mt-auto border-t border-gray-50">
            {/* 1. PENDING: Navigate */}
            {statusKey === "pending" && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // ✅ Added stopPropagation
                  navigate(`/owner/maintenance/${request.id}/assign`);
                }}
                className="flex items-center justify-center w-full gap-2 py-2.5 text-sm font-bold text-white transition-all bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-95 shadow-sm"
              >
                <FaTools size={12} /> Manage Professional
              </button>
            )}

            {/* 2. ASSIGNED / IN_PROGRESS: Navigate */}
            {(statusKey === "assigned" || statusKey === "in_progress") && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // ✅ Added stopPropagation
                  navigate(`/owner/maintenance/${request.id}/assign`);
                }}
                className="flex items-center justify-center w-full gap-2 py-2 text-xs font-bold text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
              >
                <FaClock className="animate-pulse" /> Tracking Professional...
              </button>
            )}

            {/* 3. WORK_DONE / PAID: Review */}
            {(statusKey === "work_done" || statusKey === "paid") && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowReviewModal(true);
                }}
                className="flex items-center justify-center w-full gap-2 py-2.5 text-sm font-bold text-white transition-all bg-orange-500 rounded-lg hover:bg-orange-600 animate-pulse active:scale-95"
              >
                <FaStar size={12} /> Review & Complete
              </button>
            )}

            {/* 4. COMPLETED / RESOLVED */}
            {(statusKey === "completed" || statusKey === "resolved") && (
              <div className="flex items-center justify-center w-full gap-2 py-2 text-sm font-bold text-green-600 rounded-lg bg-green-50">
                <FaCheckCircle /> Successfully Resolved
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Modal Overlay */}
      {showReviewModal && (
        <ReviewTechnicianModal
          request={request}
          onClose={() => setShowReviewModal(false)}
          onSuccess={() => {
            onUpdateStatus(request.id, "COMPLETED");
            setShowReviewModal(false);
          }}
        />
      )}
    </>
  );
};

export default MaintenanceCard;
