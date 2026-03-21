import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import api from "../../api/api"; 

import {
  FaArrowLeft,
  FaWifi,
  FaSnowflake,
  FaTshirt,
  FaShieldAlt,
  FaUtensils,
  FaTv,
  FaDumbbell,
  FaBicycle,
  FaDirections, // Added for Directions button
} from "react-icons/fa";

import Map from "../../components/common/Map.jsx";
import StudentLayout from "../../components/student/common/StudentLayout";
import ImageGallery from "../../components/student/boarding-details/ImageGallery";
import QuickInfoCard from "../../components/student/boarding-details/QuickInfoCard";
import OwnerCard from "../../components/student/boarding-details/OwnerCard";
import AppointmentForm from "../../components/student/boarding-details/AppointmentForm";
import ReviewsList from "../../components/student/boarding-details/ReviewsList";
import StudentService from "../../api/student/StudentService";
import { useAuth } from "../../context/student/StudentAuthContext.jsx";

import {
  timeSlots,
  safetyTips,
} from "../../data/student/boardingDetailsData.js";
import { useImageGallery } from "../../hooks/student/useImageGallery.js";
import { useAppointmentForm } from "../../hooks/student/useAppointmentForm.js";


const amenityIcons = {
  wifi: FaWifi,
  snowflake: FaSnowflake,
  tshirt: FaTshirt,
  "shield-alt": FaShieldAlt,
  utensils: FaUtensils,
  tv: FaTv,
  dumbbell: FaDumbbell,
  bicycle: FaBicycle,
};

const mapAmenitiesWithIcons = (amenities) => {
  if (!amenities || !Array.isArray(amenities)) return [];
  const amenityIconMap = {
    wifi: "wifi",
    ac: "snowflake",
    laundry: "tshirt",
    security: "shield-alt",
    furnished: "utensils",
    parking: "bicycle",
  };
  return amenities.map((amenity) => {
    if (typeof amenity === 'object' && amenity.icon) return amenity;
    const amenityLower = String(amenity).toLowerCase();
    const iconKey = amenityIconMap[amenityLower] || "wifi";
    return { icon: iconKey, label: amenity };
  });
};

