import React from 'react';

const SubmissionCard = ({ ad, onApprove, onReject, onViewDetails, onPublish, onDelete }) => {
  const isPending = ad.status === 'PENDING';
  const isApproved = ad.status === 'APPROVED';

  const handleDelete = () => {
    if (!onDelete) return;
    onDelete(ad.id);
  };

  const handleDownload = () => {
    if (ad.bannerImageUrl) {
      const link = document.createElement('a');
      link.href = ad.bannerImageUrl;
      link.download = `ad-${ad.id}-${ad.title.replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-white border border-[#e0d6c5] rounded-[25px] overflow-hidden hover:shadow-xl transition-all group">
      {/* Image Section */}
      <div className="h-44 relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        <img 
          src={ad.bannerImageUrl || 'https://via.placeholder.com/300x150?text=No+Image'} 
          alt={ad.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        {/* Status Badge */}
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
          <span className="text-[9px] font-black text-white uppercase tracking-widest">{ad.status}</span>
        </div>
        
        {/* Download Overlay */}
        {ad.bannerImageUrl && (
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleDownload}
              className="bg-white text-[#332720] px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg hover:bg-[#D84C38] hover:text-white transition-all"
            >
              <i className="fas fa-download"></i> Download
            </button>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-[#332720] leading-tight mb-1 line-clamp-2">{ad.title}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase">{ad.companyName}</p>
          </div>
          <div className="text-right ml-3">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Plan</span>
            <span className="text-sm font-black text-[#D84C38]">Rs. {ad.planPrice || 0}</span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mb-4 pt-3 border-t border-gray-100 text-xs text-gray-500 space-y-1">
          <p><i className="fas fa-envelope w-3 mr-2 text-[#D84C38]"></i>{ad.email}</p>
          <p><i className="fas fa-phone w-3 mr-2 text-[#D84C38]"></i>{ad.phone}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {isPending ? (
            <>
              <div className="flex gap-2">
                <button 
                  onClick={() => onApprove(ad.id)} 
                  className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-green-600 transition-all"
                >
                  ✓ Approve
                </button>
                <button 
                  onClick={() => onReject(ad.id)} 
                  className="flex-1 bg-red-50 text-red-500 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
                >
                  ✕ Reject
                </button>
              </div>
              <button 
                onClick={() => onViewDetails(ad)} 
                className="w-full bg-blue-50 text-blue-600 py-2.5 rounded-xl text-xs font-bold hover:bg-blue-100 transition-all"
              >
                <i className="fas fa-eye mr-2"></i>View Full Details
              </button>
              <button
                onClick={handleDelete}
                className="w-full bg-red-50 text-red-600 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
              >
                🗑 Delete
              </button>
            </>
          ) : isApproved ? (
            <>
              <button 
                onClick={() => onPublish(ad)} 
                className="w-full bg-[#332720] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-all"
              >
                📢 Publish Campaign
              </button>
              <button 
                onClick={() => onViewDetails(ad)} 
                className="w-full bg-gray-50 text-gray-600 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all"
              >
                <i className="fas fa-eye mr-2"></i>View Details
              </button>
              <button
                onClick={handleDelete}
                className="w-full bg-red-50 text-red-600 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-all mt-2"
              >
                🗑 Delete
              </button>
            </>
          ) : (
            <>
              <div className="w-full py-2.5 bg-gray-50 text-gray-400 rounded-xl text-xs font-bold text-center uppercase">
                {ad.status}
              </div>
              <button 
                onClick={() => onViewDetails(ad)} 
                className="w-full bg-gray-50 text-gray-600 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-100 transition-all"
              >
                <i className="fas fa-eye mr-2"></i>View Details
              </button>
              <button
                onClick={handleDelete}
                className="w-full bg-red-50 text-red-600 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-all mt-2"
              >
                🗑 Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;