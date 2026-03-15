import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import HeaderBar from "../../../../../components/Owner/common/HeaderBar.jsx";
import { buySubscriptionPlan } from "../../../../../api/owner/subscriptionPlanService";

const OwnerPaymentSuccess = () => {
  const { state } = useLocation();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [activating, setActivating] = useState(false);
  const [activated, setActivated] = useState(false);

  const planId = params.get("planId");
  const adId = params.get("adId");
  const flow = params.get("flow");
  const returnPath = adId
    ? `/owner/subscriptions/${encodeURIComponent(adId)}`
    : "/owner/subscription-plans";

  useEffect(() => {
    if (!state) {
      navigate("/owner/subscription-plans", { replace: true });
      return;
    }

    if (flow === "subscription" && planId && !activated) {
      const activateSubscription = async () => {
        try {
          setActivating(true);
          await buySubscriptionPlan(planId);
          setActivated(true);
          toast.success("Subscription activated successfully!");
        } catch (err) {
          console.error("Failed to activate subscription:", err);
          const message =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Payment succeeded but subscription activation failed. Please contact support.";
          toast.error(message);
        } finally {
          setActivating(false);
        }
      };
      activateSubscription();
    }
  }, [state, flow, planId, activated, navigate]);

  if (!state) {
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

      <div className="max-w-md bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center mx-auto">
        <div className="text-4xl mb-2">Payment Completed</div>

        <h2 className="text-xl font-bold text-green-600">
          {activating
            ? "Activating Subscription..."
            : activated
              ? "Subscription Activated"
              : "Payment Completed"}
        </h2>

        {activating && (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
          </div>
        )}

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
          disabled={activating}
          className="mt-6 w-full bg-accent hover:bg-primary transition-colors text-white font-bold py-3 rounded-large disabled:opacity-60"
        >
          {activated ? "Back to Subscription Plans" : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default OwnerPaymentSuccess;

