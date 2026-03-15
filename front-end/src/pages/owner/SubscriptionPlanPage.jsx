import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck, FaStar, FaRocket, FaCrown } from "react-icons/fa";
import toast from "react-hot-toast";
import HeaderBar from "../../components/Owner/common/HeaderBar.jsx";
import { getActivePlans } from "../../api/admin/subscriptionPlanService";
import { createSubscription } from "../../api/owner/subscriptionService";

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
      .map((item) =>
        typeof item === "string" ? item.trim() : String(item).trim(),
      )
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

const PlanCard = ({ plan, styleIndex, onSelect, isSubmitting }) => {
  const style = planStyles[styleIndex % planStyles.length];
  const IconComponent = style.icon;
  const features = normalizeFeatures(plan?.features);

  return (
    <div
      className={`
        relative flex flex-col p-8 rounded-large bg-white shadow-custom border-t-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
        ${style.borderClass}
      `}
    >
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

      <ul className="flex-1 space-y-4 mb-8">
        {features.map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm font-medium text-text"
          >
            <FaCheck className={`mt-1 shrink-0 ${style.colorClass}`} />
            <span>{feature}</span>
          </li>
        ))}

        {features.length === 0 && (
          <li className="text-sm text-text-muted">Features will be available soon</li>
        )}
      </ul>

      <button
        onClick={() => onSelect(plan)}
        disabled={isSubmitting}
        className={`
          w-full py-4 text-xs font-black uppercase tracking-widest rounded-full text-white shadow-lg transition-all
          ${isSubmitting ? "opacity-60 cursor-not-allowed" : "active:scale-95"}
          ${style.bgClass} hover:brightness-110
        `}
      >
        {isSubmitting ? "Processing..." : `Activate ${plan.name}`}
      </button>
    </div>
  );
};

export default function SubscriptionPlanPage() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingPlanId, setSubmittingPlanId] = useState(null);

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
    try {
      setSubmittingPlanId(plan.id);

      const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
      const ownerId = userData?.id;

      if (!ownerId) {
        toast.error("Owner account not found. Please log in again.");
        return;
      }

      await createSubscription(plan.id);
      toast.success("Subscription activated successfully");
      navigate("/owner/myAds");
    } catch (err) {
      console.error("Failed to activate subscription:", err);
      toast.error(err?.message || "Failed to activate subscription");
    } finally {
      setSubmittingPlanId(null);
    }
  };

  if (!adId) {
    setTimeout(() => navigate("/owner/myAds"), 0);
    return null;
  }

  return (
    <div className="pt-4 space-y-8 min-h-screen pb-12">
      <HeaderBar
        title="Choose Subscription Plan"
        subtitle="Select a plan to increase ad visibility and attract more students."
        navBtnText="Back to My Ads"
        navBtnPath="/owner/myAds"
      />

      <section className="mx-4 p-8 rounded-large bg-white shadow-custom border border-gray-100 text-center max-w-4xl lg:mx-auto">
        <h2 className="text-xl font-black text-accent uppercase tracking-widest mb-3">
          Why Subscribe?
        </h2>
        <p className="text-muted font-medium italic">
          Subscription plans increase your listing visibility and improve conversion on your boarding ads.
        </p>
      </section>

      <section className="px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-large shadow-custom">
            <p className="text-text-muted text-lg">
              No subscription plans available at the moment.
            </p>
            <p className="text-text-muted text-sm mt-2">Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                styleIndex={index}
                onSelect={handleSelectPlan}
                isSubmitting={submittingPlanId === plan.id}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
