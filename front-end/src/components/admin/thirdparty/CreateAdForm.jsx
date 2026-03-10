import React, { useState, useEffect } from 'react';

const CreateAdForm = ({ plans, onSubmit, prefillData }) => {
  const [formData, setFormData] = useState({
    title: '', 
    companyName: '', 
    bannerImageUrl: '', 
    redirectUrl: '',
    planName: '',
    planPrice: 0,
    expiryDate: '',
    targetPanels: ['STUDENT_PANEL'] // Matches AdPanelType.java Enum
  });

  // Pre-fill when coming from an approved submission
  useEffect(() => {
    if (prefillData) {
      setFormData(prev => ({ 
        ...prev, 
        title: prefillData.title || '',
        companyName: prefillData.companyName || '',
        bannerImageUrl: prefillData.bannerImageUrl || '',
        redirectUrl: prefillData.redirectUrl || '',
        planName: prefillData.planName || '',
        planPrice: prefillData.planPrice || 0,
        // Default expiry to 30 days from now if not provided
        expiryDate: prefillData.expiryDate || new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
      }));
    }
  }, [prefillData]);

  const handlePanelToggle = (panel) => {
    setFormData(prev => ({
      ...prev,
      targetPanels: prev.targetPanels.includes(panel)
        ? prev.targetPanels.filter(p => p !== panel)
        : [...prev.targetPanels, panel]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ensure expiryDate is formatted for LocalDateTime if needed, 
    // or just send as ISO string which Spring handles well.
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-[30px] p-8 shadow-sm border border-gray-100 animate-fade-in max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-[#332720]">Publish Live Campaign</h3>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Finalize Ad Placement</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ad Title */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Campaign Title</label>
            <input 
              required
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})} 
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#D84C38] font-bold" 
              placeholder="Summer Special 2024" 
            />
          </div>

          {/* Company Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Advertiser / Company</label>
            <input 
              required
              value={formData.companyName} 
              onChange={e => setFormData({...formData, companyName: e.target.value})} 
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#D84C38] font-bold" 
              placeholder="Brand Name" 
            />
          </div>
        </div>

        {/* Redirect URL */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Redirect URL (Link)</label>
          <input 
            required
            type="url"
            value={formData.redirectUrl} 
            onChange={e => setFormData({...formData, redirectUrl: e.target.value})} 
            className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#D84C38]" 
            placeholder="https://example.com/promo" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Plan Info (Read Only if prefilled) */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Selected Plan</label>
            <div className="w-full p-4 bg-orange-50 rounded-2xl border border-orange-100 font-bold text-[#D84C38]">
              {formData.planName} (Rs. {formData.planPrice})
            </div>
          </div>

          {/* Expiry Date */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Campaign Expiry</label>
            <input 
              required
              type="date"
              value={formData.expiryDate} 
              onChange={e => setFormData({...formData, expiryDate: e.target.value})} 
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#D84C38] font-bold" 
            />
          </div>
        </div>

        {/* Target Panels Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Display Panels</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'STUDENT_PANEL', label: 'Student' },
              { id: 'OWNER_PANEL', label: 'Owner' },
              { id: 'MOBILE_APP', label: 'App' },
              { id: 'PUBLIC_DASHBOARD', label: 'Public' }
            ].map(panel => (
              <button
                key={panel.id}
                type="button"
                onClick={() => handlePanelToggle(panel.id)}
                className={`py-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${
                  formData.targetPanels.includes(panel.id)
                    ? 'border-[#D84C38] bg-[#D84C38] text-white shadow-md'
                    : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'
                }`}
              >
                {panel.label}
              </button>
            ))}
          </div>
        </div>

        {/* Banner Image Preview */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Ad Creative</label>
          <div className="relative group border-2 border-dashed border-gray-200 rounded-2xl overflow-hidden bg-gray-50">
            {formData.bannerImageUrl ? (
              <img src={formData.bannerImageUrl} className="w-full h-48 object-contain" alt="Preview" />
            ) : (
              <div className="py-12 text-center text-gray-400 italic text-sm">No image available</div>
            )}
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full py-4 bg-[#332720] text-white rounded-2xl font-bold hover:bg-black transition-all shadow-xl shadow-gray-200 uppercase tracking-widest text-sm"
        >
          Confirm & Go Live
        </button>
      </form>
    </div>
  );
};

export default CreateAdForm;