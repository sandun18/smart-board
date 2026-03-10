import { useState, useEffect } from 'react';

export const useSettings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [systemHealth, setSystemHealth] = useState({ cpu: 12, ram: 45, storage: 28 });

  // Simulate real-time server monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth({
        cpu: Math.floor(Math.random() * 20) + 5,
        ram: 40 + Math.floor(Math.random() * 10),
        storage: 28
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSave = () => {
    // Logic to save settings
    alert("Settings saved successfully!");
  };

  return { activeSection, setActiveSection, maintenanceMode, setMaintenanceMode, systemHealth, handleSave };
};