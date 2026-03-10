import React, { useState } from 'react';

const AdDetailsModal = ({ ad, onClose, onApprove, onReject }) => {
  const [currentImg, setCurrentImg] = useState(0);
  const [activeTab, setActiveTab] = useState('details'); // 'details', 'amenities', 'owner', 'reviews'
  const [showRejectionInput, setShowRejectionInput] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const isPending = ad.status === 'pending';

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 lg:p-4 bg-text-dark/40 backdrop-blur-sm">
      <div className="bg-card-bg w-full h-full lg:h-auto lg:max-w-5xl lg:rounded-[25px] shadow-2xl overflow-hidden flex flex-col max-h-screen lg:max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3 truncate">
            <h3 className="text-base lg:text-xl font-bold text-primary truncate pr-4">Review: {ad.title}</h3>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
              ad.status === 'approved' ? 'bg-success/10 text-success' : 
              ad.status === 'rejected' ? 'bg-red-alert/10 text-red-alert' : 
              'bg-accent/10 text-accent'
            }`}>
              {ad.status}
            </span>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-text-muted">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-8">
            {/* Image Gallery */}
            <div>
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 group">
                <img src={ad.images[currentImg]} className="w-full h-full object-cover" alt="Property" />
                <div className="absolute inset-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => setCurrentImg(prev => (prev === 0 ? ad.images.length - 1 : prev - 1))} className="w-8 h-8 bg-white/90 rounded-full shadow-lg"><i className="fas fa-chevron-left text-xs"></i></button>
                   <button onClick={() => setCurrentImg(prev => (prev === ad.images.length - 1 ? 0 : prev + 1))} className="w-8 h-8 bg-white/90 rounded-full shadow-lg"><i className="fas fa-chevron-right text-xs"></i></button>
                </div>
              </div>
              <div className="flex gap-2 mt-3 overflow-x-auto pb-2 no-scrollbar">
                {ad.images.map((img, i) => (
                  <img key={i} src={img} onClick={() => setCurrentImg(i)} className={`w-16 h-12 lg:w-20 lg:h-16 rounded-lg cursor-pointer object-cover border-2 transition-all shrink-0 ${currentImg === i ? 'border-accent' : 'border-transparent'}`} />
                ))}
              </div>
            </div>

            {/* Quick Pricing & Basic Info */}
            <div className="space-y-4 lg:space-y-6">
              <div>
                <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-bold uppercase rounded-full">Primary Info</span>
                <h2 className="text-xl lg:text-3xl font-bold text-text-dark mt-2">{ad.price} <span className="text-sm font-normal text-text-muted">/ month</span></h2>
                <p className="text-text-muted text-sm mt-1"><i className="fas fa-map-marker-alt mr-2 text-accent"></i>{ad.location}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-background-light rounded-xl">
                  <p className="text-[10px] text-text-muted uppercase font-bold">Boarding Type</p>
                  <p className="text-sm font-bold text-text-dark capitalize">{ad.category || 'Boarding'}</p>
                </div>
                <div className="p-3 bg-background-light rounded-xl">
                  <p className="text-[10px] text-text-muted uppercase font-bold">Status</p>
                  <p className="text-sm font-bold text-text-dark capitalize">{ad.status}</p>
                </div>
              </div>

              {ad.status === 'rejected' && ad.rejectionReason && (
                <div className="p-4 bg-red-alert/5 border border-red-alert/10 rounded-xl">
                  <p className="text-[10px] text-red-alert uppercase font-bold mb-1">Reason for Rejection</p>
                  <p className="text-sm italic text-text-dark">"{ad.rejectionReason}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex gap-6 border-b border-gray-100 mb-6 overflow-x-auto no-scrollbar whitespace-nowrap">
              {['details', 'amenities', 'owner', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 px-1 font-bold capitalize transition-all relative text-sm ${
                    activeTab === tab ? 'text-accent' : 'text-text-muted'
                  }`}
                >
                  {tab === 'details' ? 'Boarding Info' : tab === 'owner' ? 'Owner Info' : tab}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-accent rounded-t-full" />}
                </button>
              ))}
            </div>

            <div className="min-h-[200px]">
              {/* Boarding Information */}
              {activeTab === 'details' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <p className="text-text-dark leading-relaxed">{ad.description || "No detailed description provided."}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                      <i className="fas fa-door-open w-5 text-accent"></i>
                      <span>Rooms Available: {ad.availableRooms || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-text-muted">
                      <i className="fas fa-venus-mars w-5 text-accent"></i>
                      <span>Gender: {ad.genderType || 'Any'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Amenities Section */}
              {activeTab === 'amenities' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {(ad.amenities || ['Water', 'Electricity', 'Parking']).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-background-light rounded-xl">
                      <i className="fas fa-check-circle text-success text-xs"></i>
                      <span className="text-sm font-medium text-text-dark">{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* OWNER INFORMATION SECTION */}
              {activeTab === 'owner' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-background-light rounded-2xl">
                    <img 
                      src={ad.owner.avatar} 
                      alt={ad.owner.name} 
                      className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover"
                    />
                    <div className="text-center sm:text-left space-y-2">
                      <h4 className="text-xl font-bold text-text-dark">{ad.owner.name}</h4>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm text-text-muted flex items-center justify-center sm:justify-start gap-2">
                          <i className="fas fa-envelope text-accent w-4"></i> {ad.owner.email || 'N/A'}
                        </p>
                        <p className="text-sm text-text-muted flex items-center justify-center sm:justify-start gap-2">
                          <i className="fas fa-phone text-accent w-4"></i> {ad.owner.phone || 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                         <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Rating:</span>
                         <div className="flex text-yellow-500 text-xs">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star ${i < (ad.owner.rating || 0) ? 'fill-current' : 'opacity-20'}`}></i>
                            ))}
                         </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Students Reviews Section */}
              {activeTab === 'reviews' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {ad.reviews && ad.reviews.length > 0 ? (
                    ad.reviews.map((rev, idx) => (
                      <div key={idx} className="p-4 bg-background-light rounded-2xl border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm text-text-dark">{rev.userName}</span>
                          <div className="flex text-yellow-500 text-[10px]">
                            {[...Array(5)].map((_, i) => (
                              <i key={i} className={`fas fa-star ${i < rev.rating ? 'fill-current' : 'opacity-20'}`}></i>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-text-muted italic">"{rev.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-text-muted italic text-sm">
                      No reviews yet for this listing.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 lg:p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          {isPending ? (
            !showRejectionInput ? (
              <>
                <button onClick={() => setShowRejectionInput(true)} className="flex-1 px-6 py-3 rounded-xl font-bold text-red-alert border-2 border-red-alert hover:bg-red-alert hover:text-white transition-all order-2 sm:order-1">Reject</button>
                <button onClick={() => { onApprove(ad.id); onClose(); }} className="flex-1 px-6 py-3 rounded-xl font-bold bg-success text-white hover:bg-emerald-700 shadow-md transition-all order-1 sm:order-2 flex items-center justify-center gap-2"><i className="fas fa-check"></i> Approve Ad</button>
              </>
            ) : (
              <div className="w-full flex flex-col gap-3">
                <input value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Reason for rejection..." className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-red-alert" />
                <div className="flex gap-2">
                  <button onClick={() => setShowRejectionInput(false)} className="flex-1 py-3 text-text-muted font-bold hover:bg-gray-200 rounded-xl transition-all">Cancel</button>
                  <button onClick={() => { onReject(ad.id, rejectionReason); onClose(); }} disabled={!rejectionReason} className="flex-1 py-3 bg-red-alert text-white rounded-xl font-bold disabled:opacity-50">Confirm Reject</button>
                </div>
              </div>
            )
          ) : (
            <button onClick={onClose} className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all shadow-md">Close Details</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdDetailsModal;