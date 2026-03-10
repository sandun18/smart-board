import React from "react";

const SkeletonWidget = () => (
  <div className="p-5 border shadow-sm bg-card-bg rounded-xl border-light animate-pulse">
    <div className="flex items-start justify-between mb-4">
      {/* Icon Skeleton */}
      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      {/* Trend Skeleton */}
      <div className="w-16 h-6 bg-gray-100 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="w-20 h-3 bg-gray-200 rounded"></div>
      <div className="w-32 h-8 bg-gray-300 rounded"></div>
      <div className="w-24 h-3 bg-gray-100 rounded"></div>
    </div>
  </div>
);

export default SkeletonWidget;