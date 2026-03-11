import React from 'react';
import { motion } from 'framer-motion';
import { FaWallet, FaCheckCircle, FaCalendarAlt, FaReceipt } from 'react-icons/fa';

const CARD_CONFIGS = [
  {
    key: 'currentBalance',
    title: 'Current Balance',
    icon: FaWallet,
    colorClass: 'text-error',
    subLabel: 'dueDate',
  },
  {
    key: 'paidThisMonth',
    title: 'Paid This Month',
    icon: FaCheckCircle,
    colorClass: 'text-success',
    subLabel: 'status',
  },
  {
    key: 'nextPayment',
    title: 'Next Payment',
    icon: FaCalendarAlt,
    colorClass: 'text-accent',
    subLabel: 'date',
  },
  {
    key: 'totalPayments',
    title: 'Payment History',
    icon: FaReceipt,
    colorClass: 'text-primary',
    subLabel: 'description',
  },
];
const OverviewCards = ({ overview = {} }) => {
  return (
    <section className="mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 min-[1400px]:grid-cols-4 gap-6">
        {CARD_CONFIGS.map((config, index) => {
          const data = overview[config.key] || {};

          return (
            <OverviewCard
              key={config.key}
              icon={config.icon}
              title={config.title}
              amount={data.amount ?? 0}
              subtitle={data[config.subLabel] ?? '-'}
              colorClass={config.colorClass}
              index={index}
            />
          );
        })}
      </div>
    </section>
  );
};


const OverviewCard = ({ icon: Icon, title, amount, subtitle, colorClass, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    // h-full for equal height
    className="bg-card-bg rounded-large shadow-custom p-6 flex items-center gap-4 transition-shadow duration-300 hover:shadow-xl h-full"
  >
    <div className="bg-background-light p-4 rounded-large text-accent text-2xl flex-shrink-0">
      <Icon />
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-sm font-semibold text-text-muted mb-2 truncate">{title}</h3>
      <div className={`text-3xl font-bold ${colorClass} mb-1 truncate`}>
        {typeof amount === 'number' ? `LKR ${amount}` : amount}
      </div>
      <span className="text-sm text-text-muted truncate block">{subtitle}</span>
    </div>
  </motion.div>
);

export default OverviewCards;