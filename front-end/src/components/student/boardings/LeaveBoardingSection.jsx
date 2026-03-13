import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaExclamationTriangle, FaSpinner, FaCheckCircle } from 'react-icons/fa';
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
        alert("Leave request sent successfully! Waiting for owner approval.");
        window.location.reload(); 
    } catch (error) {
        console.error("Leave request failed", error);
        alert(error.response?.data?.message || "Failed to send leave request.");
    } finally {
        setIsLoading(false);
        setShowModal(false);
    }
  };

  // If already requested, show status
  if (boarding.status === 'LEAVE_REQUESTED') {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 mt-6 shadow-sm">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full text-yellow-600"><FaCheckCircle size={20} /></div>
                <div>
                    <h4 className="text-lg font-bold text-gray-800">Leave Request Pending</h4>
                    <p className="text-sm text-gray-600">You have requested to leave. Please wait for the owner to approve your request.</p>
                </div>
            </div>
        </motion.div>
    );
  }

  // Only show if APPROVED (Active)
  if (boarding.status !== 'APPROVED') return null;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border border-gray-100 rounded-2xl p-6 mt-6 shadow-sm flex items-center justify-between">
        <div>
            <h4 className="text-lg font-bold text-red-600 flex items-center gap-2"><FaExclamationTriangle /> Danger Zone</h4>
            <p className="text-sm text-gray-500 mt-1">If you wish to leave this boarding place, you must request approval from the owner.</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors flex items-center gap-2"
        >
            <FaSignOutAlt /> Request to Leave
        </button>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
              <div className="bg-red-50 p-6 flex flex-col items-center text-center border-b border-red-100">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-3"><FaSignOutAlt size={24} /></div>
                <h3 className="text-xl font-bold text-gray-800">Request to Leave?</h3>
                <p className="text-sm text-gray-500 mt-2">Are you sure you want to request to leave <strong>{boarding.name}</strong>?<br />The owner will be notified to approve this.</p>
              </div>
              <div className="p-6 bg-white flex gap-3 justify-end">
                <button onClick={() => setShowModal(false)} disabled={isLoading} className="flex-1 px-4 py-2 rounded-lg font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                <button onClick={handleRequestLeave} disabled={isLoading} className="flex-1 px-4 py-2 rounded-lg font-bold text-sm text-white bg-red-500 hover:bg-red-600 shadow-md flex items-center justify-center gap-2">
                  {isLoading ? <><FaSpinner className="animate-spin" /> Sending...</> : "Confirm Request"}
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