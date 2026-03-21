import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaBuilding, FaPhone, FaCheckCircle, FaTimesCircle, FaEye, FaInfoCircle } from "react-icons/fa";
import AppointmentDetailsModal from "./AppointmentDetailsModal";

const AppointmentRow = ({
  appointment,
  config,
  onAction,
  formatDate,
  formatTime,
  onProfileClick
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const isPending = appointment.status === "pending";
  const isConfirmed = appointment.status === "confirmed";

  // ✅ Helper: Get Initials (e.g. "John Doe" -> "JD")
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 2 }}
        animate={{ opacity: 1, y: 10 }}
        transition={{ duration: 0.3 }}
        className="relative flex flex-col gap-4 p-5 overflow-hidden transition-shadow duration-300 border md:flex-row md:items-center md:gap-6 md:p-6 rounded-report shadow-custom bg-card-bg border-light hover:shadow-md"
      >
        {/* 1. Student & Property Details */}
        <div className="flex flex-col flex-1 gap-1">
          <div className="flex items-start justify-between md:block">
            
            {/* ✅ UPDATED: Added click handler and cursor styling */}
            <div 
              className="flex items-center gap-3 cursor-pointer group" 
              onClick={() => onProfileClick(appointment.studentId)}
            >
              {/* Avatar Circle */}
              <div className="flex items-center justify-center w-10 h-10 text-xs font-black text-white transition-transform border-2 border-white rounded-full shadow-sm bg-gradient-to-br from-primary to-primary/80 ring-1 ring-light shrink-0 group-hover:scale-110">
                {getInitials(appointment.student)}
              </div>
              
              {/* Name & Status */}
              <div>
                <h4 className="text-base font-black leading-none tracking-tight uppercase transition-colors md:text-lg text-text group-hover:text-primary">
                  {appointment.student}
                </h4>
                {/* Mobile Status Badge */}
                <span className={`md:hidden inline-block mt-1 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full ${config.bgClass} ${config.textClass}`}>
                  {appointment.status}
                </span>
              </div>
            </div>
          </div>
          
          {/* Boarding Name (pushed slightly to align with text) */}
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] font-bold uppercase tracking-wider text-muted md:ml-[52px] mt-1">
            <FaBuilding className="text-accent" />
            <span className="truncate">{appointment.boardingName}</span>
          </div>
        </div>

        {/* 2. Contact & Date */}
        <div className="grid grid-cols-2 md:flex md:flex-row flex-[2] gap-4 md:gap-6 py-3 md:py-0 border-y md:border-y-0 border-light/50">
          <div className="flex flex-col justify-center gap-1 md:flex-1">
            <div className="flex items-center gap-2 font-bold text-text">
              <FaPhone className="text-info text-[10px]" />
              <span className="text-xs md:text-sm">{appointment.contact}</span>
            </div>
            <span className="hidden md:block text-[10px] italic text-muted truncate">
              Note: {appointment.notes?.slice(0, 25)}...
            </span>
          </div>

          <div className="text-left md:text-center shrink-0 md:w-32 md:border-x border-light md:px-4">
            <div className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] text-muted mb-0.5 md:mb-1">
              Visit Date
            </div>
            <div className="text-sm font-black leading-none md:text-base text-primary">
              {formatDate(appointment.date)}
            </div>
            <div className="text-[10px] md:text-xs font-bold text-muted mt-0.5">
              {formatTime(appointment.time)}
            </div>
          </div>
        </div>

        {/* 3. Actions */}
        <div className="flex items-center justify-between gap-3 mt-2 md:justify-end md:gap-4 md:mt-0">
          <div className="flex w-full gap-2 md:w-auto">
            
            {/* Detail Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-2.5 rounded-full bg-gray-100 text-muted hover:bg-gray-200 hover:text-text transition-colors flex items-center justify-center shadow-sm"
              title="View Details"
            >
              <FaInfoCircle />
            </motion.button>

            {/* Pending Actions */}
            {isPending && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest bg-success text-white shadow-sm flex items-center justify-center gap-2"
                  onClick={() => onAction(appointment.id, "confirmed")}
                >
                  <FaCheckCircle /> Confirm
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest border-2 border-error text-error flex items-center justify-center gap-2"
                  onClick={() => onAction(appointment.id, "rejected")}
                >
                  <FaTimesCircle /> Reject
                </motion.button>
              </>
            )}

            {/* Confirmed Actions */}
            {isConfirmed && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full md:w-auto px-6 py-2.5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest bg-info text-white shadow-sm flex items-center justify-center gap-2"
                  onClick={() => onAction(appointment.id, "visited")}
                >
                  <FaEye /> Mark Visited
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 md:flex-none px-4 py-2.5 rounded-full font-black text-[9px] md:text-[10px] uppercase tracking-widest border-2 border-error text-error flex items-center justify-center gap-2"
                  onClick={() => onAction(appointment.id, "rejected")}
                >
                  <FaTimesCircle /> Reject
                </motion.button>
              </>
            )}
          </div>

          {/* Desktop Status Badge */}
          <span
            className={`hidden md:block px-4 py-2 text-[10px] font-black uppercase tracking-[0.15em] rounded-full shadow-inner shrink-0 ${config.bgClass} ${config.textClass}`}
          >
            {appointment.status}
          </span>
        </div>
      </motion.div>

      {/* Render Modal */}
      <AppointmentDetailsModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        appointment={appointment}
        formatDate={formatDate}
        formatTime={formatTime}
      />
    </>
  );
};

export default AppointmentRow;