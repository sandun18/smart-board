import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaMapMarkerAlt,
  FaTools,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import {
  searchTechnicians,
  assignTechnician,
} from "../../../api/owner/service";
import toast from "react-hot-toast";

const AssignTechnicianModal = ({ request, onClose, onSuccess }) => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTechs = async () => {
      try {
        const skill = request.issueType.toUpperCase().includes("PLUMB")
          ? "PLUMBING"
          : request.issueType.toUpperCase().includes("ELECT")
            ? "ELECTRICAL"
            : "OTHER";
        const data = await searchTechnicians(skill);
        setTechnicians(data);
      } catch (error) {
        toast.error("Could not load technicians");
      } finally {
        setLoading(false);
      }
    };
    fetchTechs();
  }, [request]);

  const handleAssign = async (techId) => {
    try {
      await assignTechnician(request.id, techId);
      toast.success("Technician Assigned!");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to assign.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-xl"
      >
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              Select Professional
            </h2>
            <p className="text-sm text-gray-500">For: {request.issueType}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FaTimes />
          </button>
        </div>
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : technicians.length === 0 ? (
            <p className="text-center text-gray-500">No technicians found.</p>
          ) : (
            technicians.map((tech) => (
              <div
                key={tech.id}
                className="border border-gray-100 rounded-xl p-4 flex gap-4 hover:border-accent transition-colors"
              >
                <img
                  src={
                    tech.profileImageUrl
                      ? `http://localhost:8086/uploads/${tech.profileImageUrl}`
                      : "https://via.placeholder.com/150"
                  }
                  alt={tech.fullName}
                  className="w-16 h-16 rounded-full object-cover bg-gray-100"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-gray-800">{tech.fullName}</h3>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                      <FaStar /> {tech.averageRating || "New"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <FaMapMarkerAlt size={12} /> {tech.city}
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="font-bold text-accent">
                      LKR {tech.basePrice}
                    </span>
                    <button
                      onClick={() => handleAssign(tech.id)}
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 flex items-center gap-2"
                    >
                      Assign <FaCheck size={12} />
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
