import { Pencil, Trash2, Eye, Mail, Globe, Users, Linkedin, PhoneCall, MailOpen, HelpCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import StatusBadge from "./StatusBadge";

const sourceConfig = {
  Website: { classes: "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-350 dark:border-sky-900/30", icon: Globe },
  Referral: { classes: "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/20 dark:text-teal-350 dark:border-teal-900/30", icon: Users },
  LinkedIn: { classes: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-350 dark:border-indigo-900/30", icon: Linkedin },
  "Cold Call": { classes: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-950/20 dark:text-orange-350 dark:border-orange-900/30", icon: PhoneCall },
  "Email Campaign": { classes: "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/20 dark:text-pink-350 dark:border-pink-900/30", icon: MailOpen },
  Other: { classes: "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800/40 dark:text-slate-350 dark:border-slate-700/80", icon: HelpCircle },
};

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function SortHeader({ field, label, currentSort, onSort }) {
  const isSortable = !!onSort;
  const content = (
    <span className="inline-flex items-center">
      {label}
      {isSortable && (
        currentSort.field === field ? (
          currentSort.direction === "asc" ? (
            <ArrowUp size={14} className="ml-1.5 text-blue-600 dark:text-blue-400" />
          ) : (
            <ArrowDown size={14} className="ml-1.5 text-blue-600 dark:text-blue-400" />
          )
        ) : (
          <ArrowUpDown size={14} className="ml-1.5 opacity-30 group-hover:opacity-70 transition" />
        )
      )}
    </span>
  );

  if (!isSortable) {
    return (
      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        {label}
      </th>
    );
  }

  return (
    <th
      onClick={() => onSort(field)}
      className="group px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200 transition"
    >
      {content}
    </th>
  );
}

export default function LeadTable({ leads, onEdit, onDelete, onView, sortBy = { field: "createdAt", direction: "desc" }, onSort }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/70 dark:border-slate-800/50 dark:bg-slate-900/50 shadow-sm backdrop-blur-md transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse">
          <thead>
            <tr className="border-b border-slate-200/85 bg-slate-50/70 dark:border-slate-800/60 dark:bg-slate-900/80 sticky top-0 z-10 backdrop-blur-md">
              <SortHeader field="name" label="Name" currentSort={sortBy} onSort={onSort} />
              <SortHeader field="company" label="Company" currentSort={sortBy} onSort={onSort} />
              <SortHeader field="status" label="Status" currentSort={sortBy} onSort={onSort} />
              <SortHeader field="email" label="Email" currentSort={sortBy} />
              <SortHeader field="source" label="Source" currentSort={sortBy} />
              <SortHeader field="createdAt" label="Date Added" currentSort={sortBy} onSort={onSort} />
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 w-[140px]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {leads.map((lead) => {
              const source = sourceConfig[lead.source] || sourceConfig.Other;
              const SourceIcon = source.icon;

              return (
                <tr
                  key={lead.id || lead._id}
                  className="group odd:bg-white even:bg-slate-50/20 hover:bg-blue-50/10 dark:odd:bg-slate-950/20 dark:even:bg-slate-900/10 dark:hover:bg-blue-950/5 transition-all duration-200"
                  style={{ height: "72px" }}
                >
                  {/* Name */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {lead.name}
                    </span>
                  </td>

                  {/* Company */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                      {lead.company}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={lead.status} />
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a
                      href={`mailto:${lead.email}`}
                      title={`Send email to ${lead.email}`}
                      className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-blue-600 dark:text-gray-450 dark:hover:text-blue-400 transition"
                    >
                      <Mail size={14} className="opacity-70 group-hover:opacity-100 transition" />
                      <span className="max-w-[180px] truncate">{lead.email}</span>
                    </a>
                  </td>

                  {/* Source */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-xs font-semibold capitalize tracking-wide ${source.classes}`}>
                      <SourceIcon size={12} className="opacity-80" />
                      {lead.source}
                    </span>
                  </td>

                  {/* Date Added */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-gray-450 font-medium">
                    {formatDate(lead.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onView(lead)}
                        title="View details"
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-slate-800 transition min-h-[38px] min-w-[38px] flex items-center justify-center"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(lead)}
                        title="Edit lead"
                        className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 dark:text-gray-500 dark:hover:text-blue-400 dark:hover:bg-blue-950/20 transition min-h-[38px] min-w-[38px] flex items-center justify-center"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(lead)}
                        title="Delete lead"
                        className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50/50 dark:text-gray-500 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition min-h-[38px] min-w-[38px] flex items-center justify-center"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
