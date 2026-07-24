import StatusBadge from "./StatusBadge";

export default function LeadTable({ leads, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800">
      <table className="min-w-[720px] w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-slate-900">
            <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Company</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Email</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Source</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date Added</th>
            <th className="p-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-gray-200 text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
              <td className="p-4">{lead.name}</td>
              <td className="p-4">{lead.company}</td>
              <td className="p-4"><StatusBadge status={lead.status} /></td>
              <td className="p-4 text-gray-600 dark:text-gray-300">{lead.email}</td>
              <td className="p-4">{lead.source}</td>
              <td className="p-4 text-gray-600 dark:text-gray-300">{lead.createdAt}</td>
              <td className="p-4">
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => onEdit(lead)} className="min-h-[44px] font-medium text-blue-600 hover:text-blue-500">
                    Edit
                  </button>
                  <button onClick={() => onDelete(lead.id)} className="min-h-[44px] font-medium text-red-600 hover:text-red-500">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
