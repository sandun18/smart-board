import React from 'react';

const ConfirmModal = ({ open, title, message, onCancel, onConfirm, confirmLabel = 'Confirm', loading = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-red-alert/10 text-red-alert flex items-center justify-center text-2xl">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-text-dark">{title}</h4>
            <p className="text-sm text-text-muted mt-2">{message}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-100 text-text-dark font-bold">Cancel</button>
          <button onClick={onConfirm} disabled={loading} className="px-4 py-2 rounded-lg bg-red-alert text-white font-bold">
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
