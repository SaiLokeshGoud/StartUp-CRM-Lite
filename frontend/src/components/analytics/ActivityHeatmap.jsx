export default function ActivityHeatmap({ leads }) {
  const activityMap = {};

  const getDateKey = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toISOString().split("T")[0];
  };

  leads.forEach((lead) => {
    const dateKey = getDateKey(lead.createdAt);
    if (!dateKey) return;
    activityMap[dateKey] = (activityMap[dateKey] || 0) + 1;
  });

  const getColor = (count) => {
    if (count === 0) return "bg-slate-200 dark:bg-slate-700";
    if (count === 1) return "bg-blue-200";
    if (count === 2) return "bg-blue-500";
    if (count === 3) return "bg-blue-700";
    return "bg-blue-950";
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover-card hover-shine transition-colors dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Activity Heatmap</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Lead creation and sales activity over time.</p>
        </div>
        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Monthly view
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex max-w-[1120px] gap-4">
          {months.map((month, monthIndex) => (
            <div key={month} className="w-[220px] flex-shrink-0 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
              <h4 className="mb-4 text-center text-base font-semibold text-slate-700 dark:text-slate-300">{month}</h4>

              <div className="flex">
                <div className="mr-3 flex flex-col gap-1.5 text-[10px] font-medium uppercase tracking-wide text-slate-400">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                </div>

                <div className="grid grid-rows-7 grid-flow-col gap-1.5">
                  {Array.from({ length: 35 }, (_, index) => {
                    const date = new Date(2026, monthIndex, index + 1);
                    const dateKey = date.toISOString().split("T")[0];
                    return { id: dateKey, count: activityMap[dateKey] || 0 };
                  }).map((day) => (
                    <div key={day.id} className="group relative">
                      <div
                        title={`${day.id} • ${day.count} leads`}
                        className={`h-4 w-4 rounded-sm border border-white/50 transition-all duration-200 hover:scale-125 dark:border-slate-800 ${getColor(day.count)}`}
                      />
                      <div className="pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-full rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-slate-700 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200">
                        <div>{day.id}</div>
                        <div>{day.count} lead{day.count === 1 ? "" : "s"}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-slate-400">Less</span>
        <div className="h-3 w-3 rounded-sm bg-slate-200 dark:bg-slate-700" />
        <div className="h-3 w-3 rounded-sm bg-blue-200" />
        <div className="h-3 w-3 rounded-sm bg-blue-500" />
        <div className="h-3 w-3 rounded-sm bg-blue-700" />
        <div className="h-3 w-3 rounded-sm bg-blue-950" />
        <span className="text-xs font-medium text-slate-400">More</span>
      </div>
    </div>
  );
}
