import React from "react";
import { FaTimes, FaExclamationTriangle } from "react-icons/fa";

const ReportHeader = ({ job, onClose }) => {
  // Format Date
  const formattedDate = new Date(job.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // ✅ READ FROM DTO (Flat Fields)
  const boardingTitle = job.boardingTitle || "Unknown Boarding";

  return (
    <div className="bg-red-50 p-6 border-b border-red-100 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <div className="bg-red-100 p-2 rounded-full text-red-600">
          <FaExclamationTriangle size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-red-700">Report Owner</h2>
          <p className="text-xs text-red-500 font-medium">
            {formattedDate} • {boardingTitle}
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <FaTimes size={24} />
      </button>
    </div>
  );
};

export default ReportHeader;