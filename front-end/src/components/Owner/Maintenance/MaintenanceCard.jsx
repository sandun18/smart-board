// import React from 'react';
// import { motion } from 'framer-motion';
// import { FaCalendar, FaMapMarkerAlt, FaExclamationTriangle, FaCheckCircle, FaClock, FaImage } from 'react-icons/fa';

// const BASE_IMAGE_URL = "http://localhost:8086/uploads/";

// const URGENCY_CONFIG = {
//   low: { color: 'bg-emerald-100 text-emerald-700', icon: null },
//   medium: { color: 'bg-blue-100 text-blue-700', icon: null },
//   high: { color: 'bg-orange-100 text-orange-700', icon: <FaExclamationTriangle /> },
//   critical: { color: 'bg-red-100 text-red-700', icon: <FaExclamationTriangle /> },
// };

// const STATUS_CONFIG = {
//   pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50' },
//   'in_progress': { label: 'In Progress', color: 'text-blue-600 bg-blue-50' },
//   'in-progress': { label: 'In Progress', color: 'text-blue-600 bg-blue-50' },
//   completed: { label: 'Resolved', color: 'text-green-600 bg-green-50' },
//   resolved: { label: 'Resolved', color: 'text-green-600 bg-green-50' },
// };

// const MaintenanceCard = ({ request, onUpdateStatus }) => {
//   const urgencyKey = request.urgency ? request.urgency.toLowerCase() : 'low';
//   const statusKey = request.status ? request.status.toLowerCase() : 'pending';

//   const urgencyStyle = URGENCY_CONFIG[urgencyKey] || URGENCY_CONFIG.low;
//   const statusStyle = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Date(dateString).toLocaleDateString('en-US', {
//       month: 'short', day: 'numeric', year: 'numeric'
//     });
//   };

//   // Safe check for images array
//   const hasImages = request.image && request.image.length > 0;

//   return (
//     <motion.div
//       layout
//       initial={{ opacity: 0, scale: 0.95 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.95 }}
//       whileHover={{ y: -4 }}
//       className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full hover:shadow-md transition-all duration-300"
//     >
//       <div className={`h-2 w-full ${urgencyStyle.color.split(' ')[0].replace('bg-', 'bg-')}`} />

//       <div className="p-5 flex flex-col flex-1">
//         {/* Top Row */}
//         <div className="flex justify-between items-center text-xs text-gray-400 mb-3">
//           <span className="flex items-center gap-1">
//             <FaCalendar className="text-gray-300" /> {formatDate(request.date)}
//           </span>
//           <span className="font-mono">#{request.id}</span>
//         </div>

//         {/* Title */}
//         <div className="mb-4">
//           <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
//             {request.issueType || "Maintenance Request"}
//           </h3>
//           <div className="flex items-center gap-2 text-sm text-gray-500">
//             <FaMapMarkerAlt className="text-gray-300" size={12} />
//             <span>{request.boardingName || "Unknown Property"} • Room {request.roomNumber || "?"}</span>
//           </div>
//         </div>

//         {/* Badges */}
//         <div className="flex flex-wrap gap-2 mb-4">
//           <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${urgencyStyle.color}`}>
//             {urgencyStyle.icon}
//             <span className="capitalize">{urgencyKey} Priority</span>
//           </span>
//           <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.color}`}>
//             {statusStyle.label}
//           </span>
//         </div>

//         {/* Description */}
//         <p className="text-gray-600 text-sm line-clamp-2 mb-4">
//           {request.description}
//         </p>

//         {/* 🔥 NEW: IMAGE GALLERY SECTION */}
//         {hasImages && (
//           <div className="mb-4">
//              <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 flex items-center gap-1">
//                <FaImage /> Attached Evidence ({request.image.length})
//              </p>
//              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
//                {request.image.map((imgName, index) => (
//                  <img
//                    key={index}
//                    // Assuming imgName is just the filename "photo.jpg"
//                    src={`${BASE_IMAGE_URL}${imgName}`}
//                    alt={`Evidence ${index + 1}`}
//                    className="h-16 w-24 object-cover rounded-lg border border-gray-100 cursor-pointer hover:opacity-90"
//                    onClick={() => window.open(`${BASE_IMAGE_URL}${imgName}`, '_blank')}
//                  />
//                ))}
//              </div>
//           </div>
//         )}

