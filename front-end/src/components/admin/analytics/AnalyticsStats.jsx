import React from 'react';
import StatCard from '../dashboard/StatCard';

const AnalyticsStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          increase={stat.increase}
        />
      ))}
    </div>
  );
};

export default AnalyticsStats;