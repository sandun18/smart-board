import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getCurrentSubscriptionPlan } from "../../../api/owner/subscriptionPlanService";

/**
 * Ensures the owner has an active subscription plan before accessing child routes.
 * Routes that are part of the subscription flow itself should NOT be wrapped by this.
 */
const OwnerSubscriptionGuard = () => {
  const [checking, setChecking] = useState(true);
  const [hasPlan, setHasPlan] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;

    const checkPlan = async () => {
      setChecking(true);
      setError(null);
      try {
        const plan = await getCurrentSubscriptionPlan();
        if (!cancelled) {
          setHasPlan(Boolean(plan && plan.id));
        }
      } catch (err) {
        if (!cancelled) {
          // If backend says "not found", treat as no active plan but not a fatal error
          const status = err?.response?.status;
          if (status === 404) {
            setHasPlan(false);
          } else {
            setError("Failed to verify subscription status.");
          }
        }
      } finally {
        if (!cancelled) {
          setChecking(false);
        }
      }
    };

    checkPlan();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-light">
        <div className="w-10 h-10 border-4 rounded-full border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (error) {
    // If there was an unexpected error, let the user proceed rather than blocking everything
    return <Outlet />;
  }

  if (!hasPlan) {
    return (
      <Navigate
        to="/owner/subscription-plans"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
};

export default OwnerSubscriptionGuard;

