import React from 'react';
import { motion } from 'framer-motion';

const BoardingDetailsModal = ({
  show,
  onClose,
  loading,
  boarding,
  currentImageIndex,
  onPrevImage,
  onNextImage,
  onSelectImage,
  onOpenFullDetails,
}) => {
  if (!show) return null;

  const hasImages = boarding?.images?.length > 0;
  const owner = boarding?.owner || {};
  const location = boarding?.location?.trim() || boarding?.address?.trim() || 'Location not specified';
  const mapUrl = location !== 'Location not specified' ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}` : null;
  const amenityLabels = Array.isArray(boarding?.amenities)
    ? boarding.amenities
        .map((amenity) => {
          if (typeof amenity === 'string') return amenity;
          return amenity?.label || amenity?.name || null;
        })
        .filter(Boolean)
    : [];
  const quickAmenities = [
    boarding?.hasWifi ? 'Wi-Fi' : null,
    boarding?.hasParking ? 'Parking' : null,
    boarding?.hasSecurity ? 'Security' : null,
    boarding?.hasLaundry ? 'Laundry' : null,
    boarding?.hasMeals ? 'Meals' : null,
    boarding?.hasAc ? 'AC' : null,
  ].filter(Boolean);
  const mergedAmenities = [...new Set([...amenityLabels, ...quickAmenities])];

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
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div className="p-10 text-center text-white/70">Loading boarding details...</div>
        ) : !boarding ? (
          <div className="p-10 text-center text-red-300">Unable to load boarding details.</div>
        ) : (
          <>
            <div className="relative h-72 sm:h-96 bg-black/40 overflow-hidden rounded-t-3xl">
              {hasImages ? (
                <img
                  src={boarding.images[currentImageIndex]}
                  alt={boarding.name}
                  className="w-full h-full object-cover"
                />
              ) : boarding.mainImage ? (
                <img
                  src={boarding.mainImage}
                  alt={boarding.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/60">
                  <i className="fas fa-home text-4xl" />
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
                aria-label="Close details"
              >
                <span className="text-xl leading-none">x</span>
              </button>

              {hasImages && boarding.images.length > 1 && (
                <>
                  <button
                    onClick={onPrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
                    aria-label="Previous image"
                  >
                    <span className="text-xl leading-none">&lt;</span>
                  </button>
                  <button
                    onClick={onNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
                    aria-label="Next image"
                  >
                    <span className="text-xl leading-none">&gt;</span>
                  </button>
                </>
              )}

              <div className="absolute bottom-5 left-6 right-6 text-white">
                <h2 className="text-2xl sm:text-3xl font-black mb-2">{boarding.name}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
                  <span className="inline-flex items-center gap-1.5"><i className="fas fa-map-marker-alt" />{location}</span>
                  {boarding.boardingType && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/15 border border-white/20">
                      <i className="fas fa-building" />
                      {boarding.boardingType}
                    </span>
                  )}
                  {boarding.distanceToCampus && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/15 border border-white/20">
                      <i className="fas fa-location-arrow" />
                      {boarding.distanceToCampus}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {hasImages && boarding.images.length > 1 && (
              <div className="px-6 pt-4">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {boarding.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onSelectImage(idx)}
                      className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border ${currentImageIndex === idx ? 'border-accent' : 'border-white/20'}`}
                      aria-label={`Image ${idx + 1}`}
                    >
                      <img src={img} alt={`${boarding.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 text-white">
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-lg font-bold mb-3">Overview</h3>
                  <p className="text-white/80 leading-relaxed">{boarding.description || 'No detailed description available.'}</p>
                </section>

                <section className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-lg font-bold mb-4">Amenities</h3>
                  {mergedAmenities.length > 0 ? (
                    <div className="flex flex-wrap gap-2 text-sm">
                      {mergedAmenities.map((label, i) => (
                        <span key={`${label}-${i}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/90">
                          {label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-white/60">No amenities listed.</p>
                  )}
                </section>
              </div>

              <div className="space-y-6">
                <section className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-lg font-bold mb-4">Quick Info</h3>
                  <div className="space-y-3 text-sm">
                    {(boarding.price || boarding.formattedPrice || boarding.minPrice || boarding.maxPrice) && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Price</span>
                        <span className="font-semibold">{boarding.formattedPrice || boarding.price || `${boarding.minPrice || ''}${boarding.minPrice && boarding.maxPrice ? ' - ' : ''}${boarding.maxPrice || ''}`}</span>
                      </div>
                    )}
                    {boarding.availableSpots !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Available Spots</span>
                        <span className="font-semibold inline-flex items-center gap-1"><i className="fas fa-users" />{boarding.availableSpots}</span>
                      </div>
                    )}
                    {boarding.capacity !== undefined && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Capacity</span>
                        <span className="font-semibold">{boarding.capacity}</span>
                      </div>
                    )}
                    {boarding.roomType && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Room Type</span>
                        <span className="font-semibold inline-flex items-center gap-1"><i className="fas fa-bed" />{boarding.roomType}</span>
                      </div>
                    )}
                    {boarding.nearbyLandmark && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-white/70 mb-1">Nearby Landmark</p>
                        <p className="font-medium">{boarding.nearbyLandmark}</p>
                      </div>
                    )}
                    {boarding.rating !== undefined && (
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-white/70 mb-1">Rating</p>
                        <p className="font-medium">{boarding.rating} / 5</p>
                      </div>
                    )}
                  </div>
                </section>

                <section className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <h3 className="text-lg font-bold mb-4">Owner Contact</h3>
                  <div className="space-y-3 text-sm">
                    {(boarding.ownerName || owner.name || owner.fullName) && (
                      <div className="flex items-center gap-2 text-white/90"><i className="fas fa-user" />{boarding.ownerName || owner.name || owner.fullName}</div>
                    )}
                    {(boarding.contact || owner.phone || owner.contactNumber) && (
                      <div className="flex items-center gap-2 text-white/90"><i className="fas fa-phone" />{boarding.contact || owner.phone || owner.contactNumber}</div>
                    )}
                    {(boarding.ownerEmail || owner.email) && (
                      <div className="flex items-center gap-2 text-white/90"><i className="fas fa-envelope" />{boarding.ownerEmail || owner.email}</div>
                    )}
                  </div>
                </section>

                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={onOpenFullDetails}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-bold shadow-lg hover:opacity-95"
                  >
                    <i className="fas fa-external-link-alt" />
                    View Full Details
                  </button>

                  {mapUrl && (
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20"
                    >
                      <i className="fas fa-map-marker-alt" />
                      Open in Maps
                    </a>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default BoardingDetailsModal;
