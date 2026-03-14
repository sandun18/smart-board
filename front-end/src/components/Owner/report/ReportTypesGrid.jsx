// import React from "react";
// import { motion } from "framer-motion";
// import {
//   FaUserTimes,
//   FaMoneyBillWave,
//   FaHouseDamage,
//   FaVolumeUp,
//   FaExclamationCircle,
//   FaShieldAlt,
// } from "react-icons/fa";

// const OWNER_REPORT_TYPES = [
//   {
//     type: "misconduct",
//     icon: FaUserTimes,
//     title: "Student Misconduct",
//     description:
//       "Report rule violations, inappropriate behavior, or conflicts with other tenants.",
//   },
//   {
//     type: "payment",
//     icon: FaMoneyBillWave,
//     title: "Payment Issue",
//     description: "Report late payments, missed rent, or billing disputes.",
//   },
//   {
//     type: "damage",
//     icon: FaHouseDamage,
//     title: "Property Damage",
//     description:
//       "Report damage to furniture, facilities, or the boarding property.",
//   },
//   {
//     type: "noise",
//     icon: FaVolumeUp,
//     title: "Noise Complaint",
//     description: "Report excessive noise or disturbance of peace.",
//   },
//   {
//     type: "safety",
//     icon: FaShieldAlt,
//     title: "Safety Threat",
//     description: "Report threats, dangerous activities, or security concerns.",
//   },
//   {
//     type: "other",
//     icon: FaExclamationCircle,
//     title: "Other Issue",
//     description: "Any other concerns regarding tenancy or students.",
//   },
// ];

// const ReportTypesGrid = ({ onSelectType }) => {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 min-[1400px]:grid-cols-3 gap-6">
//       {OWNER_REPORT_TYPES.map((reportType, index) => (
//         <motion.div
//           key={reportType.type}
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: index * 0.1 }}
//           whileHover={{ y: -5, borderColor: "var(--accent)" }}
//           onClick={() => onSelectType(reportType.type, reportType.title)}
//           className="bg-card-bg p-8 rounded-large shadow-custom text-center cursor-pointer transition-all duration-300 border-2 border-transparent hover:shadow-xl h-full flex flex-col items-center group"
//         >
//           <motion.div
//             whileHover={{
//               scale: 1.1,
//               backgroundColor: "var(--accent)",
//               color: "white",
//             }}
//             className="w-20 h-20 bg-background-light rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-accent transition-all duration-300"
//           >
//             <reportType.icon />
//           </motion.div>
//           <h3 className="text-xl font-bold text-text-dark mb-2">
//             {reportType.title}
//           </h3>
//           <p className="text-text-muted text-sm leading-relaxed">
//             {reportType.description}
//           </p>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default ReportTypesGrid;

import React from "react";
import { motion } from "framer-motion";
import {
  FaUserTimes,
  FaMoneyBillWave,
  FaHouseDamage,
  FaTools,
  FaClock,
} from "react-icons/fa";

const STUDENT_TYPES = [
  {
    type: "MISCONDUCT",
    icon: FaUserTimes,
    title: "Student Misconduct",
    description: "Rule violations.",
  },
  {
    type: "PAYMENT",
    icon: FaMoneyBillWave,
    title: "Payment Issue",
    description: "Late rent.",
  },
  {
    type: "DAMAGE",
    icon: FaHouseDamage,
    title: "Damage",
    description: "Property damage.",
  },
];
const TECHNICIAN_TYPES = [
  {
    type: "POOR_WORK_QUALITY",
    icon: FaTools,
    title: "Poor Work",
    description: "Repair failed.",
  },
  {
    type: "PAYMENT_ISSUE",
    icon: FaMoneyBillWave,
    title: "Overcharging",
    description: "Demanded extra money.",
  },
  {
    type: "DELAY",
    icon: FaClock,
    title: "No Show",
    description: "Did not arrive.",
  },
];

const ReportTypesGrid = ({ onSelectType, targetMode }) => {
  const types = targetMode === "TECHNICIAN" ? TECHNICIAN_TYPES : STUDENT_TYPES;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {types.map((t, i) => (
        <motion.div
          key={t.type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -5, borderColor: "var(--accent)" }}
          onClick={() => onSelectType(t.type, t.title)}
          className="bg-card-bg p-8 rounded-large shadow-custom text-center cursor-pointer border-2 border-transparent hover:shadow-xl group"
        >
          <motion.div
            whileHover={{
              scale: 1.1,
              backgroundColor: "var(--accent)",
              color: "white",
            }}
            className="w-20 h-20 bg-background-light rounded-full flex items-center justify-center mx-auto mb-4 text-3xl text-accent"
          >
            <t.icon />
          </motion.div>
          <h3 className="text-xl font-bold text-text-dark mb-2">{t.title}</h3>
          <p className="text-text-muted text-sm">{t.description}</p>
        </motion.div>
      ))}
    </div>
  );
};
export default ReportTypesGrid;
