import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaCheck, FaStar, FaRocket, FaCrown } from "react-icons/fa";
import toast from "react-hot-toast";
import HeaderBar from "../../components/Owner/common/HeaderBar.jsx";
<<<<<<< HEAD
import toast from "react-hot-toast";
import { getActivePlans } from "../../api/admin/subscriptionPlanService";
import { createSubscription } from "../../api/owner/subscriptionService";
=======
import { getActivePlans } from "../../api/common/subscriptionPlanService";
import {
  createSubscriptionBuyIntent,
  getCurrentSubscriptionPlan,
} from "../../api/owner/subscriptionPlanService";
import { getApiErrorMessage } from "../../utils/apiError";
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02

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

<<<<<<< HEAD
const PlanCard = ({ plan, adId, styleIndex, onSelect }) => {
  const navigate = useNavigate();

  const style = planStyles[styleIndex % planStyles.length];

  const handleSelectPlan = async () => {
    const confirmation = window.confirm(
      `Confirm purchase of the ${
        plan.name
      } for LKR ${plan.price.toLocaleString()}?`
    );

    if (!confirmation) return;

    await onSelect(plan);
    navigate("/owner/my-ads");
  };
=======
const PlanCard = ({ plan, styleIndex, isCurrent, isBuying, onBuy }) => {
  const style = planStyles[styleIndex % planStyles.length];
  const IconComponent = style.icon;
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02

  return (
    <div
      className={`
<<<<<<< HEAD
      relative flex flex-col p-8 rounded-report bg-card-bg shadow-custom border-t-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
      ${style.borderClass}
    `}
=======
        relative flex flex-col p-8 rounded-large bg-white shadow-custom border-t-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
        ${style.borderClass}
      `}
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-black text-text uppercase tracking-tight">
          {plan.name}
        </h3>
<<<<<<< HEAD
        <div className={`p-3 rounded-2xl bg-light ${style.colorClass}`}>
          <i className={`${style.icon} text-2xl`}></i>
=======
        <div className={`p-3 rounded-2xl bg-background-light ${style.colorClass}`}>
          <IconComponent className="text-2xl" />
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
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
<<<<<<< HEAD
        {plan.features && plan.features.split(',').map((feature, index) => (
=======
        {(plan.features || []).map((feature, index) => (
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
          <li
            key={index}
            className="flex items-start gap-3 text-sm font-medium text-text"
          >
<<<<<<< HEAD
            <i
              className={`fas fa-check-circle mt-1 shrink-0 ${style.colorClass}`}
            ></i>
            <span>{feature.trim()}</span>
=======
            <FaCheck className={`mt-1 shrink-0 ${style.colorClass}`} />
            <span>{feature}</span>
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
          </li>
        ))}
      </ul>

      <button
        onClick={() => onBuy(plan)}
        disabled={isCurrent || isBuying}
        className={`
<<<<<<< HEAD
          w-full py-4 text-xs font-black uppercase tracking-widest rounded-full text-white shadow-lg transition-all active:scale-95
          ${style.bgClass} hover:brightness-110
=======
          w-full py-4 text-xs font-black uppercase tracking-widest rounded-full text-white shadow-lg transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed
          ${isCurrent ? "bg-gray-500" : `${style.bgClass} hover:brightness-110`}
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
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
<<<<<<< HEAD
  const [subscribing, setSubscribing] = useState(false);

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
      setSubscribing(true);
      
      // Create subscription payload
      const payload = {
        subscriptionPlanId: plan.id,
        adId: adId, // Include the ad ID for boosting
      };
      
      await createSubscription(payload);
      toast.success("Subscription activated successfully");
      
      // Navigate back to ads page after successful subscription
      navigate("/owner/myAds");
    } catch (err) {
      console.error("Failed to activate subscription:", err);
      toast.error("Failed to activate subscription");
    } finally {
      setSubscribing(false);
    }
  };

  if (!adId) {
    setTimeout(() => navigate("/owner/my-ads"), 0);
    return null;
  }
=======
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
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02

  return (
    <div className="pt-4 space-y-8 min-h-screen pb-12">
      <HeaderBar
        title="Choose Subscription Plan"
        subtitle="Select a plan to increase ad visibility and attract more students."
        navBtnText="Back to My Ads"
        navBtnPath="/owner/myAds"
      />
<<<<<<< HEAD
      {/* Why Boost Section */}
      <section className="mx-4 p-8 rounded-report bg-card-bg shadow-custom border border-light text-center max-w-4xl lg:mx-auto">
=======

      <section className="mx-4 p-8 rounded-large bg-white shadow-custom border border-gray-100 text-center max-w-4xl lg:mx-auto">
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
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
<<<<<<< HEAD
          <div className="text-center py-20 bg-card-bg rounded-report shadow-custom">
=======
          <div className="text-center py-20 bg-white rounded-large shadow-custom">
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
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
<<<<<<< HEAD
                adId={adId}
                styleIndex={index}
                onSelect={handleSelectPlan}
                disabled={subscribing}
=======
                styleIndex={index}
                isCurrent={Number(plan.id) === Number(currentPlanId)}
                isBuying={Number(plan.id) === Number(buyingPlanId)}
                onBuy={handleBuyPlan}
>>>>>>> 3621e99b3aa3481d97ecd01ac84d36ff24145c02
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
