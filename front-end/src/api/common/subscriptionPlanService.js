import api from "../api";

/**
 * Public subscription plan endpoints for authenticated users.
 */
export const getActivePlans = async () => {
  const response = await api.get("/subscription-plans");
  return response.data;
};

export const getPlanById = async (id) => {
  const response = await api.get(`/subscription-plans/${id}`);
  return response.data;
};
