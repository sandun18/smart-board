import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaChevronRight } from "react-icons/fa";

const TenantModal = ({
  isOpen,
  onClose,
  propertyName,
  tenants = [],
  onViewTenant,
}) => {

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", bounce: 0.4, duration: 0.5 },
    },
    exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text/40 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          <motion.div
            className="bg-card-bg w-full max-w-2xl rounded-boarding shadow-2xl overflow-hidden border border-light"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Header */}
            <div className="p-6 border-b border-light flex justify-between items-center bg-light/30">
              <div>
                <h3 className="text-xl font-black text-primary tracking-tight uppercase">
                  Current Tenants
                </h3>
                <p className="text-[11px] font-bold text-muted uppercase tracking-wider">
                  {propertyName}
                </p>
              </div>

              <button
                onClick={onClose}
                className="text-muted hover:text-text transition-colors p-2 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Tenant List */}
            <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">

              {tenants && tenants.length > 0 ? (

                <motion.div
                  className="space-y-3"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                >

                  {tenants.map((tenant) => (

                    <motion.div
                      key={tenant.id}
                      variants={itemVariants}
                      className="flex items-center justify-between p-4 rounded-2xl border border-light bg-white/50 hover:bg-white transition-all group"
                    >

                      <div className="flex items-center gap-4">

                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-light flex items-center justify-center">

                          {tenant.avatar ? (
                            <img
                              src={tenant.avatar}
                              alt={tenant.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FaUserCircle className="text-xl text-muted" />
                          )}

                        </div>

                        <div>
                          <p className="font-black text-text text-sm">
                            {tenant.name}
                          </p>

                          <p className="text-[9px] font-bold uppercase text-muted tracking-widest">
                            Joined: {tenant.joinedDate}
                          </p>
                        </div>

                      </div>

                      {/* View Profile */}
                      <button
                        onClick={() => onViewTenant(tenant)}
                        className="px-4 py-2 bg-white border border-light rounded-full text-[10px] font-black uppercase tracking-widest text-primary shadow-sm hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center gap-2"
                      >
                        View Profile <FaChevronRight className="text-[8px]" />
                      </button>

                    </motion.div>

                  ))}

                </motion.div>

              ) : (

                <div className="text-center py-16 text-muted/40">
                  <p className="font-black uppercase tracking-widest text-xs">
                    No active tenants found.
                  </p>
                </div>

              )}

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-light bg-light/10 flex justify-end">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all active:scale-95"
              >
                Close
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TenantModal;