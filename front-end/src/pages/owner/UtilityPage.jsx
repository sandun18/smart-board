import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import HeaderBar from "../../components/Owner/common/HeaderBar";
import UtilityCard from "../../components/Owner/utilities/UtilityCard";

export default function UtilityPage() {
  const navigate = useNavigate();
  const [utilities, setUtilities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUtilities();
  }, []);

  const loadUtilities = async () => {
    try {
      setLoading(true);
      const res = await api.get("/owner/utilities");
      setUtilities(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <HeaderBar title="Utilities" />

      {loading ? (
        <div className="text-center text-gray-500">
          Loading utilities...
        </div>
      ) : utilities.length === 0 ? (
        <div className="text-center text-gray-500">
          No utility bills yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {utilities.map((u) => (
            <UtilityCard
              key={u.id}
              utility={u}
              onView={() =>
                navigate(
                  `/owner/utility/details?boardingId=${u.boardingId}&month=${u.month}&boardingName=${u.boarding?.title || u.boardingTitle}`
                )
              }
            />
          ))}
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 pt-6">
        <button
          onClick={() => navigate("/owner/utility/payment-verify")}
          className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold"
        >
          Payment Approvals
        </button>

        <button
          onClick={() => navigate("/owner/utility/add")}
          className="px-5 py-3 bg-emerald-600 text-white rounded-lg font-semibold"
        >
          + Add / Update Utilities
        </button>
      </div>
    </div>
  );
}
