import { useState, useEffect } from "react";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext.jsx";
import {
  getOwnerBoardings,
  getOwnerRegistrations,
  createBoarding,
  updateBoarding,
  deleteBoarding,
} from "../../api/owner/service.js";

import api from "../../api/api";

const useBoardingLogic = () => {

  const [rawBoardings, setRawBoardings] = useState([]);
  const [registrations, setRegistrations] = useState([]);

  const [boardings, setBoardings] = useState([]);

  const [viewMode, setViewMode] = useState("grid");
  const [activeModal, setActiveModal] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const { currentOwner } = useOwnerAuth();

  /* ================= FETCH DATA ================= */

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    if (!currentOwner?.id) return;

    setIsLoading(true);

    try {

      const [boardingsRes, registrationsRes] = await Promise.all([
        getOwnerBoardings(currentOwner.id),
        getOwnerRegistrations(currentOwner.id)
      ]);

      const backendBoardings = Array.isArray(boardingsRes)
        ? boardingsRes
        : boardingsRes.content || [];

      setRawBoardings(backendBoardings);
      setRegistrations(registrationsRes || []);

    } catch (err) {

      console.error("Failed to load boardings", err);

    } finally {

      setIsLoading(false);

    }
  };

  /* ================= MAP BOARDINGS + TENANTS ================= */

  useEffect(() => {

    const buildBoardings = async () => {

      if (!rawBoardings.length) {
        setBoardings([]);
        return;
      }

      const approvedRegistrations = registrations.filter(
        r => r.status === "APPROVED"
      );

      const formatted = await Promise.all(

        rawBoardings.map(async (b) => {

          const tenants = await Promise.all(

            approvedRegistrations
              .filter(r => r.boardingId === b.id)
              .map(async (r) => {

                try {

                  const res = await api.get(`/users/public/${r.studentId}`);

                  const profile = res.data;

                  return {
                    id: r.studentId,
                    name: r.studentName,
                    email: r.studentEmail,
                    joinedDate: r.moveInDate,
                    phone: profile.phone,
                    avatar: profile.profileImageUrl
                  };

                } catch (err) {

                  console.error("Profile fetch failed", err);

                  return {
                    id: r.studentId,
                    name: r.studentName,
                    email: r.studentEmail,
                    joinedDate: r.moveInDate,
                    phone: null,
                    avatar: null
                  };

                }

              })

          );

          return {

            id: b.id,
            name: b.title,
            address: b.address,

            rent: `LKR ${b.pricePerMonth ? b.pricePerMonth.toLocaleString() : "0"}`,

            availableRooms: b.availableSlots,
            maxOccupants: b.maxOccupants,

            status: b.status ? b.status.toLowerCase() : "active",

            image:
              b.imageUrls && b.imageUrls.length > 0
                ? b.imageUrls[0]
                : "https://via.placeholder.com/300",

            description: b.description,
            genderType: b.genderType,
            boardingType: b.boardingType,

            tenantsList: tenants,
            totalTenants: tenants.length

          };

        })

      );

      setBoardings(formatted);

    };

    buildBoardings();

  }, [rawBoardings, registrations]);

  /* ================= TENANT MODAL ================= */

  const openTenantsModal = (property) => {

    setSelectedProperty(property);
    setActiveModal("tenants");

  };

  /* ================= TENANT PROFILE ================= */

 const openTenantDetails = async (tenant) => {

  try {

    const res = await api.get(`/users/${tenant.id}`);

    const profile = res.data;
    console.log("PROFILE IMAGE:", profile.profileImageUrl);

    setSelectedTenant({
      id: tenant.id,
      name: profile.fullName,
      email: profile.email,
      phone: profile.phone,
      joinedDate: tenant.joinedDate,
      profileImageUrl: profile.profileImageUrl
    });

  } catch (err) {

    console.error("Failed to load profile", err);

    setSelectedTenant(tenant);

  }

};

  const closeTenantDetails = () => setSelectedTenant(null);

  /* ================= OTHER MODALS ================= */

  const openManageModal = (property) => {

    setSelectedProperty(property);
    setActiveModal("manage");

  };

  const closeModal = () => {

    setActiveModal(null);
    setSelectedProperty(null);

  };

  /* ================= CREATE ================= */

  const addProperty = async (formData) => {

    try {

      const payload = {

        title: formData.name,
        description: formData.description,
        address: formData.address,

        pricePerMonth: parseFloat(
          formData.rent.toString().replace(/[^0-9.]/g, "")
        ),

        availableSlots: parseInt(formData.availableRooms),
        maxOccupants: parseInt(formData.maxOccupants),

        genderType: formData.genderType,
        boardingType: formData.boardingType,

        status: "ACTIVE",
        imageUrls: [formData.image],
        amenities: []

      };

      await createBoarding(payload);

      await fetchData();

      setIsCreateModalOpen(false);

    } catch (error) {

      console.error("Create failed", error);
      alert("Failed to create property.");

    }

  };

  /* ================= UPDATE ================= */

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
        maxOccupants: uiData.maxOccupants,

        status: uiData.status.toUpperCase()

      };

      await updateBoarding(uiData.id, payload);

      await fetchData();

      closeModal();

    } catch (error) {

      console.error("Update failed", error);
      alert("Failed to update property.");

    }

  };

  /* ================= DELETE ================= */

  const deleteProperty = async (id) => {

    try {

      await deleteBoarding(id);

      setRawBoardings(prev => prev.filter(b => b.id !== id));

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
    isLoading,

    setViewMode,
    setIsCreateModalOpen,
    openTenantsModal,
    openManageModal,
    closeModal,
    openTenantDetails,
    closeTenantDetails,

    addProperty,
    updateProperty,
    deleteProperty

  };

};

export default useBoardingLogic;