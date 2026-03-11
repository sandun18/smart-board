import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StudentLayout from "../../../../../components/student/common/StudentLayout";

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/student/billing");
    return null;
  }

  return (
    <StudentLayout
      title="Payment Successful"
      subtitle="Your payment has been completed successfully"
    >
      <div className="max-w-md bg-white rounded-2xl p-6
                      border border-gray-100 shadow-sm text-center">

        <div className="text-4xl mb-2">🎉</div>

        <h2 className="text-xl font-bold text-green-600">
          Payment Completed
        </h2>

        <p className="text-lg font-semibold text-text-dark mt-3">
          Rs. {state.amount}
        </p>

        <p className="text-sm text-text-muted mt-1">
          Reference: {state.ref}
        </p>

        {state.receiptUrl && (
          <button
            onClick={() => window.open(state.receiptUrl, "_blank")}
            className="mt-4 text-accent font-semibold underline"
          >
            View Receipt
          </button>
        )}

        <button
          onClick={() => navigate("/student/billing")}
          className="mt-6 w-full bg-accent hover:bg-primary
                     transition-colors text-white font-bold
                     py-3 rounded-large"
        >
          Back to Billing
        </button>
      </div>
    </StudentLayout>
  );
};

export default PaymentSuccess;
