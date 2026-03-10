import React from "react";
import { motion } from "framer-motion";
import {
  FaFileInvoiceDollar,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";

const RegistrationRow = ({ registration, config, onViewProof }) => {
  const isKeyMoneyPaid = registration.keyMoneyPaid;

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative p-4 rounded-2xl bg-white border ${config.border} shadow-sm hover:shadow-md transition-all group`}
    >
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        {/* Left: Info Block */}
        <div className="flex items-start gap-4">
          {/* Status Icon Box */}
          <div
            className={`relative p-4 rounded-2xl bg-white border ${config.border} shadow-sm hover:shadow-md transition-all group`}
          >
            {registration.status === "PENDING" && <FaClock size={22} />}
            {registration.status === "ACCEPTED" && <FaCheckCircle size={22} />}
            {registration.status === "REJECTED" && <FaTimesCircle size={22} />}
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-black leading-tight text-text md:text-base">
              {registration.studentName}
            </h4>
            <p className="flex flex-wrap items-center gap-2 text-xs font-bold text-muted">
              <span className="text-primary">{registration.boardingName}</span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <FaUsers className="text-gray-400" />{" "}
                {registration.numberOfStudents} People
              </span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center gap-1">
                <FaCalendarAlt className="text-gray-400" /> Move-in:{" "}
                {formatDate(registration.moveInDate)}
              </span>
            </p>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-1.5">
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wide ${config.bgClass} ${config.textClass}`}
              >
                {registration.status}
              </span>

              {isKeyMoneyPaid ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                  Key Money Paid
                </span>
              ) : (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-500 border border-gray-200 uppercase tracking-wide">
                  Payment Pending
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions Block */}
        <div className="flex items-center w-full gap-3 mt-2 md:w-auto md:mt-0">
          {/* CTA Button: Only show if PENDING and PAID */}
          {isKeyMoneyPaid && registration.status === "PENDING" && (
            <button
              onClick={() => onViewProof(registration)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-white text-xs font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-dark hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95"
            >
              <FaFileInvoiceDollar size={14} />
              Review Payment
            </button>
          )}

          {/* Info Text for processed items */}
          {registration.status !== "PENDING" && (
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-muted font-bold uppercase tracking-wider">
                Processed
              </span>
              <span className="text-xs font-bold text-text">
                {formatDate(registration.date)}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default RegistrationRow;
