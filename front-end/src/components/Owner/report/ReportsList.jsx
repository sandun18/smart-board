import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaUser,
  FaBuilding,
  FaFilter,
  FaExclamationCircle,
  FaCircle,
} from "react-icons/fa";

// --- 1. CONFIGURATION (Matches Backend Enums) ---

const STATUS_CONFIG = {
  // Backend Enum: PENDING
  PENDING: {
    label: "New",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    dot: "text-blue-500",
  },
  // Backend Enum: UNDER_REVIEW
  UNDER_REVIEW: {
    label: "In Review",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "text-amber-500",
  },
  // Backend Enum: INVESTIGATING
  INVESTIGATING: {
    label: "Investigating",
    color: "bg-purple-50 text-purple-700 border-purple-200",
    dot: "text-purple-500",
  },
  // Backend Enum: RESOLVED
  RESOLVED: {
    label: "Resolved",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "text-emerald-500",
  },
  // Backend Enum: DISMISSED
  DISMISSED: {
    label: "Dismissed",
    color: "bg-gray-50 text-gray-500 border-gray-200",
    dot: "text-gray-400",
  },
};

const PRIORITY_STYLES = {
  LOW: "bg-gray-100 text-gray-600",
  MEDIUM: "bg-orange-50 text-orange-600",
  HIGH: "bg-rose-50 text-rose-600",
  CRITICAL: "bg-red-100 text-red-800 font-bold border border-red-200",
};

const ReportCard = ({ report, onClick, index }) => {
  // 🟢 BACKEND NORMALIZATION LAYER
  // Maps ReportResponseDTO fields to UI
  const data = {
    id: report.id,
    title: report.title || "Untitled Report",
    description: report.description || "No description provided.",
    status: report.status || "PENDING", // DTO: status
    priority: report.priority || "LOW", // DTO: priority (Enum)
    date: report.date || "N/A", // DTO: date (String)
    property: report.property || "Unknown", // DTO: property
    student: report.student || "Unknown", // DTO: student
    evidenceCount: report.evidenceCount || 0,
  };

  const statusStyle = STATUS_CONFIG[data.status] || STATUS_CONFIG.PENDING;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)" }}
      onClick={() => onClick(data.id)}
      className="relative flex flex-col h-full p-0 overflow-hidden transition-all duration-300 bg-white border shadow-sm cursor-pointer group rounded-xl border-gray-200/60 hover:border-accent/40"
    >
      {/* Top Status Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-50 bg-gray-50/30">
        <div
          className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyle.color}`}
        >
          <FaCircle className={`text-[6px] ${statusStyle.dot}`} />
          {statusStyle.label}
        </div>
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${PRIORITY_STYLES[data.priority]}`}
        >
          {data.priority}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 p-5">
        <h3 className="mb-2 text-base font-bold leading-tight text-gray-800 transition-colors group-hover:text-accent">
          {data.title}
        </h3>
        <p className="mb-4 text-xs leading-relaxed text-gray-500 line-clamp-3">
          {data.description}
        </p>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 mt-auto text-xs text-gray-500 gap-y-2 gap-x-4">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <FaBuilding className="text-gray-300 min-w-[12px]" />
            <span className="font-medium text-gray-600 truncate">
              {data.property}
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-hidden">
            <FaUser className="text-gray-300 min-w-[12px]" />
            <span className="font-medium text-gray-600 truncate">
              {data.student}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-400 font-medium uppercase tracking-wider bg-gray-50/10">
        <span className="flex items-center gap-1.5">
          <FaCalendarAlt /> {data.date}
        </span>
        {data.evidenceCount > 0 && (
          <span className="flex items-center gap-1 text-accent">
            <i className="fas fa-paperclip"></i> {data.evidenceCount} File(s)
          </span>
        )}
      </div>
    </motion.div>
  );
};

const ReportsList = ({ reports, loading, onViewDetails, onFilterChange }) => {
  // Skeleton Loader for Professional Feel
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="flex flex-col justify-between h-56 p-5 bg-white border border-gray-100 rounded-xl animate-pulse"
          >
            <div>
              <div className="flex justify-between mb-4">
                <div className="w-20 h-5 bg-gray-100 rounded"></div>
                <div className="w-12 h-5 bg-gray-100 rounded"></div>
              </div>
              <div className="w-3/4 h-6 mb-3 bg-gray-100 rounded"></div>
              <div className="w-full h-3 mb-2 bg-gray-100 rounded"></div>
              <div className="w-2/3 h-3 bg-gray-100 rounded"></div>
            </div>
            <div className="w-full h-8 mt-4 rounded bg-gray-50"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col items-end justify-between gap-4 pb-4 border-b border-gray-200 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-800">
            Incident Reports
          </h2>
          <p className="mt-1 text-sm font-medium text-gray-500">
            Manage reported issues, misconduct, and disputes.
          </p>
        </div>

        <div className="relative">
          <FaFilter className="absolute z-10 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          <select
            onChange={(e) => onFilterChange(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 cursor-pointer shadow-sm hover:border-gray-400 transition-all appearance-none min-w-[200px]"
          >
            <option value="All">All Statuses</option>
            <option value="PENDING">Pending (New)</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
          <div className="absolute text-xs text-gray-400 -translate-y-1/2 pointer-events-none right-3 top-1/2">
            ▼
          </div>
        </div>
      </div>

      {/* Grid Content */}
      {reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-gray-200 border-dashed bg-gray-50 rounded-2xl">
          <div className="flex items-center justify-center w-16 h-16 mb-4 bg-white rounded-full shadow-sm">
            <FaExclamationCircle className="text-2xl text-gray-300" />
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-900">
            No reports found
          </h3>
          <p className="text-sm text-gray-500">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {reports.map((report, index) => (
              <ReportCard
                key={report.id || index}
                report={report}
                index={index}
                onClick={onViewDetails}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ReportsList;
