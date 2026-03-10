import React, { useState } from 'react';
import { motion } from 'framer-motion';

const BankSlipPaymentPanel = ({ amount, onSubmit, isProcessing }) => {
  const [file, setFile] = useState(null);

  const handleSubmit = () => {
    if (!file) {
      alert('Please select a bank slip file');
      return;
    }
    onSubmit({ amount, file });
  };

  return (
    <div className="border-t pt-6 space-y-4">
      <p className="text-sm text-text-muted">
        Upload your bank payment receipt (image or PDF).  
        The owner will verify this payment.
      </p>

      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="w-full px-4 py-3 border-2 rounded-xl"
      />

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={isProcessing}
        onClick={handleSubmit}
        className="w-full py-3 rounded-xl bg-accent text-white font-bold"
      >
        Submit Bank Slip
      </motion.button>
    </div>
  );
};

export default BankSlipPaymentPanel;
