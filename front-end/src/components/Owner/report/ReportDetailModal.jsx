import React from "react";
import { motion } from "framer-motion";

const ReportDetailModal = ({ report, onClose }) => {
  if (!report) return null;

  // 🟢 DATA MAPPING (Matches ReportResponseDTO.java)
  const data = {
    id: report.id,
    title: report.title,
    description: report.description,
    status: report.status || "PENDING",
    type: report.type || "General",
    priority: report.priority || "LOW", // DTO uses 'priority' (enum)
    date: report.date,

    // Boarding Info
    property: report.property,

    // User Info (Handle DTO nested objects or flat strings)
    student: report.reportedUser?.name || report.student || "N/A",
    sender: report.sender?.name || "Unknown",

    // Admin Resolutions (From DTO)
    adminResponse: report.adminResponse,
    actionTaken: report.actionTaken,
    actionDuration: report.actionDuration,

    // Evidence (Handle single object DTO or List)
    evidence: report.evidence ? [report.evidence] : [], // Wrap single DTO in array for map
    evidenceCount: report.evidenceCount || 0,
  };

  const isResolved = data.status === "RESOLVED" || data.status === "DISMISSED";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* --- HEADER --- */}
        <div className="flex items-start justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/50">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold leading-tight text-gray-800">
                {data.title}
              </h2>
            </div>
            <p className="text-xs font-medium text-gray-500">
              Submitted on <span className="text-gray-700">{data.date}</span> •
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 text-gray-400 transition-colors bg-white border border-gray-200 rounded-full shadow-sm hover:text-red-500 hover:border-red-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* --- SCROLLABLE CONTENT --- */}
        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
          {/* 1. Status & Priority Banner */}
          <div className="flex gap-4">
            <div
              className={`flex-1 p-4 rounded-xl border flex flex-col justify-center items-center gap-1 
              ${
                data.status === "PENDING"
                  ? "bg-blue-50 border-blue-100 text-blue-700"
                  : data.status === "RESOLVED"
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-gray-50 border-gray-100 text-gray-600"
              }`}
            >
              <span className="text-[10px] uppercase font-black tracking-widest opacity-60">
                Current Status
              </span>
              <span className="text-lg font-bold">
                {data.status.replace("_", " ")}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 gap-1 p-4 text-gray-600 border border-gray-100 rounded-xl bg-gray-50">
              <span className="text-[10px] uppercase font-black tracking-widest opacity-60">
                Severity Level
              </span>
              <span className="text-lg font-bold">{data.priority}</span>
            </div>
          </div>

          {/* 2. Key Parties (Grid) */}
          <div className="grid grid-cols-2 gap-6">
            {/* Boarding */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                Property
              </label>
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 text-gray-400 bg-gray-100 rounded-lg">
                  <i className="fas fa-building"></i>
                </div>
                <span className="text-sm font-bold text-gray-700 truncate">
                  {data.property}
                </span>
              </div>
            </div>

            {/* Student */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                Reported Individual
              </label>
              <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 text-gray-400 bg-gray-100 rounded-lg">
                  <i className="fas fa-user"></i>
                </div>
                <span className="text-sm font-bold text-gray-700 truncate">
                  {data.student}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Description */}
          <div>
            <h3 className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-900">
              <i className="text-gray-300 fas fa-align-left"></i> Incident
              Details
            </h3>
            <div className="p-6 text-sm font-medium leading-relaxed text-gray-600 whitespace-pre-wrap border border-gray-100 bg-gray-50 rounded-xl">
              "{data.description}"
            </div>
          </div>

          {/* 4. Admin Resolution (Only if Resolved/Dismissed) */}
          {isResolved && (data.adminResponse || data.actionTaken) && (
            <div className="p-6 border bg-emerald-50/50 border-emerald-100 rounded-xl">
              <h3 className="flex items-center gap-2 mb-4 text-sm font-bold text-emerald-800">
                <i className="fas fa-check-circle"></i> Official Resolution
              </h3>

              <div className="space-y-4">
                {data.actionTaken && (
                  <div className="flex justify-between pb-2 border-b border-emerald-100/50">
                    <span className="text-xs font-bold uppercase text-emerald-600">
                      Action Taken:
                    </span>
                    <span className="text-xs font-medium text-emerald-900">
                      {data.actionTaken} ({data.actionDuration})
                    </span>
                  </div>
                )}
                {data.adminResponse && (
                  <div>
                    <span className="block mb-1 text-xs font-bold uppercase text-emerald-600">
                      Admin Notes:
                    </span>
                    <p className="text-sm text-emerald-900">
                      {data.adminResponse}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 5. Evidence Section */}
          <div>
            <h3 className="flex items-center gap-2 mb-3 text-sm font-bold text-gray-900">
              <i className="text-gray-300 fas fa-paperclip"></i> Evidence (
              {data.evidenceCount})
            </h3>

            {data.evidenceCount > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {/* Map EvidenceDTO or generic array */}
                {data.evidence.map((file, i) => (
                  <a
                    href={file.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    key={i}
                    className="relative overflow-hidden transition-all bg-gray-100 border border-gray-200 cursor-pointer group aspect-square rounded-xl hover:border-accent"
                  >
                    {/* If it's an image, show it, otherwise show icon */}
                    {file.type === "image" ||
                    (file.url && file.url.match(/\.(jpeg|jpg|png|gif)$/)) ? (
                      <img
                        src={file.url}
                        alt="Evidence"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-gray-400 group-hover:text-accent">
                        <i className="mb-1 text-2xl fas fa-file-alt"></i>
                        <span className="text-[9px] uppercase font-bold">
                          Document
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold backdrop-blur-[2px]">
                      View File
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center border border-gray-200 border-dashed bg-gray-50 rounded-xl">
                <p className="text-xs italic text-gray-400">
                  No evidence files attached to this report.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-lg text-xs font-bold text-white bg-gray-900 hover:bg-black transition-colors shadow-lg"
          >
            Close Viewer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ReportDetailModal;
