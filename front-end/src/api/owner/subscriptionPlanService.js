import api from "../api";

/**
 * Owner endpoints for managing subscription plans.
 */
export const getAllPlans = async () => {
  const response = await api.get("/owner/subscription-plans");
  return response.data;
};

export const createPlan = async (planData) => {
  const response = await api.post("/owner/subscription-plans", {
    name: planData.name,
    price: Number(planData.price) || 0,
    durationDays: Number(planData.durationDays) || 0,
    description: planData.description || "",
    features: planData.features || [],
    active: planData.active !== undefined ? planData.active : true,
  });
  return response.data;
};

export const updatePlan = async (id, planData) => {
  const response = await api.put(`/owner/subscription-plans/${id}`, {
    name: planData.name,
    price: Number(planData.price) || 0,
    durationDays: Number(planData.durationDays) || 0,
    description: planData.description || "",
    features: planData.features || [],
    active: planData.active !== undefined ? planData.active : true,
  });
  return response.data;
};

export const deletePlan = async (id) => {
  const response = await api.delete(`/owner/subscription-plans/${id}`);
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
