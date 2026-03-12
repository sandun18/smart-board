import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext"; 
import { 
  getOwnerBoardings, 
  createBoarding, 
  getBoardingById, 
  updateBoarding,
  deleteBoarding,
  uploadBoardingImages 
} from "../../api/owner/service"; 

const useMyAdsLogic = () => {
  const [ads, setAds] = useState([]); // Store backend data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();
  const location = useLocation();
  const { currentOwner } = useOwnerAuth();

  // --- 1. Helper: Status Mapping Logic ---
  // Maps Backend Enums to Frontend Tabs (Active, Pending, Draft)
  const normalizeStatus = (backendStatus) => {
    if (!backendStatus) return "Draft";
    
    const status = backendStatus.toUpperCase();

    // 1. Approved Ads -> "Active" Tab
    if (status === "ACTIVE" || status === "APPROVED") {
      return "Active";
    }
    
    // 2. New Ads -> "Pending" Tab
    if (status === "PENDING" || status === "REVIEW") {
      return "Pending";
    }

    // 3. Rejected Ads -> "Draft" Tab (As per your requirement)
    if (status === "REJECTED" || status === "DENIED" || status === "DRAFT") {
      return "Draft";
    }

    // 4. Inactive Ads -> "Inactive" Tab
    if (status === "INACTIVE") {
      return "Inactive";
    }

    // Fallback default
    return "Draft";
  };

  const toggleAdStatus = async (id, currentStatus) => {
    const isCurrentlyActive = currentStatus === "Active";
    // If Active (Approved) -> INACTIVE. If Inactive -> PENDING (for review)
    const newStatus = isCurrentlyActive ? "INACTIVE" : "PENDING";
    
    const confirmMsg = isCurrentlyActive 
      ? "Deactivate this ad? It will move to the Inactive tab." 
      : "Activate this ad? It will move to Pending for approval.";

    if (!window.confirm(confirmMsg)) return;

    const toastId = toast.loading("Updating status...");
    try {
      // 1. Fetch current details
      const currentData = await getBoardingById(id);

      // 2. Construct Payload manually to ensure "Write DTO" compatibility
      const payload = {
        title: currentData.title,
        description: currentData.description,
        address: currentData.address,
        
        // Ensure numeric types
        pricePerMonth: Number(currentData.pricePerMonth), 
        keyMoney: Number(currentData.keyMoney) || 0,
        
        genderType: currentData.genderType,
        boardingType: currentData.boardingType,
        availableSlots: Number(currentData.availableSlots),
        maxOccupants: Number(currentData.maxOccupants),
        amenities: currentData.amenities || [],
        
        latitude: Number(currentData.latitude),
        longitude: Number(currentData.longitude),
        nearbyPlaces: currentData.nearbyPlaces || {}, 
        
        // Ensure images are a list of strings
        imageUrls: currentData.imageUrls || [],
        
        // CRITICAL FIX: Inject Owner ID explicitly
        // The Public Get endpoint might not return the ID, but the Update endpoint needs it.
        ownerId: currentOwner?.id, 

        // THE STATUS CHANGE
        status: newStatus 
      };

      

      // 3. Send Update
      await updateBoarding(id, payload); 

      // 4. Force UI Refresh
      // Using a small timeout ensures the DB transaction clears before we fetch
      setTimeout(() => {
        fetchAds();
        toast.success(isCurrentlyActive ? "Ad deactivated" : "Ad is now Active!", { id: toastId });
      }, 500);

    } catch (err) {
      console.error("Update failed:", err);
      toast.error("Failed to update status", { id: toastId });
    }
  };

  // --- 2. Fetch Data (From Backend) ---
  const fetchAds = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getOwnerBoardings(); 
      
      const rawList = Array.isArray(data) ? data : (data.content || []);

      const formattedAds = rawList.map((item) => ({
        id: item.id,
        title: item.title,
        address: item.address,
        rent: item.pricePerMonth, 
        deposit: item.keyMoney,
        genderType: item.genderType,
        boardingType: item.boardingType,
        availableSlots: item.availableSlots,
        maxOccupants: item.maxOccupants,
        
        // ✅ Apply the mapping here
        status: normalizeStatus(item.status), 
        
        image: item.imageUrls && item.imageUrls.length > 0 
          ? item.imageUrls[0] 
          : "https://via.placeholder.com/400x300?text=No+Image",
        isBoosted: item.isBoosted || false, 
        
        // Mock stats (since backend doesn't send them yet)
        views: 0, 
        appointments: 0, 
        selected: 0
      }));

      setAds(formattedAds);
    } catch (err) {
      console.error("Failed to load ads", err);
      setError("Could not load your listings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // --- 3. Client-Side Actions ---
  
  const createAd = async (formData, rawFiles) => {
    setIsLoading(true);

    const toastId = toast.loading("Publishing your ad...");

    try {
      let uploadedUrls = [];
      if (rawFiles.length > 0) {
        uploadedUrls = await uploadBoardingImages(rawFiles);
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        pricePerMonth: parseFloat(formData.rent),
        keyMoney: parseFloat(formData.deposit) || 0,
        genderType: formData.genderType || "MIXED",
        boardingType: formData.boardingType || "ROOM",
        availableSlots: parseInt(formData.availableSlots || 1),
        maxOccupants: parseInt(formData.maxOccupants || 1),
        amenities: formData.amenities,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        nearbyPlaces: {}, 
        imageUrls: uploadedUrls,
      };


      await createBoarding(payload);
      toast.success("Ad published successfully!", { id: toastId });
      navigate("/owner/myAds");
    } catch (err) {
      console.error(err);
      toast.error("Failed to publish ad. Please try again.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAd = async (id, formData, newFiles, existingImages, currentStatus) => {
    setIsLoading(true);
    const toastId = toast.loading("Updating your ad...");

    try {
      // 1. Upload new images if any
      let newUrls = [];
      if (newFiles.length > 0) {
        newUrls = await uploadBoardingImages(newFiles);
      }
      
      // Combine old and new images
      const finalImages = [...existingImages, ...newUrls];

      // 2. Prepare Payload
      const payload = {
        title: formData.title,
        description: formData.description,
        address: formData.address,
        pricePerMonth: parseFloat(formData.rent),
        keyMoney: parseFloat(formData.deposit) || 0,
        genderType: formData.genderType,
        boardingType: formData.boardingType,
        availableSlots: parseInt(formData.availableSlots),
        maxOccupants: parseInt(formData.maxOccupants),
        amenities: formData.amenities,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        nearbyPlaces: {}, 
        imageUrls: finalImages,
        
        status: currentStatus === "Inactive" ? "INACTIVE" : "PENDING" 
      };

      // 3. Send to Backend
      await updateBoarding(id, payload);
      
      toast.success("Changes saved! Ad is now under review.", { id: toastId });
      navigate("/owner/myAds");
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to update ad.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    // 1. Confirm with user
    if (!window.confirm("Are you sure you want to delete this ad? This action cannot be undone.")) {
      return;
    }

    const toastId = toast.loading("Deleting ad...");

    try {
      // 2. Call Backend
      await deleteBoarding(id);

      // 3. Optimistic Update (Remove from UI immediately)
      setAds((prevAds) => prevAds.filter((ad) => ad.id !== id));

      toast.success("Ad deleted successfully", { id: toastId });
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Failed to delete ad", { id: toastId });
    }
  };

  const fetchSingleAd = useCallback(async (id) => {
    try {
      setIsLoading(true);
      const data = await getBoardingById(id);
      return {
        ...data,
        rent: data.pricePerMonth,
        deposit: data.keyMoney,
        currentImages: data.imageUrls || [],
        status: normalizeStatus(data.status),
        latitude: data.latitude || 6.9271,
        longitude: data.longitude || 79.8612
      };
    } catch (err) {
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- 4. Filtering Logic ---
  // Calculates counts for tabs
  const counts = useMemo(() => {
    const acc = ads.reduce((a, ad) => {
      const statusKey = ad.status; 
      a[statusKey] = (a[statusKey] || 0) + 1;
      return a;
    }, {});
    acc["All"] = ads.length;
    return acc;
  }, [ads]);

  // Filters the list based on selected tab
  const filteredAds = useMemo(() => {
    return ads.filter((ad) => filter === "All" || ad.status === filter);
  }, [ads, filter]);

  // --- 5. Navigation Handlers ---
  const handleCreate = () => navigate("createAd");
  const handleEdit = (id) => navigate(`editAd/${id}`);
  const handleBoostRedirect = (id) => navigate(`/owner/subscriptions/${id}`);
  
  const getStatusBadgeStyle = (status) => {
    const statusColors = {
      Active: { backgroundColor: "var(--success)", color: "white" }, 
      Pending: { backgroundColor: "var(--info)", color: "white" },
      Draft: { backgroundColor: "var(--error)", color: "white" },   
    };
    
    // Return an OBJECT, not a string
    return statusColors[status] || { backgroundColor: "#6B7280", color: "white" };
  };

  const isNestedRoute = location.pathname !== "/owner/myAds";

  return {
    ads,
    filter,
    setFilter,
    filteredAds,
    counts,
    isLoading,
    error,
    isNestedRoute,
    fetchAds,
    fetchSingleAd,
    createAd,
    updateAd,
    handleEdit,
    handleCreate,
    handleBoostRedirect,
    getStatusBadgeStyle,
    toggleAdStatus
  };
};

export default useMyAdsLogic;