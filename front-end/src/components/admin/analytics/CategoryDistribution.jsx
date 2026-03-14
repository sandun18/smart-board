import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryDistribution = ({ data }) => {
  if (!data || !data.datasets) return null;

  const chartData = {
    labels: data.labels,
    datasets: [{
      label: 'Categories',
      data: data.datasets[0].data,
      backgroundColor: ['#6366f1', '#f59e0b', '#10b981', '#ef4444'],
      hoverOffset: 15,
      borderWidth: 0,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: { size: 12, weight: '600' }
        }
      }
    },
    cutout: '75%'
  };

  return (
    <div className="bg-white p-6 rounded-[25px] shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-bold text-text-dark mb-6">Property Categories</h3>
      <div className="flex-grow min-h-[300px] relative">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default CategoryDistribution;