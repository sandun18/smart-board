import React from 'react';
import { motion } from 'framer-motion';

const ActivityItem = ({ icon: Icon, content, time, status }) => {
  // Logic checks for status string
  const isApproved = status === 'APPROVED' || status === 'ACCEPTED';
  const isRejected = status === 'REJECTED' || status === 'DECLINED';

  return (
    <div className="flex items-start gap-4 p-4 border-b border-background-light last:border-b-0 hover:bg-background-light/20 transition-all">
      <div className={`p-3 rounded-btn text-xl flex-shrink-0 ${
        isApproved ? 'bg-green-100 text-green-600' : 
        isRejected ? 'bg-red-100 text-red-600' : 'bg-background-light text-accent'
      }`}>
        {Icon && <Icon />}
      </div>
      <div className="flex flex-col min-w-0">
        <div className={`text-sm md:text-base font-medium ${isRejected ? 'text-red-700' : 'text-text-dark'}`}>
          {content}
        </div>
        <span className="text-text-muted text-xs md:text-sm mt-1 italic">{time}</span>
      </div>
    </div>
  );
};

const RecentActivitySection = ({ activities }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mb-8"
    >
      <h2 className="text-primary text-xl md:text-2xl font-bold mb-4">
        Recent Activity
      </h2>

      <div className="bg-card-bg rounded-large shadow-custom overflow-hidden">
        {activities && activities.length > 0 ? (
          activities.map((item) => (
            <ActivityItem 
               key={item.id} 
               icon={item.icon} 
               content={item.content} 
               time={item.timeAgo} 
               status={item.status} 
            />
          ))
        ) : (
          <div className="p-8 text-center text-text-muted">
             No recent appointment updates within the last 2 weeks.
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default RecentActivitySection;