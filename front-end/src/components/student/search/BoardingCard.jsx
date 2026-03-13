import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt,
  FaEye, 
  FaStar,
  FaStarHalfAlt,
  FaRegStar
} from 'react-icons/fa';

const BoardingCard = ({ boarding, onBook, onViewDetails, viewMode, compact = false }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(boarding);
      return;
    }
    // Navigate to details page with boarding ID and pass boarding data
    navigate(`/student/boarding-details/${boarding.id}`, { 
      state: { boarding } 
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        // Full Star
        stars.push(<FaStar key={i} className="text-yellow-500" />);
      } else if (i === Math.ceil(rating) && !Number.isInteger(rating)) {
        // Half Star
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-500" />);
      } else {
        // Empty Star
        stars.push(<FaRegStar key={i} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const isListView = viewMode === 'list';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      // Added h-full and flex flex-col to make cards uniform height
      className={`bg-white rounded-large overflow-hidden shadow-custom transition-shadow duration-300 hover:shadow-xl cursor-pointer h-full flex ${isListView ? 'flex-row' : 'flex-col'}`}
    >
      {/* Card Image */}
      <div className={`relative overflow-hidden flex-shrink-0 ${isListView ? 'w-48 h-auto' : compact ? 'h-40' : 'h-48'}`}>
        <img 
          src={boarding.image} 
          alt={boarding.name}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => e.target.src = "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80"}
        />
        <div className="absolute top-4 right-4 bg-accent text-white px-3 py-1.5 rounded-full text-xs font-semibold">
          {boarding.badge}
        </div>
      </div>

      {/* Card Content - Added flex-1 and flex-col to stretch content */}
      <div className={`${compact ? 'p-4' : 'p-5'} flex-1 flex flex-col`}>
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className={`${compact ? 'text-base' : 'text-lg'} font-bold text-text-dark mb-1`}>{boarding.name}</h3>
            
            <div className="flex items-center gap-1.5 text-sm mb-1">
              <div className="flex">
                {renderStars(boarding.rating || 0)}
              </div>
              <span className="text-text-muted font-medium ml-1">
                {boarding.rating} ({boarding.reviewCount || 0} reviews)
              </span>
            </div>
            
          </div>
          <div className="text-right">
            <div className={`${compact ? 'text-xl' : 'text-2xl'} font-bold text-accent`}>LKR {boarding.price}</div>
            <span className="text-xs text-text-muted">/month</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-text-muted text-sm mb-4">
          <FaMapMarkerAlt className="text-accent" />
          {boarding.location}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {boarding.amenities.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className={`${compact ? 'px-2.5 py-0.5' : 'px-3 py-1'} bg-background-light text-text-dark rounded-full text-xs font-medium`}>
              {amenity}
            </span>
          ))}
           {boarding.amenities.length > 3 && (
             <span className="text-text-muted text-xs self-center">+{boarding.amenities.length - 3} more</span>
           )}
        </div>

        {/* Push buttons to the bottom using mt-auto */}
        <div className="flex gap-3 mt-auto">
          {/* <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); onBook(boarding.id); }}
            className="flex-1 bg-accent text-white py-2.5 rounded-large font-semibold transition-all hover:bg-primary flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <FaCalendarCheck />
            Book Visit
          </motion.button> */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
            className={`flex-1 border-2 border-accent text-accent ${compact ? 'py-2' : 'py-2.5'} rounded-large font-semibold transition-all hover:bg-accent hover:text-white flex items-center justify-center gap-2 text-sm ${compact ? '' : 'sm:text-base'}`}
          >
            <FaEye />
            Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default BoardingCard;