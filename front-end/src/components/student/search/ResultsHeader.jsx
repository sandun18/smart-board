import React from 'react';
import { motion } from 'framer-motion';
import { FaTh, FaList } from 'react-icons/fa';

const ResultsHeader = ({ 
  resultsCount, 
  sortBy, 
  onSort, 
  viewMode, 
  setViewMode 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-large shadow-custom p-5 mb-6 sticky top-24 z-10"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-primary text-2xl font-bold mb-1">Search Results</h2>
          <p className="text-text-muted">
            <span className="text-accent font-bold">{resultsCount}</span> boardings found 
            {/* <strong>University of Ruhuna</strong> */}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select 
            value={sortBy}
            onChange={(e) => onSort(e.target.value)}
            className="px-4 py-2 border border-background-light rounded-large bg-white text-text-dark outline-none focus:border-accent"
          >
            <option value="relevance">Sort by: Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="distance">Nearest First</option>
          </select>

          <div className="flex bg-background-light rounded-large p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-btn transition-all ${
                viewMode === 'grid' ? 'bg-accent text-white' : 'text-text-muted'
              }`}
            >
              <FaTh />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-btn transition-all ${
                viewMode === 'list' ? 'bg-accent text-white' : 'text-text-muted'
              }`}
            >
              <FaList />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultsHeader;
