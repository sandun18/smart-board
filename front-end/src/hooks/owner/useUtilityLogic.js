import { useState, useEffect, useMemo, useCallback } from "react";
import { getOwnerBoardings, updateUtilityBill } from "../../api/owner/service";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext";

export const useUtilityLogic = () => {
  const { currentOwner } = useOwnerAuth(); // 2. Get Current User

  // --- State ---
  const [boardings, setBoardings] = useState([]);
  const [selectedBoarding, setSelectedBoarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Form State
  const [formData, setFormData] = useState({
    electricity: "",
    water: "",
    period: "",
  });

  // --- 3. Fetch Data Effect ---
  const fetchBoardings = useCallback(async () => {
    // If no user is logged in yet, don't fetch
    if (!currentOwner) return;

    try {
      setLoading(true);
      
      // Call API to get boardings owned by this user
      const data = await getOwnerBoardings();
      
      // Map Backend Data to UI Structure
      // Since the standard Boarding entity might not have 'electricityCost' on top level yet,
      // we default them to 0 or check if your backend DTO sends a 'latestUtility' object.
      const formattedData = Array.isArray(data) ? data.map(b => ({
          ...b,
          // If your backend Boarding DTO doesn't have these fields, default them:
          electricityCost: b.latestUtility?.electricityCost || 0, 
          waterCost: b.latestUtility?.waterCost || 0,
          lastUpdated: b.latestUtility?.period || "N/A",
          // Ensure baseRent exists
          baseRent: b.rent || b.baseRent || 0 
      })) : [];

      setBoardings(formattedData);
      setError(null);
    } catch (err) {
      console.error("Failed to load boardings", err);
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  }, [currentOwner]);

  // Trigger fetch when user is ready
  useEffect(() => {
    fetchBoardings();
  }, [fetchBoardings]);


  // --- Calculations ---
  const totalUtility = (Number(formData.electricity) || 0) + (Number(formData.water) || 0);
  const totalMonthly = (selectedBoarding?.baseRent || 0) + totalUtility;

  // --- Filter Logic ---
  const filteredBoardings = useMemo(() => {
    return boardings.filter((b) => {
      const nameMatch = b.name?.toLowerCase() || "";
      const matchesSearch = nameMatch.includes(searchTerm.toLowerCase());
      
      const isUpdated = b.lastUpdated !== "N/A";
      let matchesStatus = true;
      
      if (filterStatus === "pending") matchesStatus = !isUpdated;
      if (filterStatus === "updated") matchesStatus = isUpdated;

      return matchesSearch && matchesStatus;
    });
  }, [boardings, searchTerm, filterStatus]);

  // --- Handlers ---

  const handleOpenModal = (boarding) => {
    setSelectedBoarding(boarding);
    setFormData({
      electricity: boarding.electricityCost || "",
      water: boarding.waterCost || "",
      period: boarding.lastUpdated !== "N/A" 
        ? boarding.lastUpdated 
        : new Date().toISOString().substring(0, 7),
    });
  };

  const handleCloseModal = () => {
    setSelectedBoarding(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentOwner) return;

    const payload = {
      boardingId: selectedBoarding.id,
      period: formData.period,
      electricityCost: Number(formData.electricity),
      waterCost: Number(formData.water),
    };

    try {
      // 1. Send to Backend
      const savedRecord = await updateUtilityBill(payload);

      // 2. Optimistically update the UI list
      setBoardings((prev) =>
        prev.map((b) =>
          b.id === selectedBoarding.id
            ? {
                ...b,
                electricityCost: savedRecord.electricityCost,
                waterCost: savedRecord.waterCost,
                lastUpdated: savedRecord.period,
              }
            : b
        )
      );
      
      alert("Bill saved successfully!");
      handleCloseModal();
      
    } catch (error) {
      console.error("Submission failed", error);
      alert("Failed to save bill. Please try again.");
    }
  };

  return {
    boardings,
    filteredBoardings,
    selectedBoarding,
    formData,
    setFormData,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    totalUtility,
    totalMonthly,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    loading,
    error // Return error state for UI handling
  };
};