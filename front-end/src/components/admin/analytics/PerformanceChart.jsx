import React from 'react';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, Title, Tooltip, Legend, Filler 
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const PerformanceChart = ({ title, chartData }) => {
  // Check if chartData exists and has the necessary datasets to prevent "undefined" map errors
  const hasData = chartData && chartData.datasets && chartData.datasets.length > 0;

  const data = {
    labels: hasData ? chartData.labels : [],
    datasets: [
      {
        label: title,
        data: hasData ? chartData.datasets[0].data : [],
        fill: true,
        backgroundColor: 'rgba(99, 102, 241, 0.1)', // Light indigo
        borderColor: '#6366f1', // Indigo
        borderWidth: 3,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverRadius: 6,
        tension: 0.4, // Creates a smooth curve
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        cornerRadius: 8,
        displayColors: false
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      },
      x: { 
        grid: { display: false },
        ticks: { color: '#64748b', font: { size: 11 } }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-[25px] shadow-sm flex flex-col h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-text-dark">{title}</h3>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-accent"></span>
          <span className="text-xs text-text-muted font-medium">Growth Rate</span>
        </div>
      </div>
      
      <div className="flex-grow relative">
        {!hasData ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
            <p className="text-text-muted italic">No trend data available</p>
          </div>
        ) : (
          <Line data={data} options={options} />
        )}
      </div>
    </div>
  );
};

export default PerformanceChart;