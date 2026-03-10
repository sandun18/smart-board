import React from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaCheckCircle, FaStar } from 'react-icons/fa';

const ProfileHeader = ({ ownerData, onChangeAvatar }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8 bg-card-bg rounded-large shadow-custom"
    >
      <div className="flex flex-col items-start justify-between gap-8 lg:flex-row">
        {/* Avatar and Info */}
        <div className="flex flex-col items-center w-full gap-6 sm:flex-row sm:items-start lg:w-auto">
          <div className="relative flex-shrink-0">
            <img
              src={ownerData.avatar}
              alt={`${ownerData.firstName} ${ownerData.lastName}`}
              className="object-cover w-32 h-32 border-4 rounded-full border-accent"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onChangeAvatar}
              className="absolute flex items-center justify-center w-10 h-10 text-white transition-colors duration-300 rounded-full shadow-lg bottom-1 right-1 bg-accent hover:bg-primary"
            >
              <FaCamera />
            </motion.button>
          </div>

          <div className="text-center sm:text-left">
            <h2 className="mb-2 text-3xl font-bold text-text-dark">
              {ownerData.businessName}
            </h2>
            <p className="mb-1 text-lg text-text-muted">{ownerData.firstName} {ownerData.lastName}</p>
            <p className="mb-3 font-semibold text-accent">Verified Owner</p>
            
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-success/20 text-success">
                <FaCheckCircle />
                Identity Verified
              </span>
              <span className="flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-warning/20 text-warning">
                <FaStar />
                Partner since 2023
              </span>
            </div>
          </div>
        </div>

        
      </div>
    </motion.section>
  );
};

export default ProfileHeader;