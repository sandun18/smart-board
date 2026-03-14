import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaClipboardList, FaClock, FaUser } from "react-icons/fa";
import TechnicianLayout from "../../components/technician/common/TechnicianLayout";
import { getTechnicianJobs } from "../../api/technician/technicianService";
import { useTechAuth } from "../../context/technician/TechnicianAuthContext";

const normalizeJobs = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const TechnicianDashboard = () => {
  const { currentTech } = useTechAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setErrorText("");
      try {
        const response = await getTechnicianJobs();
        setJobs(normalizeJobs(response));
      } catch (error) {
        setErrorText(error?.response?.data?.message || "Failed to load jobs.");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const stats = useMemo(() => {
    const pending = jobs.filter((j) => String(j?.status || "").toUpperCase().includes("PENDING")).length;
    const completed = jobs.filter((j) => String(j?.status || "").toUpperCase().includes("COMPLETED")).length;
    const inProgress = jobs.filter((j) => String(j?.status || "").toUpperCase().includes("PROGRESS")).length;
    return { pending, completed, inProgress, total: jobs.length };
  }, [jobs]);

  return (
    <TechnicianLayout title="Dashboard" subtitle="Overview of your maintenance work">
      {loading ? (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">Loading dashboard...</div>
      ) : errorText ? (
        <div className="rounded-xl bg-red-50 text-red-700 p-6 border border-red-200">{errorText}</div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-white p-5 border border-gray-100 shadow-sm">
              <div className="text-gray-500 text-sm">Total Jobs</div>
              <div className="text-2xl font-bold text-gray-900 mt-2 flex items-center gap-2">
                <FaClipboardList className="text-blue-500" /> {stats.total}
              </div>
            </div>
            <div className="rounded-xl bg-white p-5 border border-gray-100 shadow-sm">
              <div className="text-gray-500 text-sm">Pending</div>
              <div className="text-2xl font-bold text-gray-900 mt-2 flex items-center gap-2">
                <FaClock className="text-orange-500" /> {stats.pending}
              </div>
            </div>
            <div className="rounded-xl bg-white p-5 border border-gray-100 shadow-sm">
              <div className="text-gray-500 text-sm">In Progress</div>
              <div className="text-2xl font-bold text-gray-900 mt-2 flex items-center gap-2">
                <FaUser className="text-indigo-500" /> {stats.inProgress}
              </div>
            </div>
            <div className="rounded-xl bg-white p-5 border border-gray-100 shadow-sm">
              <div className="text-gray-500 text-sm">Completed</div>
              <div className="text-2xl font-bold text-gray-900 mt-2 flex items-center gap-2">
                <FaCheckCircle className="text-green-600" /> {stats.completed}
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white border border-gray-100 shadow-sm">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Recent Jobs</h2>
              <Link to="/technician/history" className="text-sm font-semibold text-primary hover:underline">
                View History
              </Link>
            </div>

            <div className="p-5">
              {jobs.length === 0 ? (
                <div className="text-gray-500">No jobs assigned yet.</div>
              ) : (
                <div className="space-y-3">
                  {jobs.slice(0, 5).map((job) => (
                    <div key={job.id || job.maintenanceId} className="p-4 rounded-lg border border-gray-100 bg-gray-50">
                      <div className="font-semibold text-gray-800">{job.title || "Untitled job"}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {job.boardingTitle || "Boarding"} • {String(job.status || "UNKNOWN").replaceAll("_", " ")}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">Profile Snapshot</h2>
            <p className="text-gray-600 mt-2">
              {currentTech?.fullName || "Technician"} • {currentTech?.email || "No email"}
            </p>
          </div>
        </div>
      )}
    </TechnicianLayout>
  );
};

export default TechnicianDashboard;
