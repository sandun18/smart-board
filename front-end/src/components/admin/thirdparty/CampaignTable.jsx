import React from 'react';

const CampaignTable = ({ campaigns, onToggleStatus, onEdit }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-left border-separate border-spacing-y-3">
      <thead>
        <tr className="text-[#665345] text-[11px] uppercase tracking-widest">
          <th className="pb-4 px-4 font-black">Ad Preview</th>
          <th className="pb-4 font-black">Campaign Details</th>
          <th className="pb-4 font-black text-center">Status</th>
          <th className="pb-4 font-black text-right pr-6">Actions</th>
        </tr>
      </thead>
      <tbody>
        {campaigns.map(c => (
          <tr key={c.id} className="bg-white hover:bg-gray-50/50 transition-colors group shadow-sm">
            <td className="py-4 px-4">
              <div className="w-16 h-10 rounded-lg overflow-hidden border border-gray-200">
                <img src={c.bannerImageUrl} className="w-full h-full object-cover" alt="ad" />
              </div>
            </td>
            <td className="py-4">
              <div className="flex flex-col">
                <span className="font-bold text-[#332720]">{c.title}</span>
                <span className="text-[10px] font-black text-[#D84C38]">Rs. {c.planPrice} • {c.planName}</span>
              </div>
            </td>
            <td className="py-4 text-center">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                c.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
              }`}>
                {c.status}
              </span>
            </td>
            <td className="py-4 text-right pr-4">
              <div className="flex justify-end gap-2">
                <button 
                  onClick={() => onToggleStatus(c.id)}
                  className="p-2 text-orange-500 hover:bg-orange-50 rounded-xl"
                >
                  <i className={`fas ${c.status === 'ACTIVE' ? 'fa-pause' : 'fa-play'}`}></i>
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CampaignTable;