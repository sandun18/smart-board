import React from "react";
import { motion } from "framer-motion";
import { FaBuilding, FaEdit } from "react-icons/fa";

const BusinessInfoSection = ({ ownerData, onEdit }) => {
  // We include 'nicNumber' since it is available in your Backend DTO
  const infoItems = [
    { label: "Business / Owner Name", value: ownerData.businessName },
    { label: "NIC Number", value: ownerData.nicNumber || "Not provided" },
    { label: "Phone Number", value: ownerData.phone },
    { label: "Email Address", value: ownerData.email },
    { label: "Main Address", value: ownerData.address, fullWidth: true },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="p-6 bg-card-bg rounded-large shadow-custom"
    >
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
        <h3 className="flex items-center gap-2 text-xl font-bold text-primary">
          <FaBuilding />
          Business Information
        </h3>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-large bg-background-light text-text-dark hover:bg-accent hover:text-white"
        >
          <FaEdit />
          Edit Info
        </motion.button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {infoItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-4 rounded-large hover:bg-background-light/30 transition-colors duration-200 ${
              item.fullWidth ? "md:col-span-2" : ""
            }`}
          >
            <label className="block mb-1 text-sm font-semibold text-text-muted">
              {item.label}
            </label>
            <p className="text-lg font-medium text-text-dark">
              {item.value || (
                <span className="italic text-gray-400">Not set</span>
              )}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default BusinessInfoSection;
