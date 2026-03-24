import React, { useState, useEffect } from "react";
import TechnicianLayout from "../../components/technician/common/TechnicianLayout";
import ReportModal from "../../components/technician/reports/ReportModal"; 
import HistoryItem from "../../components/technician/history/HistoryItem"; 
import { getTechnicianJobs } from "../../api/technician/technicianService";
import { useTechAuth } from "../../context/technician/TechnicianAuthContext";

const TechnicianHistory = () => {
  const { authLoading } = useTechAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        console.log("🔄 Fetching History...");
        const jobs = await getTechnicianJobs(); 
        
        console.log("✅ RAW DATA FROM BACKEND:", jobs);

        // ✅ FILTER LOGIC:
        // We include jobs even if status is missing (!s) so you can debug them.
        const completedJobs = jobs.filter(job => {
            const s = job.status;
            return !s || ["COMPLETED", "WORK_DONE", "PAID", "ACCEPTED", "IN_PROGRESS"].includes(s);
        });

        // Sort Newest First
        completedJobs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setHistory(completedJobs);
      } catch (error) {
        console.error("❌ Failed to load history", error);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchHistory();
  }, [authLoading]);

  return (
    <TechnicianLayout title="Work History" subtitle="Your completed jobs & reviews">
      
      {loading ? (
        <div className="p-10 text-center text-gray-500 animate-pulse">Loading work history...</div>
      ) : (
        <div className="grid gap-6">
          {history.length === 0 ? (
            <div className="text-center p-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-gray-400">No jobs found.</p>
            </div>
          ) : (
            history.map((job, index) => (
              <HistoryItem 
                // ✅ USE INDEX IF ID IS MISSING (Prevents Key Warning)
                key={job.id || index} 
                job={job} 
                onReport={setSelectedJob} 
              />
            ))
          )}
        </div>
      )}

      {selectedJob && (
        <ReportModal 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
        />
      )}

    </TechnicianLayout>
  );
};

export default TechnicianHistory;