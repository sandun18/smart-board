import React, { useState, useEffect } from 'react';

const EditCampaignModal = ({ isOpen, onClose, campaign, onSave }) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (campaign) {
      setFormData({
        title: campaign.title,
        redirectUrl: campaign.redirectUrl || '',
        targetPanels: campaign.targetPanels || ['student'],
        image: campaign.image
      });
    }
  }, [campaign]);

  if (!isOpen || !formData) return null;

  const handlePanelToggle = (panel) => {
    setFormData(prev => ({
      ...prev,
      targetPanels: prev.targetPanels.includes(panel)
        ? prev.targetPanels.filter(p => p !== panel)
        : [...prev.targetPanels, panel]
    }));
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-lg rounded-[30px] p-8 shadow-2xl animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-[#332720]">Edit Live Ad</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(campaign.id, formData); onClose(); }} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Campaign Title</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#D84C38]"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Redirect URL</label>
            <input 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 font-mono text-sm outline-none focus:ring-2 focus:ring-[#D84C38]"
              value={formData.redirectUrl}
              onChange={(e) => setFormData({...formData, redirectUrl: e.target.value})}
            />
          </div>

          <div className="py-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 block mb-2">Display Panels</label>
            <div className="flex gap-2">
              {['student', 'owner'].map(panel => (
                <button
                  key={panel}
                  type="button"
                  onClick={() => handlePanelToggle(panel)}
                  className={`flex-1 py-2 rounded-lg border font-bold text-xs capitalize transition-all ${
                    formData.targetPanels.includes(panel) 
                    ? 'bg-[#D84C38] border-[#D84C38] text-white' 
                    : 'bg-white border-gray-200 text-gray-400'
                  }`}
                >
                  {panel}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-[#332720] text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCampaignModal;