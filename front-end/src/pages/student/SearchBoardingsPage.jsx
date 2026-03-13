import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaFilter } from 'react-icons/fa';

// Layout
import StudentLayout from '../../components/student/common/StudentLayout';

// Components
import BoardingCard from '../../components/student/search/BoardingCard';
import FiltersSidebar from '../../components/student/search/FiltersSidebar';
import SearchHero from '../../components/student/search/SearchHero';
import ResultsHeader from '../../components/student/search/ResultsHeader';
import EmptyResults from '../../components/student/search/EmptyResults';

// Data & Hooks
import { sampleBoardings } from '../../data/student/searchBoardingsData.js';
import { useSearchFilters } from '../../hooks/student/useSearchFilters.js';
import { useSortBoardings } from '../../hooks/student/useSortBoardings.js';

const SearchBoardingsPage = () => {
  // const [searchQuery, setSearchQuery] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isSearching, setIsSearching] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  // Custom hooks
  const {
    filters,
    filteredBoardings,
    handleFilterChange,
    applyFilters,
    clearAllFilters,
    setFilteredBoardings
  } = useSearchFilters(sampleBoardings);

  const { sortBy, handleSort } = useSortBoardings();

  const handleSearch = () => {
    if (!filters.searchQuery || !filters.searchQuery.trim()) {
      alert('Please enter a location to search');
      return;
    }
    setIsSearching(true);
    setTimeout(() => {
      applyFilters();
      setIsSearching(false);
    }, 500);
  };

  const handleBookAppointment = (id) => {
    console.log(`Booking appointment for boarding ${id}`);
    alert('Redirecting to appointment booking...');
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setMoveInDate(today);
  }, []);

  return (
    <StudentLayout
      title="Search Boardings"
      subtitle="Find your perfect boarding place near campus"
    >
      {/* 1. Search Hero Section */}
      <div className="mb-6">
        <SearchHero 
          searchQuery={filters.searchQuery}
          setSearchQuery={(val) => handleFilterChange('searchQuery', val)}
          moveInDate={moveInDate}
          setMoveInDate={setMoveInDate}
          onSearch={handleSearch}
          isSearching={isSearching}
        />
      </div>

      {/* 2. Control Section (Stacked: Filter Button Top -> Results Header Bottom) */}
      <div className="flex flex-col gap-4 mb-6">
        
        {/* Universal "Show Filters" Button - FULL WIDTH & AT THE TOP */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => setIsFilterModalOpen(true)}
          className="w-full bg-white rounded-large shadow-custom py-4 px-6 flex items-center justify-between group border border-transparent hover:border-accent transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="bg-background-light p-2 rounded-full group-hover:bg-accent/10 transition-colors">
              <FaFilter className="text-accent text-lg" />
            </div>
            <span className="text-primary font-bold text-base sm:text-lg">Filter Boardings</span>
          </div>

          {/* Active Filter Indicator */}
          {(filters.minPrice > 0 || filters.amenities.length > 0) ? (
             <div className="flex items-center gap-2">
               <span className="text-sm font-medium text-accent">Filters Active</span>
               <span className="flex h-3 w-3 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
               </span>
             </div>
          ) : (
            <span className="text-text-muted text-sm group-hover:text-accent transition-colors">Select options</span>
          )}
        </motion.button>

        {/* Results Header (Sort & View Mode) - Below the button */}
        <div className="w-full">
          <ResultsHeader 
            resultsCount={filteredBoardings.length}
            sortBy={sortBy}
            onSort={(value) => handleSort(value, filteredBoardings, setFilteredBoardings)}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
        </div>
      </div>

      {/* 3. Results Section */}
      <div className="min-w-0 relative">
        
        {/* Filter Modal Component */}
        <FiltersSidebar 
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={clearAllFilters}
          onApply={applyFilters}
        />

        {/* Results Grid */}
        <AnimatePresence mode="wait">
          {filteredBoardings.length === 0 ? (
            <EmptyResults onClearFilters={clearAllFilters} />
          ) : (
            <motion.div 
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              // Strict Breakpoints: Mobile(1) -> Tablet(2) -> Desktop(3)
              className={`grid gap-4 sm:gap-6 mb-6 sm:mb-8 items-stretch ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}
            >
              {filteredBoardings.map((boarding, index) => (
                <motion.div
                  key={boarding.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full" // Uniform height wrapper
                >
                  <BoardingCard 
                    boarding={boarding}
                    onBook={handleBookAppointment}
                    viewMode={viewMode}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More Button */}
        {filteredBoardings.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border-2 border-accent text-accent px-8 py-3 rounded-large font-semibold text-base hover:bg-accent hover:text-white transition-all duration-300 flex items-center gap-2 mx-auto shadow-md hover:shadow-xl"
            >
              <FaPlus />
              Load More Results
            </motion.button>
            <p className="text-text-muted text-sm mt-4">
              Showing {filteredBoardings.length} of 87 boardings
            </p>
          </motion.div>
        )}
      </div>
    </StudentLayout>
  );
};

export default SearchBoardingsPage;