import { useState, useEffect, useMemo, useCallback } from "react";
import toast from "react-hot-toast";
// 1. Service Imports
import {
  getOwnerAppointments,
  updateAppointmentStatus,
} from "../../api/owner/service.js";
// 2. Auth Context Import
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext";
// 3. Mock Data (Fallback for avatar/images if backend doesn't send them yet)
import { ownerData as mockOwnerData } from "../../data/mockData";

const useAppointmentsLogic = () => {
  const { currentOwner } = useOwnerAuth();

  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ NEW: Search & Sort State
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("nearest"); // Default to Nearest

  // --- 1. Fetch & Map Data ---
  const fetchAppointments = useCallback(async () => {
    if (!currentOwner || !currentOwner.id) return;
    setLoading(true);
    try {
      const data = await getOwnerAppointments(currentOwner.id);

      const mappedData = data.map((dto) => ({
        id: dto.id,
        student: dto.studentName,
        boardingName: dto.boardingTitle,
        boardingAddress: dto.boardingAddress,
        numberOfStudents: dto.numberOfStudents,
        studentEmail: dto.studentEmail,
        ownerNote: dto.ownerNote,
        ownerStartTime: dto.ownerStartTime,
        ownerEndTime: dto.ownerEndTime,
        date: dto.requestedStartTime,
        time: dto.requestedStartTime,
        contact: dto.studentEmail,
        notes: dto.studentNote,
        status: mapBackendStatusToFrontend(dto.status),
        originalStart: dto.requestedStartTime,
        originalEnd: dto.requestedEndTime,
      }));

      setAppointments(mappedData);
      setError(null);
    } catch (err) {
      setError("Failed to load appointments.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentOwner]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // --- 2. Action Handlers ---
  const handleAction = async (id, actionType, decisionData = null) => {
    if (!currentOwner) return;

    const currentApp = appointments.find((app) => app.id === id);
    if (!currentApp) return;

    

    // Prepare DTO based on the decisionData passed from Modal
    let decisionDTO = {
      status: null,
      ownerStartTime: null,
      ownerEndTime: null,
      ownerNote: "",
    };

    if (actionType === "confirmed") {
      decisionDTO.status = "ACCEPTED";
      // ✅ Use the edited time from modal, or fallback to original
      decisionDTO.ownerStartTime =
        decisionData?.startTime || currentApp.originalStart;
      decisionDTO.ownerEndTime =
        decisionData?.endTime || currentApp.originalEnd;
      decisionDTO.ownerNote = decisionData?.note || "Request accepted.";
    } else if (actionType === "visited") {
      decisionDTO.status = "VISITED";
      decisionDTO.ownerNote = "Student has visited the property.";
    } else if (actionType === "rejected") {
      decisionDTO.status = "DECLINED";
      decisionDTO.ownerNote = decisionData?.note || "Slot unavailable.";
    }

    // Optimistic Update
    const previousState = [...appointments];
    setAppointments((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status: actionType } : app)),
    );

    const toastId = toast.loading("Updating status...");

    try {
      await updateAppointmentStatus(currentOwner.id, id, decisionDTO);
      toast.success("Status updated successfully!", { id: toastId });
    } catch (err) {
      setAppointments(previousState);
      toast.error("Failed to update status.", { id: toastId });
    }
  };

  // --- 3. Filtering & Sorting Logic ---
  const filteredAppointments = useMemo(() => {
    // 1. Filter by Status Tab (Pending, Confirmed, etc.)
    let result = appointments.filter((app) => app.status === filter);

    // 2. Filter by Search Query (Name or Boarding)
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(
        (app) =>
          app.student.toLowerCase().includes(lowerQuery) ||
          app.boardingName.toLowerCase().includes(lowerQuery),
      );
    }

    // 3. Sort by Date
    result.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      if (sortBy === "nearest") {
        // Ascending (Earliest date first)
        return dateA - dateB;
      } else if (sortBy === "furthest") {
        // Descending (Latest date first)
        return dateB - dateA;
      }
      return 0;
    });

    return result;
  }, [appointments, filter, searchQuery, sortBy]);

  // --- Helpers ---
  const mapBackendStatusToFrontend = (backendStatus) => {
    switch (backendStatus) {
      case "PENDING":
        return "pending";
      case "ACCEPTED":
        return "confirmed";
      case "DECLINED":
        return "rejected";
      case "CANCELLED":
        return "cancelled";
      case "VISITED":
        return "visited";
      default:
        return "pending";
    }
  };

  const counts = useMemo(() => {
    return appointments.reduce(
      (acc, app) => {
        acc[app.status] = (acc[app.status] || 0) + 1;
        return acc;
      },
      { pending: 0, confirmed: 0, visited: 0, cancelled: 0, rejected: 0 },
    );
  }, [appointments]);

  const formatDate = (d) => {
    if (!d) return "N/A";
    const dateObj = new Date(d);
    return isNaN(dateObj)
      ? d
      : dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatTime = (t) => {
    if (!t) return "N/A";
    const dateObj = new Date(t.includes("T") ? t : `2000-01-01T${t}`);
    return isNaN(dateObj)
      ? t
      : dateObj.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: {
        colorClass: "bg-accent",
        textClass: "text-accent",
        bgClass: "bg-accent/10",
      },
      confirmed: {
        colorClass: "bg-success",
        textClass: "text-success",
        bgClass: "bg-success/10",
      },
      visited: {
        colorClass: "bg-info",
        textClass: "text-info",
        bgClass: "bg-info/10",
      },
      cancelled: {
        colorClass: "bg-error",
        textClass: "text-error",
        bgClass: "bg-error/10",
      },
      rejected: {
        colorClass: "bg-warning",
        textClass: "text-warning",
        bgClass: "bg-warning/10",
      },
    };
    return styles[status] || styles.pending;
  };

  const activeOwnerData = {
    ...mockOwnerData,
    ...currentOwner,
  };

  return {
    appointments,
    filteredAppointments,
    counts,
    ownerData: activeOwnerData,
    filter,
    setFilter,
    handleAction,
    formatDate,
    formatTime,
    getStatusStyle,
    loading,
    error,
    // ✅ Export Search & Sort State
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
  };
};

export default useAppointmentsLogic;
