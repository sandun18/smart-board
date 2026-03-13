import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaTimes, FaSave, FaTools } from "react-icons/fa";
import { updateTechnicianProfile } from "../../../api/technician/technicianService";
import toast from "react-hot-toast";

const SKILL_OPTIONS = [
  { value: "PLUMBING", label: "Plumbing" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "FURNITURE", label: "Furniture Repair" },
  { value: "APPLIANCE", label: "Appliance Repair" },
  { value: "CLEANING", label: "Cleaning Services" },
  { value: "PEST", label: "Pest Control" },
  { value: "OTHER", label: "General / Other" }
];

const EditProfileModal = ({ user, onClose, onUpdate }) => {
  // ✅ FIX: Safe access with ?. and fallback to empty string
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    city: user?.city || "",
    basePrice: user?.basePrice || "",
    address: user?.address || ""
  });

  // ✅ FIX: Safe access for skills array
  const [selectedSkills, setSelectedSkills] = useState(user?.skills || []);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillChange = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateTechnicianProfile({ ...formData, skills: selectedSkills });
      toast.success("Profile Updated!");
      if (onUpdate) onUpdate(); // Refresh parent
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        <div className="bg-primary p-4 text-white flex justify-between items-center">
          <h2 className="font-bold text-lg">Edit Profile</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full"><FaTimes /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="block text-sm font-bold text-gray-700">Full Name</label><input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border rounded-xl p-3" /></div>
          
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-bold text-gray-700">Phone</label><input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border rounded-xl p-3" /></div>
            <div><label className="block text-sm font-bold text-gray-700">Base Price (LKR)</label><input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} className="w-full border rounded-xl p-3" /></div>
          </div>
          
          <div><label className="block text-sm font-bold text-gray-700">City</label><input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border rounded-xl p-3" /></div>
          
          <div><label className="block text-sm font-bold text-gray-700">Full Address</label><textarea name="address" value={formData.address} onChange={handleChange} className="w-full border rounded-xl p-3" rows="2" /></div>

          {/* Skills Editor */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <label className=" text-sm font-bold text-gray-700 mb-2 flex items-center gap-2"><FaTools className="text-accent"/> Skills</label>
            <div className="grid grid-cols-2 gap-2">
               {SKILL_OPTIONS.map((skill) => (
                 <label key={skill.value} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${selectedSkills.includes(skill.value) ? "bg-accent/10 border-accent text-accent" : "bg-white border-gray-200"}`}>
                    <input type="checkbox" checked={selectedSkills.includes(skill.value)} onChange={() => handleSkillChange(skill.value)} className="accent-accent w-4 h-4" />
                    <span className="text-xs font-bold">{skill.label}</span>
                 </label>
               ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors">
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProfileModal;