/**
 * Shows lead status distribution
 * @param {Object} props
 * @param {Array} props.leads
 */
export default function PipelineOverview({ leads }) {
  const counts = {
    New: leads.filter((l) => l.status === "New").length,
    Contacted: leads.filter((l) => l.status === "Contacted").length,
    Won: leads.filter((l) => l.status === "Won").length,
    Lost: leads.filter((l) => l.status === "Lost").length,
  };

  const total = leads.length || 1;
  const statuses = [
    { name: "New", color: "bg-blue-500", textColor: "text-blue-600", bgColor: "bg-blue-50 dark:bg-blue-900/20" },
    { name: "Contacted", color: "bg-amber-500", textColor: "text-amber-600", bgColor: "bg-amber-50 dark:bg-amber-900/20" },
    { name: "Won", color: "bg-emerald-500", textColor: "text-emerald-600", bgColor: "bg-emerald-50 dark:bg-emerald-900/20" },
    { name: "Lost", color: "bg-rose-500", textColor: "text-rose-600", bgColor: "bg-rose-50 dark:bg-rose-900/20" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Pipeline Overview</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {total} total leads
        </span>
      </div>

      <div className="flex h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        {statuses.map(({ name, color }) => {
          const value = counts[name] || 0;
          return <div key={name} className={color} style={{ width: `${(value / total) * 100}%` }} />;
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statuses.map(({ name, color, textColor, bgColor }) => {
          const count = counts[name] || 0;
          const percent = total === 0 ? 0 : Math.round((count / total) * 100);

          return (
            <div key={name} className={`rounded-2xl border border-slate-200 p-4 ${bgColor}`}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{name}</p>
                <span className={`h-3 w-3 rounded-full ${color}`} />
              </div>
              <p className={`mt-3 text-2xl font-bold ${textColor}`}>{count}</p>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{percent}% of pipeline</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
