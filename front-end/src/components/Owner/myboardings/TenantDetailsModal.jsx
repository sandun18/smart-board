import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaEnvelope, FaPhone, FaCalendarAlt } from "react-icons/fa";

const TenantDetailsModal = ({ tenant, onClose }) => {

  if (!tenant) return null;

  return (
    <AnimatePresence>

      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >

        <motion.div
          className="bg-white rounded-2xl shadow-2xl w-[420px] max-w-[95%] overflow-hidden"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >

          {/* Header */}
          <div className="bg-orange-100 h-28 relative flex items-center justify-center">

            {/* Avatar */}
            <div className="absolute top-14 w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white flex items-center justify-center">

  {tenant?.profileImageUrl ? (
    <img
      src={tenant.profileImageUrl}
      alt={tenant.name}
      className="w-full h-full object-cover"
    />
  ) : (
    <FaUserCircle className="text-5xl text-orange-500" />
  )}

</div>

            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-600"
            >
              ✕
            </button>

          </div>

          {/* Body */}
          <div className="pt-16 px-6 pb-6 text-center">

            <h2 className="text-xl font-bold text-gray-800">
              {tenant.name}
            </h2>

            <p className="text-sm text-gray-500 mb-6">
              ID : {tenant.id}
            </p>

            <div className="bg-gray-100 rounded-xl p-5 space-y-4 text-left">

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500">EMAIL</p>
                  <p className="font-semibold">{tenant.email}</p>
                </div>
              </div>

              <hr />

              <div className="flex items-center gap-3">
                <FaPhone className="text-green-500" />
                <div>
                  <p className="text-xs text-gray-500">PHONE</p>
                  <p className="font-semibold">{tenant.phone || "Not provided"}</p>
                </div>
              </div>

              <hr />

              <div className="flex items-center gap-3">
                <FaCalendarAlt className="text-orange-500" />
                <div>
                  <p className="text-xs text-gray-500">JOINED DATE</p>
                  <p className="font-semibold">{tenant.joinedDate}</p>
                </div>
              </div>

            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
            >
              CLOSE PROFILE
            </button>

          </div>

        </motion.div>

      </motion.div>

    </AnimatePresence>
  );
};

export default TenantDetailsModal;