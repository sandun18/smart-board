import React from 'react';
import AnalyticsStats from '../../components/admin/analytics/AnalyticsStats';
import PerformanceChart from '../../components/admin/analytics/PerformanceChart';
import CategoryDistribution from '../../components/admin/analytics/CategoryDistribution';
import { useAnalytics } from '../../hooks/admin/useAnalytics';

const AdminAnalytics = () => {
  const { timeRange, setTimeRange, data, isLoading, error } = useAnalytics();

  // 🛡️ 1. LOADING STATE - Show a spinner while waiting
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-accent font-medium">Connecting to server...</p>
      </div>
    );
  }

  // 🛡️ 2. ERROR STATE - If backend is down, show this instead of a blank page
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-4">
        <div className="bg-white p-8 rounded-[30px] shadow-sm border border-red-100 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-exclamation-triangle text-2xl"></i>
          </div>
          <h3 className="text-xl font-bold text-text-dark mb-2">Backend Connection Failed</h3>
          <p className="text-text-muted mb-6">
            {error || "We couldn't reach the analytics service. Please check if your Spring Boot backend is running."}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  // 🚀 3. NORMAL RENDER - Only runs if data exists
  return (
    <div>
      <div className="mb-6 flex justify-end">
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white border border-gray-200 rounded-lg px-4 py-2 outline-none cursor-pointer focus:ring-2 focus:ring-accent/20"
        >
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Since we checked !data above, we know data.stats exists here */}
      <AnalyticsStats stats={data.stats || []} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        <PerformanceChart title="Student Growth" chartData={data.studentTrend} />
        <PerformanceChart title="Property Listings" chartData={data.listingTrend} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CategoryDistribution data={data.categoryData} />
        </div>
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-[25px] shadow-sm h-full flex items-center justify-center text-text-muted italic border border-gray-50 text-center">
             Select a data point in the charts to see detailed demographic breakdowns.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;