import React from "react";
import { Link } from "react-router-dom";

const HeroAction = () => (
  <div className="relative overflow-hidden text-white shadow-lg rounded-xl bg-primary group">
    <div className="relative z-10 flex flex-col items-start justify-between h-full p-6">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest mb-3 backdrop-blur-sm">
          <i className="text-yellow-400 fas fa-bolt"></i> Quick Action
        </div>
        <h3 className="mb-2 text-xl font-black tracking-tight uppercase md:text-2xl">
          Post New Ad
        </h3>
        <p className="text-sm text-white/80 max-w-[200px] mb-6 leading-relaxed">
          Have a vacancy? Create a listing in seconds and find tenants fast.
        </p>
      </div>

      <Link
        to="/ownerLayout/myAds/createAd"
        className="px-5 py-2.5 bg-white text-primary rounded-lg font-bold text-sm shadow-md hover:bg-gray-50 active:scale-95 transition-all flex items-center gap-2"
      >
        <span>Create Now</span>
        <i className="fas fa-arrow-right"></i>
      </Link>
    </div>

    {/* Background Decoration */}
    <div className="absolute top-0 bottom-0 right-0 w-1/2 pointer-events-none bg-gradient-to-l from-white/10 to-transparent"></div>
    <i className="fas fa-bullhorn absolute -bottom-6 -right-6 text-[120px] text-white opacity-10 -rotate-12 group-hover:rotate-0 group-hover:scale-105 transition-all duration-500"></i>
  </div>
);

export default HeroAction;
