import React, { useState } from "react";
import { motion } from "framer-motion"; // ✅ Import Framer Motion
import useMyAdsLogic from "../../hooks/owner/useMyAdsLogic"; 
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext"; 
import FormGroup from "../../components/Owner/forms/FormGroup";
import HeaderBar from "../../components/Owner/common/HeaderBar";
import LocationPicker from "../../components/common/LocationPicker";
import {
  AmenityCheckbox,
  PhotoUploader,
} from "../../components/Owner/ads/CreateAdSubComponents";

// Backend Enum Options
const BOARDING_TYPES = ["ANNEX", "ROOM", "HOUSE"]; 
const GENDER_TYPES = ["MALE", "FEMALE", "MIXED"]; 

const availableAmenities = [
  { label: "Attached Bathroom", icon: "fa-bath" },
  { label: "Wi-Fi", icon: "fa-wifi" },
  { label: "Kitchen Access", icon: "fa-utensils" },
  { label: "Parking", icon: "fa-car" },
  { label: "Laundry", icon: "fa-washing-machine" },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 } // Stagger effect for children
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const CreateAdPage = () => {
  const { currentOwner } = useOwnerAuth();
  const { createAd, isLoading } = useMyAdsLogic();

  // --- Local Form State ---
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    rent: "",        
    deposit: "",     
    description: "",
    amenities: [],
    genderType: "MIXED",
    boardingType: "ROOM",
    availableSlots: 1,
    maxOccupants: 1,
    latitude: 6.9271, 
    longitude: 79.8612
  });

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // --- Handlers ---
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]); 
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox"
        ? checked
          ? [...prev.amenities, value]
          : prev.amenities.filter((i) => i !== value)
        : value,
    }));
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createAd(formData, selectedFiles); 
  };

  return (
    <div className="space-y-8 pb-12 bg-light min-h-screen">
      <HeaderBar
        title="Create New Boarding Ad"
        subtitle="Fill in the details below to create your ad."
        navBtnText="Back to My Ads"
        navBtnPath="/owner/myAds"
        userAvatar={currentOwner?.avatar}
        userName={currentOwner?.firstName}
      />

      {/* ✅ Animated Container Form */}
      <motion.form 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        onSubmit={handleSubmit} 
        className="space-y-8 px-4 max-w-6xl mx-auto"
      >
        
        {/* Section 1: Details (Animated) */}
        <motion.section 
          variants={itemVariants} 
          className="bg-card-bg p-8 rounded-report shadow-custom border border-light"
        >
          <h2 className="text-xl font-black mb-6 pb-3 border-b border-light text-primary uppercase tracking-tight">
            Boarding Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <FormGroup
              label="Ad Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Spacious Room near University"
            />
            <FormGroup
              label="Full Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="e.g. 123 Main St, Colombo"
            />
            <FormGroup
              label="Monthly Rent (LKR)"
              name="rent"
              type="number"
              value={formData.rent}
              onChange={handleChange}
            />
            <FormGroup
              label="Security Deposit (LKR)"
              name="deposit"
              type="number"
              value={formData.deposit}
              onChange={handleChange}
            />
            
            {/* Dropdowns */}
            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-muted tracking-wider">
                    Gender Preference
                </label>
                <select 
                    name="genderType" 
                    value={formData.genderType} 
                    onChange={handleChange}
                    className="p-3 border border-light rounded-xl bg-white/50 focus:border-accent font-medium text-text"
                >
                    {GENDER_TYPES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-muted tracking-wider">
                    Boarding Type
                </label>
                <select 
                    name="boardingType" 
                    value={formData.boardingType} 
                    onChange={handleChange}
                    className="p-3 border border-light rounded-xl bg-white/50 focus:border-accent font-medium text-text"
                >
                    {BOARDING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
            </div>

            <FormGroup
              label="Available Slots"
              name="availableSlots"
              type="number"
              value={formData.availableSlots}
              onChange={handleChange}
            />
            <FormGroup
              label="Max Occupants"
              name="maxOccupants"
              type="number"
              value={formData.maxOccupants}
              onChange={handleChange}
            />
          </div>
          
          <div className="mt-8">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-muted">
              Description
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the atmosphere, rules, and nearby landmarks..."
              className="w-full p-4 border border-light rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 bg-white/50 transition-all text-text font-medium"
              required
            />
          </div>
        </motion.section>

        {/* ✅ Section 2: MAP LOCATION */}
        <motion.section 
          variants={itemVariants} 
          className="bg-card-bg p-8 rounded-report shadow-custom border border-light"
        >
          <h2 className="text-xl font-black mb-6 pb-3 border-b border-light text-primary uppercase tracking-tight">
             Boarding Location
          </h2>
          <LocationPicker 
             lat={formData.latitude} 
             lng={formData.longitude} 
             onLocationSelect={handleLocationSelect} 
          />
        </motion.section>

        {/* Section 3: Amenities & Media (Animated) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.section 
            variants={itemVariants}
            className="bg-card-bg p-8 rounded-report shadow-custom border border-light"
          >
            <h2 className="text-xl font-black mb-6 pb-3 border-b border-light text-primary uppercase tracking-tight">
              Features & Amenities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableAmenities.map((item) => (
                <AmenityCheckbox
                  key={item.label}
                  item={item}
                  isChecked={formData.amenities.includes(item.label)}
                  onChange={handleChange}
                />
              ))}
            </div>
          </motion.section>

          <motion.section 
            variants={itemVariants}
            className="bg-card-bg p-8 rounded-report shadow-custom border border-light"
          >
            <h2 className="text-xl font-black mb-6 pb-3 border-b border-light text-primary uppercase tracking-tight">
              Media Gallery
            </h2>
            <PhotoUploader
              onImageSelect={handleImageSelect}
              previews={previews}
              onRemove={handleRemoveImage}
            />
          </motion.section>
        </div>

        {/* ✅ Submit Button with Micro-Interaction */}
        <div className="flex justify-end pt-6">
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className={`
              px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg transition-all flex items-center gap-3
              ${isLoading 
                  ? "bg-muted text-white cursor-not-allowed" 
                  : "bg-accent text-white"
              }
            `}
          >
            {isLoading ? (
              <>
                <i className="fas fa-circle-notch fa-spin"></i>
                <span>Publishing...</span>
              </>
            ) : (
              <>
                <i className="fas fa-bullhorn"></i> 
                <span>Publish Ad</span>
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
};

export default CreateAdPage;