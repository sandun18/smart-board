import React from 'react';

const UserModal = ({ user, onClose, onDelete, onVerify }) => {
  if (!user) return null;

  // Check if the user is an owner awaiting verification
  const isPendingOwner = user.role === 'OWNER' && user.verifiedOwner === false;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-text-dark/40 backdrop-blur-sm transition-opacity">
      {/* Modal Container */}
      <div className="bg-card-bg w-full max-w-lg rounded-[25px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Modal Header */}
        <div className="p-5 lg:p-6 border-b border-gray-100 flex justify-between items-center bg-background-light/30">
          <h3 className="text-lg lg:text-xl font-bold text-primary">User Details</h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors text-text-muted"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 lg:p-8">
          <div className="flex flex-col items-center mb-6 lg:mb-8">
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-24 h-24 lg:w-32 lg:h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
              <span className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-white ${
                user.status === 'active' ? 'bg-success' : 'bg-red-alert'
              }`}></span>
            </div>
            <h2 className="mt-4 text-xl lg:text-2xl font-bold text-text-dark">{user.name}</h2>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mt-2">
              {user.role}
            </span>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-4 p-3 lg:p-4 border border-gray-100 rounded-[15px] bg-gray-50/30">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <p className="text-text-muted text-[10px] lg:text-xs uppercase font-bold tracking-wider">Email Address</p>
                  <p className="text-xs lg:text-sm text-text-dark font-bold">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 lg:p-4 border border-gray-100 rounded-[15px] bg-gray-50/30">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <p className="text-text-muted text-[10px] lg:text-xs uppercase font-bold tracking-wider">Phone Number</p>
                  <p className="text-xs lg:text-sm text-text-dark font-bold">{user.phone || 'Not provided'}</p>
                </div>
              </div>

              {/* Show Student ID for Students */}
              {user.role === 'STUDENT' && user.studentIdNumber && (
                <div className="flex items-center gap-4 p-3 lg:p-4 border border-gray-100 rounded-[15px] bg-gray-50/30">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500">
                    <i className="fas fa-id-card"></i>
                  </div>
                  <div>
                    <p className="text-text-muted text-[10px] lg:text-xs uppercase font-bold tracking-wider">Student ID</p>
                    <p className="text-xs lg:text-sm text-text-dark font-bold">{user.studentIdNumber}</p>
                  </div>
                </div>
              )}

              {/* Show Address */}
              {user.address && (
                <div className="flex items-center gap-4 p-3 lg:p-4 border border-gray-100 rounded-[15px] bg-gray-50/30">
                  <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <p className="text-text-muted text-[10px] lg:text-xs uppercase font-bold tracking-wider">Address</p>
                    <p className="text-xs lg:text-sm text-text-dark font-bold">{user.address}</p>
                  </div>
                </div>
              )}

              {/* Show Number of Boardings for Owners */}
              {user.role === 'OWNER' && user.boardingCount !== undefined && (
                <div className="flex items-center gap-4 p-3 lg:p-4 border border-gray-100 rounded-[15px] bg-gray-50/30">
                  <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-500">
                    <i className="fas fa-building"></i>
                  </div>
                  <div>
                    <p className="text-text-muted text-[10px] lg:text-xs uppercase font-bold tracking-wider">Active Boardings</p>
                    <p className="text-xs lg:text-sm text-text-dark font-bold">{user.boardingCount}</p>
                  </div>
                </div>
              )}

              {/* Show University for Students */}
              {user.role === 'STUDENT' && user.studentUniversity && (
                <div className="flex items-center gap-4 p-3 lg:p-4 border border-gray-100 rounded-[15px] bg-gray-50/30">
                  <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                    <i className="fas fa-university"></i>
                  </div>
                  <div>
                    <p className="text-text-muted text-[10px] lg:text-xs uppercase font-bold tracking-wider">University</p>
                    <p className="text-xs lg:text-sm text-text-dark font-bold">{user.studentUniversity}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 lg:p-6 bg-gray-50 border-t border-gray-100">
          {isPendingOwner ? (
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold text-warning uppercase text-center mb-1">
                <i className="fas fa-exclamation-triangle mr-1"></i> Owner Awaiting Verification
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => onVerify(user.id, true)}
                  className="flex-1 bg-success text-white px-4 py-2.5 lg:py-3 rounded-[12px] font-bold hover:bg-success/90 transition-all text-sm shadow-sm"
                >
                  Approve Owner
                </button>
                <button 
                  onClick={() => onVerify(user.id, false)}
                  className="flex-1 bg-red-alert/10 text-red-alert px-4 py-2.5 lg:py-3 rounded-[12px] font-bold hover:bg-red-alert/20 transition-all text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 px-4 py-2.5 lg:py-3 rounded-[12px] font-bold text-text-muted hover:bg-gray-200 transition-all text-sm border border-gray-200"
              >
                Close
              </button>
              <button 
                onClick={() => {
                  onDelete(user.id);
                  onClose();
                }}
                className="flex-1 px-4 py-2.5 lg:py-3 rounded-[12px] font-bold bg-red-alert/10 text-red-alert hover:bg-red-alert hover:text-white transition-all text-sm"
              >
                Delete User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;