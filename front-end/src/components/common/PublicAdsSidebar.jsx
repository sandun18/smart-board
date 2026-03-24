import React, { useState, useEffect, useRef } from 'react';
import AdminService from '../../api/admin/AdminService';

const PublicAdsSidebar = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const VISIBLE_COUNT = 5; // show up to 5 ads at once
  const [startIndex, setStartIndex] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(0);
  const [adAspectRatios, setAdAspectRatios] = useState({});
  const sidebarRef = useRef(null);

  useEffect(() => {
    fetchPublicAds();
  }, []);

  useEffect(() => {
    if (!sidebarRef.current) return undefined;

    const updateWidth = () => {
      if (sidebarRef.current) {
        setSidebarWidth(sidebarRef.current.clientWidth || 0);
      }
    };

    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(sidebarRef.current);

    return () => observer.disconnect();
  }, []);

  const fetchPublicAds = async () => {
    setLoading(true);
    setError(null);
    try {
      const publicAds = await AdminService.getPublicAds();
      setAds(publicAds || []);
    } catch (err) {
      console.error('Failed to fetch public ads:', err);
      setError('Unable to load advertisements');
      setAds([]);
    } finally {
      setLoading(false);
    }
  };
  // Hooks and helpers for rotating visible ads — keep hooks at top to preserve call order
  useEffect(() => {
    setStartIndex(0);
  }, [ads.length]);

  useEffect(() => {
    if (ads.length <= VISIBLE_COUNT) return undefined;
    const interval = setInterval(() => {
      setStartIndex((s) => (s + VISIBLE_COUNT) % ads.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [ads.length]);

  const getVisibleAds = () => {
    if (ads.length <= VISIBLE_COUNT) return ads;
    const end = startIndex + VISIBLE_COUNT;
    if (end <= ads.length) return ads.slice(startIndex, end);
    return ads.slice(startIndex).concat(ads.slice(0, end - ads.length));
  };

  const visibleAds = getVisibleAds();

  useEffect(() => {
    const nextRatios = {};

    visibleAds.forEach((ad) => {
      if (!ad.bannerImageUrl || adAspectRatios[ad.id]) return;

      const img = new Image();
      img.onload = () => {
        if (img.naturalWidth > 0 && img.naturalHeight > 0) {
          setAdAspectRatios((prev) => ({
            ...prev,
            [ad.id]: img.naturalHeight / img.naturalWidth,
          }));
        }
      };
      img.src = ad.bannerImageUrl;
    });

    return () => {
      Object.keys(nextRatios).forEach((k) => delete nextRatios[k]);
    };
  }, [visibleAds, adAspectRatios]);

  const getAdHeight = (adId) => {
    const ratio = adAspectRatios[adId] || 0.62;
    const width = sidebarWidth || 240;
    // Scale by real image ratio, then clamp so very tall banners don't dominate the page.
    return Math.max(180, Math.min(Math.round(width * ratio), 300));
  };

  if (error) {
    return (
      <div className="w-full bg-white rounded-[20px] p-6 shadow-lg border-2 border-red-100">
        <h3 className="text-sm font-black text-red-600 uppercase tracking-widest">⚠ Error Loading Ads</h3>
        <p className="text-xs text-red-500 mt-2">{error}</p>
      </div>
    );
  }

  if (visibleAds.length === 0) return null;

  // Render visible window (up to VISIBLE_COUNT) and let images display at their natural height
  return (
    <aside ref={sidebarRef} className="w-full flex flex-col gap-3">
      {visibleAds.map((ad) => (
        <a
          key={ad.id}
          href={ad.redirectUrl || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="group block rounded-2xl overflow-hidden shadow-lg border border-[#e0d6c5] bg-white/95 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#D84C38]"
        >
          {ad.bannerImageUrl ? (
            <img
              src={ad.bannerImageUrl}
              alt={ad.title}
              style={{ height: `${getAdHeight(ad.id)}px` }}
              className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div style={{ height: `${getAdHeight(ad.id)}px` }} className="w-full bg-gradient-to-r from-[#D84C38] to-[#E6633F] flex items-center justify-center p-3">
              <h4 className="text-white font-black text-sm text-center line-clamp-2">{ad.title}</h4>
            </div>
          )}
        </a>
      ))}
    </aside>
  );
};

export default PublicAdsSidebar;
