export const normalizeFeatures = (features) => {
  if (Array.isArray(features)) {
    return features
      .map((item) =>
        typeof item === "string" ? item.trim() : String(item).trim(),
      )
      .filter(Boolean);
  }

  if (typeof features === "string") {
    return features
      .split(/\|\||,|\r?\n/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

export const getDurationDays = (plan, fallback = 30) => {
  if (plan?.durationDays !== undefined && plan?.durationDays !== null) {
    const parsedDurationDays = Number(plan.durationDays);
    return Number.isFinite(parsedDurationDays) && parsedDurationDays > 0
      ? parsedDurationDays
      : fallback;
  }

  if (typeof plan?.duration === "string" && plan.duration.trim()) {
    const parsed = parseInt(plan.duration.trim().split(/\s+/)[0], 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  return fallback;
};

export const getDurationLabel = (plan) => {
  const days = getDurationDays(plan, null);
  if (days !== null && days !== undefined) {
    return `${days} Days`;
  }

  if (typeof plan?.duration === "string" && plan.duration.trim()) {
    return plan.duration.trim();
  }

  return "N/A";
};

