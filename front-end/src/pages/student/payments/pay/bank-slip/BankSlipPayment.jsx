import React, { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../../../../../api/api";
import { uploadImage } from "../../../../../api/upload";
import StudentLayout from "../../../../../components/student/common/StudentLayout";

const BankSlipPayment = () => {
  const { intentId } = useParams();
  const [params] = useSearchParams();
  const boardingId = params.get("boardingId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const uploadSlip = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const slipUrl = await uploadImage(file, "bank-slips");

      await api.post(`/payments/bank-slip/${intentId}`, null, {
        params: { slipUrl },
      });

      alert("Slip submitted. Awaiting owner verification.");
      navigate(`/student/boardings/register/${boardingId}`);
    } catch (err) {
      console.error(err);
      alert("Slip submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout
      title="Bank Slip Payment"
      subtitle="Upload your payment slip for verification"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 max-w-xl">
        <h2 className="text-lg font-bold text-primary mb-2">
          Upload Bank Slip
        </h2>
        <p className="text-sm text-text-muted mb-4">
          Upload a clear image of your bank payment slip. The owner will verify it.
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={uploadSlip}
          disabled={loading}
          className="block w-full text-sm text-text-muted
            file:mr-4 file:py-2 file:px-4
            file:rounded-large file:border-0
            file:bg-accent file:text-white
            hover:file:bg-primary
            cursor-pointer"
        />

        {loading && (
          <p className="text-sm text-text-muted mt-3">
            Uploading slip, please wait...
          </p>
        )}
      </div>
    </StudentLayout>
  );
};

export default BankSlipPayment;
