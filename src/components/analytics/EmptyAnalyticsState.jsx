import { BarChart3 } from "lucide-react";

export default function EmptyAnalyticsState() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border p-12 text-center">
      <BarChart3
        size={48}
        className="mx-auto text-gray-400 mb-4"
      />

      <h3 className="text-xl font-semibold">
        No analytics available yet
      </h3>

      <p className="text-gray-500 mt-2">
        Add your first lead to start
        tracking business performance.
      </p>
    </div>
  );
}
