import React from 'react';
import { motion } from 'framer-motion';
import { FaKey, FaLock } from 'react-icons/fa';

const AccountInfoSection = ({ userData, onSecurity }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatLastLogin = () => {
    return `Today, ${new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })}`;
  };

  const accountItems = [
    { label: 'Email Address', value: userData.email },
    { label: 'Username', value: userData.firstName },
    { label: 'Account Created', value: formatDate(userData.createdAt) },
    { label: 'Last Login', value: formatLastLogin() },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card-bg rounded-large shadow-custom p-6"
    >
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <h3 className="text-xl font-bold text-primary flex items-center gap-2">
          <FaKey />
          Account Information
        </h3>
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSecurity}
          className="flex items-center gap-2 px-4 py-2 rounded-large font-semibold text-sm bg-background-light text-text-dark hover:bg-accent hover:text-white transition-all duration-300"
        >
          <FaLock />
          Security
        </motion.button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accountItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 rounded-large hover:bg-background-light/30 transition-colors duration-200"
          >
            <label className="block text-sm font-semibold text-text-muted mb-1">
              {item.label}
            </label>
            <p className="text-text-dark">{item.value}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default AccountInfoSection;