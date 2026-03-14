import React from 'react';

const AdDetailsModal = ({ selectedAd, onClose }) => {
  if (!selectedAd) return null;

  const handleImageDownload = () => {
    if (selectedAd.bannerImageUrl) {
      const link = document.createElement('a');
      link.href = selectedAd.bannerImageUrl;
      link.download = `submission-${selectedAd.id}-${selectedAd.title.replace(/\s+/g, '-')}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-[30px] overflow-hidden shadow-2xl animate-fade-in flex flex-col md:flex-row max-h-[90vh]">

        {/* Left Side: Media Preview & Download */}
        <div className="md:w-1/2 bg-[#f9f7f2] p-8 flex flex-col items-center justify-center border-r border-[#e0d6c5]">
          <div className="mb-4 text-center">
            <p className="text-[10px] font-black text-[#D84C38] uppercase tracking-widest mb-2">Submission Preview</p>
            <h3 className="text-lg font-bold text-[#332720]">Ad Banner Image</h3>
          </div>

          <div className="relative group w-full aspect-square md:aspect-auto md:h-80 rounded-2xl overflow-hidden shadow-lg border-4 border-white bg-white">
            <img
              src={selectedAd.bannerImageUrl || 'https://via.placeholder.com/400x400?text=No+Image'}
              alt={selectedAd.title}
              className="w-full h-full object-contain"
            />
            {selectedAd.bannerImageUrl && (
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={handleImageDownload}
                  className="bg-white text-[#332720] px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-xl hover:bg-[#D84C38] hover:text-white transition-all"
                >
                  <i className="fas fa-download"></i> Download Image
                </button>
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-gray-400 italic">Hover over image to download for publishing</p>
        </div>

        {/* Right Side: Ad Information */}
        <div className="md:w-1/2 p-8 overflow-y-auto max-h-[90vh]">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <span
                className={`text-[10px] font-black uppercase px-3 py-1 rounded-md inline-block ${
                  selectedAd.status === 'PENDING'
                    ? 'bg-orange-100 text-orange-600'
                    : selectedAd.status === 'APPROVED'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {selectedAd.status}
              </span>
              <h2 className="text-2xl font-black text-[#332720] mt-3 leading-tight">{selectedAd.title}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 ml-4">
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>

          <div className="space-y-6">
            {/* Company & Description */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Company Name</label>
              <p className="text-lg font-bold text-[#332720]">{selectedAd.companyName}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Ad Description</label>
              <p className="text-[#665345] text-sm leading-relaxed">{selectedAd.description || 'No description provided'}</p>
            </div>

            {/* Plan Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Selected Plan</label>
                <p className="font-bold text-[#332720] text-lg">{selectedAd.planName || 'N/A'}</p>
                <p className="text-[#D84C38] font-bold text-sm mt-1">Rs. {selectedAd.planPrice || 0}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Duration</label>
                <p className="font-bold text-[#332720] text-lg">{selectedAd.expiryDate ? 'Set' : 'N/A'}</p>
                {selectedAd.expiryDate && (
                  <p className="text-gray-600 font-medium text-sm mt-1">{new Date(selectedAd.expiryDate).toLocaleDateString()}</p>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-3">Contact Information</label>
              <div className="space-y-3 p-4 border border-dashed border-gray-200 rounded-2xl">
                <div className="flex items-center gap-3">
                  <i className="fas fa-user text-[#D84C38] w-5"></i>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Contact Person</p>
                    <p className="text-[#332720] font-bold">{selectedAd.companyName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-envelope text-[#D84C38] w-5"></i>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Email</p>
                    <p className="text-[#665345] text-sm font-medium">{selectedAd.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-phone text-[#D84C38] w-5"></i>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold">Phone</p>
                    <p className="text-[#665345] text-sm font-medium">{selectedAd.phone}</p>
                  </div>
                </div>

                {selectedAd.redirectUrl && (
                  <div className="flex items-center gap-3">
                    <i className="fas fa-globe text-[#D84C38] w-5"></i>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">Website</p>
                      <a href={selectedAd.redirectUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm font-medium hover:underline">
                        {selectedAd.redirectUrl}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submission Timeline */}
            <div className="bg-[#f9f7f2] p-4 rounded-2xl border border-[#e0d6c5]">
              <label className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Submission Info</label>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>Status:</strong> {selectedAd.status}</p>
                {selectedAd.createdAt && (
                  <p><strong>Submitted:</strong> {new Date(selectedAd.createdAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button onClick={onClose} className="w-full py-4 bg-[#332720] text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg">
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdDetailsModal;