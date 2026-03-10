import api from "../api";

const StudentService = {
  // ==========================================
  // 1. AUTHENTICATION (Called by Context)
  // ==========================================
  updateProfile: async (userId, data) => {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  // ==========================================
  // 2. REPORTS
  // ==========================================
  getSentReports: async (studentId) => {
    const response = await api.get(`/reports/sent/${studentId}`);
    return response.data;
  },

  createReport: async (formData) => {
    const response = await api.post("/reports", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  // ==========================================
  // 3. BOARDINGS (Search & Details)
  // ==========================================
  searchBoardings: async (filters) => {
    let backendBoardingType = null;
    if (filters.roomTypes && filters.roomTypes.length > 0) {
      const selected = filters.roomTypes[0].toLowerCase();
      if (selected === "apartment") backendBoardingType = "ANEX";
      else if (selected === "single" || selected === "shared")
        backendBoardingType = "ROOM";
    }

    const params = {
      addressKeyword: filters.searchQuery || null,
      minPrice: filters.minPrice > 0 ? filters.minPrice : null,
      maxPrice: filters.maxPrice < 50000 ? filters.maxPrice : null,
      genderType:
        filters.gender !== "any" ? filters.gender?.toUpperCase() : null,
      boardingType: backendBoardingType,
      page: 0,
      size: 50,
    };

    Object.keys(params).forEach(
      (key) => params[key] == null && delete params[key],
    );

    const response = await api.get("/boardings/search", { params });
    return response.data;
  },

  getBoardingDetails: async (id) => {
    const response = await api.get(`/boardings/${id}`);
    return response.data;
  },

  // ✅ ADDED: This is needed for RegistrationModal to auto-fetch price
  getBoarding: async (id) => {
    const response = await api.get(`/boardings/${id}`);
    return response.data;
  },

  // ==========================================
  // 4. APPOINTMENTS (Visits)
  // ==========================================
  createAppointment: async (studentId, appointmentData) => {
    const start = new Date(
      `${appointmentData.visitDate}T${appointmentData.visitTime}`,
    );
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    const toIsoString = (date) => {
      const pad = (num) => String(num).padStart(2, "0");
      const year = date.getFullYear();
      const month = pad(date.getMonth() + 1);
      const day = pad(date.getDate());
      const hours = pad(date.getHours());
      const minutes = pad(date.getMinutes());
      return `${year}-${month}-${day}T${hours}:${minutes}:00`;
    };

    const payload = {
      boardingId: appointmentData.boardingId,
      numberOfStudents: 1,
      requestedStartTime: toIsoString(start),
      requestedEndTime: toIsoString(end),
      studentNote: appointmentData.visitNotes,
    };

    const response = await api.post(
      `/appointments/student/${studentId}`,
      payload,
    );
    return response.data;
  },

  getMyAppointments: async (studentId) => {
    const response = await api.get(`/appointments/student/${studentId}`);
    return response.data;
  },

  cancelAppointment: async (studentId, appointmentId, reason) => {
    const response = await api.put(
      `/appointments/student/${studentId}/${appointmentId}/cancel`,
      { reason: reason },
    );
    return response.data;
  },

  markAsVisited: async (studentId, appointmentId) => {
    const response = await api.put(
      `/appointments/student/${studentId}/${appointmentId}/visit`,
    );
    return response.data;
  },

  selectBoarding: async (studentId, appointmentId) => {
    const response = await api.put(
      `/appointments/student/${studentId}/${appointmentId}/select`,
    );
    return response.data;
  },

  rejectBoarding: async (studentId, appointmentId) => {
    const response = await api.put(
      `/appointments/student/${studentId}/${appointmentId}/reject`,
    );
    return response.data;
  },

  // ==========================================
  // 5. REGISTRATIONS & DASHBOARD (New Section)
  // ==========================================

  registerBoarding: async (studentId, data) => {
    const response = await api.post(
      `/registrations/student/${studentId}`,
      data,
    );
    return response.data;
  },

  // ✅ ADDED: Needed for 'My Boardings' Page list
  getRegistrations: async (studentId) => {
    const response = await api.get(`/registrations/student/${studentId}`);
    return response.data;
  },

  // ✅ ADDED: Needed for 'My Boardings' to get Members List
  getDashboard: async (regId) => {
    const response = await api.get(`/registrations/${regId}/dashboard`);
    return response.data;
  },

  downloadReceipt: async (regId) => {
    const response = await api.get(`/registrations/${regId}/receipt`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Receipt_${regId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  },

  requestLeave: async (studentId, regId) => {
    const response = await api.post(
      `/registrations/student/${studentId}/leave/${regId}`,
    );
    return response.data;
  },

  // ==========================================
  // 6. REVIEWS (Ratings)
  // ==========================================
  uploadReviewImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      // Endpoint: POST /api/files/upload-multiple/{folder}
      const response = await api.post(
        "/files/upload-multiple/reviews",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data; // List of S3 URLs
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  },

  submitReview: async (reviewData) => {
    const payload = {
      studentId: reviewData.userId,
      boardingId: reviewData.boardingId,
      rating: reviewData.rating,
      comment: reviewData.review,
      imageUrls: reviewData.imageUrls || [],
    };
    const response = await api.post("/reviews", payload);
    return response.data;
  },

  updateReview: async (reviewData) => {
    const payload = {
      rating: reviewData.rating,
      comment: reviewData.review,
      imageUrls: reviewData.imageUrls || [],
    };
    // Match backend: PUT /api/reviews/student/{sid}/boarding/{bid}
    const response = await api.put(
      `/reviews/student/${reviewData.userId}/boarding/${reviewData.boardingId}`,
      payload,
    );
    return response.data;
  },

  getBoardingReviews: async (boardingId) => {
    const response = await api.get(`/reviews/boarding/${boardingId}`);
    return response.data;
  },

  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // ==========================================
  // 7. MAINTENANCE (New Section)
  // ==========================================

  getMaintenanceRequests: async () => {
    const response = await api.get("/maintenance/student");
    return response.data;
  },

  uploadMaintenanceImages: async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      // Uses your existing file upload endpoint, saving to 'maintenance' folder
      const response = await api.post(
        "/files/upload-multiple/maintenance",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data; // Returns List<String> (URLs)
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    }
  },

  createMaintenanceRequest: async (data) => {
    // data must match MaintenanceCreateDTO: { boardingId, title, description, issueType, maintenanceUrgency, imageUrls }
    const response = await api.post("/maintenance", data);
    return response.data;
  },

  // ==========================================
  // 8. PROFILE & SETTINGS
  // ==========================================

  // 1. Get Profile (Fresh Data)
  getProfile: async () => {
    const userData = JSON.parse(localStorage.getItem("user_data"));
    if (!userData?.id) throw new Error("No user logged in");

    const response = await api.get(`/users/${userData.id}`);
    return response.data;
  },

  // Update profile (text fields)
  updateProfile: async (userId, updateData) => {
  
  const cleanData = Object.fromEntries(
    Object.entries(updateData).filter(([_, v]) => v != null && v !== '')
  );
  
  const response = await api.put(`/users/${userId}`, cleanData);
  return response.data;
},

  // Upload profile picture (Base64)
  uploadAvatar: async (userId, file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64String = e.target.result;

          // Send base64 to backend
          const response = await api.put(`/users/${userId}`, {
            profileImageBase64: base64String,
          });

          resolve(response.data);
        } catch (error) {
          console.error('Avatar upload error:', error);
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error("File read failed"));
      reader.readAsDataURL(file);
    });
  },

  // ==========================================
  // 9. DASHBOARD API CALLS
  // ==========================================

  // 1. Get All Appointments (for Upcoming Visits widget)
  getAllAppointments: async (studentId) => {
    const response = await api.get(`/appointments/student/${studentId}`);
    return response.data;
  },

  // 2. Get All Registrations (for Current Boarding widget)
  getAllRegistrations: async (studentId) => {
    const response = await api.get(`/registrations/student/${studentId}`);
    return response.data;
  },

  // 3. Get Specific Registration Dashboard (for Payment widget)
  getRegistrationDashboard: async (regId) => {
    const response = await api.get(`/registrations/${regId}/dashboard`);
    return response.data;
  },

  // 4. Get Payment History (for Recent Activity)
  getPaymentHistory: async () => {
    const response = await api.get("/payments/history");
    return response.data;
  },

  // 5. Get My Reviews (for Reviews widget)
  getMyReviews: async (studentId) => {
    // Falls back to empty array if endpoint doesn't exist yet
    try {
      const response = await api.get(`/reviews/student/${studentId}`);
      return response.data;
    } catch (e) {
      console.warn("Review endpoint not ready", e);
      return [];
    }
  },
};

export default StudentService;
