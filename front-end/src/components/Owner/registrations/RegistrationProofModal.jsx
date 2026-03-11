import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignatureCanvas from "react-signature-canvas";
import {
  FaCheck,
  FaTimes,
  FaReceipt,
  FaInfoCircle
} from "react-icons/fa";

const RegistrationProofModal = ({
  isOpen,
  onClose,
  registration,
  onDecide
}) => {

  const signatureRef = useRef(null);

  const [ownerNote, setOwnerNote] = useState("");
  const [ownerSignature, setOwnerSignature] = useState(null);
  const [processing, setProcessing] = useState(false);

  if (!isOpen || !registration) return null;

  /* ================= SIGNATURE ================= */

  const saveSignature = () => {
    if (!signatureRef.current) return;

    const base64 = signatureRef.current
      .getCanvas()
      .toDataURL("image/png");

    setOwnerSignature(base64);
  };

  const clearSignature = () => {
    if (!signatureRef.current) return;

    signatureRef.current.clear();
    setOwnerSignature(null);
  };

  /* ================= DECISION ================= */

  const handleSubmit = async (status) => {

    if (processing) return;

    if (status === "APPROVED" && !ownerSignature) {
      alert("Owner signature required");
      return;
    }

    const approvingPendingPayment =
      status === "APPROVED" &&
      registration.paymentMethod !== "CARD" &&
      registration.paymentVerified !== true;

    const payload = {
      status,
      ownerNote,
      ownerSignatureBase64:
        status === "APPROVED" ? ownerSignature : null,
      approveWithPendingPayment: approvingPendingPayment
    };

    setProcessing(true);

    const success = await onDecide(
      registration.id,
      payload
    );

    setProcessing(false);

    if (success) {
      setOwnerNote("");
      setOwnerSignature(null);
      onClose();
    }
  };

  return (
    <AnimatePresence>

      <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">

        <motion.div
          initial={{ opacity: 0, scale: .9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        >

          {/* HEADER */}

          <div className="flex items-center gap-4 p-6 bg-primary text-white">

            <FaReceipt size={24} />

            <div>
              <h3 className="font-black text-lg">
                Registration Review
              </h3>
              <p className="text-xs opacity-80">
                Approve or reject tenant registration
              </p>
            </div>

          </div>


          <div className="p-6 space-y-5">

            {/* STUDENT INFO */}

            <div className="text-sm space-y-1">

              <p>
                <b>Student:</b> {registration.studentName}
              </p>

              <p>
                <b>Boarding:</b> {registration.boardingTitle}
              </p>

              <p>
                <b>Students:</b> {registration.numberOfStudents}
              </p>

              <p>
                <b>Move-in:</b> {new Date(
                  registration.moveInDate
                ).toLocaleDateString()}
              </p>

            </div>

            {/* PAYMENT */}

            <div className="bg-gray-50 p-4 rounded-lg border">

              <p className="font-semibold">
                Key Money: Rs {registration.keyMoney}
              </p>

              <p className="text-sm text-gray-600">
                Payment Method: {registration.paymentMethod}
              </p>

            </div>

            {/* BANK SLIP */}

            {registration.paymentMethod === "BANK_SLIP" &&
              registration.paymentSlipUrl && (

                <div>

                  <p className="text-xs font-bold uppercase text-muted mb-2">
                    Bank Slip
                  </p>

                  <img
                    src={registration.paymentSlipUrl}
                    className="rounded-lg border"
                  />

                </div>
              )}

            {/* STUDENT NOTE */}

            {registration.studentNote && (

              <div className="flex gap-3 bg-blue-50 border border-blue-200 p-3 rounded-lg">

                <FaInfoCircle className="text-blue-500 mt-1" />

                <div>

                  <p className="text-xs font-bold uppercase text-blue-500">
                    Student Note
                  </p>

                  <p className="text-sm">
                    {registration.studentNote}
                  </p>

                </div>

              </div>

            )}

            {/* OWNER NOTE */}

            <div>

              <label className="text-xs font-bold uppercase text-muted">
                Owner Note
              </label>

              <textarea
                value={ownerNote}
                onChange={(e) =>
                  setOwnerNote(e.target.value)
                }
                className="w-full border rounded-lg p-3 mt-1"
                placeholder="Write a note for the student"
              />

            </div>

            {/* SIGNATURE */}

            <div>

              <label className="text-xs font-bold uppercase text-muted">
                Owner Signature *
              </label>

              <div className="border rounded-lg bg-gray-100 mt-2">

                <SignatureCanvas
                  ref={signatureRef}
                  penColor="black"
                  canvasProps={{
                    width: 600,
                    height: 180,
                    className: "w-full"
                  }}
                />

              </div>

              <div className="flex justify-between mt-2">

                <button
                  onClick={clearSignature}
                  className="text-red-600 text-sm"
                >
                  Clear
                </button>

                <button
                  onClick={saveSignature}
                  className="text-blue-600 text-sm"
                >
                  Save Signature
                </button>

              </div>

              {ownerSignature && (
                <p className="text-green-600 text-sm mt-1">
                  Signature captured
                </p>
              )}

            </div>

            {/* ACTIONS */}

            <div className="grid grid-cols-2 gap-3 pt-3">

              <button
                disabled={processing}
                onClick={() =>
                  handleSubmit("DECLINED")
                }
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-red-500 text-white font-bold"
              >
                <FaTimes /> Decline
              </button>

              <button
                disabled={processing}
                onClick={() =>
                  handleSubmit("APPROVED")
                }
                className="flex items-center justify-center gap-2 py-3 rounded-lg bg-green-600 text-white font-bold"
              >
                {processing
                  ? "Processing..."
                  : (
                    <>
                      <FaCheck />
                      Approve
                    </>
                  )}
              </button>

            </div>

            <button
              onClick={onClose}
              className="w-full text-sm text-gray-500 pt-2"
            >
              Cancel
            </button>

          </div>

        </motion.div>

      </div>

    </AnimatePresence>
  );
};

export default RegistrationProofModal;