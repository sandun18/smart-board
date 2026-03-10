import React from 'react';
import { motion } from 'framer-motion';
import { FaCamera, FaCheckCircle, FaStar, FaExternalLinkAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ProfileHeader = ({ userData, onChangeAvatar }) => {

  const navigate = useNavigate();

  const handleNameClick = () => {
    if (userData?.id) {
        // ✅ Matches the route used in your InfoCards.jsx
        navigate(`/profile/view/${userData.id}`);
    }
  };

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
              src={userData.avatar}
              alt={`${userData.firstName} ${userData.lastName}`}
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
            <div 
                onClick={handleNameClick}
                className="flex items-center justify-center gap-3 mb-2 cursor-pointer group sm:justify-start"
                title="View Public Profile"
            >
                <h2 className="text-3xl font-bold transition-colors duration-200 text-text-dark group-hover:text-accent">
                  {userData.firstName} {userData.lastName}
                </h2>
                <FaExternalLinkAlt className="text-sm transition-opacity duration-200 opacity-0 text-text-muted group-hover:opacity-100 group-hover:text-accent" />
            </div>
            <p className="mb-1 text-lg text-text-muted">{userData.email}</p>
            <p className="mb-3 font-semibold text-accent">Student Member</p>
            
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <span className="flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-success/20 text-success">
                <FaCheckCircle />
                Email Verified
              </span>
              {/* <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-warning/20 text-warning text-xs font-semibold">
                <FaStar />
                Member since 2023
              </span> */}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        {/* <div className="grid w-full grid-cols-2 gap-4 lg:w-auto">
          {[
            { label: 'Visits Booked', value: '12' },
            { label: 'Reviews Posted', value: '5' },
            { label: 'Active Reports', value: '3' },
            { label: 'Response Rate', value: '98%' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 text-center bg-background-light rounded-large"
            >
              <div className="mb-1 text-3xl font-bold text-primary">{stat.value}</div>
              <div className="text-sm text-text-muted">{stat.label}</div>
            </motion.div>
          ))}
        </div> */}
      </div>
    </motion.section>
  );
};

export default ProfileHeader;