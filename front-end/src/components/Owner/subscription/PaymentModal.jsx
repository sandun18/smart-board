import React, { useState } from "react";
import { FaCreditCard, FaLock, FaTimes, FaCheckCircle } from "react-icons/fa";
import toast from "react-hot-toast";
import api from "../../../api/api";
import { createSubscriptionBuyIntent, buySubscriptionPlan } from "../../../api/owner/subscriptionPlanService";

const STEPS = { CARD_FORM: "CARD_FORM", PROCESSING: "PROCESSING", SUCCESS: "SUCCESS" };

export default function PaymentModal({ plan, onClose, onSuccess }) {
  const [step, setStep] = useState(STEPS.CARD_FORM);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [result, setResult] = useState(null);

  const formatCardNumber = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  };

  const isFormValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.replace(/\D/g, "").length === 4 &&
    cvv.length >= 3 &&
    cardName.trim().length > 1;

  const handlePay = async () => {
    if (!isFormValid) {
      toast.error("Please fill in all card details correctly.");
      return;
    }

    try {
      setStep(STEPS.PROCESSING);

      // Step 1: Create buy intent (payment intent)
      const paymentIntent = await createSubscriptionBuyIntent(plan.id);
      const intentId = paymentIntent?.id;
      if (!intentId) throw new Error("Failed to create payment intent");

      // Step 2: Process payment via backend (simulated PayHere gateway)
      const payRes = await api.post(`/payments/pay/${intentId}`, null, {
        params: { method: "CARD" },
      });

      // Step 3: Activate subscription via buyPlan
      await buySubscriptionPlan(plan.id);

      setResult({
        amount: payRes.data.amount,
        ref: payRes.data.transactionId,
        receiptUrl: payRes.data.receiptUrl || "",
      });
      setStep(STEPS.SUCCESS);
    } catch (err) {
      console.error("Payment failed:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Payment failed. Please try again.";
      toast.error(message);
      setStep(STEPS.CARD_FORM);
    }
  };

  const handleDone = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={step !== STEPS.PROCESSING ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-[fadeInUp_0.3s_ease-out]">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">
                {step === STEPS.SUCCESS ? "Payment Successful" : "Complete Payment"}
              </h2>
              <p className="text-sm opacity-90 mt-0.5">{plan.name} Plan</p>
            </div>
            {step !== STEPS.PROCESSING && (
              <button
                onClick={step === STEPS.SUCCESS ? handleDone : onClose}
                className="p-2 rounded-full hover:bg-white/20 transition"
              >
                <FaTimes />
              </button>
            )}
          </div>
          <div className="mt-3 text-3xl font-black tracking-tight">
            LKR {plan.price?.toLocaleString()}
          </div>
        </div>

        {/* ─── CARD FORM ─── */}
        {step === STEPS.CARD_FORM && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs text-text-muted font-semibold mb-1">
              <FaLock className="text-green-500" />
              <span>Secured by PayHere Payment Gateway</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                Card Number
              </label>
              <div className="relative">
                <FaCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                  Expiry
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM / YY"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                  CVV
                </label>
                <input
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="•••"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="Name on card"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition"
              />
            </div>

            {/* Accepted cards */}
            <div className="flex justify-center gap-4 pt-2">
              {["VISA", "MASTER", "AMEX"].map((brand) => (
                <span
                  key={brand}
                  className="px-3 py-1 rounded-md bg-gray-100 text-[11px] font-bold text-gray-500 tracking-wide"
                >
                  {brand}
                </span>
              ))}
            </div>

            <button
              onClick={handlePay}
              disabled={!isFormValid}
              className={`
                w-full py-4 mt-2 text-sm font-extrabold uppercase tracking-widest rounded-xl text-white shadow-lg transition-all
                ${isFormValid
                  ? "bg-gradient-to-r from-accent to-primary hover:shadow-xl active:scale-[0.98]"
                  : "bg-gray-300 cursor-not-allowed"
                }
              `}
            >
              Pay LKR {plan.price?.toLocaleString()}
            </button>
          </div>
        )}

        {/* ─── PROCESSING ─── */}
        {step === STEPS.PROCESSING && (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 border-4 rounded-full border-accent border-t-transparent animate-spin" />
            <p className="text-lg font-bold text-text">Processing Payment...</p>
            <p className="text-sm text-text-muted">
              Please wait while we securely process your payment.
            </p>
          </div>
        )}

        {/* ─── SUCCESS ─── */}
        {step === STEPS.SUCCESS && result && (
          <div className="p-8 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
              <FaCheckCircle className="text-3xl text-green-500" />
            </div>
            <h3 className="text-xl font-extrabold text-text">Subscription Activated!</h3>
            <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted font-medium">Amount</span>
                <span className="font-bold text-text">LKR {result.amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted font-medium">Reference</span>
                <span className="font-bold text-text font-mono text-xs">{result.ref}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted font-medium">Plan</span>
                <span className="font-bold text-text">{plan.name}</span>
              </div>
            </div>

            {result.receiptUrl && (
              <button
                onClick={() => window.open(result.receiptUrl, "_blank")}
                className="text-accent font-semibold underline text-sm"
              >
                Download Receipt
              </button>
            )}

            <button
              onClick={handleDone}
              className="w-full py-4 mt-2 text-sm font-extrabold uppercase tracking-widest rounded-xl text-white bg-gradient-to-r from-green-500 to-green-600 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
