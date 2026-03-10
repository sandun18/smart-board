import React from 'react';

const ReportTable = ({ reports, onView }) => {
  const getPriorityStyle = (p) => {
    switch (p.toLowerCase()) {
      case 'high': return 'bg-red-alert/10 text-red-alert';
      case 'medium': return 'bg-yellow-500/10 text-yellow-600';
      default: return 'bg-info/10 text-info';
    }
  };

  return (
    <div className="w-full">
      {/* MOBILE: Card View (Hidden on Desktop) */}
      <div className="flex flex-col gap-4 lg:hidden">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src={report.reporter.avatar} className="w-10 h-10 rounded-full border border-gray-100 shadow-sm" alt="" />
                <div>
                  <div className="font-bold text-text-dark text-sm">{report.reporter.name}</div>
                  <div className="text-[9px] uppercase text-accent font-bold tracking-tight">{report.reporter.role}</div>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase ${getPriorityStyle(report.priority)}`}>
                {report.priority}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="text-sm font-bold text-text-dark mb-1">{report.title}</div>
              <div className="text-xs text-text-muted">{report.type} • {report.date}</div>
            </div>

            <button 
              onClick={() => onView(report)}
              className="w-full bg-primary text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* DESKTOP: Standard Table (Hidden on Mobile) */}
      <div className="hidden lg:block overflow-hidden bg-card-bg rounded-large shadow-custom">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-5 font-bold text-text-muted text-sm uppercase tracking-wider">Reporter</th>
              <th className="p-5 font-bold text-text-muted text-sm uppercase tracking-wider">Issue</th>
              <th className="p-5 font-bold text-text-muted text-sm uppercase tracking-wider">Priority</th>
              <th className="p-5 font-bold text-text-muted text-sm uppercase tracking-wider">Date</th>
              <th className="p-5 font-bold text-text-muted text-sm text-right uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id} className="border-b border-gray-50 hover:bg-background-light/30 transition-colors">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <img src={report.reporter.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                    <div>
                      <div className="font-bold text-text-dark text-sm">{report.reporter.name}</div>
                      <div className="text-[10px] uppercase text-accent font-bold tracking-tight">{report.reporter.role}</div>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <div className="text-sm font-bold text-text-dark truncate max-w-[250px]">{report.title}</div>
                  <div className="text-xs text-text-muted">{report.type}</div>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getPriorityStyle(report.priority)}`}>
                    {report.priority}
                  </span>
                </td>
                <td className="p-5 text-sm text-text-muted font-medium">{report.date}</td>
                <td className="p-5 text-right">
                  <button 
                    onClick={() => onView(report)}
                    className="bg-primary text-white hover:bg-primary/90 px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm whitespace-nowrap"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportTable;