import { Search, X } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

      <input
        aria-label="Search leads"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, company, or email..."
        className="w-full min-h-[44px] rounded-xl border border-gray-300 bg-white py-3 pl-10 pr-10 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
      />

      {value && (
        <button onClick={() => onChange("")} className="absolute right-3 top-1/2 flex min-h-[44px] min-w-[44px] -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Clear search">
          <X size={18} />
        </button>
      )}
    </div>
  );
}
