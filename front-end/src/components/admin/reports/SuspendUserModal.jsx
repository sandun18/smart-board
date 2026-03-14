import React, { useState } from 'react';

const SuspendUserModal = ({ user, onClose, onConfirm }) => {
  const [duration, setDuration] = useState('7_days');
  const durations = [
    { id: '24_hours', label: '24 Hours' },
    { id: '7_days', label: '7 Days' },
    { id: '30_days', label: '30 Days' },
    { id: 'permanent', label: 'Permanent' },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-text-dark/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-large shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-alert/5">
          <h3 className="text-lg font-bold text-red-alert flex items-center gap-2">
            <i className="fas fa-user-slash"></i> Suspend Account
          </h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-dark text-xl">&times;</button>
        </div>

        <div className="p-8 text-center">
          <img src={user.avatar} className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-red-alert p-1" alt="" />
          <p className="text-text-dark font-semibold mb-1">Suspend {user.name}?</p>
          <p className="text-sm text-text-muted mb-6">Select the duration for this suspension.</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {durations.map((d) => (
              <button
                key={d.id}
                onClick={() => setDuration(d.id)}
                className={`py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                  duration === d.id 
                  ? 'border-red-alert bg-red-alert text-white' 
                  : 'border-gray-100 text-text-muted hover:border-red-alert/30'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          
          <p className="text-[11px] text-red-alert font-medium italic">
            * This will disable the user's ability to login or post listings.
          </p>
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 font-bold text-text-muted hover:bg-gray-200 rounded-xl transition-all">
            Cancel
          </button>
          <button 
            onClick={() => onConfirm(user.id, duration)}
            className="flex-1 py-3 font-bold bg-red-alert text-white rounded-xl shadow-lg hover:bg-red-700 transition-all"
          >
            Confirm Suspension
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuspendUserModal;