import {
  Users,
  TrendingUp,
  IndianRupee,
  XCircle,
} from "lucide-react";

export default function StatsCards({
  totalLeads,
  conversionRate,
  pipelineValue,
  wonRevenue,
  averageSalesCycle,
  lostRate,
}) {
  const cards = [
    {
      title: "Total Leads",
      value: totalLeads,
      icon: Users,
      subtitle: "Active pipeline",
      iconClasses: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300",
    },
    {
      title: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      subtitle: "Wins vs total",
      iconClasses: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    {
      title: "Pipeline Value",
      value: `₹${pipelineValue.toLocaleString()}`,
      icon: IndianRupee,
      subtitle: "Open opportunities",
      iconClasses: "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300",
    },
    {
      title: "Won Revenue",
      value: `₹${wonRevenue.toLocaleString()}`,
      icon: IndianRupee,
      subtitle: "Revenue closed",
      iconClasses: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300",
    },
    {
      title: "Average Sales Cycle",
      value: `${averageSalesCycle} Days`,
      icon: TrendingUp,
      subtitle: "From first touch",
      iconClasses: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-300",
    },
    {
      title: "Lost Rate",
      value: `${lostRate}%`,
      icon: XCircle,
      subtitle: "Lost opportunities",
      iconClasses: "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-sm text-gray-500 dark:text-gray-300">{card.title}</span>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{card.subtitle}</p>
              </div>
              <div className={`rounded-xl p-2 ${card.iconClasses}`}>
                <Icon size={20} />
              </div>
            </div>

            <h2 className="mt-4 text-2xl font-bold sm:text-3xl">{card.value}</h2>
          </div>
        );
      })}
    </div>
  );
}
