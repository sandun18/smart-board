import React, { useState, useEffect } from "react";
import { FaCheck, FaStar, FaRocket, FaCrown } from "react-icons/fa";
import toast from "react-hot-toast";
import { getActivePlans } from "../../api/admin/subscriptionPlanService";
import HeaderBar from "../../components/Owner/common/HeaderBar.jsx";

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

const PlanCard = ({ plan, styleIndex }) => {
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
        onClick={() => {
          toast.success(`Selected: ${plan.name}`);
        }}
        className={`
          w-full py-4 text-xs font-black uppercase tracking-widest rounded-full text-white shadow-lg transition-all active:scale-95
          ${style.bgClass} hover:brightness-110
        `}
      >
        Select {plan.name}
      </button>
    </div>
  );
};

export default function ViewSubscriptionPlansPage() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

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
              <PlanCard key={plan.id} plan={plan} styleIndex={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
