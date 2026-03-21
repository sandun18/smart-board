import React from 'react';

const StatCard = ({ icon, label, value, change, increase, subtext }) => {
  return (
    /* MOBILE: Reduced padding (p-4), DESKTOP: Original (lg:p-6) */
    <div className="bg-card-bg p-4 lg:p-6 rounded-[25px] shadow-custom hover:-translate-y-[5px] transition-transform duration-300 flex gap-3 lg:gap-4 items-start h-full">
      
      {/* MOBILE: Smaller icon container (w-[50px] h-[50px]), DESKTOP: Original (lg:w-[60px] lg:h-[60px]) */}
      <div className="bg-background-light p-3 lg:p-4 rounded-[15px] text-accent text-xl lg:text-2xl w-[50px] h-[50px] lg:w-[60px] lg:h-[60px] flex items-center justify-center shrink-0">
        <i className={`fas ${icon}`}></i>
      </div>
      
      <div className="flex flex-col">
        {/* MOBILE: Smaller text (text-xs) */}
        <h3 className="text-text-muted font-semibold mb-1 lg:mb-2 text-xs lg:text-base tracking-tighter lowercase first-letter:uppercase">
          {label}
        </h3>
        
        {/* MOBILE: Smaller value (text-xl) */}
        <strong className="text-xl lg:text-2xl text-text-dark block font-bold leading-none mb-1 tracking-tight">
          {value}
        </strong>
        
        <div className="text-[10px] lg:text-sm text-text-muted flex items-center gap-2 mt-1">
          {change ? (
            <>
              <span className={`flex items-center gap-1 font-medium ${increase ? 'text-success' : 'text-red-alert'}`}>
                <i className={`fas fa-arrow-${increase ? 'up' : 'down'}`}></i>
                {change}
              </span>
              <span className="opacity-80">this month</span>
            </>
          ) : (
            <span className="opacity-80">{subtext}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;