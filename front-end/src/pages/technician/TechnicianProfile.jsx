import React, { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaTools } from "react-icons/fa";
import TechnicianLayout from "../../components/technician/common/TechnicianLayout";
import EditProfileModal from "../../components/technician/profile/EditProfileModal";
import { useTechAuth } from "../../context/technician/TechnicianAuthContext";

const TechnicianProfile = () => {
  const { currentTech, refreshUser } = useTechAuth();
  const [isEditing, setIsEditing] = useState(false);

  const tech = currentTech || {};
  const skills = Array.isArray(tech.skills) ? tech.skills : [];

  return (
    <TechnicianLayout title="My Profile" subtitle="Manage your personal and service information">
      <div className="space-y-6">
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="bg-primary/10 p-6">
            <h2 className="text-2xl font-bold text-gray-900">{tech.fullName || "Technician"}</h2>
            <p className="text-gray-600 mt-1">{tech.role || "TECHNICIAN"}</p>
          </div>

          <div className="p-6 grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 text-gray-700">
              <FaEnvelope className="text-primary" />
              <span>{tech.email || "No email provided"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <FaPhone className="text-primary" />
              <span>{tech.phone || "No phone provided"}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700 md:col-span-2">
              <FaMapMarkerAlt className="text-primary" />
              <span>{tech.address || tech.city || "No address provided"}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold">Base Price: </span>
              <span>LKR {tech.basePrice || "0.00"}</span>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
              <FaTools className="text-primary" />
              Skills
            </div>
            {skills.length === 0 ? (
              <div className="text-gray-500">No skills added yet.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-sm font-semibold border border-orange-100"
                  >
                    {String(skill).replaceAll("_", " ")}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 pb-6">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-accent text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {isEditing && (
        <EditProfileModal
          user={tech}
          onClose={() => setIsEditing(false)}
          onUpdate={async () => {
            if (typeof refreshUser === "function") {
              await refreshUser();
            }
          }}
        />
      )}
    </TechnicianLayout>
  );
};

export default TechnicianProfile;
