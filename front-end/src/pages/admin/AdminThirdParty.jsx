import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ThirdPartyStats from '../../components/admin/thirdparty/ThirdPartyStats';
import CampaignTable from '../../components/admin/thirdparty/CampaignTable';
import SubmissionCard from '../../components/admin/thirdparty/SubmissionCard';
import AdDetailsModal from '../../components/admin/thirdparty/AdDetailsModal';
import CreateAdForm from '../../components/admin/thirdparty/CreateAdForm'; 
import EditCampaignModal from '../../components/admin/thirdparty/EditCampaignModal';
import PlanModal from '../../components/admin/thirdparty/PlanModal';
import { useThirdPartyAds } from '../../hooks/admin/useThirdPartyAds'; 

const AdminThirdParty = () => {
    const navigate = useNavigate();
    const {
        submissions, campaigns, plans, activeTab, setActiveTab,
        stats, toast, loading, prefillAdData, isOffline, fetchData,
        handleApprove, handleReject, startPublishWorkflow,
        createAd, toggleCampaignStatus, updateCampaign, deleteAd,
        addPlan, updatePlan, deletePlan
    } = useThirdPartyAds();

    const [selectedAd, setSelectedAd] = useState(null);
    const [editingCampaign, setEditingCampaign] = useState(null);
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [planToEdit, setPlanToEdit] = useState(null);

    if (loading) {
        return (
            <div className="flex flex-col h-96 items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D84C38]"></div>
                <p className="text-[#665345] font-bold text-sm">Syncing Advertising Data...</p>
            </div>
        );
    }

    return (
        <>
            {/* Connection Error Banner */}
            {isOffline && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[25px] flex items-center gap-4 text-red-700 animate-pulse">
                    <div className="bg-red-100 p-2 rounded-full">
                        <i className="fas fa-exclamation-circle text-xl"></i>
                    </div>
                    <div className="flex-1">
                        <p className="font-black text-sm uppercase tracking-tight">Backend Connection Failed</p>
                        <p className="text-xs opacity-90 font-medium">Data could not be synced. Check your API server or internet connection.</p>
                    </div>
                    <button 
                        onClick={fetchData}
                        className="bg-white border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-black hover:bg-red-50 transition-all shadow-sm"
                    >
                        RETRY SYNC
                    </button>
                </div>
            )}

            <ThirdPartyStats stats={stats} />

            <div className="flex flex-wrap gap-2 mb-8 bg-white/50 p-1.5 rounded-[22px] w-fit border border-[#e0d6c5]">
                {['submissions', 'campaigns', 'plans', 'create'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2.5 rounded-[18px] text-[11px] font-black uppercase tracking-wider transition-all ${
                            activeTab === tab 
                            ? 'bg-[#332720] text-white shadow-lg' 
                            : 'text-[#665345] hover:bg-[#e0d6c5]/30'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="animate-fade-in min-h-[400px]">
                {activeTab === 'submissions' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(submissions || []).length > 0 ? (
                            submissions.map(ad => (
                                <SubmissionCard 
                                    key={ad.id} 
                                    ad={ad} 
                                    onApprove={handleApprove}
                                    onReject={handleReject}
                                    onViewDetails={setSelectedAd}
                                    onPublish={startPublishWorkflow}
                                />
                            ))
                        ) : (
                            <div className="col-span-full py-20 text-center bg-white rounded-[30px] border-2 border-dashed border-gray-200 text-gray-400 font-bold">
                                {isOffline ? "Cannot load submissions while offline." : "No new submissions to review."}
                            </div>
                        )}
                    </div>
                )}

                {/* Campaigns Tab */}
                {activeTab === 'campaigns' && (
                    <CampaignTable 
                        campaigns={campaigns || []} 
                        onEdit={setEditingCampaign}
                        onToggleStatus={toggleCampaignStatus}
                        onDelete={deleteAd}
                    />
                )}

                {/* Plans Tab */}
                {activeTab === 'plans' && (
                    <div className="bg-white rounded-[30px] p-8">
                        <button 
                            onClick={() => { setPlanToEdit(null); setIsPlanModalOpen(true); }}
                            className="mb-6 px-6 py-3 bg-[#332720] text-white rounded-[18px] font-bold text-sm hover:shadow-lg transition-all"
                        >
                            + Add New Plan
                        </button>
                        {/* Plans list would be rendered here */}
                    </div>
                )}

                {/* Create Campaign Tab */}
                {activeTab === 'create' && (
                    <CreateAdForm 
                        prefillData={prefillAdData}
                        onSubmit={createAd}
                        onCancel={() => setActiveTab('campaigns')}
                    />
                )}
            </div>

            {/* Modals & Toasts */}
            {selectedAd && <AdDetailsModal selectedAd={selectedAd} onClose={() => setSelectedAd(null)} />}
            {editingCampaign && (
                <EditCampaignModal 
                    isOpen={!!editingCampaign} 
                    campaign={editingCampaign} 
                    onClose={() => setEditingCampaign(null)} 
                    onSave={(data) => { updateCampaign(editingCampaign.id, data); setEditingCampaign(null); }}
                />
            )}
            {isPlanModalOpen && (
                <PlanModal 
                    isOpen={isPlanModalOpen} 
                    planToEdit={planToEdit} 
                    onClose={() => { setIsPlanModalOpen(false); setPlanToEdit(null); }}
                    onSave={(data) => { 
                        if (planToEdit) {
                            updatePlan(planToEdit.id, data);
                        } else {
                            addPlan(data);
                        }
                        setIsPlanModalOpen(false);
                        setPlanToEdit(null);
                    }}
                />
            )}
            {toast && (
                <div className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[1000] px-8 py-4 rounded-[20px] text-white shadow-2xl flex items-center gap-3 animate-bounce-in ${
                    toast.type === 'error' ? 'bg-red-600' : 'bg-[#332720]'
                }`}>
                    <i className={`fas ${toast.type === 'error' ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
                    <span className="font-bold text-sm">{toast.message}</span>
                </div>
            )}
        </>
    );
};

export default AdminThirdParty;