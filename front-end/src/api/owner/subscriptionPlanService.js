import api from "../api";

/**
 * Owner endpoints for browsing and purchasing subscription plans.
 */
export const createSubscriptionBuyIntent = async (planId) => {
  const response = await api.post(`/owner/subscription-plans/${planId}/buy-intent`);
  return response.data;
};

export const buySubscriptionPlan = async (planId) => {
  const response = await api.post(`/owner/subscription-plans/${planId}/buy`);
  return response.data;
};

export const getCurrentSubscriptionPlan = async () => {
  const response = await api.get("/owner/subscription-plans/current");
  return response.data;
};

/**
 * Public endpoint for viewing active subscription plans (any authenticated user)
 */
export const getActivePlans = async () => {
  const response = await api.get("/subscription-plans");
  return response.data;
};

export const getPlanById = async (id) => {
  const response = await api.get(`/subscription-plans/${id}`);
  return response.data;
};
