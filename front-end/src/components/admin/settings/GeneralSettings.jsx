import React, { useState } from 'react';

const GeneralSettings = ({ onSave }) => {
  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="animate-fadeIn space-y-10">
      {/* Section Header */}
      <div>
        <h3 className="text-2xl font-black text-text-dark tracking-tight mb-2">General Configuration</h3>
        <p className="text-text-muted text-sm font-medium">Global platform identity and public contact information.</p>
      </div>

      {/* Brand Identity Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-8 bg-accent rounded-full"></div>
          <h4 className="text-xs font-black text-text-muted uppercase tracking-widest">Brand Identity</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Logo Upload - Matches the circular preview in your CSS */}
          <div className="flex items-center gap-6 p-6 bg-background-light/20 rounded-[20px] border border-gray-100">
            <div className="relative group">
              <div className="w-24 h-24 rounded-2xl bg-white border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-accent">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-cover" />
                ) : (
                  <i className="fas fa-image text-3xl text-gray-300"></i>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform">
                <i className="fas fa-camera text-xs"></i>
                <input type="file" className="hidden" onChange={handleLogoChange} accept="image/*" />
              </label>
            </div>
            <div>
              <p className="font-bold text-text-dark">Platform Logo</p>
              <p className="text-[10px] text-text-muted uppercase font-black tracking-tighter">PNG, JPG up to 2MB</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Platform Name</label>
              <div className="relative">
                <i className="fas fa-signature absolute left-4 top-1/2 -translate-y-1/2 text-accent/50"></i>
                <input 
                  type="text" 
                  defaultValue="SmartBoAD"
                  className="w-full pl-12 pr-4 py-4 rounded-[18px] bg-background-light/20 border-2 border-transparent focus:border-accent focus:bg-white outline-none transition-all font-bold text-text-dark shadow-inner"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-8 bg-primary rounded-full"></div>
          <h4 className="text-xs font-black text-text-muted uppercase tracking-widest">Contact Information</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Support Email</label>
            <div className="relative">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-primary/50"></i>
              <input 
                type="email" 
                defaultValue="support@smartboad.lk"
                className="w-full pl-12 pr-4 py-4 rounded-[18px] bg-background-light/20 border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold text-text-dark shadow-inner"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Contact Phone</label>
            <div className="relative">
              <i className="fas fa-phone-alt absolute left-4 top-1/2 -translate-y-1/2 text-primary/50"></i>
              <input 
                type="text" 
                defaultValue="+94 77 123 4567"
                className="w-full pl-12 pr-4 py-4 rounded-[18px] bg-background-light/20 border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold text-text-dark shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Physical Address</label>
          <div className="relative">
            <i className="fas fa-map-marker-alt absolute left-4 top-6 text-primary/50"></i>
            <textarea 
              rows="3" 
              className="w-full pl-12 pr-4 py-4 rounded-[18px] bg-background-light/20 border-2 border-transparent focus:border-primary focus:bg-white outline-none transition-all font-bold text-text-dark shadow-inner resize-none"
              defaultValue="123, High Level Road, Colombo 07, Sri Lanka"
            ></textarea>
          </div>
        </div>
      </div>

      {/* Footer Actions - Matches the fixed look of the HTML version */}
      <div className="pt-8 border-t border-gray-100 flex justify-end gap-4">
        <button className="px-8 py-4 rounded-[15px] font-bold text-text-muted hover:bg-gray-100 transition-colors">
          Reset Changes
        </button>
        <button 
          onClick={onSave}
          className="bg-accent text-white font-black py-4 px-12 rounded-[18px] shadow-[0_10px_20px_rgba(255,122,0,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_25px_rgba(255,122,0,0.4)] transition-all active:scale-95 flex items-center gap-3"
        >
          <i className="fas fa-save"></i>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default GeneralSettings;