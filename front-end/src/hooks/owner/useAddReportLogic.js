import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useOwnerAuth } from "../../context/owner/OwnerAuthContext";
import { getOwnerBoardings, getBoardingTenants } from "../../api/owner/service";
import useReportLogic from "./useReportLogic";

export default function useAddReportLogic() {
  const navigate = useNavigate();
  const { currentOwner } = useOwnerAuth();
  const { submitNewReport, isSubmitting } = useReportLogic();

  // --- State ---
  const [properties, setProperties] = useState([]);
  const [students, setStudents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [newFiles, setNewFiles] = useState([]);

  // Form Data (Matches Java DTO: ReportCreateDTO)
  const [formData, setFormData] = useState({
    reportTitle: "",
    reportDescription: "",
    type: "",
    severity: "",
    boarding: "",
    senderId: currentOwner?.id,
    reportedUserId: "",
    reportedPersonName: "",
    incidentDate: "",
    allowContact: true,
    propertyId: "", // Helper only
  });

  // --- 1. SMART FETCH (Fixes Blank Dropdown) ---
  useEffect(() => {
    const loadProperties = async () => {
      if (!currentOwner?.id) return;

      try {
        setLoadingData(true);
        const data = await getOwnerBoardings(currentOwner.id);

        if (Array.isArray(data) && data.length > 0) {
          console.log("📦 Raw Boarding Data:", data);

          // 🛠️ AUTO-FIX: Detect the correct field names
          const sample = data[0];
          const keys = Object.keys(sample);

          // Find the key that looks like a Name/Title
          const nameKey =
            keys.find(
              (k) =>
                k.toLowerCase().includes("name") ||
                k.toLowerCase().includes("title") ||
                k.toLowerCase().includes("label"),
            ) || "name";

          // Find the key that looks like an ID
          const idKey =
            keys.find((k) => k.toLowerCase().includes("id")) || "id";

          console.log(`🔑 Mapping: ID=[${idKey}], Name=[${nameKey}]`);

          const formatted = data.map((p) => ({
            id: p[idKey],
            // Use the detected key, or fallback to "Property #{id}" so it's never blank
            name: p[nameKey] || `Property #${p[idKey]}`,
          }));

          setProperties(formatted);
        }
      } catch (error) {
        console.error("Failed to load properties", error);
      } finally {
        setLoadingData(false);
      }
    };
    loadProperties();
  }, [currentOwner]);

  // --- 2. Handlers ---
  const handlePropertyChange = async (e) => {
    const selectedId = e.target.value;
    const selectedProp = properties.find(
      (p) => String(p.id) === String(selectedId),
    );

    setFormData((prev) => ({
      ...prev,
      propertyId: selectedId,
      boarding: selectedProp ? selectedProp.name : "", // Sent to backend
      reportedUserId: "",
      reportedPersonName: "",
    }));

    if (selectedId) {
      try {
        const tenantList = await getBoardingTenants(selectedId);
        // Ensure tenants also have 'name' property
        const formattedTenants = tenantList.map((t) => ({
          id: t.id || t.userId,
          name: t.name || t.fullName || t.username || "Unknown Student",
        }));
        setStudents(formattedTenants);
      } catch (err) {
        setStudents([]);
      }
    } else {
      setStudents([]);
    }
  };

  const handleStudentChange = (e) => {
    const sId = e.target.value;
    const student = students.find((s) => String(s.id) === String(sId));
    setFormData((prev) => ({
      ...prev,
      reportedUserId: sId,
      reportedPersonName: student ? student.name : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) =>
    setNewFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  const handleRemoveFile = (i) =>
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, senderId: currentOwner?.id };
    delete payload.propertyId; // Don't send helper field

    const result = await submitNewReport(payload, newFiles);
    if (result.success) {
      alert("Report submitted successfully.");
      navigate("/owner/reports");
    } else {
      alert(result.message || "Failed.");
    }
  };

  return {
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
  };
}
