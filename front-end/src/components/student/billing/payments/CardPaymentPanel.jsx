import React, { useState } from 'react';
import { motion } from 'framer-motion';

const CardPaymentPanel = ({ amount, onSubmit, isProcessing }) => {
  const [card, setCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const handleChange = (e) => {
    setCard({ ...card, [e.target.name]: e.target.value });
  };

  const handlePay = () => {
    if (!card.number || !card.expiry || !card.cvv || !card.name) {
      alert('Please fill all card details');
      return;
    }
    onSubmit({ amount, card });
  };

  return (
    <div className="border-t pt-6 space-y-4">
      <input name="number" placeholder="Card Number" onChange={handleChange} className="input" />
      <input name="expiry" placeholder="MM/YY" onChange={handleChange} className="input" />
      <input name="cvv" placeholder="CVV" onChange={handleChange} className="input" />
      <input name="name" placeholder="Cardholder Name" onChange={handleChange} className="input" />

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={isProcessing}
        onClick={handlePay}
        className="w-full py-3 rounded-xl bg-accent text-white font-bold"
      >
        Pay {amount} LKR
      </motion.button>
    </div>
  );
};

export default CardPaymentPanel;