//         {/* Action Footer (Pushed to bottom) */}
//         <div className="pt-4 border-t border-gray-50 flex gap-2 mt-auto">
//           {statusKey !== 'completed' && statusKey !== 'resolved' ? (
//             <>
//               {statusKey === 'pending' && (
//                 <button
//                   onClick={(e) => { e.stopPropagation(); onUpdateStatus(request.id, 'IN_PROGRESS'); }}
//                   className="flex-1 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
//                 >
//                   <FaClock size={12} /> Start Work
//                 </button>
//               )}
//               <button
//                 onClick={(e) => { e.stopPropagation(); onUpdateStatus(request.id, 'COMPLETED'); }}
//                 className="flex-1 py-2 rounded-lg bg-green-50 text-green-600 text-sm font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
//               >
//                 <FaCheckCircle size={12} /> Mark Done
//               </button>
//             </>
//           ) : (
//             <div className="w-full text-center text-sm text-gray-400 py-2 font-medium bg-gray-50 rounded-lg">
//               Completed on {formatDate(new Date())}
//             </div>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default MaintenanceCard;

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaCalendar,
  FaMapMarkerAlt,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTools,
  FaStar,
} from "react-icons/fa";
import AssignTechnicianModal from "./AssignTechnicianModal";
import ReviewTechnicianModal from "./ReviewTechnicianModal";

const URGENCY_CONFIG = {
  low: { color: "bg-emerald-100 text-emerald-700" },
  medium: { color: "bg-blue-100 text-blue-700" },
  high: { color: "bg-orange-100 text-orange-700" },
  critical: { color: "bg-red-100 text-red-700" },
};
const STATUS_CONFIG = {
  pending: { label: "Pending", color: "text-yellow-600 bg-yellow-50" },
  assigned: { label: "Assigned", color: "text-purple-600 bg-purple-50" },
  in_progress: { label: "In Progress", color: "text-blue-600 bg-blue-50" },
  completed: { label: "Resolved", color: "text-green-600 bg-green-50" },
};

const MaintenanceCard = ({ request, onUpdateStatus }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const urgencyKey = request.urgency ? request.urgency.toLowerCase() : "low";
  const statusKey = request.status ? request.status.toLowerCase() : "pending";
  const urgencyStyle = URGENCY_CONFIG[urgencyKey] || URGENCY_CONFIG.low;
  const statusStyle = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="flex flex-col h-full overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-md"
    >
      <div className={`h-2 w-full ${urgencyStyle.color.split(' ')[0].replace('bg-', 'bg-')}`} />
      
      <div className="flex flex-col flex-1 p-5">
        {/* Top Row */}
        <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <FaCalendar className="text-gray-300" /> {formatDate(request.createdDate)}
          </span>
        </div>

        {/* Title */}
        <div className="mb-4">
          <h3 className="mb-1 text-lg font-bold text-gray-800 line-clamp-1">
            {request.issueType || "Maintenance Request"}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FaMapMarkerAlt className="text-gray-300" size={12} />
            <span>{request.boardingName || "Unknown Property"} • Room {request.roomNumber || "?"}</span>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${urgencyStyle.color}`}>
            {urgencyStyle.icon}
            <span className="capitalize">{urgencyKey} Priority</span>
          </span>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusStyle.color}`}>
            {statusStyle.label}
          </span>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-gray-600 line-clamp-2">
          {request.description}
        </p>

        {/* 🔥 UPDATED: IMAGE GALLERY SECTION */}
        {hasImages && (
          <div className="mb-4">
             <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 flex items-center gap-1">
               <FaImage /> Attached Evidence ({request.image.length})
             </p>
             <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide">
               {request.image.map((imgUrl, index) => (
                 <img 
                   key={index}
                   // ✅ FIX: Use imgUrl directly. Do NOT add BASE_IMAGE_URL.
                   src={imgUrl} 
                   alt={`Evidence ${index + 1}`}
                   className="object-cover w-24 h-16 border border-gray-100 rounded-lg cursor-pointer hover:opacity-90"
                   onClick={() => window.open(imgUrl, '_blank')}
                 />
               ))}
             </div>
          </div>
        )}

        {/* Action Footer */}
        <div className="flex gap-2 pt-4 mt-auto border-t border-gray-50">
          
          {/* CASE 1: PENDING - Only show 'Start Work' */}
          {statusKey === 'pending' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(request.id, 'IN_PROGRESS');
              }}
              className="flex items-center justify-center w-full gap-2 py-2 text-sm font-semibold text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
            >
              <FaClock size={12} /> Start Work
            </button>
          )}

          {/* CASE 2: IN PROGRESS - Only show 'Mark Done' */}
          {(statusKey === 'in_progress' || statusKey === 'in-progress') && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(request.id, 'COMPLETED');
              }}
              className="flex items-center justify-center w-full gap-2 py-2 text-sm font-semibold text-green-600 transition-colors rounded-lg bg-green-50 hover:bg-green-100"
            >
              <FaCheckCircle size={12} /> Mark Done
            </button>
          )}

          {/* CASE 3: COMPLETED - Show Date */}
          {(statusKey === 'completed' || statusKey === 'resolved') && (
            <div className="w-full py-2 text-sm font-medium text-center text-gray-400 rounded-lg bg-gray-50">
              Completed on {formatDate(request.updatedDate)}
            </div>
          )}
          
        </div>
      </div>
    </motion.div>
  );
};
export default MaintenanceCard;
