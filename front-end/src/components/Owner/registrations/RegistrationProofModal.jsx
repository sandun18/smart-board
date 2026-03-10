import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes, FaReceipt, FaInfoCircle } from "react-icons/fa";

const RegistrationProofModal = ({
  isOpen,
  onClose,
  registration,
  onDecide,
}) => {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !registration) return null;

  const handleSubmit = async (status) => {
    setIsSubmitting(true);
    // Call the hook function passed via props
    const success = await onDecide(registration.id, status, note);
    setIsSubmitting(false);
    if (success) {
      setNote(""); // Reset note
      onClose(); // Close modal
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md overflow-hidden bg-white shadow-2xl rounded-3xl"
        >
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-5 bg-primary">
            <div className="bg-white/20 p-2.5 rounded-xl text-white shadow-inner">
              <FaReceipt size={24} />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-black leading-none text-white">
                Payment Review
              </h3>
              <p className="text-xs font-medium text-white/80">
                Verify transaction details below
              </p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Student Note (if any) */}
            {registration.studentNote && (
              <div className="flex items-start gap-3 p-3 border border-blue-100 bg-blue-50 rounded-xl">
                <FaInfoCircle className="text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] uppercase font-bold text-blue-400 mb-0.5">
                    Student Note
                  </p>
                  <p className="text-xs font-medium text-blue-900">
                    {registration.studentNote}
                  </p>
                </div>
              </div>
            )}

            {/* Proof Section */}
            <div className="space-y-2">
              <label className="ml-1 text-xs font-black tracking-wider uppercase text-muted">
                Transaction Reference
              </label>
              <div className="p-4 font-mono text-sm font-bold text-center break-all border-2 border-gray-200 border-dashed text-primary bg-gray-50 rounded-xl">
                {registration.paymentTransactionRef || "No reference provided"}
              </div>
            </div>

            {/* Owner Note Input */}
            <div className="space-y-2">
              <label className="ml-1 text-xs font-black tracking-wider uppercase text-muted">
                Your Response Note
              </label>
              <textarea
                className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white placeholder:text-muted/50 font-medium text-text min-h-[80px]"
                placeholder="E.g., Payment received, welcome! OR Invalid transaction ID."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                disabled={isSubmitting}
                onClick={() => handleSubmit("REJECTED")}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-error/10 bg-error/5 text-error font-bold text-sm hover:bg-error hover:text-white hover:border-error transition-all disabled:opacity-50"
              >
                <FaTimes /> Reject
              </button>
              <button
                disabled={isSubmitting}
                onClick={() => handleSubmit("ACCEPTED")}
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-success text-white font-bold text-sm shadow-lg shadow-success/30 hover:bg-success-dark hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                ) : (
                  <>
                    <FaCheck /> Accept & Verify
                  </>
                )}
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2 mt-2 text-xs font-bold text-center text-muted hover:text-text"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default RegistrationProofModal;
