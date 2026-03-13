import React, { useState, useEffect } from "react";
import PaymentGatewayModal from "./PaymentGatewayModal";
import { useAuth } from "../../../context/student/StudentAuthContext";

import StudentService from "../../../api/student/StudentService";

const RegistrationModal = ({ isOpen, onClose, onSubmit, appointment }) => {
  const { currentUser } = useAuth(); // Get logged-in user details
  const [step, setStep] = useState(1);

  const [autoKeyMoney, setAutoKeyMoney] = useState(0);

  // Logic: When modal opens, ensure we have the correct Key Money amount
  useEffect(() => {
    if (isOpen && appointment) {
        // Option A: Use data passed in props (if backend updated)
        if (appointment.keyMoney) {
            setAutoKeyMoney(appointment.keyMoney);
        } 
        // Option B: Safety Net - Fetch fresh data from backend
        else if (appointment.boardingId) {
            StudentService.getBoarding(appointment.boardingId)
                .then(data => {
                    // Handle potential response variations
                    const amount = data.keyMoney || (data.data && data.data.keyMoney) || 0;
                    setAutoKeyMoney(amount);
                })
                .catch(err => console.error("Error fetching price", err));
        }
    }
  }, [isOpen, appointment]);
  const [formData, setFormData] = useState({
    studentName: "",
    studentPhone: "",
    moveInDate: "",
    contractDuration: "",
    emergencyContact: "",
    emergencyPhone: "",
    specialRequirements: "",
    agreeTerms: false,
  });

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData((prev) => ({
        ...prev,
        studentName: currentUser.name || currentUser.fullName || "",
        studentPhone: currentUser.phone || currentUser.phoneNumber || ""
      }));
    }
  }, [isOpen, currentUser]);

  const handleChange = (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.id]: value });
  };

  const handleNext = () => {
    if (
      !formData.studentName ||
      !formData.studentPhone ||
      !formData.moveInDate ||
      !formData.contractDuration ||
      !formData.emergencyContact ||
      !formData.agreeTerms
    ) {
      alert("Please fill in all required fields and agree to the terms.");
      return;
    }
    setStep(2); // Open Payment Gateway
  };

  const handlePaymentSuccess = (transactionId, paidAmount) => {
    const finalData = {
        ...formData,
        paymentMethod: "CARD",
        transactionId: transactionId,
        keyMoneyPaidAmount: paidAmount
    };
    onSubmit(finalData); 
  };

  if (!isOpen || !appointment) return null;

  return (
    <>
      {/* STEP 1: REGISTRATION FORM */}
      {step === 1 && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl w-11/12 max-w-2xl relative animate-modalSlideIn max-h-[90vh] overflow-y-auto">
            <span 
              className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-400 hover:text-gray-600 transition-colors" 
              onClick={onClose}
            >&times;</span>
            
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Register for {appointment.boardingName}</h3>
            <p className="text-gray-500 mb-6 text-sm">Fill in your details to generate your rental agreement.</p>


            {/* ✅ DISPLAY KEY MONEY INFO HERE */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center">
                <div>
                    <p className="text-blue-800 font-semibold text-sm">Required Key Money</p>
                    <p className="text-xs text-blue-600">This amount will be locked in the payment step.</p>
                </div>
                <span className="text-blue-900 font-bold text-xl">
                    LKR {autoKeyMoney ? autoKeyMoney.toLocaleString() : "0.00"}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* ✅ NEW: Student Name */}
              <div className="form-group">
                <label className="block font-semibold mb-1 text-gray-700 text-sm">Full Name (for Contract) *</label>
                <input 
                  type="text" 
                  id="studentName" 
                  value={formData.studentName} 
                  onChange={handleChange} 
                  placeholder="e.g. John Doe"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              {/* ✅ NEW: Student Phone */}
              <div className="form-group">
                <label className="block font-semibold mb-1 text-gray-700 text-sm">Your Phone Number *</label>
                <input 
                  type="tel" 
                  id="studentPhone" 
                  value={formData.studentPhone} 
                  onChange={handleChange} 
                  placeholder="e.g. 077 123 4567"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              {/* Move-in Date */}
              <div className="form-group">
                <label className="block font-semibold mb-1 text-gray-700 text-sm">Move-in Date *</label>
                <input 
                  type="date" 
                  id="moveInDate" 
                  value={formData.moveInDate} 
                  onChange={handleChange} 
                  min={new Date().toISOString().split("T")[0]} 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              {/* ✅ UPDATED: Contract Duration */}
              <div className="form-group">
                <label className="block font-semibold mb-1 text-gray-700 text-sm">Agreement Period (Contract) *</label>
                <select 
                  id="contractDuration" 
                  value={formData.contractDuration} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="" disabled>Select period</option>
                  <option value="6 Months">6 Months</option>
                  <option value="1 Year">1 Year</option>
                  <option value="2 Years">2 Years</option>
                </select>
              </div>

              {/* Emergency Contact */}
              <div className="form-group">
                <label className="block font-semibold mb-1 text-gray-700 text-sm">Emergency Contact Name *</label>
                <input 
                  type="text" 
                  id="emergencyContact" 
                  value={formData.emergencyContact} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>

              {/* Emergency Phone */}
              <div className="form-group">
                <label className="block font-semibold mb-1 text-gray-700 text-sm">Emergency Phone *</label>
                <input 
                  type="tel" 
                  id="emergencyPhone" 
                  value={formData.emergencyPhone} 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" 
                />
              </div>
            </div>

            {/* Special Requirements */}
            <div className="form-group mt-4">
              <label className="block font-semibold mb-1 text-gray-700 text-sm">Special Requirements</label>
              <textarea 
                id="specialRequirements" 
                value={formData.specialRequirements} 
                onChange={handleChange} 
                rows="2" 
                placeholder="Any dietary restrictions or allergies?"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              ></textarea>
            </div>

            {/* Terms Checkbox */}
            <div className="form-group mt-4">
              <label className="flex items-center gap-3 cursor-pointer text-sm text-gray-600 select-none">
                <input 
                  type="checkbox" 
                  id="agreeTerms" 
                  checked={formData.agreeTerms} 
                  onChange={handleChange} 
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500" 
                />
                I agree to the boarding house rules and terms of service
              </label>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={onClose} 
                className="px-6 py-2 rounded-lg border text-gray-600 hover:bg-gray-100 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleNext} 
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                 Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: PAYMENT GATEWAY */}
      <PaymentGatewayModal 
        isOpen={step === 2}
        onClose={() => setStep(1)} // Go back to form
        defaultAmount={autoKeyMoney}
        onPaymentComplete={handlePaymentSuccess}
      />
    </>
  );
};

export default RegistrationModal;