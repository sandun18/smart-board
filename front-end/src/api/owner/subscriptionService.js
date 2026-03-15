import api from "../api";

export const createSubscription = async (planId) => {
  try {
    const normalizedPlanId =
      typeof planId === "object" && planId !== null
        ? planId.subscriptionPlanId ?? planId.planId ?? planId.id
        : planId;

    const requestBody = {
      subscriptionPlanId: normalizedPlanId,
    };

    const response = await api.post("/owner/subscriptions", requestBody);

    return response.data;
  } catch (error) {
    console.error("Subscription creation error:", error);
    
    if (error.response) {
      // Server responded with error status
      const errorMessage = 
        error.response.data?.message ||
        error.response.data?.error ||
        `Request failed with status ${error.response.status}`;
      throw new Error(errorMessage);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error("No response from server. Please check your connection.");
    } else {
      // Something else happened
      throw new Error("Failed to create subscription");
    }
  }
};

export const getOwnerSubscriptions = async (ownerId) => {
  try {
    const response = await api.get(`/subscriptions/owner/${ownerId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch owner subscriptions:", error);
    throw error;
  }
};

export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await api.delete(`/subscriptions/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to cancel subscription:", error);
    throw error;
  }
};

export const getSubscriptionById = async (subscriptionId) => {
  try {
    const response = await api.get(`/subscriptions/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch subscription:", error);
    throw error;
  }
};
