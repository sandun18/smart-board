import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBar from "../../components/Owner/common/HeaderBar.jsx";
import toast from "react-hot-toast";
import { getActivePlans } from "../../api/admin/subscriptionPlanService";
import { createSubscription } from "../../api/owner/subscriptionService";

const planStyles = [
  {
    colorClass: "text-info",
    bgClass: "bg-info",
    borderClass: "border-info",
    icon: "fas fa-star",
  },
  {
    colorClass: "text-accent",
    bgClass: "bg-accent",
    borderClass: "border-accent",
    icon: "fas fa-rocket",
  },
  {
    colorClass: "text-primary",
    bgClass: "bg-primary",
    borderClass: "border-primary",
    icon: "fas fa-crown",
  },
];

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

  return (
    <div
      className={`
      relative flex flex-col p-8 rounded-report bg-card-bg shadow-custom border-t-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl
      ${style.borderClass}
    `}
    >
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-xl font-black text-text uppercase tracking-tight">
          {plan.name}
        </h3>
        <div className={`p-3 rounded-2xl bg-light ${style.colorClass}`}>
          <i className={`${style.icon} text-2xl`}></i>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-4xl font-black text-primary tracking-tighter">
          LKR {plan.price.toLocaleString()}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
          per {plan.duration}
        </span>
      </div>

      <ul className="flex-1 space-y-4 mb-8">
        {plan.features && plan.features.split(',').map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm font-medium text-text"
          >
            <i
              className={`fas fa-check-circle mt-1 shrink-0 ${style.colorClass}`}
            ></i>
            <span>{feature.trim()}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleSelectPlan}
        className={`
          w-full py-4 text-xs font-black uppercase tracking-widest rounded-full text-white shadow-lg transition-all active:scale-95
          ${style.bgClass} hover:brightness-110
        `}
      >
        Activate {plan.name}
      </button>
    </div>
  );
};

export default function SubscriptionPlanPage() {
  const { adId } = useParams();
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="pt-4 space-y-8 min-h-screen bg-light pb-12">
      <HeaderBar
        title="Choose Your Subscription Plan"
        subtitle="Select a plan to boost your ad visibility and attract more students."
        navBtnText="Back to My Ads"
        navBtnPath="/owner/myAds"
      />
      {/* Why Boost Section */}
      <section className="mx-4 p-8 rounded-report bg-card-bg shadow-custom border border-light text-center max-w-4xl lg:mx-auto">
        <h2 className="text-xl font-black text-accent uppercase tracking-widest mb-3">
          Why Boost Your Ads?
        </h2>
        <p className="text-muted font-medium italic">
          Boosted ads appear higher in search results, reach more students, and
          convert appointments faster than standard listings.
        </p>
      </section>

      {/* Subscription Grid */}
      <section className="px-4 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-20 bg-card-bg rounded-report shadow-custom">
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
                adId={adId}
                styleIndex={index}
                onSelect={handleSelectPlan}
                disabled={subscribing}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
