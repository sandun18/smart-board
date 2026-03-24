import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  FaSearch, FaCalendarAlt, FaCreditCard, 
  FaTools, FaFlag, FaUserCog
} from 'react-icons/fa';

const actionButtons = [
  { path: "/student/search-boardings", icon: FaSearch, label: "Search Boardings" },
  { path: "/student/appointmentpage", icon: FaCalendarAlt, label: "View Appointments" },
  { path: "/student/billing", icon: FaCreditCard, label: "Pay Bills" },
];

const manageButtons = [
  { path: "/student/maintenance", icon: FaTools, label: "Maintenance Requests" },
  { path: "/student/reports", icon: FaFlag, label: "Report Issues" },
  { path: "/student/profile", icon: FaUserCog, label: "Profile Settings" },
];

const QuickActionButton = ({ path, icon: Icon, label }) => (
  <Link
    to={path}
    className="bg-white border border-gray-200 text-text-dark 
    p-3 md:p-3.5 rounded-large flex items-center gap-3 
    text-sm md:text-base font-semibold shadow-sm 
    transition-all hover:shadow-accent-hover hover:bg-accent hover:text-white"
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </Link>
);

const QuickActionsSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="mb-8"
    >
      <h2 className="text-primary text-xl md:text-2xl font-bold mb-4">
        Quick Actions
      </h2>

      <div className="bg-card-bg p-4 md:p-6 rounded-large shadow-custom 
        flex flex-col xl:flex-row gap-8 hover:shadow-xl">

        {/* FIND & BOOK */}
        <div className="flex-1">
          <h3 className="text-secondary-accent text-lg md:text-xl font-semibold mb-4">
            Find & Book
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {actionButtons.map((btn, index) => (
              <QuickActionButton key={index} {...btn} />
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-full h-px bg-primary/20 xl:w-px xl:h-auto"></div>

        {/* MANAGE */}
        <div className="flex-1">
          <h3 className="text-secondary-accent text-lg md:text-xl font-semibold mb-4">
            Manage
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {manageButtons.map((btn, index) => (
              <QuickActionButton key={index} {...btn} />
            ))}
          </div>
        </div>

      </div>
    </motion.section>
  );
};

export default QuickActionsSection;
