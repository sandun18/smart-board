import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdStatsBar from '../../components/admin/ads/AdStatsBar';
import AdCard from '../../components/admin/ads/AdCard';
import AdDetailsModal from '../../components/admin/ads/AdDetailsModal';
import Toast from '../../components/admin/common/Toast';
import { useAds } from '../../hooks/admin/useAds';

const AdminAds = () => {
  const navigate = useNavigate();
  const { 
    ads, stats, currentTab, setCurrentTab, selectedAd, setSelectedAd, 
    toast, handleApprove, handleReject, loading // <-- Added loading here
  } = useAds();

  return (
      <>
      {toast && <Toast message={toast.message} type={toast.type} />}

      <AdStatsBar stats={stats} />

      <div className="bg-card-bg rounded-[25px] shadow-sm p-4 lg:p-8 min-h-[60vh]">
        <div className="flex gap-6 lg:gap-10 border-b border-gray-100 mb-6 lg:mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
          {['pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`pb-4 px-1 font-bold capitalize transition-all relative text-sm lg:text-base ${
                currentTab === tab ? 'text-accent' : 'text-text-muted hover:text-text-dark'
              }`}
            >
              {tab}
              {currentTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* --- NEW LOADING STATE LOGIC --- */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-text-muted animate-pulse">Fetching boardings...</p>
          </div>
        ) : ads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} onReview={() => setSelectedAd(ad)} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-text-muted">
            <i className="fas fa-folder-open text-5xl mb-4 opacity-20"></i>
            <p className="italic font-medium">No {currentTab} ads found.</p>
          </div>
        )}
      </div>

      {selectedAd && (
        <AdDetailsModal 
          ad={selectedAd} 
          onClose={() => setSelectedAd(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
      </>
  );
};

export default AdminAds;