import React from 'react';
import { motion } from 'framer-motion';

const AdvertiseModal = ({
  show,
  onClose,
  successMessage,
  errorMessage,
  onSubmit,
  loadingPlans,
  plans,
  formData,
  onInputChange,
  onImageChange,
  isSubmittingAd,
}) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 md:p-8 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-5xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-10 border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-3xl font-black text-white mb-2">Advertise Your Business</h3>
            <p className="text-white/60 font-medium">Target thousands of students daily. Choose a plan and submit your ad for review.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl border border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors text-xl leading-none"
            aria-label="Close advertise form"
          >
            &times;
          </button>
        </div>

        {successMessage && <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-2xl text-green-200 text-sm font-bold">{successMessage}</div>}
        {errorMessage && <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-200 text-sm font-bold">{errorMessage}</div>}

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h4 className="text-white font-bold mb-4">Choose Your Plan</h4>
            {loadingPlans ? (
              <div className="text-white/60 text-sm">Loading plans...</div>
            ) : plans.length === 0 ? (
              <div className="text-red-400 text-sm">No active plans available. Please contact support.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan) => (
                  <label key={plan.id} className={`relative cursor-pointer p-5 rounded-2xl border transition-all shadow-sm h-full flex flex-col justify-between ${
                    formData.planId === String(plan.id)
                      ? 'bg-gradient-to-br from-white/10 to-white/5 border-accent ring-2 ring-accent/20'
                      : 'bg-red-600/10 border-red-600/20 hover:shadow-md hover:scale-[1.01]'
                  }`}>
                    <input
                      type="radio"
                      name="planId"
                      value={plan.id}
                      checked={formData.planId === String(plan.id)}
                      onChange={onInputChange}
                      className="hidden"
                    />
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h5 className="text-white font-extrabold text-sm">{plan.name}</h5>
                        <span className="text-white/60 text-xs px-2 py-1 rounded-md bg-white/5">{plan.durationDays}d</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <p className="text-white font-black text-2xl">Rs. {plan.price}</p>
                        <p className="text-white/60 text-xs">one-time</p>
                      </div>
                      {plan.description && <p className="text-white/50 text-sm line-clamp-3">{plan.description}</p>}
                    </div>
                    <div className="pt-3">
                      <ul className="text-white/60 text-xs list-disc list-inside space-y-1">
                        {(plan.features || []).slice(0, 3).map((f, i) => (<li key={i}>{f}</li>))}
                      </ul>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input type="text" name="companyName" placeholder="Company Name *" value={formData.companyName} onChange={onInputChange} required className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-accent/50 outline-none" />
              <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={onInputChange} required className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-accent/50 outline-none" />
              <input type="tel" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={onInputChange} required className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-accent/50 outline-none" />
            </div>
            <div className="space-y-4">
              <input type="text" name="adTitle" placeholder="Ad Title *" value={formData.adTitle} onChange={onInputChange} required className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-accent/50 outline-none" />
              <textarea name="adDescription" placeholder="Ad Description *" value={formData.adDescription} onChange={onInputChange} required rows="3" className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-accent/50 outline-none resize-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="text" name="website" placeholder="Website URL (optional)" value={formData.website || ''} onChange={onInputChange} className="w-full px-5 py-3 bg-white/5 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-accent/50 outline-none" />
            <div className="p-4 border-2 border-dashed border-white/20 rounded-2xl text-center hover:border-white/40 transition-colors">
              <input type="file" accept="image/*" onChange={onImageChange} className="text-white text-xs cursor-pointer" />
              <p className="text-white/50 text-xs mt-2">{formData.image ? formData.image.name : 'Upload Banner Image'}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="button"
              onClick={onClose}
              className="sm:w-44 py-3 bg-white/10 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/20 transition-all"
            >
              Cancel
            </button>
            <button type="submit" disabled={isSubmittingAd || loadingPlans} className="flex-1 py-4 bg-gradient-to-r from-primary to-accent text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 text-lg">
              {isSubmittingAd ? 'Processing...' : 'Submit Advertisement for Review'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdvertiseModal;
