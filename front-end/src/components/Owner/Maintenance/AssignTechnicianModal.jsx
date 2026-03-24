import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaMapMarkerAlt,
  FaTimes,
  FaCheck,
  FaUser,
} from "react-icons/fa";
import {
  searchTechnicians,
  assignTechnician,
} from "../../../api/owner/service";
import toast from "react-hot-toast";

// Use the same base URL as your Maintenance Card
const BASE_IMAGE_URL = "http://localhost:8086/uploads/";

const AssignTechnicianModal = ({ request, onClose, onSuccess }) => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        setLoading(true);
        // ✅ Refined Skill Logic: Check for more keywords
        const issue = request.issueType?.toUpperCase() || "";
        let skill = "OTHER";

        if (issue.includes("PLUMB")) skill = "PLUMBING";
        else if (issue.includes("ELECT")) skill = "ELECTRICAL";
        else if (issue.includes("CARPENT")) skill = "CARPENTRY";
        else if (issue.includes("PAINT")) skill = "PAINTING";
        else if (issue.includes("CLEAN")) skill = "CLEANING";

        const data = await searchTechnicians(skill);
        setTechnicians(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Tech fetch error:", error);
        toast.error("Could not load technicians");
      } finally {
        setLoading(false);
      }
    };
    fetchTechs();
  }, [request]);

  const handleAssign = async (techId) => {
    try {
      // Ensure request.id is passed correctly to your service
      await assignTechnician(request.id, techId);
      toast.success("Technician Assigned successfully!");
      onSuccess(); // Triggers the status update in MaintenanceCard
      onClose(); // Closes the modal
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to assign.");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Assign Professional
            </h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
              Category: {request.issueType}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-full transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        {/* List Content */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-3">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 text-sm">
                Finding experts near you...
              </p>
            </div>
          ) : technicians.length === 0 ? (
            <div className="text-center py-12">
              <FaUser className="mx-auto text-gray-200 text-5xl mb-4" />
              <p className="text-gray-500">
                No professionals available for this skill yet.
              </p>
            </div>
          ) : (
            technicians.map((tech) => (
              <div
                key={tech.id}
                className="group border border-gray-100 rounded-xl p-4 flex gap-4 hover:border-blue-400 hover:shadow-md transition-all bg-white"
              >
                <img
                  src={
                    tech.profileImageUrl &&
                    tech.profileImageUrl.startsWith("http")
                      ? tech.profileImageUrl // ✅ Use the S3 link directly
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.fullName)}&background=random`
                  }
                  alt={tech.fullName}
                  className="w-16 h-16 rounded-xl object-cover border border-gray-100 shadow-sm"
                  onError={(e) => {
                    // Fallback if the S3 link is broken or access is denied
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(tech.fullName)}&background=0D8ABC&color=fff`;
                  }}
                />

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {tech.fullName}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                        <FaMapMarkerAlt className="text-blue-400" />{" "}
                        {tech.city || "Area Not Specified"}
                      </div>
                    </div>
                    <span className="bg-yellow-50 text-yellow-700 text-[10px] font-bold px-2 py-1 rounded-md border border-yellow-200 flex items-center gap-1">
                      <FaStar />{" "}
                      {tech.averageRating > 0
                        ? tech.averageRating.toFixed(1)
                        : "NEW"}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold">
                        Base Fee
                      </span>
                      <span className="font-bold text-lg text-blue-600">
                        LKR {tech.basePrice?.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAssign(tech.id)}
                      className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center gap-2 active:scale-95"
                    >
                      Assign Professional <FaCheck size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AssignTechnicianModal;
