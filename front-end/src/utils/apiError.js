export const getApiErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  if (!error) return fallback;

  // Network error or backend down.
  if (!error.response) {
    return "Cannot reach backend. Make sure the API server is running and VITE_API_BASE is correct.";
  }

  const status = error.response.status;
  const data = error.response.data;

  if (typeof data === "string" && data.trim()) {
    return data;
  }

  if (data?.message) {
    return data.message;
  }

  if (status === 401) return "Your session expired. Please log in again.";
  if (status === 403) return "You are not allowed to perform this action.";
  if (status === 404) return "Requested API endpoint was not found.";
  if (status >= 500) return "Server error occurred while processing your request.";

  return fallback;
};
