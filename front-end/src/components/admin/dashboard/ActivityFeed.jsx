import React from 'react';

const ActivityFeed = ({ activities }) => {
  const getIconStyles = (type) => {
    switch (type) {
      case 'success': return 'bg-success/10 text-success';
      case 'warning': return 'bg-yellow-500/10 text-yellow-600';
      case 'info':    return 'bg-info/10 text-info';
      case 'primary': return 'bg-accent/10 text-accent';
      default:        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="bg-card-bg rounded-large shadow-custom h-full">
      {/* MOBILE: Reduced p-5, DESKTOP: Original p-6 */}
      <div className="p-5 lg:p-6 pb-3 lg:pb-4 border-b border-gray-100/50">
        <h3 className="text-primary text-lg lg:text-xl font-bold">Recent Activity</h3>
      </div>
      
      <div className="p-4 lg:p-6 flex flex-col gap-3 lg:gap-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 lg:gap-4 p-2 lg:p-3 rounded-btn hover:bg-background-light transition-colors duration-300">
            {/* MOBILE: Smaller 8x8 icon, DESKTOP: Original 10x10 */}
            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center shrink-0 text-xs lg:text-base ${getIconStyles(activity.type)}`}>
              <i className={`fas ${activity.icon}`}></i>
            </div>

            <div className="flex-1">
              <p className="text-text-dark text-xs lg:text-sm mb-0.5 lg:mb-1">
                <strong className="text-primary">{activity.user}</strong> {activity.action}
              </p>
              <span className="text-text-muted text-[10px] lg:text-xs block">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;