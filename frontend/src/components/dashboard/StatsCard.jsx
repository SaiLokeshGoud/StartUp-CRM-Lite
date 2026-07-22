import AnimatedCounter from "../common/AnimatedCounter";

/**
 * Reusable dashboard statistic card
 * @param {Object} props
 * @param {string} props.title
 * @param {string|number} props.value
 * @param {React.ComponentType} props.icon
 * @param {number} props.change
 * @param {string} props.color
 */
export default function StatsCard({
  title,
  value,
  icon: Icon,
  change,
  color,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm hover-card hover-shine card-icon-hover transition-all active:scale-[0.98] duration-200 cursor-pointer dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 truncate">{title}</p>

          <h2 className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
            <AnimatedCounter value={value} />
          </h2>

          <p className="mt-1.5 sm:mt-2 text-[11px] sm:text-sm font-semibold tracking-wide" style={{ color }}>
            +{change}% from last month
          </p>
        </div>

        <div className="rounded-2xl p-2.5 sm:p-3 shadow-sm shrink-0" style={{ backgroundColor: `${color}14`, color }}>
          <Icon className="card-icon h-5 w-5 sm:h-[22px] sm:w-[22px]" />
        </div>
      </div>
    </div>
  );
}
