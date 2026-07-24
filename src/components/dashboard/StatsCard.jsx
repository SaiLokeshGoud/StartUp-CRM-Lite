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
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</h2>

          <p className="mt-2 text-sm font-medium" style={{ color }}>
            +{change}% from last month
          </p>
        </div>

        <div className="rounded-2xl p-3 shadow-sm" style={{ backgroundColor: `${color}14`, color }}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
