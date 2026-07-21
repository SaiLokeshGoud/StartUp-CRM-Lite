import { Pencil, Trash2, Eye, Mail, Globe, Users, PhoneCall, MailOpen, HelpCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import StatusBadge from "./StatusBadge";

const LinkedinIcon = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const sourceConfig = {
  Website: { classes: "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/15 dark:text-sky-350 dark:border-sky-500/20", icon: Globe },
  Referral: { classes: "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-500/15 dark:text-teal-350 dark:border-teal-500/20", icon: Users },
  LinkedIn: { classes: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-350 dark:border-indigo-500/20", icon: LinkedinIcon },
  "Cold Call": { classes: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/15 dark:text-orange-350 dark:border-orange-500/20", icon: PhoneCall },
  "Email Campaign": { classes: "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-500/15 dark:text-pink-350 dark:border-pink-500/20", icon: MailOpen },
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
  const isActive = currentSort.field === field;
  const content = (
    <span className="inline-flex items-center">
      {label}
      {isSortable && (
        isActive ? (
          <span className="text-blue-600 dark:text-[#3B82F6]">
            {currentSort.direction === "asc" ? (
              <ArrowUp size={14} className="ml-1.5 inline" />
            ) : (
              <ArrowDown size={14} className="ml-1.5 inline" />
            )}
          </span>
        ) : (
          <ArrowUpDown size={14} className="ml-1.5 opacity-30 group-hover:opacity-75 transition" />
        )
      )}
    </span>
  );

  const baseClasses = "px-6 py-4 text-left text-[13px] font-semibold uppercase tracking-wider bg-slate-50/70 dark:bg-[#111827] border-b border-slate-200/80 dark:border-[#243145]";

  if (!isSortable) {
    return (
      <th className={`${baseClasses} text-slate-500 dark:text-[#94A3B8]`}>
        {label}
      </th>
    );
  }

  return (
    <th
      onClick={() => onSort(field)}
      className={`group ${baseClasses} cursor-pointer select-none transition ${
        isActive
          ? "text-blue-600 dark:text-[#3B82F6]"
          : "text-slate-500 hover:text-slate-800 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]"
      }`}
    >
      {content}
    </th>
  );
}

export default function LeadTable({ leads, onEdit, onDelete, onView, sortBy = { field: "createdAt", direction: "desc" }, onSort }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-[#243145] dark:bg-[#111827] dark:shadow-lg transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-slate-50/70 dark:bg-[#111827] sticky top-0 z-10">
              <SortHeader field="name" label="Name" currentSort={sortBy} onSort={onSort} />
              <SortHeader field="company" label="Company" currentSort={sortBy} onSort={onSort} />
              <SortHeader field="status" label="Status" currentSort={sortBy} onSort={onSort} />
              <SortHeader field="email" label="Email" currentSort={sortBy} />
              <SortHeader field="source" label="Source" currentSort={sortBy} />
              <SortHeader field="createdAt" label="Date Added" currentSort={sortBy} onSort={onSort} />
              <th className="px-6 py-4 text-right text-[13px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] w-[140px] bg-slate-50/70 dark:bg-[#111827] border-b border-slate-200/80 dark:border-[#243145]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-[#243145]/60 bg-white dark:bg-[#111827]">
            {leads.map((lead) => {
              const source = sourceConfig[lead.source] || sourceConfig.Other;
              const SourceIcon = source.icon;

              return (
                <tr
                  key={lead.id || lead._id}
                  className="group hover:bg-slate-50/50 dark:hover:bg-[#1E293B]/40 transition-colors duration-200 bg-white dark:bg-[#111827]"
                  style={{ height: "60px" }}
                >
                  {/* Name */}
                  <td className="px-6 py-3 bg-white dark:bg-[#111827] text-[15px] font-medium text-slate-800 dark:text-[#F8FAFC] border-b border-slate-100 dark:border-b dark:border-[#243145]/60">
                    <span className="group-hover:text-blue-600 dark:group-hover:text-[#3B82F6] transition-colors block max-w-[160px] truncate" title={lead.name}>
                      {lead.name}
                    </span>
                  </td>

                  {/* Company */}
                  <td className="px-6 py-3 bg-white dark:bg-[#111827] text-[15px] text-slate-550 dark:text-[#94A3B8] font-medium border-b border-slate-100 dark:border-b dark:border-[#243145]/60">
                    <span className="block max-w-[140px] truncate" title={lead.company}>
                      {lead.company}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-b dark:border-[#243145]/60">
                    <StatusBadge status={lead.status} />
                  </td>

                  {/* Email */}
                  <td className="px-6 py-3 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-b dark:border-[#243145]/60">
                    <a
                      href={`mailto:${lead.email}`}
                      title={`Send email to ${lead.email}`}
                      className="inline-flex items-center gap-2 text-[15px] text-slate-500 hover:text-blue-600 dark:text-[#94A3B8] dark:hover:text-[#3B82F6] transition-colors max-w-[200px]"
                    >
                      <Mail size={14} className="opacity-70 group-hover:opacity-100 transition-opacity shrink-0" />
                      <span className="truncate">{lead.email}</span>
                    </a>
                  </td>

                  {/* Source */}
                  <td className="px-6 py-3 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-b dark:border-[#243145]/60">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-semibold capitalize tracking-wide ${source.classes}`}>
                      <SourceIcon size={12} className="opacity-80 shrink-0" />
                      {lead.source}
                    </span>
                  </td>

                  {/* Date Added */}
                  <td className="px-6 py-3 bg-white dark:bg-[#111827] text-[15px] text-slate-500 dark:text-[#94A3B8] border-b border-slate-100 dark:border-b dark:border-[#243145]/60">
                    <span className="block truncate">{formatDate(lead.createdAt)}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-b dark:border-[#243145]/60">
                    <div className="inline-flex items-center justify-end gap-2.5">
                      {/* View Button */}
                      <button
                        onClick={() => onView(lead)}
                        title="View details"
                        className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:text-[#94A3B8] dark:hover:text-[#3B82F6] dark:hover:bg-[#3B82F6]/10 transition-all duration-200 cursor-pointer"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(lead)}
                        title="Edit lead"
                        className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:text-[#94A3B8] dark:hover:text-[#F59E0B] dark:hover:bg-[#F59E0B]/10 transition-all duration-200 cursor-pointer"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(lead)}
                        title="Delete lead"
                        className="h-9 w-9 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:text-[#94A3B8] dark:hover:text-[#EF4444] dark:hover:bg-[#EF4444]/10 transition-all duration-200 cursor-pointer"
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
