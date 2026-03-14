import React, { useState, useEffect } from "react";
import { FaStar, FaRocket, FaCrown } from "react-icons/fa";
import toast from "react-hot-toast";
import { getActivePlans } from "../../api/admin/subscriptionPlanService";
import { createSubscription } from "../../api/owner/subscriptionService";
import HeaderBar from "../../components/Owner/common/HeaderBar.jsx";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext.jsx";

// Map plan index to style config for visual variety
const planStyles = [
  {
    colorClass: "text-info",
    bgClass: "bg-info",
    borderClass: "border-info",
    icon: FaStar,
  },
  {
    colorClass: "text-accent",
    bgClass: "bg-accent",
    borderClass: "border-accent",
    icon: FaRocket,
  },
  {
    colorClass: "text-primary",
    bgClass: "bg-primary",
    borderClass: "border-primary",
    icon: FaCrown,
  },
];

const normalizeFeatures = (features) => {
  if (Array.isArray(features)) {
    return features
      .map((item) => (typeof item === "string" ? item.trim() : String(item).trim()))
      .filter(Boolean);
  }

  if (typeof features === "string") {
    return features
      .split(/\|\||,|\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const getDurationLabel = (plan) => {
  if (plan?.durationDays !== undefined && plan?.durationDays !== null) {
    return `${plan.durationDays} Days`;
  }
  if (typeof plan?.duration === "string" && plan.duration.trim()) {
    return plan.duration.trim();
  }
  return "N/A";
};

const getDurationDays = (plan) => {
  if (plan?.durationDays !== undefined && plan?.durationDays !== null) {
    const parsedDurationDays = Number(plan.durationDays);
    return Number.isFinite(parsedDurationDays) && parsedDurationDays > 0
      ? parsedDurationDays
      : 30;
  }

  if (typeof plan?.duration === "string" && plan.duration.trim()) {
    const parsed = parseInt(plan.duration.trim().split(/\s+/)[0], 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
  }

  return 30;
};

const toIsoString = (date) => new Date(date).toISOString();

const PlanCard = ({
  plan,
  styleIndex,
  isPopular,
  isSelected,
  onSelectPlan,
  isSubmitting,
}) => {
  const style = planStyles[styleIndex % planStyles.length];
  const IconComponent = style.icon;
  const features = normalizeFeatures(plan?.features);

  return (
    <div
      className={`
        relative flex flex-col p-8 rounded-large bg-white border-t-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl
        ${isSelected ? "ring-2 ring-green-300 shadow-xl" : ""}
        ${isPopular ? "ring-2 ring-accent/40 shadow-xl" : "shadow-custom"}
        ${style.borderClass}
      `}
    >
      {isSelected && (
        <span className="absolute -top-3 left-4 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide bg-green-600 text-white shadow-lg uppercase">
          Selected
        </span>
      )}

      {isPopular && (
        <span className="absolute -top-3 right-4 px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wide bg-accent text-white shadow-lg uppercase">
          Most Popular
        </span>
      )}

      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-black text-text uppercase tracking-tight">
          {plan.name}
        </h3>
        <div className={`p-3 rounded-2xl bg-background-light ${style.colorClass}`}>
          <IconComponent className="text-2xl" />
        </div>
      </div>

      <div className="mb-4">
        <div className="text-4xl font-black text-primary tracking-tighter">
          LKR {plan.price?.toLocaleString()}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
          per {getDurationLabel(plan)}
        </span>
      </div>

      <ul className="flex-1 space-y-3 mb-8">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm font-medium text-text"
          >
            <span className={`mt-[2px] shrink-0 font-bold ${style.colorClass}`}>✔</span>
            <span>{feature}</span>
          </li>
        ))}
        {features.length === 0 && (
          <li className="text-sm text-text-muted">Features will be available soon</li>
        )}
      </ul>

      <button
        onClick={() => onSelectPlan(plan)}
        disabled={isSubmitting || isSelected}
        className={`
          w-full py-4 text-xs font-black uppercase tracking-widest rounded-full text-white shadow-lg transition-all
          ${isSubmitting || isSelected ? "opacity-60 cursor-not-allowed" : "active:scale-95"}
          ${style.bgClass} hover:brightness-110
        `}
      >
        {isSelected ? "Selected" : `Select ${plan.name}`}
      </button>
    </div>
  );
};

export default function ViewSubscriptionPlansPage() {
  const { currentOwner } = useOwnerAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [submittingPlanId, setSubmittingPlanId] = useState(null);

  const mostPopularPlanId = plans.reduce((bestId, currentPlan, idx) => {
    const currentPrice = Number(currentPlan?.price) || 0;
    if (bestId === null) {
      return currentPlan?.id ?? idx;
    }

    const bestPlan = plans.find((p, i) => (p?.id ?? i) === bestId);
    const bestPrice = Number(bestPlan?.price) || 0;
    return currentPrice > bestPrice ? currentPlan?.id ?? idx : bestId;
  }, null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await getActivePlans();
        setPlans(data || []);
      } catch (err) {
        console.error("Failed to fetch plans:", err);
        toast.error("Failed to load subscription plans.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSelectPlan = async (plan) => {
    const ownerId = currentOwner?.id;
    if (!ownerId) {
      toast.error("Owner account not found. Please log in again.");
      return;
    }

    const now = new Date();
    const durationDays = getDurationDays(plan);
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + durationDays);

    const payload = {
      ownerId,
      planId: plan.id,
      startDate: toIsoString(now),
      endDate: toIsoString(endDate),
      status: "ACTIVE",
    };

    try {
      setSubmittingPlanId(plan.id);
      await createSubscription(payload);
      setSelectedPlanId(plan.id);
      toast.success("Subscription activated successfully");
    } catch (error) {
      console.error("Failed to create subscription:", error);
      toast.error("Failed to activate subscription");
    } finally {
      setSubmittingPlanId(null);
    }
  };

  return (
    <div className="pt-4 space-y-8 min-h-screen pb-12">
      <HeaderBar
        title="Subscription Plans"
        subtitle="Choose a plan to boost your ad visibility and attract more students."
        navBtnText="Back to Dashboard"
        navBtnPath="/owner/dashboard"
      />

      {/* Why Subscribe Section */}
      <section className="mx-4 p-8 rounded-large bg-white shadow-custom border border-gray-100 text-center max-w-4xl lg:mx-auto">
        <h2 className="text-xl font-black text-accent uppercase tracking-widest mb-3">
          Why Subscribe?
        </h2>
        <p className="text-muted font-medium italic">
          Subscribed ads appear higher in search results, reach more students,
          and convert appointments faster than standard listings.
        </p>
      </section>

      {/* Plans Grid */}
      <section className="px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-20 text-lg font-semibold text-text-muted">
            Loading plans...
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-large shadow-custom">
            <p className="text-text-muted text-lg">No subscription plans available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id ?? index}
                plan={plan}
                styleIndex={index}
                isPopular={(plan.id ?? index) === mostPopularPlanId}
                isSelected={selectedPlanId === plan.id}
                isSubmitting={submittingPlanId === plan.id}
                onSelectPlan={handleSelectPlan}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
