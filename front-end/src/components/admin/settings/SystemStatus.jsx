import React from 'react';

const SystemStatus = ({ health }) => {
  const metrics = [
    { label: 'CPU Usage', value: health.cpu, color: 'bg-primary' },
    { label: 'RAM Allocation', value: health.ram, color: 'bg-accent' },
    { label: 'Storage Space', value: health.storage, color: 'bg-text-dark' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-background-light/30 p-5 rounded-[20px] border border-white">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-text-muted uppercase tracking-tighter">{metric.label}</span>
            <span className="text-xs font-bold text-success flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> Optimal
            </span>
          </div>
          <div className="text-3xl font-black text-text-dark mb-3">{metric.value}%</div>
          <div className="w-full bg-white h-2 rounded-full overflow-hidden">
            <div 
              className={`h-full ${metric.color} transition-all duration-1000`} 
              style={{ width: `${metric.value}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SystemStatus;