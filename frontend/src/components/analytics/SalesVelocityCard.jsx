export default function SalesVelocityCard({
  value,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold">
        Sales Velocity
      </h3>

      <p className="text-4xl font-bold mt-4 text-green-600">
        ₹{value.toLocaleString()}
      </p>

      <p className="text-gray-500 mt-2">
        Estimated revenue per day
      </p>
    </div>
  );
}
