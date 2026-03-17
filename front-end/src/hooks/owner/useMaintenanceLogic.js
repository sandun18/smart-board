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
  const [activeTab, setActiveTab] = useState("pending"); 
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchRequests = async () => {
    if (!currentOwner) return;
    setLoading(true);
    try {
      const data = await getOwnerMaintenanceRequests();
      
      // Ensure data is an array before mapping
      const dataArray = Array.isArray(data) ? data : [];

      const mapped = dataArray.map((item) => ({
        id: item.id,
        issueType: item.title,
        description: item.description,
        boardingName: item.boardingTitle,
        studentName: item.studentName,
        status: item.status ? item.status.toLowerCase() : "pending",
        urgency: item.maintenanceUrgency,
        image: item.imageUrls || [],
        roomNumber: item.roomNumber,
        date: item.createdAt,
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

  // Reset to page 1 whenever tab or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // 1. First, Filter and Sort the data
  const filteredRequests = useMemo(() => {
    const activeStatuses = ["pending", "assigned", "in_progress", "work_done", "paid"];
    
    return requests
      .filter((req) => {
        const s = req.status;
        const isPendingTab = activeTab === "pending";
        const isReqActive = activeStatuses.includes(s);

        // Tab Filtering
        if (isPendingTab && !isReqActive) return false;
        if (!isPendingTab && isReqActive) return false;

        // Search Filtering
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          return (
            req.issueType?.toLowerCase().includes(q) ||
            req.boardingName?.toLowerCase().includes(q) ||
            req.description?.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => b.id - a.id); // Sort Newest First
  }, [requests, activeTab, searchQuery]);

  // 2. Calculate total pages based on FILTERED results, not total requests
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;

  // 3. Slice the filtered data for the current page
  const paginatedRequests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(start, start + itemsPerPage);
  }, [filteredRequests, currentPage]);

  const handleStatusUpdate = async (id, newStatus) => {
    const originalRequests = [...requests];
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: newStatus.toLowerCase() } : r
      )
    );

    try {
      if (newStatus.toUpperCase() !== "ASSIGNED" && newStatus.toUpperCase() !== "COMPLETED") {
        await updateMaintenanceStatus(id, newStatus.toUpperCase(), "Updated via dashboard");
      } else {
        await fetchRequests(); // Refresh to get full tech details if modal was used
      }
    } catch (err) {
      setRequests(originalRequests);
      toast.error("Update failed.");
    }
  };

  return {
    paginatedRequests,
    activeTab,
    setActiveTab,
    handleStatusUpdate,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    loading,
  };
};

export default useMaintenanceLogic;