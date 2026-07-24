const filters = ["All", "New", "Contacted", "Meeting Scheduled", "Proposal Sent", "Won", "Lost"];

export default function FilterBar({ activeFilter, onFilterChange, leads }) {
  const getCount = (filter) => {
    if (filter === "All") return leads.length;

    return leads.filter((lead) => lead.status === filter).length;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`min-h-[44px] rounded-xl px-3 py-2 text-sm font-medium transition-all ${
            activeFilter === filter
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          }`}
        >
          {filter} ({getCount(filter)})
        </button>
      ))}
    </div>
  );
}
