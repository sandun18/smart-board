import { useState, useEffect } from "react";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext.jsx";
import {
  getOwnerBoardings,
  getBoardingTenants,
  createBoarding,
  updateBoarding,
  deleteBoarding,
} from "../../api/owner/service.js";

const useBoardingLogic = () => {
  const [rawBoardings, setRawBoardings] = useState([]);
  const [boardings, setBoardings] = useState([]);

  const [viewMode, setViewMode] = useState("grid");
  const [activeModal, setActiveModal] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { currentOwner } = useOwnerAuth();

  // --- 1. Fetch Data (READ) ---
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!currentOwner || !currentOwner.id) {
      console.warn("No owner logged in, skipping fetch.");
      return;
    }

    setIsLoading(true);
    try {
      // API CALL
      const data = await getOwnerBoardings(currentOwner.id);

      // Handle response structure (Spring Boot 'Page' vs List)
      // If your backend returns Page<DTO>, the list is in .content
      const backendList = Array.isArray(data) ? data : data.content || [];

      setRawBoardings(backendList);
    } catch (error) {
      console.error("Failed to load boardings", error);
    } finally {
      setIsLoading(false);
    }
  };

  // --- 2. Mapper (Backend -> Frontend) ---
  // Runs automatically whenever raw data changes
  useEffect(() => {
    const formatted = rawBoardings.map((b) => ({
      id: b.id,
      name: b.title, // Backend: title -> Frontend: name
      address: b.address,
      rent: `LKR ${b.pricePerMonth ? b.pricePerMonth.toLocaleString() : "0"}`,
      availableRooms: b.availableSlots, // Backend: availableSlots
      maxOccupants: b.maxOccupants,
      status: b.status ? b.status.toLowerCase() : "active",

      // Image Handling: Backend sends list, we take first
      image:
        b.imageUrls && b.imageUrls.length > 0
          ? b.imageUrls[0]
          : "https://via.placeholder.com/300",

      // Raw data for editing forms
      description: b.description,
      genderType: b.genderType,
      boardingType: b.boardingType,

      // Tenant logic (Placeholder until you link the getTenants API)
      // rating: 4.5,
      totalTenants: 0,
      tenantsList: [],
    }));
    setBoardings(formatted);
  }, [rawBoardings]);

  // --- Actions ---
  const openTenantsModal = async (property) => {
    // 1. Open modal immediately with placeholder data
    setSelectedProperty({ ...property, tenantsList: [] });
    setActiveModal("tenants");

    try {
      // 2. Fetch real tenants from Backend
      const tenantsData = await getBoardingTenants(property.id);

      // 3. Map Backend Tenant Data -> Frontend UI format
      // (Adjust 't.username', 't.contactNo' based on your User Entity)
      const formattedTenants = tenantsData.map((t) => ({
        id: t.userId || t.id,
        name: t.username || t.name || "Unknown",
        email: t.email,
        phone: t.contactNo || t.phone || "N/A",
        joinedDate: t.joinedDate || "N/A", // Ensure backend sends this or format it
      }));

      // 4. Update the selected property with real data
      setSelectedProperty((prev) => ({
        ...prev,
        tenantsList: formattedTenants,
      }));
    } catch (error) {
      console.error("Failed to load tenants", error);
      // Optional: Add error notification here
    }
  };

  const openManageModal = (property) => {
    setSelectedProperty(property);
    setActiveModal("manage");
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedProperty(null);
  };

  const openTenantDetails = (tenant) => setSelectedTenant(tenant);
  const closeTenantDetails = () => setSelectedTenant(null);

  // --- 3. CRUD Operations (Connected) ---

  // CREATE
  const addProperty = async (formData) => {
    try {
      // 1. Transform Frontend Form -> Backend DTO
      const payload = {
        title: formData.name,
        description: formData.description,
        address: formData.address,
        // Convert "LKR 15000" string to Number 15000.00
        pricePerMonth: parseFloat(
          formData.rent.toString().replace(/[^0-9.]/g, "")
        ),
        availableSlots: parseInt(formData.availableRooms),
        maxOccupants: parseInt(formData.maxOccupants),
        genderType: formData.genderType, // MALE, FEMALE, MIXED
        boardingType: formData.boardingType, // ANNEX, HOSTEL, etc
        status: "ACTIVE",
        imageUrls: [formData.image], // Wrap single image in array
        amenities: [],
      };

      // 2. API Call
      await createBoarding(payload);

      // 3. Refresh Data
      await fetchData();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Create failed", error);
      alert("Failed to create property.");
    }
  };

  // UPDATE
  const updateProperty = async (uiData) => {
    try {
      const payload = {
        title: uiData.name,
        description: uiData.description,
        address: uiData.address,
        pricePerMonth: parseFloat(
          uiData.rent.toString().replace(/[^0-9.]/g, "")
        ),
        availableSlots: parseInt(uiData.availableRooms),
        maxOccupants: uiData.maxOccupants, // Ensure this exists in your Edit Form
        status: uiData.status.toUpperCase(), // "active" -> "ACTIVE"
        // Add other fields required by your BoardingUpdateDTO
      };

      // API Call
      await updateBoarding(uiData.id, payload);

      // Refresh Data
      await fetchData();
      closeModal();
    } catch (error) {
      console.error("Update failed", error);
      alert("Failed to update property.");
    }
  };

  // DELETE
  const deleteProperty = async (id) => {
    try {
      // API Call
      await deleteBoarding(id);

      // Optimistic Update (Remove from UI immediately)
      setRawBoardings((prev) => prev.filter((b) => b.id !== id));
      closeModal();
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete property.");
    }
  };

  return {
    boardings,
    viewMode,
    selectedProperty,
    selectedTenant,
    activeModal,
    isCreateModalOpen,
    isLoading, // Export loading state

    setViewMode,
    setIsCreateModalOpen,
    openTenantsModal,
    openManageModal,
    closeModal,
    openTenantDetails,
    closeTenantDetails,

    addProperty,
    updateProperty,
    deleteProperty,
  };
};

export default useBoardingLogic;
