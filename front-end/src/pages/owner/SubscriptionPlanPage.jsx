import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck, FaStar, FaRocket, FaCrown } from "react-icons/fa";
import toast from "react-hot-toast";
import HeaderBar from "../../components/Owner/common/HeaderBar.jsx";
import { getActivePlans } from "../../api/common/subscriptionPlanService";
import {
  createSubscriptionBuyIntent,
  getCurrentSubscriptionPlan,
} from "../../api/owner/subscriptionPlanService";
import { getApiErrorMessage } from "../../utils/apiError";

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

const PlanCard = ({ plan, styleIndex, isCurrent, isBuying, onBuy }) => {
  const style = planStyles[styleIndex % planStyles.length];
  const IconComponent = style.icon;

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
          per {plan.durationDays} Days
        </span>
      </div>

      {plan.description && (
        <p className="text-sm text-text-muted mb-4 italic">{plan.description}</p>
      )}

      <ul className="flex-1 space-y-4 mb-8">
        {(plan.features || []).map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm font-medium text-text"
          >
            <FaCheck className={`mt-1 shrink-0 ${style.colorClass}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={() => onBuy(plan)}
        disabled={isCurrent || isBuying}
        className={`
          w-full py-4 text-xs font-black uppercase tracking-widest rounded-full text-white shadow-lg transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
          ${isCurrent ? "bg-gray-500" : `${style.bgClass} hover:brightness-110`}
        `}
      >
        {isCurrent ? "Current Plan" : isBuying ? "Processing..." : `Buy ${plan.name}`}
      </button>
    </div>
  );
};

export default function SubscriptionPlanPage() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingPlanId, setBuyingPlanId] = useState(null);
  const [currentPlanId, setCurrentPlanId] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [plansData, currentPlanData] = await Promise.all([
          getActivePlans(),
          getCurrentSubscriptionPlan(),
        ]);
        setPlans(plansData || []);
        if (currentPlanData?.id) {
          setCurrentPlanId(Number(currentPlanData.id));
        }
      } catch (err) {
        console.error("Failed to load subscription plans:", err);
        toast.error(getApiErrorMessage(err, "Failed to load subscription plans."));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleBuyPlan = async (plan) => {
    try {
      setBuyingPlanId(plan.id);
      const intent = await createSubscriptionBuyIntent(plan.id);
      const adQuery = adId ? `&adId=${encodeURIComponent(adId)}` : "";
      navigate(
        `/owner/payments/pay/select-method/${intent.id}?flow=subscription&planId=${plan.id}${adQuery}`
      );
    } catch (err) {
      console.error("Failed to start owner subscription payment:", err);
      toast.error(getApiErrorMessage(err, "Failed to start subscription payment."));
    } finally {
      setBuyingPlanId(null);
    }
  };

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
            <p className="text-text-muted text-sm mt-2">
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                styleIndex={index}
                isCurrent={Number(plan.id) === Number(currentPlanId)}
                isBuying={Number(plan.id) === Number(buyingPlanId)}
                onBuy={handleBuyPlan}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
