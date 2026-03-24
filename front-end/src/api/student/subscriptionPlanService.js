// Student subscription purchasing is currently disabled.
// This module intentionally exposes no-op helpers to avoid
// breaking existing imports while keeping the flow read-only.

export const createSubscriptionBuyIntent = async () => {
  throw new Error("Student subscription purchase is currently disabled.");
};

export const buySubscriptionPlan = async () => {
  throw new Error("Student subscription purchase is currently disabled.");
};

export const getCurrentSubscriptionPlan = async () => {
  // Student subscriptions are not tracked; always return null.
  return null;
};
