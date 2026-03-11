import React from 'react';

const AdDetailsModal = ({ selectedAd, onClose }) => {
  if (!selectedAd) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-[30px] overflow-hidden shadow-2xl animate-fade-in flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Side: Media Preview & Download */}
        <div className="md:w-1/2 bg-[#f9f7f2] p-8 flex flex-col items-center justify-center border-r border-[#e0d6c5]">
          <div className="mb-4 text-center">
            <p className="text-[10px] font-black text-[#D84C38] uppercase tracking-widest mb-2">Submission Preview</p>
            <h3 className="text-lg font-bold text-[#332720]">User Ad Post</h3>
          </div>
          
          <div className="relative group w-full aspect-square md:aspect-auto md:h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-white">
            <img 
              src={selectedAd.adDetails.image} 
              alt="Ad Content" 
              className="w-full h-full object-contain"
            />
            {/* Download Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a 
                    href={selectedAd.adDetails.image}
                    download={`submission-${selectedAd.id}.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white text-[#332720] px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-[#D84C38] hover:text-white transition-all"
                >
                    <i className="fas fa-download"></i> Download Image
                </a>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400 italic">Click the download button to save media for publishing</p>
        </div>

        {/* Right Side: Ad Information */}
        <div className="md:w-1/2 p-8 overflow-y-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                selectedAd.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
              }`}>
                {selectedAd.status}
              </span>
              <h2 className="text-2xl font-black text-[#332720] mt-2 leading-tight">{selectedAd.adDetails.title}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Ad Message / Content</label>
              <p className="text-[#665345] text-sm leading-relaxed italic">"{selectedAd.adDetails.message}"</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Selected Plan</label>
                <p className="font-bold text-[#D84C38] capitalize">{selectedAd.plan}</p>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase">Advertiser</label>
                <p className="font-bold text-[#332720]">{selectedAd.user.name}</p>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase">Contact Details</label>
              <div className="mt-2 p-4 border border-dashed border-gray-200 rounded-2xl space-y-2">
                <p className="text-sm text-[#665345] flex items-center gap-3">
                  <i className="fas fa-envelope w-4 text-[#D84C38]"></i> {selectedAd.user.email}
                </p>
                <p className="text-sm text-[#665345] flex items-center gap-3">
                  <i className="fas fa-phone w-4 text-[#D84C38]"></i> {selectedAd.user.phone || "No Phone Provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={onClose} 
              className="w-full py-4 bg-[#332720] text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetailsModal;