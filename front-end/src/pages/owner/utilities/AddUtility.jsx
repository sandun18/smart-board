import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/api";
import { uploadImage } from "../../../api/upload";
import HeaderBar from "../../../components/Owner/common/HeaderBar";

export default function AddUtility() {
  const navigate = useNavigate();

  const [boardings, setBoardings] = useState([]);
  const [selectedBoarding, setSelectedBoarding] = useState(null);

  const [month, setMonth] = useState("");
  const [electricity, setElectricity] = useState("");
  const [water, setWater] = useState("");
  const [proofFile, setProofFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBoardings();
  }, []);

  const loadBoardings = async () => {
    const res = await api.get("/registrations/owner/me");
    const unique = [];
    const map = new Map();

    res.data.forEach((r) => {
      if (!map.has(r.boardingId)) {
        map.set(r.boardingId, true);
        unique.push({ id: r.boardingId, title: r.boardingTitle });
      }
    });

    setBoardings(unique);
  };

  const submit = async () => {
    if (!selectedBoarding || !month || !electricity || !water) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setSaving(true);
      let proofUrl = null;

      if (proofFile) {
        proofUrl = await uploadImage(proofFile, "utility-proofs");
      }

      await api.post("/owner/utilities", {
        boardingId: selectedBoarding.id,
        month,
        electricityAmount: electricity,
        waterAmount: water,
        proofUrl,
      });

      navigate("/owner/utilities");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <HeaderBar title="Add Utility Bill" />

      <div className="bg-white border rounded-lg p-6 space-y-4 max-w-xl">
        <div className="space-y-2">
          {boardings.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBoarding(b)}
              className={`w-full text-left p-3 border rounded-lg ${
                selectedBoarding?.id === b.id
                  ? "border-blue-600 bg-blue-50"
                  : ""
              }`}
            >
              {b.title}
            </button>
          ))}
        </div>

        <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
        <input type="number" placeholder="Electricity Amount" value={electricity} onChange={e => setElectricity(e.target.value)} />
        <input type="number" placeholder="Water Amount" value={water} onChange={e => setWater(e.target.value)} />

        <input type="file" accept="image/*" onChange={e => setProofFile(e.target.files[0])} />

        <button
          onClick={submit}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold"
        >
          {saving ? "Saving..." : "Save Utility Bill"}
        </button>
      </div>
    </div>
  );
}
