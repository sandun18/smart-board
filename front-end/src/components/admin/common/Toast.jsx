import React, { useEffect, useState } from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  // Determine styles based on type
  const getStyles = () => {
    switch (type) {
      case 'success':
        return { border: 'border-l-success', icon: 'fa-check-circle', iconColor: 'text-success' };
      case 'error':
        return { border: 'border-l-red-alert', icon: 'fa-exclamation-triangle', iconColor: 'text-red-alert' };
      case 'warning':
        return { border: 'border-l-yellow-500', icon: 'fa-exclamation-circle', iconColor: 'text-yellow-500' };
      default:
        return { border: 'border-l-info', icon: 'fa-info-circle', iconColor: 'text-info' };
    }
  };

  const styles = getStyles();

  return (
    <div 
      className={`fixed top-[100px] right-[20px] bg-white p-4 rounded-btn shadow-[0_8px_25px_rgba(0,0,0,0.15)] border-l-4 ${styles.border} z-50 max-w-[350px] flex items-center gap-4 transition-transform duration-300 ease-out ${isVisible ? 'translate-x-0' : 'translate-x-[400px]'}`}
    >
      <div className="flex items-center gap-3 flex-1">
        <i className={`fas ${styles.icon} ${styles.iconColor} text-lg`}></i>
        <span className="text-text-dark text-sm font-medium">{message}</span>
      </div>
      
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300); // Wait for animation to finish before unmounting
        }}
        className="bg-transparent border-none text-text-muted cursor-pointer p-1 rounded hover:bg-background-light hover:text-text-dark transition-colors"
      >
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Toast;