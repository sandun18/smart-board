import React from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import StudentLayout from "../../../../../components/student/common/StudentLayout";

const SelectPaymentMethod = () => {
  const { intentId } = useParams();
  const [params] = useSearchParams();
  const boardingId = params.get("boardingId");
  const navigate = useNavigate();

  if (!intentId || !boardingId) {
    alert("Missing payment information");
    return null;
  }

  return (
    <StudentLayout
      title="Choose Payment Method"
      subtitle="Select how you would like to complete your payment"
    >
      <div className="max-w-xl space-y-4">

        {/* CARD */}
        <button
          onClick={() =>
            navigate(
              `/student/payments/pay/card/${intentId}?boardingId=${boardingId}`
            )
          }
          className="w-full text-left bg-white rounded-2xl p-5
                     border border-gray-100 shadow-sm
                     hover:border-accent hover:shadow-md transition-all"
        >
          <h2 className="text-lg font-bold text-text-dark">
            💳 Card Payment
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Instant payment • Powered by PayHere
          </p>
        </button>

        {/* BANK SLIP */}
        <button
          onClick={() =>
            navigate(
              `/student/payments/pay/bank-slip/${intentId}?boardingId=${boardingId}`
            )
          }
          className="w-full text-left bg-white rounded-2xl p-5
                     border border-gray-100 shadow-sm
                     hover:border-accent hover:shadow-md transition-all"
        >
          <h2 className="text-lg font-bold text-text-dark">
            🏦 Bank Slip
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Upload slip • Owner verification required
          </p>
        </button>

        {/* CASH */}
        <button
          onClick={() =>
            navigate(
              `/student/payments/pay/cash/${intentId}?boardingId=${boardingId}`
            )
          }
          className="w-full text-left bg-white rounded-2xl p-5
                     border border-gray-100 shadow-sm
                     hover:border-green-400 hover:shadow-md transition-all"
        >
          <h2 className="text-lg font-bold text-text-dark">
            💵 Cash Payment
          </h2>
          <p className="text-sm text-text-muted mt-1">
            Pay directly to owner • Confirmation required
          </p>
        </button>

      </div>
    </StudentLayout>
  );
};

export default SelectPaymentMethod;
