// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import {
//   FaPaperPlane,
//   FaSync,
//   FaCloudUploadAlt,
//   FaTimes,
//   FaInfoCircle,
//   FaExclamationCircle,
//   FaTimesCircle,
//   FaSkullCrossbones,
// } from "react-icons/fa";
// import { useOwnerAuth } from "../../../context/owner/OwnerAuthContext";
// import {
//   getOwnerBoardings,
//   getBoardingTenants,
// } from "../../../api/owner/service";

// // Severity Config (Same as Student)
// const SEVERITY_LEVELS = [
//   {
//     value: "LOW",
//     label: "Low",
//     icon: FaInfoCircle,
//     color: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
//   },
//   {
//     value: "MEDIUM",
//     label: "Medium",
//     icon: FaExclamationCircle,
//     color: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100",
//   },
//   {
//     value: "HIGH",
//     label: "High",
//     icon: FaTimesCircle,
//     color: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
//   },
//   {
//     value: "CRITICAL",
//     label: "Critical",
//     icon: FaSkullCrossbones,
//     color: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
//   },
// ];

// const ReportForm = ({ reportType, onSubmit, onCancel }) => {
//   const { currentOwner } = useOwnerAuth();

//   // Data State
//   const [properties, setProperties] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [loadingData, setLoadingData] = useState(true);

//   // Form State
//   const [formData, setFormData] = useState({
//     title: "",
//     incidentDate: "",
//     description: "",
//     severity: "",
//     propertyId: "", // Logic only
//     boardingName: "", // Backend DTO
//     studentId: "", // Backend DTO
//     allowContact: true,
//   });

//   const [files, setFiles] = useState([]);
//   const [previews, setPreviews] = useState([]);

//   // 1. Fetch Boardings on Mount
//   useEffect(() => {
//     const loadProperties = async () => {
//       if (currentOwner?.id) {
//         try {
//           const data = await getOwnerBoardings(currentOwner.id);
//           setProperties(data);
//         } catch (error) {
//           console.error("Failed to load properties");
//         } finally {
//           setLoadingData(false);
//         }
//       }
//     };
//     loadProperties();
//   }, [currentOwner]);

//   // 2. Handle Boarding Selection -> Fetch Tenants
//   const handlePropertyChange = async (e) => {
//     const newPropertyId = e.target.value;
//     const selectedProp = properties.find((p) => p.id == newPropertyId);

//     setFormData((prev) => ({
//       ...prev,
//       propertyId: newPropertyId,
//       boardingName: selectedProp ? selectedProp.name : "",
//       studentId: "", // Reset student
//     }));

//     if (newPropertyId) {
//       const tenantList = await getBoardingTenants(newPropertyId);
//       setStudents(tenantList);
//     } else {
//       setStudents([]);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // File Handling (Same as Student UI)
//   const handleFileChange = (e) => {
//     const selectedFiles = Array.from(e.target.files).slice(0, 5);
//     setFiles(selectedFiles);
//     const newPreviews = selectedFiles.map((file) => ({
//       name: file.name,
//       type: file.type,
//       url: file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
//     }));
//     setPreviews(newPreviews);
//   };

//   const removeFile = (index) => {
//     const newFiles = files.filter((_, i) => i !== index);
//     const newPreviews = previews.filter((_, i) => i !== index);
//     if (previews[index].url) URL.revokeObjectURL(previews[index].url);
//     setFiles(newFiles);
//     setPreviews(newPreviews);
//   };

//   const handleSubmit = () => {
//     if (
//       !formData.title ||
//       !formData.description ||
//       !formData.severity ||
//       !formData.studentId
//     ) {
//       alert(
//         "Please fill in all required fields (Boarding, Student, Title, Severity, Description)."
//       );
//       return;
//     }
//     // Inject the reportType from the grid selection
//     onSubmit({ ...formData, reportType: reportType.type }, files);
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       className="bg-card-bg rounded-large shadow-custom p-6 md:p-8 border border-light"
//     >
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <h2 className="text-2xl font-bold text-primary">
//           Details for {reportType.typeName}
//         </h2>
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={onCancel}
//           className="flex items-center gap-2 px-3 py-1 rounded-btn text-xs font-semibold bg-light text-text-dark hover:bg-accent hover:text-white transition-all"
//         >
//           <FaSync /> Change Type
//         </motion.button>
//       </div>

