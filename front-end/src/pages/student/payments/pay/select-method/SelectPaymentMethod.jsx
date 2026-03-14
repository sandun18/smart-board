import React from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import StudentLayout from "../../../../../components/student/common/StudentLayout";

const SelectPaymentMethod = () => {
  const { intentId } = useParams();
  const [params] = useSearchParams();
  const boardingId = params.get("boardingId");
  const flow = params.get("flow");
  const planId = params.get("planId");
  const navigate = useNavigate();
  const isSubscriptionFlow = flow === "subscription";

  if (!intentId || (!isSubscriptionFlow && !boardingId)) {
    alert("Missing payment information");
    return null;
  }

  const buildTarget = (methodPath) => {
    if (isSubscriptionFlow) {
      return `/student/payments/pay/${methodPath}/${intentId}?flow=subscription&planId=${planId || ""}`;
    }
    return `/student/payments/pay/${methodPath}/${intentId}?boardingId=${boardingId}`;
  };

  return (
    <StudentLayout
      title="Choose Payment Method"
      subtitle="Select how you would like to complete your payment"
    >
      <div className="max-w-xl space-y-4">

        {/* CARD */}
        <button
          onClick={() => navigate(buildTarget("card"))}
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

        {!isSubscriptionFlow && (
          <>
            {/* BANK SLIP */}
            <button
              onClick={() => navigate(buildTarget("bank-slip"))}
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
              onClick={() => navigate(buildTarget("cash"))}
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
          </>
        )}

        {isSubscriptionFlow && (
          <p className="text-xs text-text-muted text-center">
            Subscription purchases currently support card payment only.
          </p>
        )}

      </div>
    </StudentLayout>
  );
};

export default SelectPaymentMethod;
