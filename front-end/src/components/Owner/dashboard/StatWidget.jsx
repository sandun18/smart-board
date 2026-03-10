
const StatWidget = ({ icon, title, mainValue, subValue, trend }) => {
  // Determine trend colors
  const isPositive = trend?.isPositive;
  const trendColor = isPositive
    ? "text-green-600 bg-green-50"
    : "text-red-600 bg-red-50";
  const trendIcon = isPositive ? "fa-arrow-up" : "fa-arrow-down";

  return (
    <div className="flex flex-col p-5 transition-all duration-300 border shadow-sm bg-card-bg rounded-xl border-light hover:shadow-md group">
      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 text-xl transition-transform rounded-lg bg-light/50 text-accent group-hover:scale-110">
          <i className={icon}></i>
        </div>

        {/* Trend Pill */}
        {trend && (
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${trendColor}`}
          >
            <i className={`fas ${trendIcon}`}></i>
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-1 text-xs font-bold tracking-wider uppercase text-muted">
          {title}
        </h3>
        <strong className="text-2xl font-black tracking-tight text-text">
          {mainValue}
        </strong>
        <p className="mt-1 text-xs font-medium text-muted">{subValue}</p>
      </div>
    </div>
  );
};

export default StatWidget;
