import {
  FunnelChart,
  Funnel,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from "recharts";

const FUNNEL_COLORS = ["#2563EB", "#3B82F6", "#F59E0B", "#7C3AED", "#22C55E"];

export default function FunnelChartCard({ data }) {
  return (
    <div className="h-[450px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Sales Funnel</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Stage-by-stage conversion with clear momentum</p>
        </div>
      </div>

      <div className="flex h-[82%] items-center gap-4">
        <div className="h-full w-[78%]">
          <ResponsiveContainer width="100%" height="100%">
            <FunnelChart>
              <Tooltip
                formatter={(value, name) => [`${value} leads`, name]}
                contentStyle={{
                  borderRadius: "14px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.16)",
                  backgroundColor: "rgba(255,255,255,0.98)",
                  padding: "10px 12px",
                }}
              />
              <Funnel dataKey="value" data={data} isAnimationActive>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={FUNNEL_COLORS[index] || "#2563EB"} />
                ))}
              </Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>

        <div className="flex w-[22%] flex-col justify-center gap-3">
          {data.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: FUNNEL_COLORS[index] || "#2563EB" }} />
              <span className="truncate">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