//       <div className="space-y-6">
//         {/* --- OWNER SPECIFIC: Boarding & Student Selectors --- */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block font-semibold text-text-dark mb-2">
//               Select Boarding <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="propertyId"
//               value={formData.propertyId}
//               onChange={handlePropertyChange}
//               disabled={loadingData}
//               className="w-full p-3 border-2 border-light rounded-btn focus:border-accent focus:outline-none bg-white"
//             >
//               <option value="">
//                 {loadingData ? "Loading..." : "Select Property"}
//               </option>
//               {properties.map((p) => (
//                 <option key={p.id} value={p.id}>
//                   {p.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block font-semibold text-text-dark mb-2">
//               Select Student <span className="text-red-500">*</span>
//             </label>
//             <select
//               name="studentId"
//               value={formData.studentId}
//               onChange={handleChange}
//               disabled={!formData.propertyId || students.length === 0}
//               className="w-full p-3 border-2 border-light rounded-btn focus:border-accent focus:outline-none bg-white disabled:bg-gray-100"
//             >
//               <option value="">
//                 {!formData.propertyId
//                   ? "Select property first"
//                   : students.length === 0
//                   ? "No students found"
//                   : "Select Student"}
//               </option>
//               {students.map((s) => (
//                 // Assuming tenants API returns { id, name } or similar
//                 <option key={s.id} value={s.id}>
//                   {s.name} (ID: {s.id})
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         {/* --- Standard Fields --- */}
//         <div>
//           <label className="block font-semibold text-text-dark mb-2">
//             Report Title <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             placeholder="e.g. Late Rent Payment, Noise Complaint"
//             className="w-full p-3 border-2 border-light rounded-btn focus:border-accent focus:outline-none"
//           />
//         </div>

//         <div>
//           <label className="block font-semibold text-text-dark mb-2">
//             Date of Incident <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="date"
//             name="incidentDate"
//             value={formData.incidentDate}
//             onChange={handleChange}
//             className="w-full p-3 border-2 border-light rounded-btn focus:border-accent focus:outline-none text-gray-500"
//           />
//         </div>

//         <div>
//           <label className="block font-semibold text-text-dark mb-2">
//             Severity Level <span className="text-red-500">*</span>
//           </label>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {SEVERITY_LEVELS.map((level) => {
//               const Icon = level.icon;
//               return (
//                 <label
//                   key={level.value}
//                   className="cursor-pointer group relative"
//                 >
//                   <input
//                     type="radio"
//                     name="severity"
//                     value={level.value}
//                     checked={formData.severity === level.value}
//                     onChange={handleChange}
//                     className="sr-only"
//                   />
//                   <div
//                     className={`
//                       p-3 rounded-btn font-semibold text-sm text-center transition-all duration-300
//                       border-2 flex flex-col items-center justify-center gap-2
//                       ${
//                         formData.severity === level.value
//                           ? "border-current scale-105"
//                           : "border-transparent bg-gray-50 hover:bg-gray-100"
//                       }
//                       ${
//                         formData.severity === level.value
//                           ? level.color
//                           : "text-text-muted"
//                       }
//                     `}
//                   >
//                     <Icon size={18} />
//                     {level.label}
//                   </div>
//                 </label>
//               );
//             })}
//           </div>
//         </div>

//         <div>
//           <label className="block font-semibold text-text-dark mb-2">
//             Description <span className="text-red-500">*</span>
//           </label>
//           <textarea
//             name="description"
//             rows="5"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full p-3 border-2 border-light rounded-btn focus:border-accent focus:outline-none resize-none"
//             placeholder="Provide full details..."
//           />
//         </div>

