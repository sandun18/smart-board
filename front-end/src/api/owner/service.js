import api from "../api";

// =================================================================
// 🚩 REPORT SERVICES
// =================================================================

// =================================================================
// 🚩 REPORT SERVICES
// =================================================================

export const getOwnerReports = async (ownerId) => {
  try {
    const response = await api.get(`/reports/sent/${ownerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};

export const createReport = async (reportData, files) => {
  try {
    const formData = new FormData();

    // ✅ FIX: Map keys exactly to Java 'ReportCreateDTO'
    formData.append("reportTitle", reportData.title);
    formData.append("reportDescription", reportData.description);
    formData.append("type", reportData.reportType); // e.g., "boarding", "safety"
    formData.append("severity", reportData.severity); // e.g., "HIGH", "LOW"

    // Backend wants Boarding NAME, not ID
    formData.append("boarding", reportData.boardingName);

    // ID Mapping
    formData.append("senderId", reportData.ownerId);
    formData.append("reportedUserId", reportData.studentId);

    // Date & Boolean
    formData.append("incidentDate", reportData.incidentDate); // YYYY-MM-DD
    formData.append("allowContact", reportData.allowContact); // true/false

    // Files
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("evidence", file);
      });
    }

    const response = await api.post("/reports", formData);
    return response.data;
  } catch (error) {
    console.error("Error creating report:", error);
    throw error;
  }
};


// =================================================================
// 🛠️ BOARDING SERVICES (Updated)
// =================================================================

// 1. Get all boardings owned by this user
export const getOwnerBoardings = async () => {
  try {
    // Matches @RequestMapping("/api/boardings/owner")
    const response = await api.get("/boardings/owner");
    return response.data;
  } catch (error) {
    console.error("Error fetching boardings:", error);
    throw error;
  }
};

// 2. Get Single Boarding (For Edit Page)
export const getBoardingById = async (boardingId) => {
  try {
    // ✅ CHANGED: We now use the PUBLIC endpoint found in BoardingController.java
    // Path is "/boardings/{id}" instead of "/boardings/owner/{id}"
    const response = await api.get(`/boardings/${boardingId}`);
    
    // Quick Fix: Map the typo 'bosted' from backend to 'isBoosted' for frontend
    const data = response.data;
    if (data.bosted !== undefined) {
        data.isBoosted = data.bosted;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching single boarding:", error);
    throw error;
  }
};

// 3. Create Boarding
export const createBoarding = async (boardingData) => {
  try {
    // Matches @PostMapping at /api/boardings/owner
    const response = await api.post("/boardings/owner", boardingData);
    return response.data;
  } catch (error) {
    console.error("Error creating boarding:", error);
    throw error;
  }
};

// 4. Update Boarding
export const updateBoarding = async (boardingId, updatedData) => {
  try {
    // Matches @PutMapping("/{boardingId}") at /api/boardings/owner
    const response = await api.put(`/boardings/owner/${boardingId}`, updatedData);
    return response.data;
  } catch (error) {
    console.error("Error updating boarding:", error);
    throw error;
  }
};

// 5. Delete Boarding
export const deleteBoarding = async (boardingId) => {
  try {
    // Matches @DeleteMapping("/{boardingId}") at /api/boardings/owner
    const response = await api.delete(`/boardings/owner/${boardingId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting boarding:", error);
    throw error;
  }
};

// 6. Boost Boarding
export const boostBoarding = async (boardingId, days) => {
  try {
    // Matches @PostMapping("/{boardingId}/boost")
    const response = await api.post(`/boardings/owner/${boardingId}/boost`, null, {
      params: { days }
    });
    return response.data;
  } catch (error) {
    console.error("Error boosting boarding:", error);
    throw error;
  }
};

// 7. Upload Images (Connects to FileController)
export const uploadBoardingImages = async (files) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    // Matches @PostMapping("/upload-multiple/{folder}") in FileController
    const response = await api.post("/files/upload-multiple/boarding-ads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // Returns List<String> URLs
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

// 8. Get Tenants (unchanged, assuming separate controller)
export const getBoardingTenants = async (boardingId) => {
  try {
    const response = await api.get(`/boardings/${boardingId}/tenants`);
    return response.data;
  } catch (error) {
    console.error("Error fetching tenants:", error);
    return [];
  }
};

// =================================================================
// 🛠️ MAINTENANCE SERVICES
// =================================================================

// 1. Get all maintenance requests for the logged-in Owner
// Matches Java: @GetMapping("/owner") inside MaintenanceController
// Note: No ownerId needed param; backend takes it from the token/auth
export const getOwnerMaintenanceRequests = async () => {
  try {
    const response = await api.get(`/maintenance/owner`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching maintenance requests:", error);
    throw error;
  }
};

// 2. Update the status of a request (Decide)
// Matches Java: @PutMapping("/owner/{maintenanceId}")
// Expects MaintenanceDecisionDTO body
export const updateMaintenanceStatus = async (id, status, ownerNote, updatedAt) => {
  // Ensure your payload matches MaintenanceDecisionDTO.java
  const payload = {
    status: status,
    ownerNote: ownerNote,
    updatedAt: updatedAt // 
  };

  const response = await api.put(`/maintenance/owner/${id}`, payload);
  return response.data;
};

// =================================================================
// 🗓️ APPOINTMENT SERVICES
// =================================================================

// 1. Get all appointments for a specific owner
// Matches Java: @GetMapping("/owner/{ownerId}")
export const getOwnerAppointments = async (ownerId) => {
  try {
    const response = await api.get(`/appointments/owner/${ownerId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// 2. Respond to an appointment (Accept/Decline)
// Matches Java: @PutMapping("/owner/{ownerId}/{appointmentId}")
// Expects AppointmentOwnerDecisionDTO body
export const updateAppointmentStatus = async (ownerId, appointmentId, decisionData) => {
  try {
    const response = await api.put(`/appointments/owner/${ownerId}/${appointmentId}`, decisionData);
    return response.data;
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

// --- TECHNICIAN DISCOVERY & WORKFLOW ---

// 1. Search Technicians
export const searchTechnicians = async (skill, city = "") => {
  const response = await api.get("/technician-workflow/search", {
    params: { skill: skill.toUpperCase(), city }
  });
  return response.data;
};

// 2. Assign Technician
export const assignTechnician = async (maintenanceId, technicianId) => {
  const response = await api.put(`/technician-workflow/${maintenanceId}/assign/${technicianId}`);
  return response.data;
};

// 3. Review Technician (Job Complete)
export const reviewTechnician = async (maintenanceId, rating, comment) => {
    // Note: The controller now takes params directly, no ownerId needed in path
    const response = await api.post(`/technician-workflow/${maintenanceId}/review`, null, {
        params: { rating, comment }
    });
    return response.data;
};

// =================================================================
// 📝 REGISTRATION SERVICES
// =================================================================

// 1. Get all registrations for the owner
// Matches Java: @GetMapping("/api/registrations/owner/{ownerId}")
export const getOwnerRegistrations = async (ownerId) => {
  try {
    const response = await api.get(`/registrations/owner/${ownerId}`);
    return response.data; //
  } catch (error) {
    console.error("Error fetching registrations:", error);
    throw error;
  }
};

// 2. Decide on a registration (Accept/Reject)
// Matches Java: @PutMapping("/api/registrations/owner/{ownerId}/{regId}")
export const decideRegistration = async (ownerId, regId, decisionDTO) => {
  try {
    const response = await api.put(`/registrations/owner/${ownerId}/${regId}`, decisionDTO);
    return response.data; //
  } catch (error) {
    console.error("Error updating registration status:", error);
    throw error;
  }
};

// =================================================================
// 👤 PROFILE SERVICES (NEW)
// =================================================================

// 1. Get Owner Profile
// Matches Java: @GetMapping("/api/owner/profile")
export const getOwnerProfile = async () => {
  try {
    const response = await api.get("/owner/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching owner profile:", error);
    throw error;
  }
};

// 2. Update Owner Profile
// Matches Java: @PutMapping("/api/owner/profile")
export const updateOwnerProfile = async (profileData) => {
  try {
    const response = await api.put("/owner/profile", profileData);
    return response.data;
  } catch (error) {
    console.error("Error updating owner profile:", error);
    throw error;
  }
};

// =================================================================
//  AUTH SERVICES (Password Change)
// =================================================================

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

// =================================================================
// 💡 UTILITY SERVICES
// =================================================================

// 1. Save or Update a Utility Bill
// Matches Java: @PostMapping("/api/owner/utilities")
export const updateUtilityBill = async (utilityData) => {
  try {
    const response = await api.post("/owner/utilities", utilityData);
    return response.data;
  } catch (error) {
    console.error("Error updating utility bill:", error);
    throw error;
  }
};

// 2. Get Utility History for a specific Boarding House
// Matches Java: @GetMapping("/api/owner/utilities/history/{boardingId}")
export const getUtilityHistory = async (boardingId) => {
  try {
    const response = await api.get(`/owner/utilities/history/${boardingId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching utility history:", error);
    throw error;
  }
};
