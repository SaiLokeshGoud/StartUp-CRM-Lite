import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

import {
  STATUS_COLORS,
} from "../../constants/analyticsColors";

export default function PieChartCard({ data, total }) {
  return (
    <div className="h-[400px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-4 text-xl font-semibold text-slate-900 dark:text-white">Lead Status Distribution</h3>

      <div className="relative h-[85%]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={70} outerRadius={120} dataKey="value" paddingAngle={2} stroke="none" label={({ name, value }) => `${name}: ${value}`}>
              {data.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={STATUS_COLORS[entry.name] || "#94A3B8"} />
              ))}
            </Pie>
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
            <Legend
              verticalAlign="bottom"
              height={40}
              wrapperStyle={{ paddingTop: "10px", marginLeft: "8px" }}
              formatter={(value, entry) => {
                const count = entry?.payload?.value ?? 0;
                return (
                  <span className="text-sm text-slate-700 dark:text-slate-300">
                    {value} ({count})
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
