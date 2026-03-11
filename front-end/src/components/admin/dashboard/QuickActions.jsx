import React from 'react';

const QuickActions = ({ onNavigate, onBackup }) => {
  const actions = [
    { label: 'Manage Users', icon: 'fa-user-cog', id: 'users' },
    { label: 'Ad Management', icon: 'fa-home', id: 'ads' },
    { label: 'View Analytics', icon: 'fa-chart-line', id: 'analytics' },
    { label: 'System Settings', icon: 'fa-cogs', id: 'settings' },
    { label: 'Create Ad', icon: 'fa-ad', id: 'thirdparty' },
  ];

  return (
    /* MOBILE: Reduced p-5, DESKTOP: Original p-8 */
    <div className="bg-card-bg rounded-large shadow-custom p-5 lg:p-8">
      <h3 className="text-primary text-lg lg:text-xl font-bold mb-4 lg:mb-6">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
        {actions.map((action, idx) => (
          <button 
            key={idx} 
            onClick={() => onNavigate(action.id)} 
            /* MOBILE: Tighter px-4 py-3, smaller text-sm */
            className="flex items-center gap-3 lg:gap-4 px-4 py-3 lg:px-5 lg:py-4 border border-gray-100 rounded-[15px] text-text-dark font-bold hover:bg-accent hover:text-white hover:border-accent hover:shadow-[0_10px_20px_rgba(255,122,0,0.3)] hover:-translate-y-1 transition-all duration-300 group text-left text-sm lg:text-base"
          >
            <i className={`fas ${action.icon} w-5 lg:w-6 text-center text-base lg:text-lg text-accent group-hover:text-white transition-colors`}></i>
            {action.label}
          </button>
        ))}
        <button 
          onClick={onBackup} 
          className="flex items-center gap-3 lg:gap-4 px-4 py-3 lg:px-5 lg:py-4 border border-gray-100 rounded-[15px] text-text-dark font-bold hover:bg-primary hover:text-white hover:border-primary hover:shadow-[0_10px_20px_rgba(216,76,56,0.3)] hover:-translate-y-1 transition-all duration-300 group text-left text-sm lg:text-base"
        >
          <i className="fas fa-database w-5 lg:w-6 text-center text-base lg:text-lg text-primary group-hover:text-white transition-colors"></i>
          Database Backup
        </button>
      </div>
    </div>
  );
};

export default QuickActions;