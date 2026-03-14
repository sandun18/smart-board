import React, { useEffect, useMemo, useState } from "react";
import TechnicianLayout from "../../components/technician/common/TechnicianLayout";
import HistoryItem from "../../components/technician/history/HistoryItem";
import ReportModal from "../../components/technician/reports/ReportModal";
import { getTechnicianJobs } from "../../api/technician/technicianService";

const normalizeJobs = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const TechnicianHistory = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setErrorText("");
      try {
        const response = await getTechnicianJobs();
        setJobs(normalizeJobs(response));
      } catch (error) {
        setErrorText(error?.response?.data?.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const historyJobs = useMemo(() => {
    return jobs.filter((job) => {
      const status = String(job?.status || "").toUpperCase();
      return status.includes("COMPLETE") || status.includes("DONE") || status.includes("PAID");
    });
  }, [jobs]);

  return (
    <TechnicianLayout title="Work History" subtitle="Review completed work and report issues">
      {loading ? (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">Loading history...</div>
      ) : errorText ? (
        <div className="rounded-xl bg-red-50 text-red-700 p-6 border border-red-200">{errorText}</div>
      ) : historyJobs.length === 0 ? (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 text-gray-500">
          No completed jobs yet.
        </div>
      ) : (
        <div className="space-y-4">
          {historyJobs.map((job) => (
            <HistoryItem
              key={job.id || job.maintenanceId}
              job={job}
              onReport={(pickedJob) => setSelectedJob(pickedJob)}
            />
          ))}
        </div>
      )}

      {selectedJob && <ReportModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </TechnicianLayout>
  );
};

export default TechnicianHistory;
