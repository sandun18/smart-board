import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../api/common/userService';
// IMPORT the technician service to fetch reviews
import { getTechnicianReviews } from '../../api/technician/technicianService'; 
import { motion } from 'framer-motion';
import { 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaBuilding, 
  FaArrowLeft,
  FaStar,
  FaTools
} from 'react-icons/fa';

import ProfileSidebar from '../../components/public-profile/ProfileSidebar';
import StatCard from '../../components/public-profile/StatCard';
import PublicBoardingCard from '../../components/public-profile/PublicBoardingCard';
import IncidentHistory from '../../components/public-profile/IncidentHistory';
import bgImage from '../../assets/s5.jpg'; 

const PublicProfileView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]); // State for tech reviews
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileAndReviews = async () => {
      try {
        setLoading(true);
        const data = await userService.getPublicProfile(id);
        setProfile(data);

        // If the profile is a Technician, fetch their work reviews
        if (data.role === 'TECHNICIAN' || data.role === 'TECH') {
            try {
                // Note: Ensure your API supports fetching by ID if viewing someone else
                const reviewData = await getTechnicianReviews(id); 
                setReviews(reviewData || []);
            } catch (revErr) {
                console.error("Error fetching tech reviews:", revErr);
            }
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError("User not found or connection failed.");
        setLoading(false);
      }
    };

    fetchProfileAndReviews();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error || !profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
       <div className="text-5xl mb-4">😕</div>
       <h2 className="text-xl font-bold text-gray-600">{error}</h2>
       <button onClick={() => navigate(-1)} className="mt-4 text-accent font-semibold hover:underline">Go Back</button>
    </div>
  );

  const isOwner = profile.role === 'OWNER';
  const isTech = profile.role === 'TECHNICIAN' || profile.role === 'TECH';
  const hasListings = isOwner && profile.activeListings && profile.activeListings.length > 0;

  return (
    <div className="min-h-screen relative flex flex-col font-sans text-gray-800">
      <div className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat z-0" style={{ backgroundImage: `url(${bgImage})` }} />
      <div className="fixed inset-0 w-full h-full bg-white/20 backdrop-blur-[0.5px] z-0" />
      
      <div className="relative z-10 w-full flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-md hover:bg-gray-50 transition-all font-bold text-sm">
            <FaArrowLeft /> Back
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 pb-12">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT SIDEBAR */}
            <div className="lg:col-span-4 xl:col-span-3">
               <div className="sticky top-6">
                 <div className="shadow-xl rounded-2xl overflow-hidden bg-white">
                    <ProfileSidebar profile={profile} />
                 </div>
               </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              
              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <StatCard 
                   label="Report History" 
                   value={profile.totalReportsAgainst || 0} 
                   color={profile.totalReportsAgainst > 0 ? "text-red-600" : "text-green-600"}
                   subtext={profile.totalReportsAgainst === 0 ? "Clean Record" : "Incidents Reported"}
                   icon={FaExclamationTriangle}
                   className="bg-white shadow-xl rounded-2xl border-transparent"
                 />
                 <StatCard 
                   label={isTech ? "Rating" : (isOwner ? "Active Listings" : "Status")}
                   value={isTech ? (profile.averageRating || "0.0") : (isOwner ? (profile.activeListings?.length || 0) : "Active")}
                   color="text-accent"
                   subtext={isTech ? "Avg. Work Quality" : "Current Standing"}
                   icon={isTech ? FaStar : (isOwner ? FaBuilding : FaCheckCircle)}
                   className="bg-white shadow-xl rounded-2xl border-transparent"
                 />
              </div>

              {/* Technician Work Reviews - ONLY FOR TECHS */}
              {isTech && (
                <div className="bg-white rounded-2xl shadow-xl border-transparent p-6">
                   <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <FaTools className="text-accent" /> Work Reviews
                      </h3>
                   </div>
                   
                   {reviews.length > 0 ? (
                     <div className="space-y-4">
                        {reviews.map((rev, idx) => (
                          <div key={idx} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="flex justify-between items-start mb-2">
                               <div className="flex items-center gap-3">
                                  <img 
                                    src={`https://ui-avatars.com/api/?name=${rev.ownerName}&background=random`} 
                                    className="w-8 h-8 rounded-full" 
                                    alt="Owner" 
                                  />
                                  <div>
                                    <p className="text-sm font-bold text-gray-800">{rev.ownerName}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">{rev.date}</p>
                                  </div>
                               </div>
                               <div className="flex text-yellow-400 text-xs">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={i < rev.rating ? "fill-current" : "text-gray-200"} />
                                  ))}
                               </div>
                            </div>
                            <p className="text-sm text-gray-600 italic leading-relaxed">"{rev.comment}"</p>
                          </div>
                        ))}
                     </div>
                   ) : (
                     <p className="text-center py-8 text-gray-400 italic">No work reviews available yet.</p>
                   )}
                </div>
              )}

              {/* Active Listings (For Owners) */}
              {hasListings && (
                <div className="bg-white rounded-2xl shadow-xl border-transparent p-6">
                    <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
                      <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <FaBuilding className="text-accent" /> 
                          Properties by {profile.fullName?.split(' ')[0]}
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profile.activeListings.map(boarding => (
                            <PublicBoardingCard key={boarding.id} boarding={boarding} />
                        ))}
                    </div>
                </div>
              )}

              {/* Incident History (Global) */}
              <div className="bg-white rounded-2xl shadow-xl border-transparent p-6">
                 <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Incident History</h3>
                 </div>
                 <IncidentHistory history={profile.incidentHistory} />
              </div>
              
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfileView;