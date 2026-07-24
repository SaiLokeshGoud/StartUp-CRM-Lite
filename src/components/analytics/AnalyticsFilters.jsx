const ranges = [
  "7 Days",
  "30 Days",
  "90 Days",
  "This Year",
];

export default function AnalyticsFilters({
  selected,
  onChange,
}) {
 return (
  <div className="flex flex-wrap gap-2">
    {ranges.map((range) => (
      <button
        key={range}
        onClick={() =>
          onChange(range)
        }
        className={`px-4 py-2 rounded-lg transition-all duration-200 ${
          selected === range
            ? "bg-blue-600 text-white shadow-md"
            : `
              bg-gray-100
              dark:bg-gray-800
              text-gray-700
              dark:text-gray-300
              hover:bg-gray-200
              dark:hover:bg-gray-700
            `
        }`}
      >
        {range}
      </button>
    ))}
  </div>
);
}
