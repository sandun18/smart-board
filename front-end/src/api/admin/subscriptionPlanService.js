import api from "../api";

/**
 * Admin endpoints for managing subscription plans
 */
export const getAllPlans = async () => {
  const response = await api.get("/admin/subscription-plans");
  return response.data;
};

export const createPlan = async (planData) => {
  const response = await api.post("/admin/subscription-plans", {
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
  const response = await api.put(`/admin/subscription-plans/${id}`, {
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
  const response = await api.delete(`/admin/subscription-plans/${id}`);
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
