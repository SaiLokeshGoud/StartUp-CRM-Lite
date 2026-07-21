import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function RevenueChartCard({
  data,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-2xl p-6 shadow-sm hover-card hover-shine h-[400px]">
      <h3 className="text-xl font-semibold mb-4">
        Revenue Trend
      </h3>

      <ResponsiveContainer
        width="100%"
        height="90%"
      >
        <AreaChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />

          <Tooltip
            formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
            cursor={{ stroke: "#16a34a", strokeWidth: 1.5 }}
            contentStyle={{
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.16)",
              backgroundColor: "rgba(255,255,255,0.98)",
              padding: "10px 12px",
            }}
            labelStyle={{ color: "#0f172a", fontWeight: 600 }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#22C55E"
            fill="#22C55E"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
