import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../../api/api";
import HeaderBar from "../../../components/Owner/common/HeaderBar";

export default function UtilityDetails() {
  const [params] = useSearchParams();
  const boardingId = params.get("boardingId");
  const month = params.get("month");
  const boardingName = params.get("boardingName");

  const [paid, setPaid] = useState([]);
  const [unpaid, setUnpaid] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      setLoading(true);
      const res = await api.get("/bills/owner");

      const filtered = res.data.filter(
        (b) =>
          String(b.boardingId) === String(boardingId) &&
          b.month === month
      );

      setPaid(filtered.filter((b) => b.status === "PAID"));
      setUnpaid(filtered.filter((b) => b.status === "UNPAID"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <HeaderBar title={boardingName} subtitle={`Utility Payments • ${month}`} />

      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : (
        <>
          <Section title="Paid Students" color="text-green-600" data={paid} />
          <Section title="Unpaid Students" color="text-red-600" data={unpaid} />
        </>
      )}
    </div>
  );
}

function Section({ title, color, data }) {
  return (
    <div>
      <h3 className={`font-bold mb-3 ${color}`}>
        {title} ({data.length})
      </h3>

      {data.length === 0 ? (
        <p className="text-gray-400 italic">No students</p>
      ) : (
        <div className="space-y-3">
          {data.map((s) => (
            <div
              key={s.id}
              className="bg-white border rounded-lg p-4 flex justify-between"
            >
              <span className="font-semibold">{s.studentName}</span>
              <span className="font-bold text-blue-600">
                Rs {s.totalAmount}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
