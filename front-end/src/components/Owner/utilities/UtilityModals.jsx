import React from "react";

/**
 * Sub-Component: Billing Summary
 * Now includes "Per Student" breakdown
 */
export const BillingSummary = ({
  totalUtility,
  totalMonthly,
  baseRent=0,
  tenantCount = 4,
}) => {
  const safeTenantCount = tenantCount > 0 ? tenantCount : 1;
  const perStudent = totalMonthly / safeTenantCount;

  return (
    <div className="p-5 space-y-3 border rounded-card bg-accent/5 border-accent/10">
      {/* Base Rent Line */}
      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
        <span className="text-muted">Monthly Base Rent</span>
        <span className="text-text">LKR {baseRent.toLocaleString()}</span>
      </div>

      {/* Utilities Line */}
      <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest">
        <span className="text-muted">Variable Utilities</span>
        <span className="text-text">+ LKR {totalUtility.toLocaleString()}</span>
      </div>

      {/* Grand Total Section */}
      <div className="flex items-center justify-between pt-3 border-t border-accent/20">
        <span className="text-xs font-black tracking-widest uppercase text-text">
          Total for House
        </span>
        <span className="text-lg font-black tracking-tighter text-text">
          LKR {totalMonthly.toLocaleString()}
        </span>
      </div>

      {/* NEW: Per Student Highlight */}
      <div className="flex items-center justify-between p-3 mt-2 bg-white border rounded-lg shadow-sm border-accent/20">
        <div className="flex items-center gap-2">
          <div className="bg-accent/10 p-1.5 rounded-md text-accent">
            <i className="text-xs fas fa-user-friends"></i>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-muted tracking-widest">
              Split ({tenantCount} Students)
            </span>
          </div>
        </div>
        <span className="text-xl font-black tracking-tighter text-accent">
          LKR {Math.round(perStudent).toLocaleString()}
        </span>
      </div>
    </div>
  );
};

/**
 * Sub-Component: Nice Input
 */
export const NiceInput = ({ label, name, value, onChange, icon }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-muted uppercase tracking-[0.2em] ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute transition-colors -translate-y-1/2 left-4 top-1/2 text-muted/50 group-focus-within:text-accent">
        <i className={`fas ${icon} text-sm`}></i>
      </div>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        className="
          w-full pl-12 pr-4 py-3.5 rounded-xl transition-all duration-300
          bg-light/30 border-2 border-transparent text-text font-bold text-sm
          placeholder:text-muted/30
          focus:bg-white focus:border-accent/30 focus:ring-4 focus:ring-accent/5 focus:outline-none
        "
        placeholder="0.00"
      />
    </div>
  </div>
);
