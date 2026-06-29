export default function EmptyState({
  hasLeads,
}) {
  return (
    <div className="bg-white dark:bg-gray-800  border rounded-xl p-10 text-center">
      <h3 className="text-xl font-semibold mb-2">
        No leads found
      </h3>

      <p className="text-gray-500 dark:text-gray-100">
        {hasLeads
          ? "Try changing your search or filter."
          : "Create your first lead to get started."}
      </p>
    </div>
  );
}
