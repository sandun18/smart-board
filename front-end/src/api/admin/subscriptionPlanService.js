import api from "../api";

/**
 * Admin endpoints for managing subscription plans
 * Attach JWT from localStorage keys used across auth flows.
 */

const resolveAuthToken = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("auth_token") ||
    "";

  if (!token || token === "null" || token === "undefined") {
    return "";
  }

  return token.replace(/^Bearer\s+/i, "").trim();
};

const getAuthHeaders = () => {
  const token = resolveAuthToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const getStoredUser = () => {
  try {
    const rawUser = localStorage.getItem("user_data");
    if (!rawUser || rawUser === "null" || rawUser === "undefined") {
      return null;
    }

    const parsedUser = JSON.parse(rawUser);
    return parsedUser && typeof parsedUser === "object" ? parsedUser : null;
  } catch (_error) {
    return null;
  }
};

const refreshAdminSessionIfPossible = async () => {
  try {
    const refreshToken = localStorage.getItem("refresh_token");
    const currentUser = getStoredUser();

    if (!refreshToken || currentUser?.role !== "ADMIN") {
      return false;
    }

    const response = await api.post("/auth/refresh", { refreshToken });

    const nextToken = response?.data?.token;
    const nextRefreshToken = response?.data?.refreshToken;
    const refreshedUser = response?.data?.user;

    if (!nextToken || !nextRefreshToken || !refreshedUser) {
      return false;
    }

    if (refreshedUser?.role !== "ADMIN") {
      return false;
    }

    localStorage.setItem("token", nextToken);
    localStorage.setItem("refresh_token", nextRefreshToken);
    localStorage.setItem("user_data", JSON.stringify(refreshedUser));
    return true;
  } catch (_error) {
    return false;
  }
};

const withAdminAuthRetry = async (requestFn) => {
  try {
    return await requestFn();
  } catch (error) {
    const statusCode = error?.response?.status;
    if (statusCode !== 401 && statusCode !== 403) {
      throw error;
    }

    const refreshed = await refreshAdminSessionIfPossible();
    if (!refreshed) {
      throw error;
    }

    return requestFn();
  }
};

const normalizeDeletePlanError = (error) => {
  const status = error?.response?.status;
  const payload = error?.response?.data || {};

  const safeCount = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
  };

  const ownerSubscriptionCount = safeCount(payload?.ownerSubscriptionCount);
  const subscriptionCount = safeCount(payload?.subscriptionCount);
  const reasonCode = String(payload?.reasonCode || "").trim();

  if (status === 409 && reasonCode === "SUBSCRIPTION_PLAN_IN_USE") {
    const detail =
      `This plan is currently used by ${ownerSubscriptionCount} owner subscription(s)` +
      ` and ${subscriptionCount} ad subscription(s).`;

    return {
      status,
      reasonCode,
      ownerSubscriptionCount,
      subscriptionCount,
      message: `${detail} Please deactivate the plan before deleting it.`,
    };
  }

  return {
    status,
    reasonCode,
    ownerSubscriptionCount,
    subscriptionCount,
    message:
      payload?.message ||
      payload?.error ||
      "Failed to delete subscription plan.",
  };
};

const toNumberOrNull = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const resolveDurationDays = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const text = String(value).trim();
  if (!text) {
    return null;
  }

  const firstToken = text.split(/\s+/)[0];
  const parsed = Number(firstToken);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.round(parsed);
};

const normalizeFeatures = (value) => {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\|\||\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const normalizePlan = (plan) => {
  const durationDays = resolveDurationDays(plan?.durationDays);
  const featuresList = normalizeFeatures(plan?.features);

  return {
    ...plan,
    durationDays,
    duration: durationDays ? `${durationDays} Days` : "",
    features: featuresList,
    featuresText: featuresList.join("\n"),
  };
};

const toPlanPayload = (planData) => {
  const durationDays = resolveDurationDays(
    planData?.durationDays ?? planData?.duration
  );

  return {
    name: String(planData?.name || "").trim(),
    price: toNumberOrNull(planData?.price),
    durationDays,
    description: String(planData?.description || "").trim(),
    features: normalizeFeatures(planData?.features),
    active: planData?.active ?? true,
  };
};

export const getAllPlans = async () => {
  try {
    const response = await withAdminAuthRetry(() =>
      api.get("/admin/subscription-plans", {
        headers: getAuthHeaders(),
      }),
    );
    return Array.isArray(response.data)
      ? response.data.map(normalizePlan)
      : [];
  } catch (error) {
    console.error("Failed to fetch subscription plans:", error);
    throw error;
  }
};

export const createPlan = async (planData) => {
  try {
    const payload = toPlanPayload(planData);

    const response = await withAdminAuthRetry(() =>
      api.post("/admin/subscription-plans", payload, {
        headers: getAuthHeaders(),
      }),
    );
    return normalizePlan(response.data);
  } catch (error) {
    console.error("Failed to create subscription plan:", error);
    throw error;
  }
};

export const updatePlan = async (id, planData) => {
  try {
    const payload = toPlanPayload(planData);

    const response = await withAdminAuthRetry(() =>
      api.put(`/admin/subscription-plans/${id}`, payload, {
        headers: getAuthHeaders(),
      }),
    );
    return normalizePlan(response.data);
  } catch (error) {
    console.error("Failed to update subscription plan:", error);
    throw error;
  }
};

export const deletePlan = async (id) => {
  const normalizedId = Number(
    (typeof id === "object" && id !== null
      ? id.subscriptionPlanId ?? id.planId ?? id.id
      : id)
  );
  if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
    const invalidIdError = new Error("Invalid subscription plan id for delete operation.");
    invalidIdError.normalized = {
      status: 400,
      reasonCode: "INVALID_SUBSCRIPTION_PLAN_ID",
      message: invalidIdError.message,
      ownerSubscriptionCount: 0,
      subscriptionCount: 0,
    };
    throw invalidIdError;
  }

  try {
    const response = await withAdminAuthRetry(() =>
      api.delete(`/admin/subscription-plans/${normalizedId}`, {
        headers: getAuthHeaders(),
      }),
    );
    return response.data;
  } catch (error) {
    console.error("Failed to delete subscription plan:", error);
    error.normalized = normalizeDeletePlanError(error);
    throw error;
  }
};

export const deactivatePlan = async (id) => {
  const normalizedId = Number(
    (typeof id === "object" && id !== null
      ? id.subscriptionPlanId ?? id.planId ?? id.id
      : id)
  );

  if (!Number.isFinite(normalizedId) || normalizedId <= 0) {
    throw new Error("Invalid subscription plan id for deactivate operation.");
  }

  try {
    const response = await withAdminAuthRetry(() =>
      api.patch(`/admin/subscription-plans/${normalizedId}/deactivate`, null, {
        headers: getAuthHeaders(),
      }),
    );
    return normalizePlan(response.data);
  } catch (error) {
    console.error("Failed to deactivate subscription plan:", error);
    throw error;
  }
};

/**
 * Public endpoint for viewing active subscription plans (any authenticated user)
 */
export const getActivePlans = async () => {
  try {
    const response = await api.get("/subscription-plans");
    return Array.isArray(response.data)
      ? response.data.map(normalizePlan)
      : [];
  } catch (error) {
    console.error("Failed to fetch active plans:", error);
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      "Failed to fetch active plans"
    );
  }
};

export const getPlanById = async (id) => {
  try {
    const response = await api.get(`/subscription-plans/${id}`);
    return normalizePlan(response.data);
  } catch (error) {
    console.error("Failed to fetch subscription plan:", error);
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      "Failed to fetch subscription plan"
    );
  }
};
