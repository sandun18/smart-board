import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaEnvelope, FaPhone, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const OwnerCard = ({ owner, onContact }) => {
  const [showPhone, setShowPhone] = useState(false);
  const navigate = useNavigate();

  // ✅ SAFETY CHECK: If owner is missing, show a placeholder
  if (!owner) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-custom border border-gray-100">
        <p className="text-text-muted text-center">Owner details loading...</p>
      </div>
    );
  }

  // ✅ SAFE DATA EXTRACTION
  const ownerAvatar = owner.avatar || owner.image || null;
  const ownerPhone = owner.contact || "+94 77 123 4567";
  const ownerEmail = owner.email || "owner@example.com";
  const stats = owner.stats || {};

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (owner.id) {
      navigate(`/profile/view/${owner.id}`);
    }
  };

  // ✅ SAFE CHAT HANDLER (NO CRASH)
  const handleChatClick = () => {
    if (typeof onContact === "function") {
      onContact("message");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-custom border border-gray-100 transition-shadow duration-300 hover:shadow-lg"
    >
      {/* 1. Header */}
      <div className="flex items-center gap-4 mb-6">
        <div
          onClick={handleProfileClick}
          className="relative flex-shrink-0 cursor-pointer group"
        >
          {ownerAvatar ? (
            <img
              src={ownerAvatar}
              alt={owner.name || "Owner"}
              className="w-20 h-20 rounded-full object-cover border-4 border-background-light shadow-sm group-hover:border-accent transition-colors duration-300"
            />
          ) : (
            <FaUserCircle className="w-20 h-20 text-gray-200" />
          )}

          {owner.verified && (
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5">
              <FaCheckCircle className="text-green-500 text-lg" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            onClick={handleProfileClick}
            className="text-xl font-bold text-text-dark truncate cursor-pointer hover:text-accent hover:underline decoration-2 underline-offset-4 transition-all"
          >
            {owner.name || "Unknown Owner"}
          </h3>

          <p className="text-sm text-text-muted mb-1">Property Owner</p>
          <div className="inline-flex items-center gap-1 text-xs font-medium bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-md">
            <span>★ {owner.rating || "New"}</span>
            <span className="text-yellow-700/60">
              ({owner.reviewCount || 0} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Stats */}
      <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-gray-100 mb-6 divide-x divide-gray-100">
        <div className="text-center px-1">
          <div className="text-xl font-bold text-text-dark">
            {stats.properties || 0}
          </div>
          <div className="text-xs font-bold text-text-muted uppercase">
            Properties
          </div>
        </div>
        <div className="text-center px-1">
          <div className="text-xl font-bold text-text-dark">
            {stats.years || 0}
          </div>
          <div className="text-xs font-bold text-text-muted uppercase">
            Years Exp.
          </div>
        </div>
        <div className="text-center px-1">
          <div className="text-xl font-bold text-green-600">
            {stats.responseRate || 0}%
          </div>
          <div className="text-xs font-bold text-text-muted uppercase">
            Response
          </div>
        </div>
      </div>

      {/* 3. Contact / Chat */}
      <div className="space-y-3 mb-6">
        <div className="relative group">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleChatClick}
            className="w-full border-2 border-accent text-accent py-3 rounded-xl font-bold hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <FaEnvelope />
            Chat
          </motion.button>

          <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10">
            {ownerEmail}
          </div>
        </div>

        {showPhone ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full bg-green-50 border-2 border-green-200 text-green-700 py-3 rounded-xl font-bold flex items-center justify-center gap-3 cursor-text"
          >
            <FaPhone className="text-sm" />
            <span className="text-lg">{ownerPhone}</span>
          </motion.div>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowPhone(true)}
            className="w-full border-2 border-gray-200 text-text-dark py-3 rounded-xl font-bold hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <FaPhone />
            Show Number
          </motion.button>
        )}
      </div>

      {/* 4. Description */}
      {owner.description && (
        <p className="text-sm text-text-muted leading-relaxed italic bg-background-light p-4 rounded-xl">
          "{owner.description}"
        </p>
      )}
    </motion.div>
  );
};

export default OwnerCard;
