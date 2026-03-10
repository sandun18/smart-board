import React from "react";

const AppointmentItem = ({ appointment }) => {
  // Mapping statuses to Tailwind utility classes
  const statusStyles = {
    pending: "bg-orange-100 text-orange-700",
    confirmed: "bg-green-100 text-green-700",
    visited: "bg-indigo-100 text-indigo-700",
    cancelled: "bg-red-100 text-red-700",
  };

  const currentStatusStyle =
    statusStyles[appointment.status] || statusStyles.pending;

  return (
    <div
      className={`
        flex items-center gap-3 md:gap-4 p-4 border-b border-light relative transition-colors duration-200
        ${appointment.isNew ? "bg-accent/5" : "bg-card-bg"}
        hover:bg-light/30
      `}
    >
      {/* New Appointment Indicator (Left Border) */}
      {appointment.isNew && (
        <div className="absolute top-0 bottom-0 left-0 w-1 bg-accent" />
      )}

      {/* Avatar */}
      <div className="w-10 h-10 overflow-hidden border rounded-full shadow-sm md:w-11 md:h-11 shrink-0 border-light">
        <img
          src={appointment.avatar}
          alt={appointment.student}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Info Container */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          {/* Main Details */}
          <div>
            <h4 className="text-sm font-bold leading-snug text-text">
              {appointment.student}
            </h4>
            <p className="text-xs text-muted mt-0.5 truncate">
              {appointment.property}
            </p>
          </div>

          {/* Status Badge (Right Aligned) */}
          <span
            className={`
              shrink-0 ml-2 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest
              ${currentStatusStyle}
            `}
          >
            {appointment.status}
          </span>
        </div>

        {/* Time - Placed below for clear hierarchy */}
        <div className="mt-1.5 flex items-center gap-2">
          <i className="far fa-clock text-[10px] text-muted/60"></i>
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wide text-muted/80">
            {appointment.time}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentItem;
