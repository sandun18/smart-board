import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import HeaderBar from "../../../components/Owner/common/HeaderBar";

export default function OwnerPaymentApprovals() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/owner/payments/pendingIntents/me");
      setPayments(res.data);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (id) => {
    await api.post(`/owner/payments/${id}/approve`);
    load();
  };

  const reject = async (id) => {
    await api.post(`/payments/${id}/reject`);
    load();
  };

  return (
    <div className="p-6 space-y-6">
      <HeaderBar title="Payment Approvals" />

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : payments.length === 0 ? (
        <p className="text-gray-500">No payments awaiting verification 🎉</p>
      ) : (
        payments.map((p) => (
          <div key={p.id} className="bg-white border rounded-lg p-5 space-y-2">
            <div className="flex justify-between">
              <strong>Rs. {p.amount}</strong>
              <span className="text-sm">{p.method}</span>
            </div>

            <p className="text-gray-600">{p.description}</p>

            {p.method === "BANK_SLIP" && p.referenceId && (
              <img src={p.referenceId} alt="Slip" className="max-h-48 border rounded" />
            )}

            <div className="flex gap-3 pt-3">
              <button onClick={() => approve(p.id)} className="bg-green-600 text-white px-4 py-2 rounded">
                Approve
              </button>
              <button onClick={() => reject(p.id)} className="bg-red-600 text-white px-4 py-2 rounded">
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
