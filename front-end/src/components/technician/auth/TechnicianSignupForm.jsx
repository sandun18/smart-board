import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaIdCard,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCity,
  FaEye,
  FaEyeSlash,
  FaTools,
} from "react-icons/fa";

// Reusing your helpers
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateRequired,
} from "../../../utils/student/validation.js";

const SKILL_OPTIONS = [
  { value: "PLUMBING", label: "Plumbing" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "FURNITURE", label: "Furniture Repair" },
  { value: "APPLIANCE", label: "Appliance Repair" },
  { value: "CLEANING", label: "Cleaning Services" },
  { value: "PEST", label: "Pest Control" },
  { value: "OTHER", label: "General / Other" },
];

const TechnicianSignupForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    nicNumber: "",
    address: "",
    city: "",
    basePrice: "",
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSkillChange = (skill) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
    // Clear error if user selects a skill
    if (errors.skills) setErrors((prev) => ({ ...prev, skills: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!validateRequired(formData.firstName))
      newErrors.firstName = "First name is required";
    if (!validateRequired(formData.lastName))
      newErrors.lastName = "Last name is required";
    if (!validateEmail(formData.email))
      newErrors.email = "Valid email is required";
    if (!validatePassword(formData.password))
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!validatePhone(formData.phone))
      newErrors.phone = "Valid phone number is required";
    if (!validateRequired(formData.nicNumber))
      newErrors.nicNumber = "NIC is required";
    if (!validateRequired(formData.city)) newErrors.city = "City is required";
    if (!validateRequired(formData.address))
      newErrors.address = "Address is required";
    if (selectedSkills.length === 0)
      newErrors.skills = "Select at least 1 skill";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const payload = {
        fullName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        basePrice: formData.basePrice,
        nicNumber: formData.nicNumber,
        role: "TECHNICIAN",
        skills: selectedSkills,
      };
      onSubmit(payload);
    }
  };

  return (
    <div className="space-y-4">
      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          icon={FaUser}
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          required
        />
        <InputField
          icon={FaUser}
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          required
        />
      </div>

      {/* Email */}
      <InputField
        icon={FaEnvelope}
        label="Email Address"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      {/* Password Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          showPassword={showPassword}
          toggleShow={() => setShowPassword(!showPassword)}
          required
        />
        <PasswordField
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          showPassword={showConfirmPassword}
          toggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
          required
        />
      </div>

      {/* Phone & NIC */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          icon={FaPhone}
          label="Phone Number"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          placeholder="+94 77 123 4567"
          required
        />
        <InputField
          icon={FaIdCard}
          label="NIC Number"
          name="nicNumber"
          value={formData.nicNumber}
          onChange={handleChange}
          error={errors.nicNumber}
          required
        />
      </div>

      {/* Technician Specific: City & Base Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          icon={FaCity}
          label="City (Operating Area)"
          name="city"
          value={formData.city}
          onChange={handleChange}
          error={errors.city}
          placeholder="e.g. Colombo"
          required
        />
        <InputField
          icon={FaMoneyBillWave}
          label="Base Charge (LKR)"
          name="basePrice"
          type="number"
          value={formData.basePrice}
          onChange={handleChange}
          placeholder="1500"
        />
      </div>

      {/* Address */}
      <TextAreaField
        icon={FaMapMarkerAlt}
        label="Permanent Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        error={errors.address}
        required
      />

      {/* SKILLS SELECTION (Custom Styling to Match Theme) */}
      <div
        className={`p-4 border-2 rounded-large transition-colors duration-200 ${
          errors.skills
            ? "border-error bg-red-50/10"
            : "border-gray-200 bg-gray-50/30"
        }`}
      >
        <label className="block text-sm font-semibold text-text-dark mb-3  items-center gap-2">
          <FaTools className="text-text-muted" /> Select Your Skills{" "}
          <span className="text-error">*</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SKILL_OPTIONS.map((skill) => (
            <label
              key={skill.value}
              className={`
                flex items-center gap-3 p-3 rounded-large border-2 cursor-pointer transition-all duration-200
                ${
                  selectedSkills.includes(skill.value)
                    ? "bg-accent/10 border-accent text-accent font-semibold"
                    : "bg-white border-gray-200 text-text-muted hover:border-gray-300"
                }
              `}
            >
              <input
                type="checkbox"
                checked={selectedSkills.includes(skill.value)}
                onChange={() => handleSkillChange(skill.value)}
                className="w-4 h-4 accent-accent cursor-pointer"
              />
              <span className="text-sm">{skill.label}</span>
            </label>
          ))}
        </div>
        {errors.skills && (
          <p className="text-error text-xs mt-2 font-medium">{errors.skills}</p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full py-4 rounded-large font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-accent text-white hover:bg-primary shadow-lg"
        }`}
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            Registering...
          </>
        ) : (
          "Register as Technician"
        )}
      </motion.button>
    </div>
  );
};

// --- Reusable Component Styles (Matching Student/Owner Forms) ---

const InputField = ({ icon: Icon, label, error, required, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-text-dark mb-2">
      {label} {required && <span className="text-error">*</span>}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        {...props}
        className={`w-full pl-12 pr-4 py-3 border-2 rounded-large transition-colors duration-200 focus:outline-none ${
          error
            ? "border-error focus:border-error"
            : "border-gray-200 focus:border-accent"
        }`}
      />
    </div>
    {error && <p className="text-error text-xs mt-1">{error}</p>}
  </div>
);

const PasswordField = ({
  label,
  error,
  required,
  showPassword,
  toggleShow,
  ...props
}) => (
  <div>
    <label className="block text-sm font-semibold text-text-dark mb-2">
      {label} {required && <span className="text-error">*</span>}
    </label>
    <div className="relative">
      <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        {...props}
        type={showPassword ? "text" : "password"}
        className={`w-full pl-12 pr-12 py-3 border-2 rounded-large transition-colors duration-200 focus:outline-none ${
          error
            ? "border-error focus:border-error"
            : "border-gray-200 focus:border-accent"
        }`}
      />
      <button
        type="button"
        onClick={toggleShow}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark"
      >
        {showPassword ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
    {error && <p className="text-error text-xs mt-1">{error}</p>}
  </div>
);

const TextAreaField = ({ icon: Icon, label, error, required, ...props }) => (
  <div>
    <label className="block text-sm font-semibold text-text-dark mb-2">
      {label} {required && <span className="text-error">*</span>}
    </label>
    <div className="relative">
      <Icon className="absolute left-4 top-4 text-text-muted" />
      <textarea
        {...props}
        rows="3"
        className={`w-full pl-12 pr-4 py-3 border-2 rounded-large transition-colors duration-200 focus:outline-none resize-vertical ${
          error
            ? "border-error focus:border-error"
            : "border-gray-200 focus:border-accent"
        }`}
      />
    </div>
    {error && <p className="text-error text-xs mt-1">{error}</p>}
  </div>
);

export default TechnicianSignupForm;
