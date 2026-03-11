import React from 'react';

const SubmissionCard = ({ ad, onApprove, onReject, onViewDetails, onPublish }) => {
  const isPending = ad.status === 'PENDING';
  const isApproved = ad.status === 'APPROVED';

  return (
    <div className="bg-white border border-[#e0d6c5] rounded-[25px] overflow-hidden hover:shadow-xl transition-all group">
      <div className="h-44 relative overflow-hidden">
        <img 
          src={ad.bannerImageUrl || 'https://via.placeholder.com/300x150?text=No+Image'} 
          alt={ad.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
        />
        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
            <span className="text-[9px] font-black text-white uppercase tracking-widest">{ad.status}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-[#332720] leading-tight mb-1">{ad.title}</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase">{ad.companyName}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase block">Plan</span>
            <span className="text-sm font-black text-[#D84C38]">Rs. {ad.planPrice}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {isPending ? (
            <>
              <button onClick={() => onApprove(ad.id)} className="flex-1 bg-green-500 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-green-600 transition-all">Approve</button>
              <button onClick={() => onReject(ad.id)} className="flex-1 bg-red-50 text-red-500 py-2.5 rounded-xl text-xs font-bold hover:bg-red-100 transition-all">Reject</button>
            </>
          ) : isApproved ? (
            <button onClick={() => onPublish(ad)} className="w-full bg-[#332720] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-black transition-all">
              Go to Publish Workflow
            </button>
          ) : (
             <div className="w-full py-2.5 bg-gray-50 text-gray-400 rounded-xl text-xs font-bold text-center uppercase">
                {ad.status}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionCard;