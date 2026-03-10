import React from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsTabs from '../../components/admin/settings/SettingsTabs';
import SystemStatus from '../../components/admin/settings/SystemStatus';
import GeneralSettings from '../../components/admin/settings/GeneralSettings';
import BackupManagement from '../../components/admin/settings/BackupManagement';
import SystemLogs from '../../components/admin/settings/SystemLogs';
import { useSettings } from '../../hooks/admin/useSettings';

const AdminSettings = () => {
  const navigate = useNavigate();
  const { 
    activeSection, setActiveSection, 
    maintenanceMode, setMaintenanceMode, 
    systemHealth, handleSave 
  } = useSettings();

  const tabs = [
    { id: 'general', label: 'General Settings', icon: 'fa-cog' },
    { id: 'security', label: 'Security & Access', icon: 'fa-shield-alt' },
    { id: 'backup', label: 'Backup & Restore', icon: 'fa-database' },
    { id: 'logs', label: 'Activity Logs', icon: 'fa-history' }
  ];

  return (
    <>
      {/* Maintenance Mode Banner - Matches HTML Indicator */}
      {maintenanceMode && (
        <div className="mb-6 bg-red-alert/10 border border-red-alert/20 p-4 rounded-xl flex items-center gap-4 text-red-alert animate-pulse">
          <div className="w-10 h-10 bg-red-alert text-white rounded-full flex items-center justify-center">
            <i className="fas fa-tools"></i>
          </div>
          <div>
            <h4 className="font-bold">Maintenance Mode Active</h4>
            <p className="text-xs opacity-80">Public access is currently restricted to administrators only.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-8">
        {/* Left Sidebar - Navigation & Quick Toggle */}
        <div className="w-full xl:w-80 flex flex-col gap-6">
          <div className="bg-white p-4 rounded-large shadow-custom border border-gray-100">
            <SettingsTabs 
              tabs={tabs} 
              activeSection={activeSection} 
              onTabChange={setActiveSection} 
            />
          </div>

          <div className="bg-primary text-white p-6 rounded-large shadow-lg relative overflow-hidden group">
            <i className="fas fa-server absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:scale-110 transition-transform"></i>
            <div className="relative z-10">
              <h4 className="font-bold mb-2">Maintenance Mode</h4>
              <p className="text-xs text-white/70 mb-4">Temporarily disable front-end access for updates.</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={maintenanceMode}
                  onChange={(e) => setMaintenanceMode(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1">
          <SystemStatus health={systemHealth} />
          
          <div className="bg-white rounded-large shadow-custom border border-gray-50 p-8 min-h-[500px]">
            {activeSection === 'general' && <GeneralSettings onSave={handleSave} />}
            {activeSection === 'backup' && <BackupManagement />}
            {activeSection === 'logs' && <SystemLogs />}
            {activeSection === 'security' && (
              <div className="text-center py-20 opacity-50">
                <i className="fas fa-user-lock text-5xl mb-4 text-text-muted"></i>
                <p className="font-bold text-text-muted">Security Settings Coming Soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSettings;