import { useState } from "react";
import api from "../../../api/api";

const UtilityCard = ({ utility, onSaved, onView }) => {
  if (!utility) return null;

  const [month, setMonth] = useState(
    utility.month || new Date().toISOString().slice(0, 7)
  );
  const [electricity, setElectricity] = useState(
    utility.electricityAmount ?? ""
  );
  const [water, setWater] = useState(
    utility.waterAmount ?? ""
  );
  const [loading, setLoading] = useState(false);

  /* =======================
     🔥 MATCH MOBILE DATA
     ======================= */

  const boardingName =
    utility.boardingName || utility.boarding?.title || "Unknown Boarding";

  const baseRent =
    Number(utility.boarding?.pricePerMonth || 0);

  const studentCount =
    Number(utility.boarding?.currentStudents || 0);

  const perStudentUtility =
    Number(utility.perStudentUtility || 0);

  const totalUtility =
    Number(electricity || 0) + Number(water || 0);

  /* ======================= */

  const handleSave = async () => {
    if (!month || electricity === "" || water === "") {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await api.post("/owner/utilities", {
        boardingId: utility.boardingId,
        month,
        electricityAmount: Number(electricity),
        waterAmount: Number(water),
      });

      onSaved?.();
    } catch (err) {
      console.error(err);
      alert("Failed to save utility data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card-bg border border-light rounded-xl p-4 space-y-4 shadow-sm">

      {/* HEADER */}
      <div>
        <h3 className="text-sm font-bold text-text">
          {boardingName}
        </h3>

       
      </div>

      {/* INPUTS */}
      <div className="space-y-3">
        <div>
          <label className="text-xs font-semibold">Billing Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold">Electricity (LKR)</label>
          <input
            type="number"
            value={electricity}
            onChange={(e) => setElectricity(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-semibold">Water (LKR)</label>
          <input
            type="number"
            value={water}
            onChange={(e) => setWater(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="bg-light/40 rounded-lg p-3 text-xs">
        <div className="flex justify-between">
          <span>Total Utility</span>
          <span>LKR {totalUtility.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-accent">
          <span>Per Student</span>
          <span>LKR {perStudentUtility.toFixed(2)}</span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase transition ${
            loading
              ? "bg-gray-300"
              : "bg-accent text-white hover:bg-primary"
          }`}
        >
          Update Utilities
        </button>

        {onView && (
          <button
            onClick={onView}
            className="px-3 py-2 rounded-lg text-xs font-bold border"
          >
            View
          </button>
        )}
      </div>
    </div>
  );
};

export default UtilityCard;
