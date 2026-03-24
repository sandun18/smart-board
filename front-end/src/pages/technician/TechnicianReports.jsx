import React, { useState } from "react";
import TechnicianLayout from "../../components/technician/common/TechnicianLayout";
import { useTechAuth } from "../../context/technician/TechnicianAuthContext";
import { createTechnicianReport } from "../../api/technician/technicianService";
import toast from "react-hot-toast";
import { FaExclamationTriangle } from "react-icons/fa";

const TechnicianReports = () => {
  const { currentTech } = useTechAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "PAYMENT_ISSUE",
    severity: "MEDIUM",
    ownerId: "",
    boardingName: "General",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.ownerId)
      return toast.error("Please enter the Owner ID (or Job ID)");
    const data = new FormData();
    data.append("reportTitle", formData.title);
    data.append("reportDescription", formData.description);
    data.append("type", formData.type);
    data.append("severity", formData.severity);
    data.append("senderId", currentTech.id);
    data.append("reportedUserId", formData.ownerId);
    data.append("boarding", formData.boardingName);
    data.append("incidentDate", new Date().toISOString().split("T")[0]);
    data.append("allowContact", true);

    try {
      await createTechnicianReport(data);
      toast.success("Report Submitted Successfully");
      setFormData({ ...formData, title: "", description: "" });
    } catch (error) {
      toast.error("Failed to submit report");
    }
  };

  return (
    <TechnicianLayout
      title="Report Issue"
      subtitle="Report problems with Owners or Boardings"
    >
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-6 text-red-600">
          <FaExclamationTriangle size={24} />
          <h2 className="text-xl font-bold">Submit a Report</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Issue Type
              </label>
              <select
                className="w-full border rounded-xl p-3"
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
              >
                <option value="PAYMENT_ISSUE">Payment Issue</option>
                <option value="HARASSMENT">Harassment</option>
                <option value="SAFETY">Safety Concern</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Severity
              </label>
              <select
                className="w-full border rounded-xl p-3"
                value={formData.severity}
                onChange={(e) =>
                  setFormData({ ...formData, severity: e.target.value })
                }
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Owner ID
            </label>
            <input
              type="number"
              className="w-full border rounded-xl p-3"
              placeholder="Enter Owner ID"
              value={formData.ownerId}
              onChange={(e) =>
                setFormData({ ...formData, ownerId: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              className="w-full border rounded-xl p-3"
              placeholder="e.g., Payment issue"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded-xl p-3"
              rows="4"
              placeholder="Describe..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition-colors"
          >
            Submit Report
          </button>
        </form>
      </div>
    </TechnicianLayout>
  );
};

export default TechnicianReports;
