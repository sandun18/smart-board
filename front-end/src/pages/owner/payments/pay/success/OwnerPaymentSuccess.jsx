import React from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import HeaderBar from "../../../../../components/Owner/common/HeaderBar.jsx";

const OwnerPaymentSuccess = () => {
  const { state } = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const adId = params.get("adId");
  const returnPath = adId ? `/owner/subscriptions/${encodeURIComponent(adId)}` : "/owner/subscription-plans";

  if (!state) {
    navigate("/owner/subscription-plans", { replace: true });
    return null;
  }

  return (
    <div className="pt-4 space-y-8 min-h-screen pb-12">
      <HeaderBar
        title="Payment Successful"
        subtitle="Your subscription payment has been completed successfully"
        navBtnText="Back to Plans"
        navBtnPath={returnPath}
      />

      <div className="max-w-md bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
        <div className="text-4xl mb-2">Payment Completed</div>

        <h2 className="text-xl font-bold text-green-600">Subscription Activated</h2>

        <p className="text-lg font-semibold text-text-dark mt-3">Rs. {state.amount}</p>

        <p className="text-sm text-text-muted mt-1">Reference: {state.ref}</p>

        {state.receiptUrl && (
          <button
            onClick={() => window.open(state.receiptUrl, "_blank")}
            className="mt-4 text-accent font-semibold underline"
          >
            View Receipt
          </button>
        )}

        <button
          onClick={() => navigate(returnPath)}
          className="mt-6 w-full bg-accent hover:bg-primary transition-colors text-white font-bold py-3 rounded-large"
        >
          Back to Subscription Plans
        </button>
      </div>
    </div>
  );
};

export default OwnerPaymentSuccess;
