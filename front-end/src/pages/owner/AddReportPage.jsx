import React from "react";
import { motion } from "framer-motion";
import HeaderBar from "../../components/Owner/common/HeaderBar";
import { SelectGroup, EvidenceUpload } from "../../components/Owner/report/ReportFormComponents";
import useAddReportLogic from "../../hooks/owner/useAddReportLogic";
import { reportTypes } from "../../data/mockData";

const severityOptions = [
  { id: "LOW", name: "Low" },
  { id: "MEDIUM", name: "Medium" },
  { id: "HIGH", name: "High" },
  { id: "CRITICAL", name: "Critical" },
];

export default function AddReportPage() {
  const {
    properties,
    students,
    loadingData,
    formData,
    newFiles,
    isSubmitting,
    handlePropertyChange,
    handleStudentChange,
    handleChange,
    handleFileChange,
    handleRemoveFile,
    handleSubmit,
  } = useAddReportLogic();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pt-4 space-y-6"
    >
      <HeaderBar
        title="Report Student Issue"
        subtitle="Submit a formal report regarding student conduct."
        navBtnText="Back to Reports"
        navBtnPath="/owner/reports"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div className="p-8 bg-white rounded-report shadow-custom">
          <h2 className="text-[1.3rem] font-bold mb-6 pb-3 border-b text-primary border-light">
            Incident Details
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* 1. Property Select (Uses mapped data) */}
            <SelectGroup
              label="Select Boarding Property"
              name="propertyId"
              value={formData.propertyId}
              onChange={handlePropertyChange}
              options={properties}
              placeholder={loadingData ? "Loading..." : "Select Property"}
              disabled={loadingData}
            />

            {/* 2. Student Select (Corrected Name) */}
            <SelectGroup
              label="Select Student"
              name="reportedUserId"  // Matches DTO
              value={formData.reportedUserId}
              onChange={handleStudentChange} // Specific Handler
              options={students}
              placeholder={!formData.propertyId ? "Select property first" : "Select Student"}
              disabled={!formData.propertyId}
            />

            {/* 3. Title (Corrected Name) */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-primary">
                Report Title *
              </label>
              <input
                type="text"
                name="reportTitle" // Matches DTO
                required
                value={formData.reportTitle}
                onChange={handleChange}
                className="w-full p-3.5 px-4 rounded-xl text-sm border border-light focus:outline-none focus:border-accent"
              />
            </div>

            {/* 4. Type (Corrected Name) */}
            <SelectGroup
              label="Type of Incident"
              name="type" // Matches DTO
              value={formData.type}
              onChange={handleChange}
              options={reportTypes}
              placeholder="Choose category"
            />

            {/* 5. Severity (Corrected Name) */}
            <SelectGroup
              label="Severity Level"
              name="severity" // Matches DTO
              value={formData.severity}
              onChange={handleChange}
              options={severityOptions}
              placeholder="Select severity"
            />

            {/* 6. Date */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-primary">
                Date of Incident *
              </label>
              <input
                type="date"
                name="incidentDate"
                required
                value={formData.incidentDate}
                onChange={handleChange}
                className="w-full p-3.5 px-4 rounded-xl text-sm border border-light text-gray-500"
              />
            </div>

            {/* 7. Allow Contact */}
            <div className="flex items-center mt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="allowContact"
                  checked={formData.allowContact}
                  onChange={handleChange}
                  className="w-5 h-5 accent-accent"
                />
                <span className="text-sm font-bold text-text">
                  Allow contact about this report
                </span>
              </label>
            </div>

            {/* 8. Description (Corrected Name) */}
            <div className="md:col-span-2">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-primary">
                Detailed Description *
              </label>
              <textarea
                name="reportDescription" // Matches DTO
                rows="5"
                required
                value={formData.reportDescription}
                onChange={handleChange}
                className="w-full p-3 px-4 border rounded-xl focus:outline-none border-light"
              />
            </div>
          </div>
        </motion.div>

        {/* Evidence Section */}
        <motion.div className="p-8 bg-white rounded-report shadow-custom">
          <h2 className="text-[1.3rem] font-bold mb-6 pb-3 border-b text-primary border-light">
            Evidence (Optional)
          </h2>
          <EvidenceUpload
            onFileChange={handleFileChange}
            files={newFiles}
            onRemoveFile={handleRemoveFile}
          />
        </motion.div>

        <div className="flex justify-end pt-4">
          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 font-bold text-white shadow-lg rounded-3xl bg-error"
          >
            {isSubmitting ? "Submitting..." : "Submit Formal Report"}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}