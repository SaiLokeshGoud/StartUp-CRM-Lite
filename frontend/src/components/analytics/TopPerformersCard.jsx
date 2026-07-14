import { useAuth } from "../../context/AuthContext";

export default function TopPerformersCard({
  data,
}) {
  const { user } = useAuth();

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
          ) => {
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(performer.name);
            const displayName = (performer.name === user?._id || performer.name === user?.id)
              ? (user?.name || "Me")
              : (isObjectId ? "Sales Agent" : performer.name);

            return (
              <div
                key={
                  performer.name
                }
                className="flex justify-between"
              >
                <span>
                  {index + 1}.{" "}
                  {
                    displayName
                  }
                </span>

                <span className="font-semibold">
                  ₹
                  {performer.revenue.toLocaleString()}
                </span>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}
