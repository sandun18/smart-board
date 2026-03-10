import React from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../../../../../api/api";
import StudentLayout from "../../../../../components/student/common/StudentLayout";

const CashPayment = () => {
  const { intentId } = useParams();
  const [params] = useSearchParams();
  const boardingId = params.get("boardingId");
  const navigate = useNavigate();

  const confirmCash = async () => {
    try {
      await api.post(`/payments/cash/${intentId}`);
      alert("Cash payment submitted. Awaiting owner verification.");
      navigate(`/student/boardings/register/${boardingId}`);
    } catch {
      alert("Failed to submit cash payment");
    }
  };

  return (
    <StudentLayout
      title="Cash Payment"
      subtitle="Confirm cash payment to the boarding owner"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-xl">
        <p className="text-sm text-text-muted mb-4">
          Confirm that you have already paid the boarding owner in cash.
        </p>

        <button
          onClick={confirmCash}
          className="bg-green-600 hover:bg-green-700 transition-colors
                     text-white font-bold px-6 py-3 rounded-large"
        >
          I Have Paid Cash
        </button>
      </div>
    </StudentLayout>
  );
};

export default CashPayment;
