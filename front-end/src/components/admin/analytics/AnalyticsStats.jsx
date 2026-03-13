import React from 'react';
import StatCard from '../dashboard/StatCard';

const AnalyticsStats = ({ stats }) => {
  const normalizeIcon = (iconKey) => {
    const key = String(iconKey || '').trim().toLowerCase();
    const iconMap = {
      users: 'fa-users',
      'graduation-cap': 'fa-graduation-cap',
      home: 'fa-home',
      exclamation: 'fa-exclamation-circle',
      'exclamation-circle': 'fa-exclamation-circle',
      'exclamation-triangle': 'fa-exclamation-triangle'
    };

    if (iconMap[key]) {
      return iconMap[key];
    }

    // If backend already returns Font Awesome style, keep it.
    if (key.startsWith('fa-')) {
      return key;
    }

    return 'fa-chart-line';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={normalizeIcon(stat.icon)}
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