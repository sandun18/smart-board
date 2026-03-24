import React from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import HeaderBar from "../../../../../components/Owner/common/HeaderBar.jsx";

const OwnerSelectPaymentMethod = () => {
  const { intentId } = useParams();
  const [params] = useSearchParams();
  const flow = params.get("flow");
  const planId = params.get("planId");
  const adId = params.get("adId");
  const navigate = useNavigate();

  const isSubscriptionFlow = flow === "subscription";

  if (!intentId || !isSubscriptionFlow) {
    return (
      <div className="pt-4 space-y-8 min-h-screen pb-12">
        <HeaderBar
          title="Choose Payment Method"
          subtitle="Missing payment information for owner subscription flow."
          navBtnText="Back to Plans"
          navBtnPath="/owner/subscription-plans"
        />
      </div>
    );
  }

  const target = `/owner/payments/pay/card/${intentId}?flow=subscription&planId=${planId || ""}${
    adId ? `&adId=${encodeURIComponent(adId)}` : ""
  }`;

  return (
    <div className="pt-4 space-y-8 min-h-screen pb-12">
      <HeaderBar
        title="Choose Payment Method"
        subtitle="Select how you would like to complete your subscription payment"
        navBtnText="Back to Plans"
        navBtnPath="/owner/subscription-plans"
      />

      <div className="max-w-xl space-y-4">
        <button
          onClick={() => navigate(target)}
          className="w-full text-left bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-accent hover:shadow-md transition-all"
        >
          <h2 className="text-lg font-bold text-text-dark">Card Payment</h2>
          <p className="text-sm text-text-muted mt-1">Instant payment powered by PayHere</p>
        </button>

        <p className="text-xs text-text-muted text-center">
          Subscription purchases currently support card payment only.
        </p>
      </div>
    </div>
  );
};

export default OwnerSelectPaymentMethod;
