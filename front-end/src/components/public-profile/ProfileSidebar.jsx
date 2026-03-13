import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, FaEnvelope, FaPhone, FaHistory, 
  FaVenusMars, FaBuilding, FaMapMarkerAlt, FaUniversity 
} from 'react-icons/fa';
import InfoRow from './InfoRow';

const ProfileSidebar = ({ profile }) => {
  const isOwner = profile.role === 'OWNER';

  return (
    <div className="lg:col-span-1 space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-bg rounded-report shadow-custom p-8 text-center border border-light relative overflow-hidden"
      >
        {/* Suspended Banner */}
        {profile.isSuspended && (
           <div className="absolute top-0 left-0 w-full bg-error text-white text-[10px] font-black uppercase tracking-widest py-1">
             Account Suspended
           </div>
        )}

        <div className="relative inline-block mt-4">
          <img 
            src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.fullName}`} 
            alt={profile.fullName} 
            className={`w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 ${profile.isSuspended ? 'border-error' : 'border-accent'} shadow-lg`}
          />
          {isOwner && profile.verifiedOwner && (
            <div className="absolute bottom-2 right-0 bg-success text-white p-2 rounded-full border-4 border-card-bg shadow-sm" title="Verified Owner">
              <FaCheckCircle size={14} />
            </div>
          )}
        </div>
        
        <h1 className="text-2xl font-black text-primary mb-1 uppercase tracking-tight">{profile.fullName}</h1>
        
        <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6
          ${isOwner ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
          {profile.role}
        </div>

        <div className="space-y-4 text-left pt-6 border-t border-light">
           <InfoRow icon={FaEnvelope} label="Email" value={profile.email} />
           <InfoRow icon={FaPhone} label="Phone" value={profile.phone} />
           <InfoRow icon={FaHistory} label="Member Since" value={profile.joinedDate} />
           <InfoRow icon={FaVenusMars} label="Gender" value={profile.gender} />
           
           {isOwner ? (
             <>
               <InfoRow icon={FaBuilding} label="Business Name" value={profile.businessName} />
               <InfoRow icon={FaMapMarkerAlt} label="Location" value={profile.address} />
             </>
           ) : (
             <InfoRow icon={FaUniversity} label="University" value={profile.university || "Not Provided"} />
           )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSidebar;