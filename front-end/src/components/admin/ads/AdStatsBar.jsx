import React from 'react';

const AdStatsBar = ({ stats }) => {
  // We define defaults here so the map function never fails
  const statItems = [
    { label: 'Total Ads', value: stats?.total || 0, color: 'border-primary', icon: 'fa-ad', bg: 'bg-primary/10', text: 'text-primary' },
    { label: 'Pending', value: stats?.pending || 0, color: 'border-accent', icon: 'fa-clock', bg: 'bg-accent/10', text: 'text-accent' },
    { label: 'Approved', value: stats?.approved || 0, color: 'border-success', icon: 'fa-check-circle', bg: 'bg-success/10', text: 'text-success' },
    { label: 'Rejected', value: stats?.rejected || 0, color: 'border-red-alert', icon: 'fa-times-circle', bg: 'bg-red-alert/10', text: 'text-red-alert' },
  ];

  return (
    <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-3 lg:gap-4 mb-6 lg:mb-8">
      {statItems.map((item, idx) => (
        <div key={idx} className={`lg:flex-grow lg:min-w-[150px] bg-white p-3 lg:p-4 rounded-[20px] shadow-sm border-l-4 ${item.color} flex items-center gap-3 lg:gap-4`}>
          <div className={`p-2.5 rounded-xl ${item.bg} ${item.text}`}>
            <i className={`fas ${item.icon} text-sm lg:text-lg`}></i>
          </div>
          <div>
            <p className="text-[10px] lg:text-xs text-text-muted font-bold uppercase tracking-tight">{item.label}</p>
            <p className="text-sm lg:text-xl font-black text-text-dark">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdStatsBar;