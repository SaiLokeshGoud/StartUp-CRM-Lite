import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function BarChartCard({
  data,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-2xl p-6 shadow-sm h-[400px] text-gray-900 dark:text-white">
      <h3 className="text-xl font-semibold mb-4">
        Monthly Leads
      </h3>

      <ResponsiveContainer
        width="100%"
        height="90%"
      >
        <BarChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} leads`, "Leads"]}
            cursor={{ fill: "rgba(37, 99, 235, 0.08)" }}
            contentStyle={{
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.16)",
              backgroundColor: "rgba(255,255,255,0.98)",
              padding: "10px 12px",
            }}
            labelStyle={{ color: "#0f172a", fontWeight: 600 }}
          />

          <Bar
            dataKey="count"
            fill="#2563EB"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