//         {/* --- Evidence Upload (Visuals Only) --- */}
//         <div>
//           <label className="block font-semibold text-text-dark mb-2">
//             Evidence (Optional)
//           </label>
//           <div className="relative">
//             <input
//               type="file"
//               id="evidence"
//               accept="image/*,.pdf"
//               multiple
//               onChange={handleFileChange}
//               className="sr-only"
//             />
//             <label
//               htmlFor="evidence"
//               className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-light rounded-btn cursor-pointer hover:border-accent bg-gray-50 transition-colors"
//             >
//               <FaCloudUploadAlt className="text-4xl text-text-muted mb-2" />
//               <span className="text-text-dark font-medium">
//                 Click to upload files
//               </span>
//             </label>
//           </div>
//           {previews.length > 0 && (
//             <div className="flex gap-3 flex-wrap mt-4">
//               {previews.map((preview, index) => (
//                 <div
//                   key={index}
//                   className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center border border-light"
//                 >
//                   {preview.url ? (
//                     <img
//                       src={preview.url}
//                       alt="prev"
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <FaPaperPlane />
//                   )}
//                   <button
//                     type="button"
//                     onClick={() => removeFile(index)}
//                     className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
//                   >
//                     <FaTimes />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="flex justify-end gap-4 pt-4 border-t border-light">
//           <button
//             type="button"
//             onClick={onCancel}
//             className="px-6 py-3 rounded-large font-semibold border-2 border-text-muted text-text-muted hover:bg-text-muted hover:text-white transition-all"
//           >
//             Cancel
//           </button>
//           <motion.button
//             type="button"
//             onClick={handleSubmit}
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             className="flex items-center gap-2 px-6 py-3 rounded-large font-semibold bg-accent text-white shadow-md"
//           >
//             <FaPaperPlane /> Submit Report
//           </motion.button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default ReportForm;

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane, FaSync } from "react-icons/fa";
import { useOwnerAuth } from "../../../context/owner/OwnerAuthContext";
import {
  getOwnerBoardings,
  getBoardingTenants,
} from "../../../api/owner/service";

const ReportForm = ({ reportType, targetMode, onSubmit, onCancel }) => {
  const { currentOwner } = useOwnerAuth();
  const [properties, setProperties] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "MEDIUM",
    propertyId: "",
    reportedUserId: "",
  });

  useEffect(() => {
    if (targetMode === "STUDENT" && currentOwner?.id) {
      getOwnerBoardings(currentOwner.id)
        .then(setProperties)
        .catch(console.error);
    }
  }, [currentOwner, targetMode]);

  const handlePropertyChange = async (e) => {
    const pid = e.target.value;
    setFormData((p) => ({ ...p, propertyId: pid, reportedUserId: "" }));
    if (pid) getBoardingTenants(pid).then(setStudents);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.reportedUserId)
      return alert("Fill all fields");
    onSubmit({ ...formData, reportType: reportType.type }, []);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-card-bg rounded-large shadow-custom p-8 border border-light"
    >
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">
          Reporting: {reportType.typeName}
        </h2>
        <button
          onClick={onCancel}
          className="flex items-center gap-2 px-3 py-1 rounded-btn bg-light text-text-dark hover:bg-accent hover:text-white"
        >
          <FaSync /> Change
        </button>
      </div>
      <div className="space-y-6">
        {targetMode === "STUDENT" ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Boarding</label>
              <select
                className="w-full p-3 border-2 rounded-btn"
                onChange={handlePropertyChange}
              >
                <option value="">Select Property</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-2">Student</label>
              <select
                className="w-full p-3 border-2 rounded-btn"
                onChange={(e) =>
                  setFormData({ ...formData, reportedUserId: e.target.value })
                }
              >
                <option value="">Select Student</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : (
          <div>
            <label className="block font-semibold mb-2">Technician ID</label>
            <input
              type="text"
              className="w-full p-3 border-2 rounded-btn"
              placeholder="Enter Technician ID"
              onChange={(e) =>
                setFormData({ ...formData, reportedUserId: e.target.value })
              }
            />
          </div>
        )}
        <div>
          <label className="block font-semibold mb-2">Title</label>
          <input
            type="text"
            className="w-full p-3 border-2 rounded-btn"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            className="w-full p-3 border-2 rounded-btn"
            rows="4"
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-accent text-white rounded-large font-bold shadow-md"
          >
            <FaPaperPlane className="inline mr-2" /> Submit Report
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default ReportForm;
