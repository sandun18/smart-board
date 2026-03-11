import React from 'react';

const AdCard = ({ ad, onReview }) => {
  // Safe image selection: use first image from backend or a placeholder
  const displayImage = ad.images && ad.images.length > 0 
    ? ad.images[0] 
    : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800';

  return (
    <div className="bg-background-light/30 rounded-[20px] overflow-hidden border border-gray-100 hover:-translate-y-1 transition-all duration-300 shadow-sm">
      <div className="relative h-48">
        <img 
          src={displayImage} 
          alt={ad.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-primary font-bold text-sm">
          {/* Defaulting to LKR since price is handled in the frontend logic usually */}
          {ad.price ? `Rs. ${ad.price}` : 'Pending Price'}
        </div>
      </div>
      
      <div className="p-5">
        <h4 className="font-bold text-text-dark mb-1 truncate">{ad.title}</h4>
        <p className="text-xs text-text-muted flex items-center gap-1 mb-4">
          <i className="fas fa-map-marker-alt text-accent"></i> {ad.address}
        </p>
        
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full border border-accent bg-gray-200 flex items-center justify-center overflow-hidden">
               {/* Use owner name initial as fallback if no avatar provided by backend */}
               <span className="text-[10px] font-bold">{ad.ownerName?.charAt(0) || 'O'}</span>
            </div>
            <span className="text-xs font-medium text-text-dark">{ad.ownerName}</span>
          </div>
          <button 
            onClick={() => onReview(ad)}
            className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Review Ad
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdCard;