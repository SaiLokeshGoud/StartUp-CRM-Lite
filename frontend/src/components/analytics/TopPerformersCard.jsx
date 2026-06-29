export default function TopPerformersCard({
  data,
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border rounded-2xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold mb-4">
        Top Performers
      </h3>

      <div className="space-y-4">
        {data.map(
          (
            performer,
            index
          ) => (
            <div
              key={
                performer.name
              }
              className="flex justify-between"
            >
              <span>
                {index + 1}.{" "}
                {
                  performer.name
                }
              </span>

              <span className="font-semibold">
                ₹
                {performer.revenue.toLocaleString()}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}
