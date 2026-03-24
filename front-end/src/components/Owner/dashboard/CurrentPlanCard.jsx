import React, { useEffect, useState } from "react";
import { getCurrentSubscriptionPlan } from "../../../api/owner/subscriptionPlanService";
import { useNavigate } from "react-router-dom";

const CurrentPlanCard = () => {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const fetchPlan = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCurrentSubscriptionPlan();
        if (!cancelled) {
          setPlan(data || null);
        }
      } catch (err) {
        if (!cancelled) {
          const status = err?.response?.status;
          if (status === 404) {
            setPlan(null);
          } else {
            setError("Unable to load subscription details.");
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPlan();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleManageClick = () => {
    navigate("/owner/subscription-plans");
  };

  const title = plan ? "Current Subscription" : "No Active Subscription";

  return (
    <div className="p-5 border shadow-sm bg-card-bg rounded-xl border-light">
      <h3 className="mb-2 text-xs font-black tracking-widest uppercase text-muted/50">
        {title}
      </h3>

      {loading ? (
        <div className="flex items-center gap-3 text-sm text-muted">
          <div className="w-4 h-4 border-2 rounded-full border-primary border-t-transparent animate-spin" />
          <span>Checking your subscription...</span>
        </div>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : plan ? (
        <div className="space-y-2 text-sm">
          <p className="font-semibold text-text">
            {plan.name}{" "}
            <span className="ml-2 inline-flex items-center rounded-full bg-accent/10 px-2 py-[2px] text-[10px] font-bold uppercase tracking-widest text-accent">
              Active
            </span>
          </p>
          <p className="text-muted">
            Price: <span className="font-semibold">LKR {plan.price?.toLocaleString()}</span>
          </p>
          {plan.duration && (
            <p className="text-muted">
              Duration: <span className="font-semibold">{plan.duration}</span>
            </p>
          )}
          {plan.maxAds !== undefined && (
            <p className="text-muted">
              Max Ads: <span className="font-semibold">{plan.maxAds}</span>
            </p>
          )}
          <button
            onClick={handleManageClick}
            className="mt-3 inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-primary transition-colors"
          >
            Manage Plan
          </button>
        </div>
      ) : (
        <div className="space-y-3 text-sm">
          <p className="text-muted">
            You do not have an active subscription. Subscribe to boost your listings and reach more
            students.
          </p>
          <button
            onClick={handleManageClick}
            className="inline-flex items-center justify-center rounded-full bg-accent px-4 py-2 text-xs font-black uppercase tracking-widest text-white hover:bg-primary transition-colors"
          >
            View Plans
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrentPlanCard;

