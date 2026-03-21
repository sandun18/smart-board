import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaEye, FaCog, FaMapMarkerAlt, FaCalendarAlt, 
  FaDollarSign, FaUserFriends, FaCreditCard, 
  FaTools, FaEnvelope, FaFileContract, FaStar,
  FaSpinner
} from 'react-icons/fa';
import EmergencyButton from "../../emergency/EmergencyButton";

const BoardingCard = ({
  boarding,
  onViewDetails,
  onManage,
  onPayRent,
  onRequestMaintenance,
  onContactOwner,
  onViewDocuments,
  isPayingRent
}) => {

  const navigate = useNavigate();

  // Navigation handler
  const handleDetailsClick = () => {
    if (boarding?.id) {
        navigate(`/student/boarding-details/${boarding.id}`);
    }
  };

  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80";

  const displayImage = (boarding?.image && boarding.image.trim() !== "") 
                        ? boarding.image 
                        : FALLBACK_IMAGE;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      // Added h-full, removed mb-8
      className="bg-card-bg rounded-large shadow-custom overflow-hidden transition-shadow duration-300 hover:shadow-xl h-full flex flex-col"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-6 pb-4">
        <div className="px-4 py-2 rounded-full bg-gradient-to-r from-success to-success/80 text-white font-semibold text-sm uppercase tracking-wider">
          Current Boarding
        </div>
        {/* <div className="flex gap-3 w-full md:w-auto"> */}
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onViewDetails}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-large font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
          >
            <FaEye />
            View Details
          </motion.button> */}
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onManage}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-large font-semibold bg-accent text-white hover:bg-primary transition-all duration-300 shadow-md"
          >
            <FaCog />
            Manage
          </motion.button> */}
        {/* </div> */}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 p-6 flex-1">
        {/* Image */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="rounded-large overflow-hidden h-48 lg:h-52"
          onClick={handleDetailsClick}
        >
          <img
            src={displayImage}
            alt={boarding.name}
            onError={(e) => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 
                onClick={handleDetailsClick}
                className="text-2xl font-bold text-text-dark mb-4 cursor-pointer hover:text-accent transition-colors"
            >
                {boarding.name}
            </h3>
            
            {/* Meta Items */}
            <div className="space-y-3 mb-6 text-sm">
              <div className="flex items-center gap-3 text-text-muted">
                <FaMapMarkerAlt className="text-accent w-4" />
                <span>{boarding.address}</span>
              </div>
              <div className="flex items-center gap-3 text-text-muted">
                <FaCalendarAlt className="text-accent w-4" />
                <span>Since {boarding.boardingSince}</span>
              </div>
              <div className="flex items-center gap-3 text-text-muted">
                <FaDollarSign className="text-accent w-4" />
                <span>LKR {boarding.rent}/month (Utilities included)</span>
              </div>
              <div className="flex items-center gap-3 text-text-muted">
                <FaUserFriends className="text-accent w-4" />
                <span>{boarding.roommates} Roommates</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 border-t border-gray-100 pt-4">
            <EmergencyButton boardingId={boarding.id} />
            <div className="text-center">
              <div className="text-2xl font-bold text-accent flex items-center gap-1">
                {boarding.rating || 0} <FaStar className="text-yellow-500 text-lg" />
              </div>
              <span className="text-sm text-text-muted">Rating</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{boarding.area}</div>
              <span className="text-sm text-text-muted">sq ft</span>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{boarding.responseRate}%</div>
              <span className="text-sm text-text-muted">Response Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-background-light p-6 border-t border-gray-200 mt-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-center">
          {/* Payment Section */}
          <div>
            <h4 className="text-lg font-bold text-text-dark mb-2">Next Payment</h4>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl font-bold text-accent">LKR {boarding.nextPayment.amount}</span>
              <span className="text-text-muted">{boarding.nextPayment.dueDate}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPayRent}
              disabled={isPayingRent}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-large font-semibold transition-all duration-300 w-full md:w-auto ${
                isPayingRent
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-accent text-white hover:bg-primary shadow-md'
              }`}
            >
              {isPayingRent ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaCreditCard />
                  Pay Now
                </>
              )}
            </motion.button>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3 justify-center lg:justify-end">
            <ActionButton icon={FaTools} label="Maintenance" onClick={onRequestMaintenance} />
            {/* <ActionButton icon={FaEnvelope} label="Contact Owner" onClick={onContactOwner} /> */}
            <ActionButton icon={FaFileContract} label="Documents" onClick={onViewDocuments} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon: Icon, label, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 rounded-large font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-300"
  >
    <Icon />
    {label}
  </motion.button>
);

export default BoardingCard;