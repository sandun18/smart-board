import React from "react";

const ReportTargetDetails = ({ job }) => {
  // ✅ READ FROM DTO (Flat Fields)
  const ownerName = job.ownerName || "Unknown Owner";
  const ownerPhone = job.ownerPhone || "N/A"; 
  const location = `${job.boardingCity || ""} - ${job.boardingAddress || ""}`;

  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="md:col-span-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
        Target Details (Auto-Filled)
      </div>

      <div>
        <label className="text-xs font-semibold text-gray-500">Reported Owner</label>
        <input
          type="text"
          value={ownerName}
          disabled
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-700 font-bold cursor-not-allowed"
        />
      </div>
      
      <div>
        <label className="text-xs font-semibold text-gray-500">Owner Phone</label>
        <input
          type="text"
          value={ownerPhone}
          disabled
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-600 cursor-not-allowed"
        />
      </div>
      
      <div className="md:col-span-2">
        <label className="text-xs font-semibold text-gray-500">Boarding Location</label>
        <input
          type="text"
          value={location}
          disabled
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-600 cursor-not-allowed"
        />
      </div>
    </div>
  );
};

export default ReportTargetDetails;