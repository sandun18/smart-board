import React, { useEffect, useRef, useState } from "react";
import StudentService from "../../../api/student/StudentService";
import { useAuth } from "../../../context/student/StudentAuthContext";
import api from "../../../api/api";
import SignatureCanvas from "react-signature-canvas";
import { useNavigate } from "react-router-dom";

const RegistrationModal = ({ isOpen, onClose, appointment }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const signatureRef = useRef(null);

  const [boarding, setBoarding] = useState(null);
  const [keyMoneyEligible, setKeyMoneyEligible] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState("CARD");

  const [formData, setFormData] = useState({
    numberOfStudents: 1,
    studentNote: "",
    moveInDate: "",
    contractDuration: "",
    emergencyContact: "",
    specialRequirements: "",
  });

  const [signature, setSignature] = useState(null);

  /* ================= LOAD BOARDING ================= */

  useEffect(() => {
    if (!appointment) return;

    StudentService.getBoarding(appointment.boardingId)
      .then((res) => {
        const data = res?.data || res;
        setBoarding(data);
      })
      .catch(() => alert("Failed to load boarding"));
  }, [appointment]);

  /* ================= CHECK PAYMENT STATUS ================= */

  useEffect(() => {
    if (!appointment) return;

    const checkPayment = async () => {
      try {
        setCheckingPayment(true);

        const res = await api.get("/payments/key-money-status", {
          params: { boardingId: appointment.boardingId },
        });

        setKeyMoneyEligible(res.data === true);
      } catch {
        setKeyMoneyEligible(false);
      } finally {
        setCheckingPayment(false);
      }
    };

    checkPayment();
  }, [appointment]);

  /* ================= HANDLE INPUT ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  /* ================= START PAYMENT ================= */

  const startKeyMoneyPayment = async () => {
    try {
      const res = await api.post("/payments/intent", {
        studentId: currentUser.id,
        ownerId: boarding.ownerId,
        boardingId: boarding.id,
        type: "KEY_MONEY",
        amount: boarding.keyMoney,
        description: "Key Money Payment",
      });

      navigate(
        `/student/payments/pay/select-method/${res.data.id}?boardingId=${boarding.id}`
      );
    } catch {
      alert("Unable to start payment");
    }
  };

  /* ================= SIGNATURE ================= */

  const saveSignature = () => {
    if (!signatureRef.current) return;

    const base64 = signatureRef.current
      .getCanvas()
      .toDataURL("image/png");

    setSignature(base64);
  };

  const clearSignature = () => {
    if (!signatureRef.current) return;

    signatureRef.current.clear();
    setSignature(null);
  };

  /* ================= SUBMIT ================= */

  const submitRegistration = async () => {
    if (!keyMoneyEligible) {
      alert("Please complete key money payment first.");
      return;
    }

    if (!signature) {
      alert("Signature required");
      return;
    }

    if (!formData.moveInDate) {
      alert("Move-in date required");
      return;
    }

    try {
      await api.post(`/registrations/student/${currentUser.id}`, {
        boardingId: boarding.id,
        numberOfStudents: Number(formData.numberOfStudents),
        studentNote: formData.studentNote,
        moveInDate: formData.moveInDate,
        contractDuration: formData.contractDuration,
        emergencyContact: formData.emergencyContact,
        specialRequirements: formData.specialRequirements,
        studentSignatureBase64: signature,
        paymentMethod: paymentMethod
      });

      alert("Registration submitted successfully");

      onClose();
    } catch (e) {
      alert(e?.response?.data?.message || "Registration failed");
    }
  };

  if (!isOpen || !boarding) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">

        <h2 className="text-2xl font-bold mb-6">
          Register for {boarding.title}
        </h2>

        {/* SUMMARY */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <p className="font-semibold">{boarding.title}</p>
          <p className="text-gray-500">{boarding.address}</p>
          <p className="text-green-600 font-bold">
            Monthly: Rs {boarding.pricePerMonth}
          </p>
          <p className="text-blue-600 font-bold">
            Key Money: Rs {boarding.keyMoney}
          </p>
        </div>

        {/* STUDENTS */}
        <label className="block text-sm font-semibold">Number of Students</label>
        <input
          id="numberOfStudents"
          type="number"
          value={formData.numberOfStudents}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        {/* NOTE */}
        <label className="block text-sm font-semibold">Note</label>
        <textarea
          id="studentNote"
          value={formData.studentNote}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        {/* MOVE IN */}
        <label className="block text-sm font-semibold">Move-in Date</label>
        <input
          id="moveInDate"
          type="date"
          value={formData.moveInDate}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        {/* CONTRACT */}
        <label className="block text-sm font-semibold">Contract Duration</label>
        <input
          id="contractDuration"
          value={formData.contractDuration}
          onChange={handleChange}
          placeholder="6 Months"
          className="w-full border p-2 rounded mb-4"
        />

        {/* EMERGENCY */}
        <label className="block text-sm font-semibold">Emergency Contact</label>
        <input
          id="emergencyContact"
          value={formData.emergencyContact}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        {/* SPECIAL */}
        <label className="block text-sm font-semibold">Special Requirements</label>
        <textarea
          id="specialRequirements"
          value={formData.specialRequirements}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        {/* PAYMENT METHOD */}
        <label className="block text-sm font-semibold">Payment Method</label>

        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="CARD">Card</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="MOBILE_WALLET">Mobile Wallet</option>
          <option value="BANK_SLIP">Bank Slip</option>
          <option value="CASH">Cash</option>
        </select>

        {/* SIGNATURE */}
        <label className="block text-sm font-semibold mb-2">Signature</label>

        <div className="border rounded bg-gray-100">
          <SignatureCanvas
            ref={signatureRef}
            penColor="black"
            canvasProps={{
              width: 600,
              height: 200,
              className: "w-full",
            }}
          />
        </div>

        <div className="flex justify-between mt-2">
          <button onClick={clearSignature} className="text-red-600 text-sm">
            Clear
          </button>

          <button onClick={saveSignature} className="text-blue-600 text-sm">
            Save Signature
          </button>
        </div>

        {signature && (
          <p className="text-green-600 text-sm mt-2">
            ✔ Signature captured
          </p>
        )}

        {/* PAYMENT */}
        <div className="mt-6 bg-gray-100 p-4 rounded-lg">
          <p className="font-semibold">Key Money Payment</p>

          {keyMoneyEligible ? (
            <p className="text-green-600 font-bold mt-2">
              ✔ Key Money Submitted
            </p>
          ) : (
            <button
              onClick={startKeyMoneyPayment}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
              disabled={checkingPayment}
            >
              Pay Key Money
            </button>
          )}
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={submitRegistration}
            disabled={!keyMoneyEligible || !signature}
            className="px-6 py-2 bg-green-600 text-white rounded disabled:opacity-40"
          >
            Submit Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationModal;