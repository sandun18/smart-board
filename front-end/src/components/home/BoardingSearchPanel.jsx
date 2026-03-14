import React from 'react';
import { motion } from 'framer-motion';
import BoardingCard from '../student/search/BoardingCard';

const BoardingSearchPanel = ({
  itemVariants,
  formData,
  setFormData,
  fetchBoardings,
  filters,
  setFilters,
  setPage,
  pageSize,
  loadingBoardings,
  boardings,
  handleOpenBoardingDetails,
  page,
  totalPages,
}) => {
  return (
    <motion.div variants={itemVariants} className="flex-1 w-full bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-8 border border-white/20">
      <h3 className="text-2xl font-bold text-white mb-6">Find Your Boarding</h3>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Where do you want to stay?"
          value={formData.searchQuery || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, searchQuery: e.target.value }))}
          className="flex-1 px-5 py-4 bg-white/10 border border-white/20 rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent/50 text-white placeholder:text-white/50"
        />
        <button
          onClick={() => fetchBoardings()}
          className="px-8 py-4 bg-accent hover:bg-accent/80 text-white rounded-2xl font-bold transition-all shadow-lg transform hover:-translate-y-1"
        >
          Search Now
        </button>
      </div>

      <div className="flex flex-wrap gap-6 items-end border-t border-white/10 pt-8 text-white">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white/60">Price Range (LKR)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: Number(e.target.value) }))}
              className="w-28 px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
              className="w-28 px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white/60">Gender</label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters((prev) => ({ ...prev, gender: e.target.value }))}
            className="w-32 px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-sm appearance-none cursor-pointer [&>option]:text-black"
          >
            <option value="any">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-white/60">Room Type</label>
          <select
            value={filters.roomType}
            onChange={(e) => setFilters((prev) => ({ ...prev, roomType: e.target.value }))}
            className="w-32 px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-sm appearance-none cursor-pointer [&>option]:text-black"
          >
            <option value="any">Any</option>
            <option value="single">Single</option>
            <option value="shared">Shared</option>
            <option value="apartment">Apartment</option>
          </select>
        </div>

        <button
          onClick={() => {
            setPage(0);
            fetchBoardings(0, pageSize);
          }}
          className="ml-auto px-4 h-9 text-sm bg-primary text-white rounded-xl font-bold hover:bg-primary/80 transition-all flex items-center justify-center self-end"
        >
          Apply
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
        {loadingBoardings ? (
          <div className="col-span-full text-center py-20 text-white font-medium animate-pulse">Loading listings...</div>
        ) : (
          boardings.map((b) => (
            <div key={b.id} className="transform hover:scale-[1.02] transition-transform">
              <BoardingCard
                boarding={{
                  ...b,
                  name: b.name || b.title || 'Boarding',
                  price: b.price || b.monthlyRent || b.pricePerMonth || 0,
                  image: b.image || (b.images && b.images[0]) || (b.imageUrls && b.imageUrls[0]) || '',
                  location: b.location || b.address || '',
                  amenities: b.amenities || b.features || [],
                  badge: b.badge || (b.isBoosted ? 'Featured' : null),
                }}
                onViewDetails={handleOpenBoardingDetails}
                compact
              />
            </div>
          ))
        )}
      </div>

      <div className="flex items-center justify-between mt-12 pt-8 border-t border-white/10">
        <div className="flex gap-4">
          <button
            onClick={() => {
              if (page > 0) {
                setPage((p) => p - 1);
                fetchBoardings(page - 1, pageSize);
              }
            }}
            disabled={page <= 0}
            className="px-5 py-2 bg-white/10 text-white rounded-xl disabled:opacity-30 border border-white/10"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (page + 1 < totalPages) {
                setPage((p) => p + 1);
                fetchBoardings(page + 1, pageSize);
              }
            }}
            disabled={page + 1 >= (totalPages || 1)}
            className="px-5 py-2 bg-white/10 text-white rounded-xl disabled:opacity-30 border border-white/10"
          >
            Next
          </button>
        </div>
        <span className="text-white/60 text-sm font-bold uppercase tracking-widest">
          Page {page + 1} / {totalPages || 1}
        </span>
      </div>
    </motion.div>
  );
};

export default BoardingSearchPanel;
