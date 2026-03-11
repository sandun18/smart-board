import React from 'react';

const ReportFilters = ({ currentTab, setTab, category, setCategory }) => {
  // MUST MATCH JAVA ENUM: PENDING, RESOLVED, DISMISSED
  const tabs = ['PENDING', 'RESOLVED', 'DISMISSED'];
  
  const categories = [
    { id: 'all', label: 'All Reports', icon: 'fa-list' },
    { id: 'students', label: 'Students', icon: 'fa-graduation-cap' },
    { id: 'owners', label: 'Owners', icon: 'fa-user-tie' }
  ];

  return (
    <div className="bg-white rounded-[20px] shadow-sm p-4 mb-6 border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex gap-6 border-b border-gray-100 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setTab(tab)}
              className={`pb-4 px-1 font-bold transition-all relative text-sm ${
                currentTab === tab ? 'text-[#FF7A00]' : 'text-gray-400'
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
              {currentTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-[#FF7A00] rounded-t-full" />
              )}
            </button>
          ))}
        </div>
        {/* ... category mapping remains same as your original ... */}
      </div>
    </div>
  );
};

export default ReportFilters;