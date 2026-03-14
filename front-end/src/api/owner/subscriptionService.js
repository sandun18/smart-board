import api from "../api";

export const createSubscription = async (payload) => {
  try {
    const response = await api.post("/subscriptions", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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
