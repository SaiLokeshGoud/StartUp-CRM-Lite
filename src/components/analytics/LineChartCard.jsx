import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function LineChartCard({
  data,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-2xl p-6 shadow-sm h-[400px]">
      <h3 className="text-xl font-semibold mb-4">
        Conversion Trend
      </h3>

      <ResponsiveContainer
        width="100%"
        height="90%"
      >
        <LineChart data={data}>
          <XAxis dataKey="month" />

          <YAxis
            domain={[0, 100]}
          />

          <Tooltip
            formatter={(value) => [`${value}%`, "Conversion Rate"]}
            cursor={{ stroke: "#22C55E", strokeWidth: 1.5 }}
            contentStyle={{
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.16)",
              backgroundColor: "rgba(255,255,255,0.98)",
              padding: "10px 12px",
            }}
            labelStyle={{ color: "#0f172a", fontWeight: 600 }}
          />

          <Line
            type="monotone"
            dataKey="rate"
            stroke="#22C55E"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
