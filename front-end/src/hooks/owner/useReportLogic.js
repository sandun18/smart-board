import { useState, useEffect, useMemo } from "react";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext";
// ✅ FIXED: Imported createOwnerReport to match your service.js name
import { getOwnerReports, createOwnerReport } from "../../api/owner/service";

// 🛠️ HELPER: Fixes Backend vs Frontend mismatch
const normalizeStatus = (status) => {
  if (!status) return "PENDING";

  const s = String(status).toUpperCase();

  // Map typical Display Strings to Enums
  if (s === "NEW" || s === "PENDING") return "PENDING";
  if (s === "IN PROGRESS" || s === "IN_PROGRESS" || s === "UNDER_REVIEW")
    return "UNDER_REVIEW";
  if (s === "RESOLVED") return "RESOLVED";
  if (s === "DISMISSED") return "DISMISSED";
  if (s === "INVESTIGATING") return "INVESTIGATING";

  return "PENDING"; // Default fallback
};

const useReportLogic = () => {
  const { currentOwner } = useOwnerAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI State
  const [filter, setFilter] = useState("All");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Reports
  const fetchReports = async () => {
    if (!currentOwner?.id) return;
    setLoading(true);
    try {
      const data = await getOwnerReports(currentOwner.id);

      const safeData = Array.isArray(data) ? data : [];

      // Normalize the data immediately
      const cleanedData = safeData.map((report) => ({
        ...report,
        status: normalizeStatus(report.status),
      }));

      setReports(cleanedData);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load reports.");
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [currentOwner]);

  // 2. Submit Logic
  const submitNewReport = async (formData, files) => {
    if (!currentOwner?.id)
      return { success: false, message: "User not identified" };

    setIsSubmitting(true);
    try {
      const dataToSend = {
        ...formData,
        ownerId: currentOwner.id, // Service.js expects 'ownerId' for mapping to 'senderId'
      };

      // ✅ FIXED: Changed call from createReport to createOwnerReport
      await createOwnerReport(dataToSend, files);
      await fetchReports();
      return { success: true };
    } catch (error) {
      console.error("Submission error:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || "Failed to submit" 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Filter Logic
  const filteredReports = useMemo(() => {
    if (filter === "All") return reports;
    return reports.filter((rep) => rep.status === filter);
  }, [reports, filter]);

  return {
    reports,
    filteredReports,
    loading,
    error,
    isSubmitting,
    filter,
    setFilter,
    submitNewReport,
  };
};

export default useReportLogic;