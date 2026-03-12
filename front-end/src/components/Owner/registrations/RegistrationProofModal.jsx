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
          className="w-full max-w-xl overflow-hidden bg-white shadow-2xl rounded-2xl"
        >

          {/* HEADER */}

          <div className="flex items-center gap-4 p-6 text-white bg-primary">

            <FaReceipt size={24} />

            <div>
              <h3 className="text-lg font-black">
                Registration Review
              </h3>
              <p className="text-xs opacity-80">
                Approve or reject tenant registration
              </p>
            </div>

          </div>


          <div className="p-6 space-y-5">

            {/* STUDENT INFO */}

            <div className="space-y-1 text-sm">

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

            <div className="p-4 border rounded-lg bg-gray-50">

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

                  <p className="mb-2 text-xs font-bold uppercase text-muted">
                    Bank Slip
                  </p>

                  <img
                    src={registration.paymentSlipUrl}
                    className="border rounded-lg"
                  />

                </div>
              )}

            {/* STUDENT NOTE */}

            {registration.studentNote && (

              <div className="flex gap-3 p-3 border border-blue-200 rounded-lg bg-blue-50">

                <FaInfoCircle className="mt-1 text-blue-500" />

                <div>

                  <p className="text-xs font-bold text-blue-500 uppercase">
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
                className="w-full p-3 mt-1 border rounded-lg"
                placeholder="Write a note for the student"
              />

            </div>

            {/* SIGNATURE */}

            <div>

              <label className="text-xs font-bold uppercase text-muted">
                Owner Signature *
              </label>

              <div className="mt-2 bg-gray-100 border rounded-lg">

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
                  className="text-sm text-red-600"
                >
                  Clear
                </button>

                <button
                  onClick={saveSignature}
                  className="text-sm text-blue-600"
                >
                  Save Signature
                </button>

              </div>

              {ownerSignature && (
                <p className="mt-1 text-sm text-green-600">
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
                className="flex items-center justify-center gap-2 py-3 font-bold text-white bg-red-500 rounded-lg"
              >
                <FaTimes /> Decline
              </button>

              <button
                disabled={processing}
                onClick={() =>
                  handleSubmit("APPROVED")
                }
                className="flex items-center justify-center gap-2 py-3 font-bold text-white bg-green-600 rounded-lg"
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
              className="w-full pt-2 text-sm text-gray-500"
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