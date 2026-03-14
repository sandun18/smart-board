import api from "../api";

export const createSubscriptionBuyIntent = async (planId) => {
  const response = await api.post(`/student/subscription-plans/${planId}/buy-intent`);
  return response.data;
};

export const buySubscriptionPlan = async (planId) => {
  const response = await api.post(`/student/subscription-plans/${planId}/buy`);
  return response.data;
};

export const getCurrentSubscriptionPlan = async () => {
  const response = await api.get("/student/subscription-plans/current");
  return response.data;
};
