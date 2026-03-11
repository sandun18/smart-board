// import { useState, useMemo, useEffect } from "react";
// import { useOwnerAuth } from "../../context/owner/OwnerAuthContext";
// import {
//   getOwnerMaintenanceRequests,
//   updateMaintenanceStatus,
// } from "../../api/owner/service";

// const useMaintenanceLogic = () => {
//   // --- STATE ---
//   const { currentOwner } = useOwnerAuth();
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [activeTab, setActiveTab] = useState("pending");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   // --- API CALLS ---
//   useEffect(() => {
//     const fetchRequests = async () => {
//       // We don't need currentOwner.id for the API call anymore (handled by token),
//       // but we still check if auth is ready.
//       if (!currentOwner) return;

//       try {
//         setLoading(true);
//         const rawData = await getOwnerMaintenanceRequests();

//         // 🔄 MAPPER: Convert Java DTO keys to Frontend keys
//         // Java: title, boardingTitle, imageUrls, maintenanceUrgency
//         // UI:   issueType, boardingName, image, urgency
//         const mappedData = (rawData || []).map((item) => ({
//           id: item.id,
//           issueType: item.title, // Map 'title' -> 'issueType'
//           description: item.description,
//           boardingName: item.boardingTitle, // Map 'boardingTitle' -> 'boardingName'
//           studentName: item.studentName,
//           status: item.status,
//           urgency: item.maintenanceUrgency, // Map 'maintenanceUrgency' -> 'urgency'
//           image: item.imageUrls || [], // Map 'imageUrls' -> 'image'
//           roomNumber: item.roomNumber,
//           date: item.createdDate,
//         }));

//         setRequests(mappedData);
//         setError(null);
//       } catch (err) {
//         console.error("Fetch error:", err);
//         setError("Could not load maintenance requests.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequests();
//   }, [currentOwner]);

//   const handleStatusUpdate = async (id, newStatus) => {
//     // 1. Optimistic Update
//     const originalRequests = [...requests];
//     const statusToSend = newStatus.toUpperCase();

//     setRequests((prev) =>
//       prev.map((req) =>
//         req.id === id ? { ...req, status: statusToSend } : req
//       )
//     );

//     try {
//       // 2. Send to Backend
//       // Passing empty note "" for now as UI doesn't have a note input yet
//       await updateMaintenanceStatus(id, statusToSend, "");
//     } catch (err) {
//       console.error("Update failed:", err);
//       setRequests(originalRequests); // Revert on error
//       alert("Failed to update status. Please try again.");
//     }
//   };

//   // --- FILTERING & SORTING ---
//   const filteredRequests = useMemo(() => {
//     let result = requests.filter((req) => {
//       const reqStatus = req.status ? req.status.toLowerCase() : "pending";

//       const isPendingTab = activeTab === "pending";
//       // Allow "pending", "in_progress", and "in-progress" for the first tab
//       const isReqPending = ["pending", "in_progress", "in-progress"].includes(
//         reqStatus
//       );
//       const isReqCompleted = ["completed", "resolved"].includes(reqStatus);

//       if (isPendingTab && !isReqPending) return false;
//       if (!isPendingTab && !isReqCompleted) return false;

//       if (!searchQuery) return true;
//       const q = searchQuery.toLowerCase();

//       return (
//         (req.issueType && req.issueType.toLowerCase().includes(q)) ||
//         (req.boardingName && req.boardingName.toLowerCase().includes(q))
//       );
//     });

//     // Sort by ID descending (newest first) since Date is missing in DTO
//     return result.sort((a, b) => b.id - a.id);
//   }, [requests, activeTab, searchQuery]);

//   // --- PAGINATION ---
//   const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
//   const paginatedRequests = useMemo(() => {
//     const start = (currentPage - 1) * itemsPerPage;
//     return filteredRequests.slice(start, start + itemsPerPage);
//   }, [filteredRequests, currentPage]);

//   useEffect(() => setCurrentPage(1), [activeTab, searchQuery]);

