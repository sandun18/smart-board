import React, { useState } from "react";
import { createTechnicianReport } from "../../../api/technician/technicianService";
import { useTechAuth } from "../../../context/technician/TechnicianAuthContext";
import toast from "react-hot-toast";

import ReportHeader from "./ReportHeader";
import ReportTargetDetails from "./ReportTargetDetails";
import ReportFormFields from "./ReportFormFields";

const ReportModal = ({ job, onClose }) => {
  const { currentTech } = useTechAuth();
  const [loading, setLoading] = useState(false);

  // 1. State for Form Data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "NON_PAYMENT",
    severity: "MEDIUM",
    evidence: null 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    const toastId = toast.loading("Submitting report...");

    try {
      // ✅ 2. CREATE THE PACKAGE (This fixes the JSON error)
      const dataPackage = new FormData();

      // Append Fields
      dataPackage.append("reportTitle", formData.title);
      dataPackage.append("reportDescription", formData.description);
      dataPackage.append("type", formData.type);
      dataPackage.append("severity", formData.severity);
      dataPackage.append("senderId", currentTech.id);
      
      // Handle optional chaining safely
      const ownerId = job.ownerId || (job.boarding && job.boarding.owner && job.boarding.owner.id);
      const ownerName = job.ownerName || (job.boarding && job.boarding.owner && job.boarding.owner.fullName);
      const boardingTitle = job.boardingTitle || (job.boarding && job.boarding.title);

      dataPackage.append("reportedUserId", ownerId); 
      dataPackage.append("reportedPersonName", ownerName);
      dataPackage.append("boarding", boardingTitle);
      
      dataPackage.append("incidentDate", new Date().toISOString().split("T")[0]);
      dataPackage.append("allowContact", true);

      //  3. APPEND FILE
      // This grabs the file from the state you updated in ReportFormFields
      if (formData.evidence) {
        dataPackage.append("evidence", formData.evidence);
      }


      // 🔍 DEBUG: Log what we're sending
      console.log("📦 Sending FormData:");
      for (let [key, value] of dataPackage.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      console.log("📦 Is FormData?", dataPackage instanceof FormData);

      //  4. SEND 'dataPackage' (Not formData)
      await createTechnicianReport(dataPackage);
      
      toast.success("Report submitted successfully!", { id: toastId });
      onClose();
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("Failed to submit report", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <ReportHeader job={job} onClose={onClose} />
        <form onSubmit={handleSubmit} className="p-6">
          <ReportTargetDetails job={job} />
          <div className="my-6">
             <ReportFormFields formData={formData} setFormData={setFormData} />
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">Cancel</button>
            <button type="submit" disabled={loading} className="px-6 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;