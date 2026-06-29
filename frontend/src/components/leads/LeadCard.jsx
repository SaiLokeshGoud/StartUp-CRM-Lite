import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function LeadCard({ lead, onEdit, onDelete }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-300">{lead.company}</p>
        </div>

        <StatusBadge status={lead.status} />
      </div>

      <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <p>{lead.email}</p>
        <p>{lead.phone}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => onEdit(lead)} className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-700">
          <Pencil size={16} />
          Edit
        </button>

        <button onClick={() => onDelete(lead.id)} className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600">
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
}
