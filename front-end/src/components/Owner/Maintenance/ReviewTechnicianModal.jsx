import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { reviewTechnician } from "../../../api/owner/service";
import toast from "react-hot-toast";

const ReviewTechnicianModal = ({ request, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Please select a star rating");
    setLoading(true);
    try {
      await reviewTechnician(request.id, rating, comment);
      toast.success("Review Submitted! Job Completed.");
      onSuccess();
      onClose();
    } catch (error) {
      toast.error("Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
      >
        <div className="bg-primary p-6 text-white text-center">
          <h2 className="text-xl font-bold">Rate the Work</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={32}
                className={`cursor-pointer ${i + 1 <= rating ? "text-yellow-400" : "text-gray-200"}`}
                onClick={() => setRating(i + 1)}
              />
            ))}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Comment
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3"
              rows="3"
              placeholder="How was the service?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
export default ReviewTechnicianModal;
