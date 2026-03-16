import api from "../api";

// 1. Get Technician Profile
export const getTechnicianProfile = async () => {
  const response = await api.get("/technician-workflow/profile");
  return response.data;
};

// 2. Get Assigned Jobs
export const getTechnicianJobs = async () => {
  const response = await api.get("/technician-workflow/my-jobs");
  return response.data;
};

// 3. NEW: Get Reviews
export const getTechnicianReviews = async (technicianId = null) => {
  try {
    // If no ID = get authenticated user's reviews
    // If ID provided = get public reviews for that technician
    const endpoint = technicianId 
      ? `/technician-workflow/${technicianId}/reviews`
      : "/technician-workflow/reviews";
    
    const response = await api.get(endpoint);
    return response.data || [];
  } catch (error) {
    console.error("Error fetching reviews:", {
      status: error.response?.status,
      message: error.response?.data,
      technicianId,
    });
    return []; // Return empty array instead of throwing
  }
};

// 4. Accept or Reject Job
export const respondToJob = async (maintenanceId, accept, reason = null) => {
  const response = await api.put(`/technician-workflow/${maintenanceId}/decision`, null, {
    params: { accept, reason }
  });
  return response.data;
};

// 5. Complete Job & Send Bill
export const completeJob = async (maintenanceId, amount) => {
  const response = await api.put(`/technician-workflow/${maintenanceId}/complete`, null, {
    params: { amount }
  });
  return response.data;
};

// 6. Create Report (Against Owner)
export const createTechnicianReport = async (formData) => {
  const token = localStorage.getItem('token');
  const response = await api.post("/reports", formData, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// 7. Update Profile
export const updateTechnicianProfile = async (data) => {
  const response = await api.put("/users/profile", data); // Assuming generic user profile endpoint
  return response.data;
};