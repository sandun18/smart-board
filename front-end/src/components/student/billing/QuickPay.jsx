import React, { useState, useEffect } from 'react';
import { FaMoneyBillWave } from 'react-icons/fa';

import CashPaymentPanel from './payments/CashPaymentPanel';
import BankSlipPaymentPanel from './payments/BankSlipPaymentPanel';
import CardPaymentPanel from './payments/CardPaymentPanel';

const QuickPay = ({
  defaultAmount,
  paymentMethods,
  activeMethodId,
  onMethodChange,
  onPay,
  isProcessing,
}) => {
  const [amount, setAmount] = useState(defaultAmount || 0);

  useEffect(() => {
    setAmount(defaultAmount || 0);
  }, [defaultAmount]);

  return (
    <section className="bg-card-bg rounded-2xl shadow-custom p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
          <FaMoneyBillWave />
        </div>
        <h2 className="text-xl font-bold text-primary">Quick Pay</h2>
      </div>

      {/* Amount */}
      <div className="mb-6">
        <label className="block font-bold text-xs uppercase mb-2">Amount</label>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full px-4 py-3 border-2 rounded-xl font-bold"
        />
      </div>

      {/* Payment Method */}
      <div className="mb-6">
        <label className="block font-bold text-xs uppercase mb-2">Pay With</label>
        <select
          value={activeMethodId}
          onChange={(e) => onMethodChange(e.target.value)}
          className="w-full px-4 py-3 border-2 rounded-xl font-semibold"
        >
          {paymentMethods.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* METHOD-SPECIFIC UI */}
      {activeMethodId === 'CASH' && (
        <CashPaymentPanel
          amount={amount}
          onConfirm={() => onPay({ amount })}
          isProcessing={isProcessing}
        />
      )}

      {activeMethodId === 'BANK_SLIP' && (
        <BankSlipPaymentPanel
          amount={amount}
          onSubmit={(file) => onPay({ amount, file })}
          isProcessing={isProcessing}
        />
      )}

      {activeMethodId === 'CARD' && (
        <CardPaymentPanel
          amount={amount}
          onSubmit={() => onPay({ amount })}
          isProcessing={isProcessing}
        />
      )}
    </section>
  );
};

export default QuickPay;
