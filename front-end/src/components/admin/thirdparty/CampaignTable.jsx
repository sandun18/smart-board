import React from 'react';

const CampaignTable = ({ campaigns, onToggleStatus, onReplay, onEdit, onDelete }) => {
  // Helper function to check if ad is expired
  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  // Helper function to get days remaining
  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-[#665345] text-[11px] uppercase tracking-widest">
            <th className="pb-4 px-4 font-black">Ad Preview</th>
            <th className="pb-4 font-black">Campaign Details</th>
            <th className="pb-4 font-black text-center">Status</th>
            <th className="pb-4 font-black text-center">Expiry</th>
            <th className="pb-4 font-black text-right pr-6">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map(c => {
            const expired = c.status === 'EXPIRED' || isExpired(c.expiryDate);
            const daysRemaining = getDaysRemaining(c.expiryDate);
            
            return (
              <tr key={c.id} className={`${expired ? 'bg-gray-50/50' : 'bg-white hover:bg-gray-50/50'} transition-colors group shadow-sm`}>
                <td className="py-4 px-4">
                  <div className={`w-16 h-10 rounded-lg overflow-hidden border border-gray-200 ${expired ? 'opacity-50' : ''}`}>
                    <img src={c.bannerImageUrl} className="w-full h-full object-cover" alt="ad" />
                  </div>
                </td>
                <td className="py-4">
                  <div className="flex flex-col">
                    <span className={`font-bold ${expired ? 'text-gray-400 line-through' : 'text-[#332720]'}`}>{c.title}</span>
                    <span className="text-[10px] font-black text-[#D84C38]">Rs. {c.planPrice} • {c.planName}</span>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                    expired ? 'bg-red-100 text-red-600' :
                    c.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                  }`}>
                    {expired ? 'EXPIRED' : c.status}
                  </span>
                </td>
                <td className="py-4 text-center">
                  {c.expiryDate ? (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-600">
                        {new Date(c.expiryDate).toLocaleDateString()}
                      </span>
                      <span className={`text-[9px] font-bold ${
                        expired ? 'text-red-600' : 
                        daysRemaining <= 3 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {expired ? 'Expired' : `${daysRemaining} days left`}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-gray-400">No expiry</span>
                  )}
                </td>
                <td className="py-4 text-right pr-4">
                  <div className="flex justify-end gap-2">
                    {/* Toggle active/paused when not expired */}
                    {!expired && (
                      <button 
                        onClick={() => onToggleStatus(c.id)}
                        className={`p-2 rounded-xl transition-colors ${
                          c.status === 'ACTIVE' 
                            ? 'text-orange-500 hover:bg-orange-50' 
                            : 'text-green-500 hover:bg-green-50'
                        }`}
                        title={c.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      >
                        <i className={`fas ${c.status === 'ACTIVE' ? 'fa-pause' : 'fa-play'}`}></i>
                      </button>
                    )}

                    {/* Replay expired campaigns */}
                    {expired && onReplay && (
                      <button
                        onClick={() => onReplay(c.id)}
                        className="p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Replay Campaign"
                      >
                        <i className="fas fa-rotate-right"></i>
                      </button>
                    )}

                    {/* Allow delete for paused or expired campaigns */}
                    {(c.status === 'PAUSED' || expired) && onDelete && (
                      <button
                        onClick={() => onDelete(c.id)}
                        className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Campaign"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignTable;
