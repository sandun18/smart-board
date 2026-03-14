import React, { useState, useEffect } from "react";
import { FaCheck, FaStar, FaRocket, FaCrown } from "react-icons/fa";
import toast from "react-hot-toast";
import { getActivePlans } from "../../api/admin/subscriptionPlanService";

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
          per {plan.duration}
        </span>
      </div>

      <ul className="flex-1 space-y-4 mb-8">
        {plan.features && plan.features.split(',').map((feature, index) => (
          <li
            key={index}
            className="flex items-start gap-3 text-sm font-medium text-text"
          >
            <FaCheck className={`mt-1 shrink-0 ${style.colorClass}`} />
            <span>{feature.trim()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function StudentSubscriptionPlansPage() {
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
    <div className="min-h-screen bg-background-light">
      {/* Header */}
      <header className="bg-white shadow-custom mb-8">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-primary text-2xl md:text-3xl font-bold mb-1">
            Subscription Plans
          </h1>
          <p className="text-text-muted">
            View available boarding subscription plans.
          </p>
        </div>
      </header>

      {/* Plans Grid */}
      <section className="px-4 max-w-7xl mx-auto pb-12">
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