//   return {
//     paginatedRequests,
//     activeTab,
//     setActiveTab,
//     handleStatusUpdate,
//     searchQuery,
//     setSearchQuery,
//     currentPage,
//     setCurrentPage,
//     totalPages,
//     loading,
//     error,
//   };
// };

// export default useMaintenanceLogic;

import { useState, useEffect, useMemo } from "react";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext";
import {
  getOwnerMaintenanceRequests,
  updateMaintenanceStatus,
} from "../../api/owner/service";
import toast from "react-hot-toast";

const useMaintenanceLogic = () => {
  const { currentOwner } = useOwnerAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending"); // pending | completed
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 1. Fetch Requests
  const fetchRequests = async () => {
    if (!currentOwner) return;
    setLoading(true);
    try {
      const data = await getOwnerMaintenanceRequests();

      // Map Backend Data to UI Format
      const mapped = data.map((item) => ({
        id: item.id,
        issueType: item.title,
        description: item.description,
        boardingName: item.boardingTitle,
        studentName: item.studentName,
        status: item.status ? item.status.toLowerCase() : "pending",
        urgency: item.maintenanceUrgency,
        image: item.imageUrls || [],
        roomNumber: item.roomNumber,
        date: item.createdDate,
        // Technician Fields (Important for Review flow)
        technicianName: item.technicianName,
        technicianFee: item.technicianFee,
        technicianId: item.technicianId,
      }));

      setRequests(mapped);
    } catch (err) {
      console.error(err);
      toast.error("Could not load maintenance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentOwner]);

  // 2. Status Update Handler
  const handleStatusUpdate = async (id, newStatus) => {
    // 1. Capture the current date immediately
    const now = new Date();
    const isoDate = now.toISOString(); // e.g., "2023-10-27T10:00:00.000Z"

    // 2. Optimistic Update
    const originalRequests = [...requests];
    const statusToSend = newStatus.toUpperCase();

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id 
          ? { 
              ...r, 
              status: newStatus.toLowerCase(), 
              updatedDate: isoDate // <--- ADDS THE DATE TO UI INSTANTLY
            } 
          : r,
      ),
    );

    try {
      // If it's a simple status change (like verifying completion), call API
      // Note: 'ASSIGNED' and 'COMPLETED' are usually handled by the Modals directly calling the service.
      // This is a fallback for manual status changes if you have them.
      if (newStatus !== "ASSIGNED" && newStatus !== "COMPLETED") {
        await updateMaintenanceStatus(
          id,
          newStatus.toUpperCase(),
          "Status updated by owner",
        );
      } else {
        // If modal handled it, just refresh data to be safe
        fetchRequests();
      }
    } catch (err) {
      setRequests(oldRequests); // Revert on failure
      toast.error("Update failed.");
    }
  };

  // 3. Filtering Logic
  const paginatedRequests = useMemo(() => {
    let filtered = requests.filter((req) => {
      // Tab Logic
      const s = req.status;
      const isPendingTab = activeTab === "pending";

      // Pending Tab shows: Pending, Assigned, In Progress, Paid (Wait for review)
      const activeStatuses = [
        "pending",
        "assigned",
        "in_progress",
        "work_done",
        "paid",
      ];
      const isReqActive = activeStatuses.includes(s);

      if (isPendingTab && !isReqActive) return false;
      if (!isPendingTab && isReqActive) return false; // Completed Tab

      // Search Logic
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          req.issueType?.toLowerCase().includes(q) ||
          req.boardingName?.toLowerCase().includes(q)
        );
      }
      return true;
    });

    // Sort by ID desc (Newest first)
    filtered.sort((a, b) => b.id - a.id);

    // Pagination
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [requests, activeTab, searchQuery, currentPage]);

  const totalPages = Math.ceil(requests.length / itemsPerPage);

  return {
    paginatedRequests,
    activeTab,
    setActiveTab,
    handleStatusUpdate, // Pass this to the Card
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
  };
};

export default useMaintenanceLogic;
