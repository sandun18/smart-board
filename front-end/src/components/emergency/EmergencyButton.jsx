import React, { useState } from "react";
import api from "../../api/api";

export default function EmergencyButton({ boardingId }) {
  const [loading, setLoading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const triggerEmergency = async () => {
    try {
      setLoading(true);

      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const payload = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };

          console.log("📍 Sending emergency location:", payload);

          await api.post(
            `/emergency/trigger?boardingId=${boardingId}`,
            payload
          );

          alert("Emergency alert sent to owner.");
          setConfirmVisible(false);
        },
        (error) => {
          console.error(error);
          alert("Failed to get location.");
        },
        {
          enableHighAccuracy: true,
        }
      );
    } catch (err) {
      console.error("Emergency failed", err);
      alert("Failed to send emergency alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setConfirmVisible(true)}
        style={styles.emergencyBtn}
      >
        🚨 EMERGENCY
      </button>

      {confirmVisible && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3 style={{ color: "#fecaca" }}>⚠ Emergency Alert</h3>

            <p style={{ color: "#e5e7eb" }}>
              Your current location will be shared with the owner.
            </p>

            <div style={styles.row}>
              <button
                onClick={() => setConfirmVisible(false)}
                style={styles.cancel}
              >
                Cancel
              </button>

              <button
                onClick={triggerEmergency}
                disabled={loading}
                style={styles.confirm}
              >
                {loading ? "Sending..." : "Send Alert"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  emergencyBtn: {
    background: "#dc2626",
    color: "white",
    padding: "16px",
    borderRadius: "16px",
    border: "none",
    fontWeight: "800",
    fontSize: "16px",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.75)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#020617",
    padding: "24px",
    borderRadius: "18px",
    width: "400px",
  },

  row: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },

  cancel: {
    background: "transparent",
    color: "#94a3b8",
    border: "none",
    cursor: "pointer",
  },

  confirm: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "10px",
    cursor: "pointer",
  },
};