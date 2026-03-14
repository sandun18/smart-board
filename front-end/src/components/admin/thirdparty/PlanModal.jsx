import React, { useState, useEffect } from 'react';

const PlanModal = ({ isOpen, onClose, onSave, planToEdit }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [featuresText, setFeaturesText] = useState('');

  // Pre-fill form when editing an existing plan
  useEffect(() => {
    if (planToEdit && isOpen) {
      setName(planToEdit.name || '');
      setPrice(planToEdit.price || '');
      setDuration(planToEdit.duration || '');
      setDescription(planToEdit.description || '');
      setFeaturesText(planToEdit.features ? planToEdit.features.join('\n') : '');
    } else {
      // Clear form for new plan
      setName('');
      setPrice('');
      setDuration('');
      setDescription('');
      setFeaturesText('');
    }
  }, [planToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert multiline text into an array of features
    const features = featuresText.split('\n').filter(f => f.trim() !== '');
    
    onSave({ 
      name, 
      price: parseFloat(price), 
      duration, 
      description, 
      features 
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[40px] p-10 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-[#332720]">
              {planToEdit ? 'Edit Pricing Plan' : 'Create New Plan'}
            </h2>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
              Third Party Advertising
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-red-500 transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Plan Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Plan Name</label>
            <input 
              required
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#D84C38] font-bold text-[#332720]" 
              placeholder="e.g. Premium Sidebar" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Price in Rupees */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Price (Rs.)</label>
              <input 
                required
                type="number"
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#D84C38] font-bold text-[#D84C38]" 
                placeholder="5000" 
              />
            </div>

            {/* Duration */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Duration</label>
              <input 
                required
                value={duration} 
                onChange={e => setDuration(e.target.value)} 
                className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#D84C38] font-bold text-[#332720]" 
                placeholder="30 Days" 
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Short Description</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#D84C38] text-sm text-[#665345]" 
              placeholder="Briefly describe who this plan is for..." 
              rows="2"
            />
          </div>

          {/* Features List */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Features (One per line)</label>
            <textarea 
              value={featuresText} 
              onChange={e => setFeaturesText(e.target.value)} 
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#D84C38] text-sm text-[#665345]" 
              rows="4" 
              placeholder="Home Page Placement&#10;Priority Support&#10;Weekly Analytics" 
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 py-4 font-bold text-gray-400 hover:bg-gray-50 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-1 py-4 bg-[#332720] text-white font-bold rounded-2xl hover:bg-black transition-all shadow-xl shadow-gray-200"
            >
              {planToEdit ? 'Update Plan' : 'Save Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModal;