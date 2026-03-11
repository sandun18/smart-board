import React from "react";
import { FaPaperclip } from "react-icons/fa";

const ReportFormFields = ({ formData, setFormData }) => {
  
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Type & Severity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Issue Type</label>
          <select
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition-all"
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
          >
            <option value="NON_PAYMENT">Non-Payment of Fees</option>
            <option value="UNSAFE_ENVIRONMENT">Unsafe Environment</option>
            <option value="HARASSMENT">Harassment / Rude Behavior</option>
            <option value="FRAUD">Fraud / Scam</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Severity</label>
          <select
            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition-all"
            value={formData.severity}
            onChange={(e) => handleChange("severity", e.target.value)}
          >
            <option value="LOW">Low - Minor Issue</option>
            <option value="MEDIUM">Medium - Needs Attention</option>
            <option value="HIGH">High - Urgent / Critical</option>
          </select>
        </div>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Report Title</label>
        <input
          type="text"
          placeholder="E.g., Owner refused to pay agreed amount"
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none transition-all"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Detailed Description</label>
        <textarea
          rows="4"
          placeholder="Describe exactly what happened..."
          required
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-200 focus:border-red-500 outline-none resize-none transition-all"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
        ></textarea>
      </div>

      {/* Evidence Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:bg-gray-50 transition-colors">
        <label className="cursor-pointer block">
          <span className="text-sm font-bold text-gray-700 mb-1 flex items-center gap-2">
            <FaPaperclip className="text-red-500" /> Attach Proof (Optional)
          </span>
          <input
            type="file"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-red-50 file:text-red-600 hover:file:bg-red-100 transition-all"
            onChange={(e) => handleChange("evidence", e.target.files[0])}
          />
          <p className="text-xs text-gray-400 mt-2">Upload screenshots, photos, or documents (Max 5MB)</p>
        </label>
      </div>
    </div>
  );
};

export default ReportFormFields;