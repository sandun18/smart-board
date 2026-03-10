import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../../../api/api";
import StudentLayout from "../../../../../components/student/common/StudentLayout";

const CardPayment = () => {
  const { intentId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const payNow = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        `/payments/pay/${intentId}`,
        null,
        { params: { method: "CARD" } }
      );

      navigate("/student/payments/success/payment-success", {
        replace: true,
        state: {
          amount: res.data.amount,
          ref: res.data.transactionId,
          receiptUrl: res.data.receiptUrl || "",
        },
      });
    } catch {
      alert("Payment Failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout
      title="Card Payment"
      subtitle="Secure payment powered by PayHere"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-xl">

        <div className="flex justify-end gap-3 mb-4 text-sm font-bold text-text-muted">
          <span>VISA</span>
          <span>MASTER</span>
          <span>AMEX</span>
        </div>

        <label className="block text-sm font-semibold text-text-dark mb-1">
          Card Number
        </label>
        <input className="w-full input mb-3" placeholder="1234 5678 9012 3456" />

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-text-dark mb-1">
              Expiry
            </label>
            <input className="w-full input" placeholder="MM / YY" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-text-dark mb-1">
              CVV
            </label>
            <input className="w-full input" placeholder="123" />
          </div>
        </div>

        <label className="block text-sm font-semibold text-text-dark mb-1 mt-3">
          Cardholder Name
        </label>
        <input className="w-full input" placeholder="Name on card" />

        <button
          onClick={payNow}
          disabled={loading}
          className="w-full bg-accent hover:bg-primary transition-colors
                     text-white font-bold py-3 rounded-large mt-5
                     disabled:opacity-70"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>

        <p className="text-xs text-text-muted text-center mt-4">
          🔒 Secure payment powered by PayHere
        </p>
      </div>
    </StudentLayout>
  );
};

export default CardPayment;
