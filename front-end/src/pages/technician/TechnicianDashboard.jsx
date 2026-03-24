import React, { useState, useEffect } from "react";
import {
  getTechnicianJobs,
  respondToJob,
  completeJob,
} from "../../api/technician/technicianService";
import TechnicianLayout from "../../components/technician/common/TechnicianLayout";
import Map from "../../components/common/Map"; 
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaMapMarkerAlt, FaPhone, FaCheck, FaEye, FaTimes, FaCalendarAlt, FaTools, 
  FaBan, FaMoneyBillWave, FaExpand, FaUserAlt, FaInfoCircle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const TechnicianDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeImage, setActiveImage] = useState(null); 
  const [rejectId, setRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [completeId, setCompleteId] = useState(null);
  const [billAmount, setBillAmount] = useState("");

  const fetchJobs = async () => {
    try {
      const data = await getTechnicianJobs();
      setJobs(data);
    } catch (error) { toast.error("Failed to load jobs"); }
  };

  useEffect(() => { fetchJobs(); }, []);

  const handleOwnerProfileClick = (ownerId) => {
    if (ownerId) {
      navigate(`/profile/view/${ownerId}`);
    } else {
      toast.error("Owner profile ID not found");
    }
  };

  const handleAccept = async (id) => {
    try {
      await respondToJob(id, true);
      toast.success("Job Accepted!");
      setSelectedJob(null);
      fetchJobs();
    } catch (e) { toast.error("Error accepting job"); }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return toast.error("Please provide a reason");
    try {
      await respondToJob(rejectId, false, rejectReason);
      toast.success("Job Declined");
      setRejectId(null);
      setRejectReason("");
      setSelectedJob(null); // Close the details modal too
      fetchJobs();
    } catch (e) { toast.error("Error declining job"); }
  };

  const handleComplete = async () => {
    try {
      await completeJob(completeId, billAmount);
      toast.success("Job Completed!");
      setCompleteId(null);
      fetchJobs();
    } catch (e) { toast.error("Error completing job"); }
  };

  const newRequests = jobs.filter((j) => j.status === "ASSIGNED");
  const activeJobs = jobs.filter((j) => j.status === "IN_PROGRESS");

  return (
    <TechnicianLayout title="Dashboard" subtitle="Overview of your work">
      
      {/* --- DASHBOARD CARDS --- */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span className="w-2 h-8 bg-accent rounded-full" /> New Requests
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {newRequests.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-400" />
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg">{job.title}</h3>
                <button onClick={() => setSelectedJob(job)} className="p-2 text-accent hover:bg-orange-50 rounded-full transition-colors"><FaEye size={18} /></button>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
              <div className="flex gap-3">
                <button onClick={() => handleAccept(job.id)} className="flex-1 bg-primary text-white py-2.5 rounded-xl font-bold">Accept</button>
                <button onClick={() => setRejectId(job.id)} className="flex-1 bg-white border border-gray-200 text-gray-600 py-2.5 rounded-xl font-bold">Decline</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- ACTIVE JOBS --- */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2"><span className="w-2 h-8 bg-green-500 rounded-full" /> Active Jobs</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {activeJobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
               <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-lg">{job.title}</h3>
                  <button onClick={() => setSelectedJob(job)} className="p-2 text-blue-500 hover:bg-blue-50 rounded-full"><FaEye /></button>
               </div>
               <button onClick={() => setCompleteId(job.id)} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"><FaCheck /> Mark Work Done</button>
            </div>
          ))}
        </div>
      </section>

      {/* --- THE COLORED DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[2rem] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl relative scrollbar-hide"
            >
              {/* Header */}
              <div className="p-5 border-b sticky top-0 bg-primary flex justify-between items-center z-10 text-white">
                <div className="flex items-center gap-2">
                    <FaInfoCircle />
                    <h3 className="font-black tracking-tight">Job Specification</h3>
                </div>
                <button onClick={() => setSelectedJob(null)} className="p-1.5 bg-white/20 rounded-full hover:bg-white/40"><FaTimes /></button>
              </div>

              <div className="p-6 space-y-5">
                {/* 1. DESCRIPTION - CREAM */}
                <div className="bg-[#FFFDF5] p-5 rounded-2xl border border-orange-100/50">
                  <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2">Problem Description</h4>
                  <p className="text-gray-700 text-sm leading-relaxed italic">"{selectedJob.description}"</p>
                </div>

                {/* 2. BOARDING - BLUE */}
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center"><FaMapMarkerAlt size={14} /></div>
                  <div className="flex-1">
                    <p className="text-[9px] text-blue-500 font-black uppercase">Property</p>
                    <h5 className="font-bold text-blue-900 text-sm">{selectedJob.boardingTitle}</h5>
                    <p className="text-[11px] text-blue-700 truncate">{selectedJob.boardingAddress}</p>
                  </div>
                </div>

                {/* 3. OWNER - EMERALD */}
                <div 
                  onClick={() => handleOwnerProfileClick(selectedJob.ownerId)}
                  className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 flex justify-between items-center cursor-pointer group hover:bg-emerald-100 transition-all shadow-sm active:scale-[0.98]"
                  title="Click to view Owner Profile"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-black"><FaUserAlt size={14} /></div>
                    <div>
                      <h5 className="font-bold text-emerald-900 text-sm">{selectedJob.ownerName}</h5>
                      <p className="text-[11px] text-emerald-700">{selectedJob.ownerPhone}</p>
                    </div>
                  </div>
                  <a href={`tel:${selectedJob.ownerPhone}`} className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center shadow-lg"><FaPhone size={12} /></a>
                </div>

                {/* 4. GALLERY */}
                {selectedJob.imageUrls?.length > 0 && (
                  <div>
                    <h4 className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-3 ml-1">Gallery</h4>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                      {selectedJob.imageUrls.map((url, i) => (
                        <div key={i} className="relative flex-shrink-0">
                          <img src={url} alt="Evidence" className="w-32 h-32 object-cover rounded-2xl border-2 border-orange-50 shadow-sm" />
                          <button onClick={() => setActiveImage(url)} className="absolute inset-0 bg-orange-900/40 opacity-0 hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white"><FaExpand size={16} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. MAP */}
                <div className="rounded-2xl overflow-hidden h-48 border-2 border-gray-50 shadow-inner">
                   <Map center={{ lat: selectedJob.latitude || 6.9271, lng: selectedJob.longitude || 79.8612 }} makerTitle={selectedJob.boardingTitle} />
                </div>
              </div>
              
              {/* MODAL ACTIONS */}
              <div className="p-5 border-t bg-gray-50 flex gap-3">
                 {selectedJob.status === "ASSIGNED" && (
                   <>
                    <button onClick={() => handleAccept(selectedJob.id)} className="flex-[2] bg-primary text-white py-2.5 rounded-xl font-bold text-sm shadow-lg">Accept Job</button>
                    {/* ✅ FIXED: Correctly calls setRejectId */}
                    <button onClick={() => setRejectId(selectedJob.id)} className="flex-1 bg-white border border-gray-200 text-gray-500 py-2.5 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-500 transition-all">Decline</button>
                   </>
                 )}
                 {selectedJob.status !== "ASSIGNED" && <button onClick={() => setSelectedJob(null)} className="w-full bg-white border border-gray-200 text-gray-500 py-2.5 rounded-xl font-bold text-sm">Close View</button>}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- FULL SCREEN IMAGE VIEWER --- */}
      <AnimatePresence>
        {activeImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/95 z-[300] flex items-center justify-center p-4" onClick={() => setActiveImage(null)}>
             <button className="absolute top-6 right-6 text-white/50 hover:text-white"><FaTimes size={24} /></button>
             <motion.img initial={{ scale: 0.9 }} animate={{ scale: 1 }} src={activeImage} className="max-w-full max-h-full rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- REJECT MODAL (Higher Z-Index) --- */}
      {rejectId && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-[1.5rem] p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-black text-lg mb-3 text-red-600 flex items-center gap-2"><FaBan /> Decline Job</h3>
            <textarea className="w-full border border-slate-200 rounded-xl p-3 mb-4 text-sm outline-none focus:border-red-500" rows="3" placeholder="Why are you declining?" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}></textarea>
            <div className="flex gap-2">
              <button onClick={() => setRejectId(null)} className="flex-1 py-2 text-slate-400 font-bold text-xs">Cancel</button>
              <button onClick={handleReject} className="flex-1 bg-red-600 text-white rounded-lg py-2 font-bold text-xs shadow-md">Confirm</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- COMPLETE MODAL --- */}
      {completeId && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[1.5rem] p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-black text-lg mb-3 text-emerald-600 flex items-center gap-2"><FaMoneyBillWave /> Service Bill</h3>
            <div className="relative mb-4">
                <span className="absolute left-3 top-2.5 font-bold text-gray-400 text-xs">LKR</span>
                <input type="number" className="w-full border border-gray-200 rounded-xl py-2 pl-12 pr-4 text-md font-black outline-none focus:border-emerald-500" placeholder="0.00" value={billAmount} onChange={(e) => setBillAmount(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCompleteId(null)} className="flex-1 py-2 text-slate-400 font-bold text-xs">Cancel</button>
              <button onClick={handleComplete} className="flex-1 bg-emerald-600 text-white rounded-lg py-2 font-bold text-xs shadow-md">Send Invoice</button>
            </div>
          </div>
        </div>
      )}

    </TechnicianLayout>
  );
};

export default TechnicianDashboard;
