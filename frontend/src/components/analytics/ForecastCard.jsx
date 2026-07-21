import AnimatedCounter from "../common/AnimatedCounter";

export default function ForecastCard({
  forecast,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-2xl p-6 shadow-sm hover-card hover-shine">
      <h3 className="text-lg font-semibold">
        Revenue Forecast
      </h3>

      <p className="text-4xl font-bold mt-4 text-blue-600 dark:text-blue-400">
        <AnimatedCounter value={`₹${forecast.toLocaleString()}`} />
      </p>

      <p className="text-gray-500 mt-2">
        Predicted next month revenue
      </p>
    </div>
  );
}
