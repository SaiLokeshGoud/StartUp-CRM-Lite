/**
 * Shows latest leads
 * @param {Object} props
 * @param {Array} props.leads
 */
export default function RecentLeads({ leads }) {
  const recent = [...leads].slice(-5).reverse();

  const getStatusClasses = (status) => {
    switch (status) {
      case "Won":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
      case "Lost":
        return "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-300";
      case "Contacted":
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
      default:
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Leads</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">A quick view of your latest opportunities and their current stage.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-slate-500 dark:border-slate-700 dark:text-slate-400">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Company</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Date</th>
            </tr>
          </thead>

          <tbody>
            {recent.map((lead) => (
              <tr key={lead.id} className="border-b border-slate-100 dark:border-slate-700/70">
                <td className="py-3 font-medium text-slate-700 dark:text-slate-200">{lead.name}</td>
                <td className="py-3 text-slate-600 dark:text-slate-300">{lead.company}</td>
                <td className="py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="py-3 text-slate-500 dark:text-slate-400">{new Date(lead.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
