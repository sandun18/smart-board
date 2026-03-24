import React from 'react';

const ReportStats = ({ stats }) => {
  const statItems = [
    { label: 'Pending Reports', value: stats.pending, color: 'border-accent', icon: 'fa-clock', bg: 'bg-accent/10', text: 'text-accent' },
    { label: 'Urgent Issues', value: stats.urgent, color: 'border-red-alert', icon: 'fa-bolt', bg: 'bg-red-alert/10', text: 'text-red-alert' },
    { label: 'Resolved', value: stats.resolved, color: 'border-success', icon: 'fa-check-circle', bg: 'bg-success/10', text: 'text-success' },
    { label: 'Total Logs', value: stats.total, color: 'border-primary', icon: 'fa-flag', bg: 'bg-primary/10', text: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statItems.map((item, idx) => (
        <div key={idx} className={`bg-white p-5 rounded-large shadow-sm border-l-4 ${item.color} flex items-center gap-4 hover:shadow-md transition-shadow`}>
          <div className={`w-12 h-12 rounded-full ${item.bg} ${item.text} flex items-center justify-center text-xl`}>
            <i className={`fas ${item.icon}`}></i>
          </div>
          <div>
            <span className="block text-[10px] font-bold text-text-muted uppercase tracking-widest leading-none mb-1">
              {item.label}
            </span>
            <span className="text-2xl font-bold text-text-dark leading-none">
              {item.value}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReportStats;