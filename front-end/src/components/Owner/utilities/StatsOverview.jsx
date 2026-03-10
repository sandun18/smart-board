import React from "react";

const StatsCard = ({ title, value, subtext, icon, colorClass, bgClass }) => (
  <div className="flex-1 p-6 transition-all duration-300 border bg-card-bg rounded-report border-light shadow-custom hover:-translate-y-1">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted">
          {title}
        </p>
        <h2 className={`text-3xl font-black ${colorClass} tracking-tighter`}>
          {value}
        </h2>
        {subtext && (
          <p className="text-[10px] font-bold text-muted/60 mt-1">{subtext}</p>
        )}
      </div>
      <div
        className={`w-12 h-12 rounded-2xl ${bgClass} flex items-center justify-center shadow-sm`}
      >
        <i className={`fas ${icon} text-lg`}></i>
      </div>
    </div>
  </div>
);

const StatsOverview = ({ boardings }) => {
  // SAFE CALCULATIONS: Handle empty lists or undefined values
  
  // 1. Total Utility Cost
  const totalUtility = boardings.reduce(
    (acc, curr) => acc + (Number(curr.electricityCost) || 0) + (Number(curr.waterCost) || 0), 
    0
  );

  // 2. Highest Single Bill
  const highestBillValue = boardings.length > 0 
    ? Math.max(...boardings.map((b) => (Number(b.electricityCost) || 0) + (Number(b.waterCost) || 0)))
    : 0;

  // 3. Count Pending Updates (Check specific string logic)
  const pendingUpdates = boardings.filter(
    (b) => !b.lastUpdated || b.lastUpdated === "N/A"
  ).length;

  return (
    <div className="grid grid-cols-1 gap-6 px-4 md:grid-cols-3">
      {/* Total Utilities Card */}
      <StatsCard
        title="Total Utilities (Nov)"
        value={`LKR ${totalUtility.toLocaleString()}`}
        subtext={`${boardings.length} Active Properties`}
        icon="fa-coins"
        colorClass="text-text"
        bgClass="bg-accent/10 text-accent"
      />

      {/* Highest Consumer Card */}
      <StatsCard
        title="Highest Single Bill"
        value={`LKR ${highestBillValue.toLocaleString()}`}
        subtext="Peak Consumption"
        icon="fa-chart-line"
        colorClass="text-error"
        bgClass="bg-error/10 text-error"
      />

      {/* Pending Action Card */}
      <StatsCard
        title="Pending Updates"
        value={pendingUpdates}
        subtext={pendingUpdates > 0 ? "Requires Attention" : "All up to date"}
        icon="fa-clipboard-list"
        colorClass={pendingUpdates > 0 ? "text-primary" : "text-success"}
        bgClass={
          pendingUpdates > 0
            ? "bg-primary/10 text-primary"
            : "bg-success/10 text-success"
        }
      />
    </div>
  );
};

export default StatsOverview;
