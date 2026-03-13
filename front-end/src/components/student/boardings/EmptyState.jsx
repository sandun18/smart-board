import React from 'react';
import { motion } from 'framer-motion';
import { FaBuilding, FaSearch } from 'react-icons/fa';

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-20 px-8 bg-card-bg rounded-large shadow-custom"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="mb-6"
      >
        <FaBuilding className="text-7xl text-text-muted mx-auto" />
      </motion.div>
      <h3 className="text-2xl font-bold text-text-dark mb-3">No Current Boarding</h3>
      <p className="text-text-muted text-lg mb-8">
        You don't have any active boarding at the moment.
      </p>
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = 'student/search-boardings'}
        className="flex items-center justify-center gap-2 px-8 py-4 rounded-large font-semibold bg-accent text-white hover:bg-primary transition-all duration-300 shadow-md mx-auto"
      >
        <FaSearch />
        Find Boardings
      </motion.button>
    </motion.div>
  );
};

export default EmptyState;