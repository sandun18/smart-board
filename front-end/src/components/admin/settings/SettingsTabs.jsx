import React from 'react';

const SettingsTabs = ({ tabs, activeSection, onTabChange }) => {
  return (
    <nav className="flex flex-col gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-4 px-5 py-4 rounded-[15px] font-bold transition-all duration-300 ${
            activeSection === tab.id
              ? 'bg-primary text-white shadow-lg translate-x-2'
              : 'text-text-muted hover:bg-white hover:text-primary'
          }`}
        >
          <i className={`fas ${tab.icon} w-5 text-center text-lg`}></i>
          <span className="text-sm tracking-tight">{tab.label}</span>
          {activeSection === tab.id && (
            <i className="fas fa-chevron-right ml-auto text-xs opacity-50"></i>
          )}
        </button>
      ))}
    </nav>
  );
};

export default SettingsTabs;