import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSignOutAlt, FaExclamationTriangle, FaSpinner, 
  FaCheckCircle, FaClock 
} from 'react-icons/fa';
import StudentService from '../../../api/student/StudentService';
import { useAuth } from '../../../context/student/StudentAuthContext';

const LeaveBoardingSection = ({ boarding }) => {
  const { currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestLeave = async () => {
    setIsLoading(true);
    try {
        await StudentService.requestLeave(currentUser.id, boarding.registrationId);
        // ✅ No reload needed — just close modal, parent will re-render with LEAVE_REQUESTED status
        setShowModal(false);
        // Trigger a soft page reload to re-fetch updated status
        window.location.reload();
    } catch (error) {
        console.error("Leave request failed", error);
        alert(error.response?.data?.message || "Failed to send leave request.");
    } finally {
        setIsLoading(false);
    }
  };

  // ✅ CASE 1: Leave already requested — show pending banner
  if (boarding.status === 'LEAVE_REQUESTED') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 shadow-sm"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-yellow-100 rounded-full text-yellow-600 mt-0.5 shrink-0">
            <FaClock size={20} />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              Leave Request Pending
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              Your request to leave <strong>{boarding.name}</strong> has been submitted. 
              The owner needs to review your payment history and approve your departure.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-yellow-700 bg-yellow-100 px-3 py-2 rounded-lg w-fit">
              <FaClock size={10} /> Waiting for owner approval
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ✅ CASE 2: Only show the leave button if APPROVED
  if (boarding.status !== 'APPROVED') return null;

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h4 className="text-lg font-bold text-red-600 flex items-center gap-2">
            <FaExclamationTriangle /> Danger Zone
          </h4>
          <p className="text-sm text-gray-500 mt-1">
            If you wish to leave this boarding, you must request approval from the owner first. 
            They will verify your payments before confirming.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="shrink-0 px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center gap-2"
        >
          <FaSignOutAlt /> Request to Leave
        </button>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Modal Header */}
              <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-3">
                  <FaSignOutAlt size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Request to Leave?</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Are you sure you want to request to leave <strong>{boarding.name}</strong>?
                </p>
              </div>

              {/* What happens next */}
              <div className="px-6 pt-4 pb-2 bg-white">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">What happens next</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xs font-bold shrink-0">1</span>
                    Your request is sent to the owner
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xs font-bold shrink-0">2</span>
                    Owner checks your payment history
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">3</span>
                    Owner approves → you are removed from the boarding
                  </li>
                </ul>
              </div>

              {/* Actions */}
              <div className="p-6 bg-white flex gap-3">
                <button 
                  onClick={() => setShowModal(false)} 
                  disabled={isLoading} 
                  className="flex-1 px-4 py-2 rounded-lg font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRequestLeave} 
                  disabled={isLoading} 
                  className="flex-1 px-4 py-2 rounded-lg font-bold text-sm text-white bg-red-500 hover:bg-red-600 shadow-md flex items-center justify-center gap-2 transition-colors"
                >
                  {isLoading 
                    ? <><FaSpinner className="animate-spin" /> Sending...</> 
                    : <><FaSignOutAlt /> Confirm Request</>
                  }
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LeaveBoardingSection;