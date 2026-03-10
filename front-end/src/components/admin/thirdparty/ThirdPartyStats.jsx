import React from 'react';
import StatCard from '../dashboard/StatCard';

const ThirdPartyStats = ({ stats }) => {
  /**
   * SAFETY CHECK:
   * If the parent component passes null or if data hasn't arrived,
   * we default to 0 so the toLocaleString() function doesn't crash the app.
   */
  const pendingCount = stats?.pending ?? 0;
  const activeCount = stats?.activeCampaigns ?? 0;
  const revenue = stats?.totalRevenue ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {/* Pending Reviews */}
      <StatCard 
        icon="fa-clock" 
        label="Pending Review" 
        value={pendingCount} 
      />

      {/* Active Ads */}
      <StatCard 
        icon="fa-layer-group" 
        label="Active Campaigns" 
        value={activeCount} 
      />

      {/* Revenue - Most common crash site */}
      <StatCard 
        icon="fa-hand-holding-usd" 
        label="Total Revenue" 
        value={`Rs. ${Number(revenue).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}`} 
      />
    </div>
  );
};

export default ThirdPartyStats;