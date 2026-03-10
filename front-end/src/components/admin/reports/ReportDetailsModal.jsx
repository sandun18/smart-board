import React, { useState } from 'react';
import SuspendUserModal from './SuspendUserModal';

const ReportDetailsModal = ({ report, onClose, onDismiss, onResolve }) => {
  const [showSuspendFlow, setShowSuspendFlow] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [dismissReasonInput, setDismissReasonInput] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [solutionInput, setSolutionInput] = useState('');

  if (!report) return null;

  // Status mapping to match Backend Enums
  const isPending = report.status === 'PENDING';
  const isResolved = report.status === 'RESOLVED';
  const isDismissed = report.status === 'DISMISSED';
  const isCompleted = isResolved || isDismissed;

  const handleActionConfirm = () => {
    if (isResolving) {
      // Maps to ReportDecisionDTO.java
      onResolve(report.id, {
        details: solutionInput,
        action: "RESOLVED_BY_ADMIN",
        duration: "N/A"
      });
    } else if (isDismissing) {
      onDismiss(report.id, dismissReasonInput);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#332720]/40 backdrop-blur-sm">
        <div className="bg-white w-full max-w-4xl rounded-t-[25px] sm:rounded-[25px] shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[90vh]">
          
          {/* Header */}
          <div className="p-5 lg:p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-[10px] font-black bg-[#FF7A00]/10 text-[#FF7A00] px-2 py-0.5 rounded-md uppercase tracking-wider">
                  Case #{report.id}
                </span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  report.severity === 'HIGH' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                }`}>
                  {report.severity} Priority
                </span>
              </div>
              <h2 className="text-xl font-black text-[#332720]">{report.title}</h2>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 text-2xl transition-colors">&times;</button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Details */}
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <i className="fas fa-align-left text-[#FF7A00]"></i> Description
                  </h4>
                  <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100 italic">
                    "{report.description}"
                  </p>
                </section>

                <section>
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <i className="fas fa-images text-[#FF7A00]"></i> Evidence Attached
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {report.evidence && report.evidence.length > 0 ? (
                      report.evidence.map((img, idx) => (
                        <div key={idx} className="aspect-square rounded-xl bg-gray-100 overflow-hidden border border-gray-100 group cursor-zoom-in">
                          <img src={img} alt="Evidence" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">No visual evidence provided.</p>
                    )}
                  </div>
                </section>

                {/* Resolution History (If Resolved) */}
                {isResolved && (
                  <section className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl">
                    <h4 className="text-[11px] font-black text-emerald-700 uppercase tracking-widest mb-2">Resolution Details</h4>
                    <p className="text-sm text-emerald-800">{report.resolutionDetails}</p>
                    <div className="mt-2 text-[10px] font-bold text-emerald-600">Action: {report.actionTaken}</div>
                  </section>
                )}
              </div>

              {/* Right Column: Meta Info */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Entities Involved</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block mb-1">Reporter (Sender)</span>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#FF7A00] text-white flex items-center justify-center text-xs font-bold">
                          {report.senderName?.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-[#332720]">{report.senderName}</span>
                      </div>
                    </div>

                    {report.reportedUserName && (
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 block mb-1">Reported Party</span>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
                            {report.reportedUserName.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-[#332720]">{report.reportedUserName}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                  <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4">Metadata</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Submitted</span>
                      <span className="text-xs font-bold text-[#332720]">{new Date(report.submissionDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Type</span>
                      <span className="text-xs font-bold text-[#332720]">{report.type}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="p-5 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
            {isResolving || isDismissing ? (
              <div className="w-full space-y-3">
                <textarea 
                  placeholder={isResolving ? "Enter resolution details..." : "Reason for dismissal..."}
                  className="w-full p-4 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#FF7A00] outline-none"
                  rows="3"
                  value={isResolving ? solutionInput : dismissReasonInput}
                  onChange={(e) => isResolving ? setSolutionInput(e.target.value) : setDismissReasonInput(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => {setIsResolving(false); setIsDismissing(false);}} className="px-6 py-2 text-sm font-bold text-gray-500">Cancel</button>
                  <button onClick={handleActionConfirm} className={`px-6 py-2 rounded-full text-sm font-bold text-white ${isResolving ? 'bg-emerald-500' : 'bg-red-500'}`}>
                    Confirm {isResolving ? 'Resolution' : 'Dismissal'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-2 w-full sm:w-auto order-2 sm:order-1">
                  <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-2.5 rounded-full font-bold text-gray-500 bg-white border border-gray-200 text-xs">Close</button>
                  {isPending && (
                    <button onClick={() => setIsDismissing(true)} className="flex-1 sm:flex-none px-6 py-2.5 rounded-full font-bold text-gray-500 bg-white border border-gray-200 text-xs hover:bg-gray-100">Dismiss Case</button>
                  )}
                </div>
                <div className="w-full sm:w-auto ml-auto order-1 sm:order-2 flex gap-2">
                  {isPending && (
                    <>
                      <button onClick={() => setShowSuspendFlow(true)} className="flex-1 sm:px-8 py-2.5 rounded-full font-bold bg-red-500 text-white text-xs shadow-md">Suspend User</button>
                      <button onClick={() => setIsResolving(true)} className="flex-1 sm:px-8 py-2.5 rounded-full font-bold bg-emerald-500 text-white text-xs shadow-md">Resolve Case</button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showSuspendFlow && (
        <SuspendUserModal 
          user={{ id: report.reportedUserId, name: report.reportedUserName, avatar: `https://ui-avatars.com/api/?name=${report.reportedUserName}` }}
          onClose={() => setShowSuspendFlow(false)}
          onConfirm={(userId, duration) => {
            onResolve(report.id, {
                details: "User suspended following policy violation.",
                action: "ACCOUNT_SUSPENSION",
                duration: duration
            });
            setShowSuspendFlow(false);
          }}
        />
      )}
    </>
  );
};

export default ReportDetailsModal;