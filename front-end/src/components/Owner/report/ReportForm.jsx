import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaPaperPlane,
  FaSync,
  FaCloudUploadAlt,
  FaTimes,
  FaInfoCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaSkullCrossbones,
} from "react-icons/fa";
import { useOwnerAuth } from "../../../context/owner/OwnerAuthContext";
import {
  getOwnerBoardings,
  getBoardingTenants,
} from "../../../api/owner/service";

// Severity Config (Same as Student)
const SEVERITY_LEVELS = [
  {
    value: "LOW",
    label: "Low",
    icon: FaInfoCircle,
    color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    icon: FaExclamationCircle,
    color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
  },
  {
    value: "HIGH",
    label: "High",
    icon: FaTimesCircle,
    color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
  },
  {
    value: "CRITICAL",
    label: "Critical",
    icon: FaSkullCrossbones,
    color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
  },
];

const ReportForm = ({ reportType, onSubmit, onCancel }) => {
  const { currentOwner } = useOwnerAuth();

  // Data State
  const [properties, setProperties] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    incidentDate: "",
    description: "",
    severity: "",
    propertyId: "", // Logic only
    boardingName: "", // Backend DTO
    studentId: "", // Backend DTO
    allowContact: true,
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  // 1. Fetch Boardings on Mount
  useEffect(() => {
    const loadProperties = async () => {
      if (currentOwner?.id) {
        try {
          const data = await getOwnerBoardings(currentOwner.id);
          setProperties(data);
        } catch (error) {
          console.error("Failed to load properties");
        } finally {
          setLoadingData(false);
        }
      }
    };
    loadProperties();
  }, [currentOwner]);

  // 2. Handle Boarding Selection -> Fetch Tenants
  const handlePropertyChange = async (e) => {
    const newPropertyId = e.target.value;
    const selectedProp = properties.find((p) => p.id == newPropertyId);

    setFormData((prev) => ({
      ...prev,
      propertyId: newPropertyId,
      boardingName: selectedProp ? selectedProp.name : "",
      studentId: "", // Reset student
    }));

    if (newPropertyId) {
      const tenantList = await getBoardingTenants(newPropertyId);
      setStudents(tenantList);
    } else {
      setStudents([]);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // File Handling (Same as Student UI)
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 5);
    setFiles(selectedFiles);
    const newPreviews = selectedFiles.map((file) => ({
      name: file.name,
      type: file.type,
      url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    }));
    setPreviews(newPreviews);
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    if (previews[index].url) URL.revokeObjectURL(previews[index].url);
    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.severity ||
      !formData.studentId
    ) {
      alert(
        "Please fill in all required fields (Boarding, Student, Title, Severity, Description)."
      );
      return;
    }
    // Inject the reportType from the grid selection
    onSubmit({ ...formData, reportType: reportType.type }, files);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 border bg-card-bg rounded-large shadow-custom md:p-8 border-light"
    >
      <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
        <h2 className="text-2xl font-bold text-primary">
          Details for {reportType.typeName}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCancel}
          className="flex items-center gap-2 px-3 py-1 text-xs font-semibold transition-all rounded-btn bg-light text-text-dark hover:bg-accent hover:text-white"
        >
          <FaSync /> Change Type
        </motion.button>
      </div>

      <div className="space-y-6">
        {/* --- OWNER SPECIFIC: Boarding & Student Selectors --- */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 font-semibold text-text-dark">
              Select Boarding <span className="text-red-500">*</span>
            </label>
            <select
              name="propertyId"
              value={formData.propertyId}
              onChange={handlePropertyChange}
              disabled={loadingData}
              className="w-full p-3 bg-white border-2 border-light rounded-btn focus:border-accent focus:outline-none"
            >
              <option value="">
                {loadingData ? "Loading..." : "Select Property"}
              </option>
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold text-text-dark">
              Select Student <span className="text-red-500">*</span>
            </label>
            <select
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              disabled={!formData.propertyId || students.length === 0}
              className="w-full p-3 bg-white border-2 border-light rounded-btn focus:border-accent focus:outline-none disabled:bg-gray-100"
            >
              <option value="">
                {!formData.propertyId
                  ? "Select property first"
                  : students.length === 0
                  ? "No students found"
                  : "Select Student"}
              </option>
              {students.map((s) => (
                // Assuming tenants API returns { id, name } or similar
                <option key={s.id} value={s.id}>
                  {s.name} (ID: {s.id})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* --- Standard Fields --- */}
        <div>
          <label className="block mb-2 font-semibold text-text-dark">
            Report Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Late Rent Payment, Noise Complaint"
            className="w-full p-3 border-2 border-light rounded-btn focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-text-dark">
            Date of Incident <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="incidentDate"
            value={formData.incidentDate}
            onChange={handleChange}
            className="w-full p-3 text-gray-500 border-2 border-light rounded-btn focus:border-accent focus:outline-none"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-text-dark">
            Severity Level <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {SEVERITY_LEVELS.map((level) => {
              const Icon = level.icon;
              return (
                <label
                  key={level.value}
                  className="relative cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="severity"
                    value={level.value}
                    checked={formData.severity === level.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div
                    className={`
                      p-3 rounded-btn font-semibold text-sm text-center transition-all duration-300
                      border-2 flex flex-col items-center justify-center gap-2
                      ${
                        formData.severity === level.value
                          ? "border-current scale-105"
                          : "border-transparent bg-gray-50 hover:bg-gray-100"
                      }
                      ${
                        formData.severity === level.value
                          ? level.color
                          : "text-text-muted"
                      }
                    `}
                  >
                    <Icon size={18} />
                    {level.label}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-text-dark">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border-2 resize-none border-light rounded-btn focus:border-accent focus:outline-none"
            placeholder="Provide full details..."
          />
        </div>

        {/* --- Evidence Upload (Visuals Only) --- */}
        <div>
          <label className="block mb-2 font-semibold text-text-dark">
            Evidence (Optional)
          </label>
          <div className="relative">
            <input
              type="file"
              id="evidence"
              accept="image/*,.pdf"
              multiple
              onChange={handleFileChange}
              className="sr-only"
            />
            <label
              htmlFor="evidence"
              className="flex flex-col items-center justify-center p-8 transition-colors border-2 border-dashed cursor-pointer border-light rounded-btn hover:border-accent bg-gray-50"
            >
              <FaCloudUploadAlt className="mb-2 text-4xl text-text-muted" />
              <span className="font-medium text-text-dark">
                Click to upload files
              </span>
            </label>
          </div>
          {previews.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="relative flex items-center justify-center w-20 h-20 overflow-hidden bg-gray-100 border rounded-lg border-light"
                >
                  {preview.url ? (
                    <img
                      src={preview.url}
                      alt="prev"
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FaPaperPlane />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full top-1 right-1"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-light">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 font-semibold transition-all border-2 rounded-large border-text-muted text-text-muted hover:bg-text-muted hover:text-white"
          >
            Cancel
          </button>
          <motion.button
            type="button"
            onClick={handleSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-6 py-3 font-semibold text-white shadow-md rounded-large bg-accent"
          >
            <FaPaperPlane /> Submit Report
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportForm;