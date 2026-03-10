import React from 'react';

const RecentReports = ({ reports, onNavigate }) => {
  return (
    <div className="bg-card-bg rounded-large shadow-custom flex flex-col h-full">
      <div className="p-5 lg:p-8 pb-3 lg:pb-4 flex justify-between items-center">
        <h3 className="text-primary text-lg lg:text-xl font-bold">Recent Reports</h3>
        <button onClick={() => onNavigate('reports')} className="text-accent font-semibold hover:underline text-xs">View All</button>
      </div>
      <div className="p-5 lg:p-8 pt-0 flex flex-col gap-3">
        {reports.map((report) => (
          <div key={report.id} className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-background-light rounded-[15px] border border-transparent hover:border-accent/10 transition-all">
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-text-dark font-bold text-base">{report.title}</h4>
              <p className="text-text-muted text-xs">{report.desc}</p>
            </div>
            <button 
              className="w-full sm:w-auto border-2 border-accent text-accent px-4 py-1.5 rounded-[12px] text-xs font-bold"
              onClick={() => onNavigate('reports')}
            >
              Investigate
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentReports;