import React from 'react';
import { motion } from 'framer-motion';

const CashPaymentPanel = ({ amount, onConfirm, isProcessing }) => {
  return (
    <div className="border-t pt-6">
      <p className="text-sm text-text-muted mb-4">
        You will pay cash directly to the owner. The owner must approve this payment.
      </p>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={isProcessing}
        onClick={() => onConfirm(amount)}
        className="w-full py-3 rounded-xl bg-accent text-white font-bold"
      >
        Mark as Paid (Cash)
      </motion.button>
    </div>
  );
};

export default CashPaymentPanel;
