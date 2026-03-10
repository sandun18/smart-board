import React from 'react';

const PendingApprovals = ({ approvals, onApprove, onReject, onNavigate }) => {
  return (
    <div className="bg-card-bg rounded-[25px] shadow-custom flex flex-col">
      <div className="p-5 lg:p-6 pb-3 lg:pb-4 flex justify-between items-center">
        <h3 className="text-primary text-lg lg:text-xl font-bold">Pending Approvals</h3>
        <button onClick={() => onNavigate('ads')} className="text-accent font-semibold hover:underline text-xs">View All</button>
      </div>
      <div className="p-5 lg:p-6 pt-0 flex flex-col gap-3 lg:gap-4">
        {approvals.map((ad) => (
          <div key={ad.id} className="flex flex-col sm:flex-row justify-between items-center p-3 lg:p-4 bg-background-light rounded-[15px] shadow-sm gap-3">
            <div className="text-center sm:text-left">
              <h4 className="text-text-dark font-bold text-sm lg:text-base">{ad.title}</h4>
              <p className="text-text-muted text-[11px] lg:text-sm">By: {ad.submittedBy}</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={() => onApprove(ad.id)} className="flex-1 sm:flex-none bg-success text-white px-3 py-1.5 rounded-[12px] text-xs font-bold shadow-sm">Approve</button>
              <button onClick={() => onReject(ad.id)} className="flex-1 sm:flex-none bg-red-alert text-white px-3 py-1.5 rounded-[12px] text-xs font-bold shadow-sm">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingApprovals;