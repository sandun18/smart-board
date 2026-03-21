import React from 'react';
import StatCard from './StatCard';

const StatsGrid = ({ stats }) => {
  if (!stats) return null;

  const data = [
    { label: "Total Users", value: stats.totalUsers, icon: "fa-users", color: "primary" },
    { label: "Total Owners", value: stats.totalOwners, icon: "fa-user-tie", color: "warning" },
    { label: "Total Boardings", value: stats.totalBoardings, icon: "fa-home", color: "success" },
    { label: "Pending Reports", value: stats.pendingReports, icon: "fa-exclamation-circle", color: "red-alert" },
  ];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {data.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          label={stat.label}
          value={stat.value?.toLocaleString()}
        />
      ))}
    </section>
  );
};

export default StatsGrid;