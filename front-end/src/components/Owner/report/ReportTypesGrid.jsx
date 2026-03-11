import React from "react";
import { motion } from "framer-motion";
import {
  FaUserTimes,
  FaMoneyBillWave,
  FaHouseDamage,
  FaVolumeUp,
  FaExclamationCircle,
  FaShieldAlt,
} from "react-icons/fa";

const OWNER_REPORT_TYPES = [
  {
    type: "misconduct",
    icon: FaUserTimes,
    title: "Student Misconduct",
    description:
      "Report rule violations, inappropriate behavior, or conflicts with other tenants.",
  },
  {
    type: "payment",
    icon: FaMoneyBillWave,
    title: "Payment Issue",
    description: "Report late payments, missed rent, or billing disputes.",
  },
  {
    type: "damage",
    icon: FaHouseDamage,
    title: "Property Damage",
    description:
      "Report damage to furniture, facilities, or the boarding property.",
  },
  {
    type: "noise",
    icon: FaVolumeUp,
    title: "Noise Complaint",
    description: "Report excessive noise or disturbance of peace.",
  },
  {
    type: "safety",
    icon: FaShieldAlt,
    title: "Safety Threat",
    description: "Report threats, dangerous activities, or security concerns.",
  },
  {
    type: "other",
    icon: FaExclamationCircle,
    title: "Other Issue",
    description: "Any other concerns regarding tenancy or students.",
  },
];

const ReportTypesGrid = ({ onSelectType }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-[1400px]:grid-cols-3 gap-6">
      {OWNER_REPORT_TYPES.map((reportType, index) => (
        <motion.div
          key={reportType.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -5, borderColor: "var(--accent)" }}
          onClick={() => onSelectType(reportType.type, reportType.title)}
          className="flex flex-col items-center h-full p-8 text-center transition-all duration-300 border-2 border-transparent cursor-pointer bg-card-bg rounded-large shadow-custom hover:shadow-xl group"
        >
          <motion.div
            whileHover={{
              scale: 1.1,
              backgroundColor: "var(--accent)",
              color: "white",
            }}
            className="flex items-center justify-center w-20 h-20 mx-auto mb-4 text-3xl transition-all duration-300 rounded-full bg-background-light text-accent"
          >
            <reportType.icon />
          </motion.div>
          <h3 className="mb-2 text-xl font-bold text-text-dark">
            {reportType.title}
          </h3>
          <p className="text-sm leading-relaxed text-text-muted">
            {reportType.description}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default ReportTypesGrid;