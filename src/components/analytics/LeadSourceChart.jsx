import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function LeadSourceChart({
  data,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-2xl p-6 shadow-sm h-[400px]">
      <h3 className="text-xl font-semibold mb-4">
        Lead Sources
      </h3>

      <ResponsiveContainer
        width="100%"
        height="90%"
      >
        <BarChart
          layout="vertical"
          data={data}
        >
          <XAxis type="number" />

          <YAxis
            type="category"
            dataKey="source"
          />

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
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
