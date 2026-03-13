import React, { useState, useEffect, useRef } from "react";
import TechnicianLayout from "../../components/technician/common/TechnicianLayout"; // Check casing!
import { useNavigate } from "react-router-dom";
import { useTechAuth } from "../../context/technician/TechnicianAuthContext";
import { getTechnicianProfile, getTechnicianReviews, updateTechnicianProfile } from "../../api/technician/technicianService";
import { 
  FaStar, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaMoneyBillWave, 
  FaCamera, 
  FaExternalLinkAlt 
} from "react-icons/fa";
import EditProfileModal from "../../components/technician/profile/EditProfileModal"; // Check casing!
import toast from "react-hot-toast";

const TechnicianProfile = () => {
  //  Destructure isLoading
  const { currentTech, isLoading: authLoading, refreshUser } = useTechAuth(); 
  const navigate = useNavigate();

  const [technician, setTechnician] = useState({});
  const [reviews, setReviews] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const fileInputRef = useRef(null);

  const getDisplayValue = (keyA, keyB, fallback) => {
    if (technician[keyA] !== undefined && technician[keyA] !== null) return technician[keyA];
    if (technician[keyB] !== undefined && technician[keyB] !== null) return technician[keyB];
    return fallback;
  };

  const loadAllData = async () => {
    try {
      setIsDataLoading(true);
      
      // 1. Fetch Profile and Reviews in parallel
      const [profileData, reviewsData] = await Promise.all([
        getTechnicianProfile(),
        getTechnicianReviews() // Fetch real reviews
      ]);

      if (profileData) {
        setTechnician(profileData);
      }
      if (reviewsData) {
        setReviews(reviewsData);
      }

    } catch (error) {
      console.error("Data Fetch Error:", error);
    } finally {
      setIsDataLoading(false);
    }
  };

 useEffect(() => {
    if (!authLoading) {
      // Load context data first for instant render
      if (currentTech) setTechnician(currentTech);
      // Then fetch fresh data
      loadAllData();
    }
  }, [authLoading, currentTech]);

  // 2. Handle Photo Upload (Convert to Base64 & Send)
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading("Uploading to cloud...");

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64String = reader.result;
      try {
        await updateTechnicianProfile({
           ...technician, 
           profileImageBase64: base64String 
        });
        toast.success("Photo updated!", { id: toastId });
        await refreshUser(); // Update Header
        loadAllData();       // Update Profile
      } catch (error) {
        console.error(error);
        toast.error("Upload failed", { id: toastId });
      }
    };
  };

  const handleNameClick = () => {
    if (technician?.id) {
       // Navigate to the public view route (Make sure this route exists in AppRoutes!)
       navigate(`/profile/view/${technician.id}`);
    }
  };


  // Variables with Fallback Logic
  const displayName = technician.fullName || "Technician";
  
  //  FIX: Ensures 3.5 doesn't truncate to 3
  const rawRating = technician.averageRating || 0;
  const displayRating = Number(rawRating).toFixed(1);

  const displayJobs = getDisplayValue("totalJobsCompleted", "technicianTotalJobs", 0);
  const displayBasePrice = technician.basePrice || "0.00";

  const getProfileImage = () => {
    if (technician?.profileImageUrl) {
        // If it's a full URL (S3), use it. If it's a local filename, use localhost (legacy support)
        return technician.profileImageUrl.startsWith("http") 
            ? technician.profileImageUrl 
            : `http://localhost:8086/uploads/${technician.profileImageUrl}`;
    }
    return `https://ui-avatars.com/api/?name=${displayName}&background=random`;
  };

  if (authLoading || isDataLoading) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <TechnicianLayout title="My Profile" subtitle="Manage your account">
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* PROFILE CARD */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-primary/10"></div>

            <button
              onClick={() => setShowEdit(true)}
              className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-sm text-gray-500 hover:text-accent z-10 transition-colors"
            >
              <FaEdit />
            </button>

            {/*  IMAGE + CAMERA BUTTON */}
            <div className="relative inline-block mx-auto mt-2 mb-4">
               <img
                src={getProfileImage()}
                alt="Profile"
                onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${displayName}&background=random`}
                className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover bg-white relative z-10"
              />
              
              {/* Camera Icon */}
              <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-1 right-1 z-20 bg-accent text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-all transform hover:scale-110 cursor-pointer"
                title="Change Photo"
              >
                <FaCamera size={14} />
              </button>
              
              {/* Hidden Input */}
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept="image/*"
                onChange={handlePhotoUpload}
              />
            </div>

            <div 
                onClick={handleNameClick}
                className="group/name flex items-center justify-center gap-2 cursor-pointer mb-2 relative z-10"
                title="View what others see"
            >
                <h2 className="text-xl font-bold text-gray-800 group-hover/name:text-accent transition-colors">
                  {displayName}
                </h2>
                <FaExternalLinkAlt className="text-xs text-gray-400 opacity-0 group-hover/name:opacity-100 transition-all group-hover/name:text-accent" />
            </div>
            
            {/* Skills */}
            <div className="mt-2 flex flex-wrap justify-center gap-2">
                {technician?.skills && technician.skills.length > 0 ? (
                    technician.skills.map((skill, i) => (
                        <span key={i} className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 uppercase">
                            {typeof skill === 'string' ? skill.replace("_", " ") : skill}
                        </span>
                    ))
                ) : (
                    <span className="text-sm text-gray-400 italic">No skills added</span>
                )}
            </div>

            <div className="mt-6 flex justify-center gap-2">
              <div className="bg-orange-50 px-4 py-2 rounded-xl text-center">
                <span className=" font-black text-xl text-orange-600 flex items-center justify-center gap-1">
                  {displayRating} <FaStar size={12} />
                </span>
                <span className="text-xs text-gray-500 uppercase font-bold">Rating</span>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-xl text-center">
                <span className="block font-black text-xl text-blue-600">
                  {displayJobs}
                </span>
                <span className="text-xs text-gray-500 uppercase font-bold">Jobs</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-bold text-gray-800 mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-gray-400" /> <span className="truncate">{technician?.email}</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhone className="text-gray-400" /> {technician?.phone}
              </li>
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-gray-400" /> {technician?.city}
              </li>
              <li className="flex items-center gap-3">
                <FaMoneyBillWave className="text-green-600" /> 
                <span className="font-bold">LKR {technician?.basePrice}</span> / visit
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Reviews */}
        <div className="md:col-span-2 space-y-6">
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
             <h3 className="font-bold mb-4 flex items-center gap-2"><FaStar className="text-yellow-400"/> Reviews from Owners</h3>
             
             {reviews.length > 0 ? (
               <div className="space-y-4">
                 {reviews.map((r) => (
                   <div key={r.id} className="border-b pb-2 mb-2 last:border-0 last:pb-0">
                     <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-gray-700">{r.ownerName}</span>
                        <span className="text-xs text-gray-400">{r.date}</span>
                     </div>
                     <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < r.rating ? "text-yellow-400" : "text-gray-200"} />
                        ))}
                     </div>
                     <p className="text-sm italic text-gray-600">"{r.comment}"</p>
                   </div>
                 ))}
               </div>
             ) : (
               <p className="text-gray-400 italic text-center py-4">No reviews yet.</p>
             )}
           </div>
        </div>
      </div>

      {showEdit && (
        <EditProfileModal
          user={technician}
          onClose={() => setShowEdit(false)}
          onUpdate={loadAllData} //  Fetch FRESH data after edit
        />
      )}
    </TechnicianLayout>
  );
};

export default TechnicianProfile;

