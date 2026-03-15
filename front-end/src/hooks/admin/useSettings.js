import { useState, useEffect } from 'react';
import AdminService from '../../api/admin/AdminService';

export const useSettings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [systemHealth, setSystemHealth] = useState({ cpu: 12, ram: 45, storage: 28 });
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'SmartBoAD',
    supportEmail: 'support@smartboad.lk',
    supportPhone: '+94 77 123 4567',
    address: '123, High Level Road, Colombo 07, Sri Lanka',
    maintenanceMode: false
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [settings, health] = await Promise.all([
          AdminService.getSystemSettings(),
          AdminService.getSystemHealth()
        ]);

        if (settings) {
          setGeneralSettings(settings);
          setMaintenanceMode(Boolean(settings.maintenanceMode));
          localStorage.setItem('sbms_maintenance_mode', String(Boolean(settings.maintenanceMode)));
        }
        if (health) {
          setSystemHealth(health);
        }
      } catch (error) {
        console.error('Failed to load system settings', error);
      }
    };

    loadInitial();

    const interval = setInterval(async () => {
      try {
        const health = await AdminService.getSystemHealth();
        if (health) {
          setSystemHealth(health);
        }
      } catch (error) {
        console.warn('System health refresh failed', error);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      const toSave = {
        ...generalSettings,
        ...payload,
        maintenanceMode: payload?.maintenanceMode ?? maintenanceMode
      };
      const updated = await AdminService.updateSystemSettings(toSave);
      setGeneralSettings(updated);
      setMaintenanceMode(Boolean(updated.maintenanceMode));
      localStorage.setItem('sbms_maintenance_mode', String(Boolean(updated.maintenanceMode)));
      return { success: true };
    } catch (error) {
      console.error('Failed to save settings', error);
      return { success: false, message: error.response?.data?.message || error.message };
    } finally {
      setSaving(false);
    }
  };

  return {
    activeSection,
    setActiveSection,
    maintenanceMode,
    setMaintenanceMode,
    systemHealth,
    generalSettings,
    saving,
    handleSave
  };
};