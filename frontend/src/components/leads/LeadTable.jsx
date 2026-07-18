import { Pencil, Trash2, Eye, Mail, Globe, Users, PhoneCall, MailOpen, HelpCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import StatusBadge from "./StatusBadge";

const LinkedinIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const sourceConfig = {
  Website: { classes: "bg-sky-500/10 text-sky-400 border-sky-500/20 dark:bg-sky-500/15 dark:text-sky-350 dark:border-sky-500/20", icon: Globe },
  Referral: { classes: "bg-teal-500/10 text-teal-400 border-teal-500/20 dark:bg-teal-500/15 dark:text-teal-350 dark:border-teal-500/20", icon: Users },
  LinkedIn: { classes: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 dark:bg-indigo-500/15 dark:text-indigo-350 dark:border-indigo-500/20", icon: LinkedinIcon },
  "Cold Call": { classes: "bg-orange-500/10 text-orange-400 border-orange-500/20 dark:bg-orange-500/15 dark:text-orange-350 dark:border-orange-500/20", icon: PhoneCall },
  "Email Campaign": { classes: "bg-pink-500/10 text-pink-400 border-pink-500/20 dark:bg-pink-500/15 dark:text-pink-350 dark:border-pink-500/20", icon: MailOpen },
  Other: { classes: "bg-slate-500/10 text-slate-400 border-slate-500/20 dark:bg-slate-800/40 dark:text-slate-350 dark:border-slate-700/80", icon: HelpCircle },
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
          currentSort.direction === "asc" ? (
            <ArrowUp size={14} className="ml-1.5 text-[#3B82F6]" />
          ) : (
            <ArrowDown size={14} className="ml-1.5 text-[#3B82F6]" />
          )
        ) : (
          <ArrowUpDown size={14} className="ml-1.5 opacity-30 group-hover:opacity-75 transition" />
        )
      )}
    </span>
  );

  if (!isSortable) {
    return (
      <th className="px-6 py-4 text-left text-[13px] font-semibold uppercase tracking-wider text-[#94A3B8]">
        {label}
      </th>
    );
  }

  return (
    <th
      onClick={() => onSort(field)}
      className={`group px-6 py-4 text-left text-[13px] font-semibold uppercase tracking-wider cursor-pointer select-none transition ${isActive ? "text-[#3B82F6]" : "text-[#94A3B8] hover:text-[#F8FAFC]"}`}
    >
      {content}
    </th>
  );
}

export default function LeadTable({ leads, onEdit, onDelete, onView, sortBy = { field: "createdAt", direction: "desc" }, onSort }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#243145] bg-[#111827] shadow-lg transition-colors duration-200">
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full border-collapse">
          <thead>
            <tr className="border-b border-[#243145] bg-[#111827] sticky top-0 z-10">
              <SortHeader field="name" label="Name" currentSort={sortBy} onSort={onSort} />
              <SortHeader field="company" label="Company" currentSort={sortBy} onSort={onSort} />
              <SortHeader field="status" label="Status" currentSort={sortBy} onSort={onSort} />
              <SortHeader field="email" label="Email" currentSort={sortBy} />
              <SortHeader field="source" label="Source" currentSort={sortBy} />
              <SortHeader field="createdAt" label="Date Added" currentSort={sortBy} onSort={onSort} />
              <th className="px-6 py-4 text-right text-[13px] font-semibold uppercase tracking-wider text-[#94A3B8] w-[140px]">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#243145]/60 bg-[#111827]">
            {leads.map((lead) => {
              const source = sourceConfig[lead.source] || sourceConfig.Other;
              const SourceIcon = source.icon;

              return (
                <tr
                  key={lead.id || lead._id}
                  className="group hover:bg-[#1E293B]/40 transition-colors duration-200"
                  style={{ height: "60px" }}
                >
                  {/* Name */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-[15px] font-medium text-[#F8FAFC] group-hover:text-[#3B82F6] transition-colors">
                      {lead.name}
                    </span>
                  </td>

                  {/* Company */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="text-[15px] text-[#94A3B8] font-medium">
                      {lead.company}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <StatusBadge status={lead.status} />
                  </td>

                  {/* Email */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <a
                      href={`mailto:${lead.email}`}
                      title={`Send email to ${lead.email}`}
                      className="inline-flex items-center gap-2 text-[15px] text-[#94A3B8] hover:text-[#3B82F6] transition-colors"
                    >
                      <Mail size={14} className="opacity-70 group-hover:opacity-100 transition-opacity" />
                      <span className="max-w-[180px] truncate">{lead.email}</span>
                    </a>
                  </td>

                  {/* Source */}
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-semibold capitalize tracking-wide ${source.classes}`}>
                      <SourceIcon size={12} className="opacity-80" />
                      {lead.source}
                    </span>
                  </td>

                  {/* Date Added */}
                  <td className="px-6 py-3 whitespace-nowrap text-[15px] text-[#94A3B8]">
                    {formatDate(lead.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-3 whitespace-nowrap text-right">
                    <div className="inline-flex items-center justify-end gap-2.5">
                      {/* View Button */}
                      <button
                        onClick={() => onView(lead)}
                        title="View details"
                        className="h-9 w-9 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10 transition-all duration-200"
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => onEdit(lead)}
                        title="Edit lead"
                        className="h-9 w-9 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-[#F59E0B] hover:bg-[#F59E0B]/10 transition-all duration-200"
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => onDelete(lead)}
                        title="Delete lead"
                        className="h-9 w-9 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#EF4444]/10 transition-all duration-200"
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