const BoardingDetailsPage = () => {
  const location = useLocation();
  const { id } = useParams();
  const passedBoarding = location.state?.boarding;
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [currentBoarding, setCurrentBoarding] = useState(passedBoarding || null);

  // Chat Logic
  const startChat = async () => {
    try {
      if (!currentUser) {
        alert("You must be logged in to start a chat.");
        return;
      }
      const res = await api.post("/chats", { boardingId: Number(id) });
      if (!res.data?.chatRoomId) throw new Error("Chat room ID missing");
      navigate(`/student/chat/${res.data.chatRoomId}`, {
        state: { name: currentBoarding?.owner?.name || "Owner" },
      });
    } catch (e) {
      console.error("Chat start failed", e);
      alert("Unable to start conversation.");
    }
  };

  // Fetch Full Details
  useEffect(() => {
    const fetchFullDetails = async () => {
      if (!id) return;
      try {
        const data = await StudentService.getBoardingDetails(id);
        if (data) {
          setCurrentBoarding(prev => ({
            ...prev,
            ...data,
            amenities: mapAmenitiesWithIcons(data.amenities || prev?.amenities),
            owner: data.owner || {},
            rating: data.rating !== undefined ? data.rating : 0.0,
            reviewCount: data.reviewCount !== undefined ? data.reviewCount : 0,
            reviewsSummary: null 
          }));
        }
      } catch (error) {
        console.error("Failed to fetch boarding details", error);
      }
    };
    fetchFullDetails();
  }, [id]);

  const galleryImages = currentBoarding?.imageUrls || currentBoarding?.images || [];
  const { currentIndex, nextImage, prevImage, selectImage } = useImageGallery(galleryImages);
  const { formData, updateField, isSubmitting, isSuccess, setSubmitting, setSuccess } = useAppointmentForm();

  const handleScheduleSubmit = async () => {
    if (!currentUser) return alert("Please login first.");
    if (!formData.date || !formData.time) return alert("Select date and time.");
    setSubmitting(true);
    try {
      const payload = {
        boardingId: currentBoarding.id,
        visitDate: formData.date,
        visitTime: formData.time,
        visitNotes: formData.notes
      };
      await StudentService.createAppointment(currentUser.id, payload);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Booking failed.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- DYNAMIC MAP LOGIC ---
  const mapCenter = {
    lat: parseFloat(currentBoarding?.latitude || 5.9485),
    lng: parseFloat(currentBoarding?.longitude || 80.5353)
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`;
    window.open(url, '_blank');
  };

  if (!currentBoarding) return <div className="p-20 text-center">Loading Boarding Details...</div>;

  const safeDescription = Array.isArray(currentBoarding.description) 
    ? currentBoarding.description : [currentBoarding.description || ""];
  const safeAmenities = currentBoarding.amenities || [];
  const safeBreakdown = currentBoarding.reviewsSummary?.breakdown || [];

  return (
    <StudentLayout
      title={currentBoarding.name || currentBoarding.title || "Boarding Details"}
      subtitle="Boarding Details"
      headerRightContent={
        <Link to="/student/search-boardings">
          <button className="hidden sm:flex items-center gap-2 py-2 px-4 rounded-lg font-semibold hover:text-primary">
            <FaArrowLeft /> Back to Search
          </button>
        </Link>
      }
    >
      <div className="flex flex-col min-[1400px]:grid min-[1400px]:grid-cols-3 gap-6 mb-8 items-start">
        <div className="min-[1400px]:col-span-2 w-full space-y-6">
          <ImageGallery images={galleryImages} currentIndex={currentIndex} onPrev={prevImage} onNext={nextImage} onSelect={selectImage} />

          <div className="flex flex-col gap-4 min-[1400px]:hidden">
            <QuickInfoCard boarding={currentBoarding} onBookVisit={() => document.getElementById("appointment-form")?.scrollIntoView({ behavior: "smooth" })} />
            <OwnerCard owner={currentBoarding.owner || {}} onContact={(type) => type === "message" && startChat()} />
          </div>

          {/* Description */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-primary mb-3">Description</h2>
            {safeDescription.map((para, idx) => (
              <p key={idx} className="text-text-muted mb-3 leading-relaxed text-sm last:mb-0">{para}</p>
            ))}
          </section>

          {/* Amenities */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-primary mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {safeAmenities.map((amenity, idx) => {
                const Icon = amenityIcons[amenity.icon] || FaWifi;
                return (
                  <div key={idx} className="flex flex-col items-center p-3 bg-background-light rounded-xl gap-2">
                    <Icon className="text-2xl text-accent" />
                    <span className="text-xs font-medium text-text-dark">{amenity.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Location Section - FIXED MAP CALL */}
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-primary">Location</h2>
               <button 
                  onClick={openInGoogleMaps}
                  className="flex items-center gap-2 text-xs font-bold text-accent hover:underline"
                >
                 <FaDirections /> Get Directions
               </button>
            </div>

            <div className="bg-background-light rounded-xl h-64 md:h-96 overflow-hidden relative border border-gray-100">
              <Map center={mapCenter} makerTitle={currentBoarding.name} />
            </div>

            <p className="mt-4 text-sm text-text-muted">
              {currentBoarding.address || "Address details available upon request"}
            </p>
          </motion.section>

          {/* Reviews */}
          <section className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-primary mb-6">Reviews ({currentBoarding.reviewCount || 0})</h2>
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="flex flex-col items-center justify-center bg-background-light rounded-2xl p-6 sm:w-40 text-center">
                <div className="text-4xl font-bold text-text-dark">{currentBoarding.rating || "0.0"}</div>
                <div className="text-yellow-400 text-sm my-1">{"★".repeat(Math.round(currentBoarding.rating || 0))}</div>
                <div className="text-xs font-bold text-text-muted uppercase">Overall</div>
              </div>
              <div className="flex-1 space-y-2">
                {safeBreakdown.length > 0 ? safeBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-text-muted w-10">{item.stars} ★</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${item.percentage}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-text-dark w-8 text-right">{item.percentage}%</span>
                  </div>
                )) : <div className="text-text-muted text-sm italic">No review breakdown available.</div>}
              </div>
            </div>
            <ReviewsList boardingId={currentBoarding.id || id} />
          </section>
        </div>

        {/* Sidebar */}
        <div className="hidden min-[1400px]:flex flex-col gap-6 w-full">
          <QuickInfoCard boarding={currentBoarding} onBookVisit={() => document.getElementById("appointment-form")?.scrollIntoView({ behavior: "smooth" })} />
          <OwnerCard owner={currentBoarding.owner || {}} onContact={(type) => type === "message" && startChat()} />
          <div id="appointment-form">
            <AppointmentForm formData={formData} updateField={updateField} onSubmit={handleScheduleSubmit} isSubmitting={isSubmitting} isSuccess={isSuccess} timeSlots={timeSlots} />
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default BoardingDetailsPage;