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
  Website:         { classes: "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/15 dark:text-sky-350 dark:border-sky-500/20",       icon: Globe },
  Referral:        { classes: "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-500/15 dark:text-teal-350 dark:border-teal-500/20",   icon: Users },
  LinkedIn:        { classes: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-500/15 dark:text-indigo-350 dark:border-indigo-500/20", icon: LinkedinIcon },
  "Cold Call":     { classes: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/15 dark:text-orange-350 dark:border-orange-500/20", icon: PhoneCall },
  "Email Campaign":{ classes: "bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-500/15 dark:text-pink-350 dark:border-pink-500/20",   icon: MailOpen },
  Other:           { classes: "bg-slate-50 text-slate-700 border-slate-100 dark:bg-slate-800/40 dark:text-slate-350 dark:border-slate-700/80", icon: HelpCircle },
};

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDealValue(value) {
  if (value === null || value === undefined || value === "") return "—";
  const numericValue = Number(value);
  if (isNaN(numericValue)) return "—";
  return `₹${numericValue.toLocaleString("en-IN")}`;
}

/* ─── Sort Header ─────────────────────────────────────────────────────────
   Uses compact px-3 padding so all 8 columns fit without overflow.
   The old px-6 (24px each side) wasted 384px of horizontal space total.
   ────────────────────────────────────────────────────────────────────── */
function SortHeader({ field, label, currentSort, onSort, align = "left" }) {
  const isSortable = !!onSort;
  const isActive   = currentSort.field === field;

  const content = (
    <span className={`inline-flex items-center gap-0.5 whitespace-nowrap ${align === "right" ? "justify-end w-full" : ""}`}>
      {label}
      {isSortable && (
        isActive ? (
          <span className="text-blue-600 dark:text-[#3B82F6]">
            {currentSort.direction === "asc"
              ? <ArrowUp   size={13} className="ml-1 shrink-0" />
              : <ArrowDown size={13} className="ml-1 shrink-0" />}
          </span>
        ) : (
          <ArrowUpDown size={13} className="ml-1 opacity-30 group-hover:opacity-75 transition shrink-0" />
        )
      )}
    </span>
  );

  const base = [
    "px-3 py-3.5",
    align === "right" ? "text-right" : "text-left",
    "text-[12px] font-semibold uppercase tracking-wider",
    "bg-slate-50/70 dark:bg-[#111827]",
    "border-b border-slate-200/80 dark:border-[#243145]",
    "overflow-hidden",
  ].join(" ");

  if (!isSortable) {
    return <th className={`${base} text-slate-500 dark:text-[#94A3B8]`}>{content}</th>;
  }

  return (
    <th
      onClick={() => onSort(field)}
      className={`group ${base} cursor-pointer select-none transition ${
        isActive
          ? "text-blue-600 dark:text-[#3B82F6]"
          : "text-slate-500 hover:text-slate-800 dark:text-[#94A3B8] dark:hover:text-[#F8FAFC]"
      }`}
    >
      {content}
    </th>
  );
}

/* ─── Shared cell base ──────────────────────────────────────────────────── */
const cell = "px-3 py-3 bg-white dark:bg-[#111827] border-b border-slate-100 dark:border-[#243145]/60 overflow-hidden";

/* ─── LeadTable ─────────────────────────────────────────────────────────── */
export default function LeadTable({
  leads,
  onEdit,
  onDelete,
  onView,
  sortBy = { field: "createdAt", direction: "desc" },
  onSort,
}) {
  return (
    /* Card — full width, never wider than parent */
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover-card hover-shine dark:border-[#243145] dark:bg-[#111827] dark:shadow-lg transition-colors duration-200">
      {/* Scroll wrapper — only scrolls when viewport is genuinely narrow */}
      <div className="w-full overflow-x-auto">
        {/*
         * table-layout:fixed + width:100% means the browser MUST fit the
         * table inside the parent; the colgroup percentages control widths.
         * No min-width is set so there is no forced overflow on laptops.
         */}
        <table className="border-collapse" style={{ tableLayout: "fixed", width: "100%" }}>

          {/* ── Column widths — total MUST equal 100% ── */}
          <colgroup>
            <col style={{ width: "15%" }} />{/* NAME       */}
            <col style={{ width: "11%" }} />{/* COMPANY    */}
            <col style={{ width: "10%" }} />{/* STATUS     */}
            <col style={{ width: "11%" }} />{/* DEAL VALUE */}
            <col style={{ width: "14%" }} />{/* SOURCE     */}
            <col style={{ width: "16%" }} />{/* EMAIL      */}
            <col style={{ width: "13%" }} />{/* DATE ADDED */}
            <col style={{ width: "10%" }} />{/* ACTIONS    */}
          </colgroup>

          {/* ── Header ── */}
          <thead>
            <tr className="bg-slate-50/70 dark:bg-[#111827] sticky top-0 z-10">
              <SortHeader field="name"      label="Name"       currentSort={sortBy} onSort={onSort} />
              <SortHeader field="company"   label="Company"    currentSort={sortBy} onSort={onSort} />
              <SortHeader field="status"    label="Status"     currentSort={sortBy} onSort={onSort} />
              <SortHeader field="value"     label="Deal Value" currentSort={sortBy} onSort={onSort} align="right" />
              <SortHeader field="source"    label="Source"     currentSort={sortBy} />
              <SortHeader field="email"     label="Email"      currentSort={sortBy} />
              <SortHeader field="createdAt" label="Date Added" currentSort={sortBy} onSort={onSort} />
              {/* Actions th — no pixel widths; colgroup handles the width */}
              <th className="px-3 py-3.5 text-left text-[12px] font-semibold uppercase tracking-wider text-slate-500 dark:text-[#94A3B8] bg-slate-50/70 dark:bg-[#111827] border-b border-slate-200/80 dark:border-[#243145] overflow-hidden">
                Actions
              </th>
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody className="divide-y divide-slate-100 dark:divide-[#243145]/60 bg-white dark:bg-[#111827]">
            {leads.map((lead) => {
              const source     = sourceConfig[lead.source] || sourceConfig.Other;
              const SourceIcon = source.icon;

              return (
                <tr
                  key={lead.id || lead._id}
                  className="group hover:bg-slate-50/50 dark:hover:bg-[#1E293B]/40 transition-colors duration-200 bg-white dark:bg-[#111827] table-row-hover"
                  style={{ height: "56px" }}
                >
                  {/* Name */}
                  <td className={`${cell} text-[14px] font-medium text-slate-800 dark:text-[#F8FAFC]`}>
                    <span
                      className="group-hover:text-blue-600 dark:group-hover:text-[#3B82F6] transition-colors block truncate whitespace-nowrap"
                      title={lead.name}
                    >
                      {lead.name}
                    </span>
                  </td>

                  {/* Company */}
                  <td className={`${cell} text-[14px] text-slate-500 dark:text-[#94A3B8] font-medium`}>
                    <span className="block truncate whitespace-nowrap" title={lead.company}>
                      {lead.company}
                    </span>
                  </td>

                  {/* Status */}
                  <td className={cell}>
                    <StatusBadge status={lead.status} />
                  </td>

                  {/* Deal Value — right-aligned, no truncation */}
                  <td className={`${cell} text-[14px] font-semibold text-slate-700 dark:text-[#E2E8F0] text-right whitespace-nowrap`}>
                    {formatDealValue(lead.value)}
                  </td>

                  {/* Source */}
                  <td className={cell}>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[11px] font-semibold capitalize tracking-wide whitespace-nowrap ${source.classes}`}>
                      <SourceIcon size={11} className="opacity-80 shrink-0" />
                      {lead.source}
                    </span>
                  </td>

                  {/* Email — first candidate for truncation */}
                  <td className={`${cell} min-w-0`}>
                    <a
                      href={`mailto:${lead.email}`}
                      title={lead.email}
                      className="inline-flex items-center gap-1.5 text-[14px] text-slate-500 hover:text-blue-600 dark:text-[#94A3B8] dark:hover:text-[#3B82F6] transition-colors w-full min-w-0"
                    >
                      <Mail size={13} className="opacity-70 shrink-0" />
                      <span className="truncate whitespace-nowrap block min-w-0">{lead.email}</span>
                    </a>
                  </td>

                  {/* Date Added — always one line */}
                  <td className={`${cell} text-[14px] text-slate-500 dark:text-[#94A3B8] whitespace-nowrap`}>
                    {formatDate(lead.createdAt)}
                  </td>

                  {/* Actions — all 3 buttons always visible */}
                  <td className={cell}>
                    <div className="flex items-center gap-1 whitespace-nowrap">

                      {/* View — Blue */}
                      <button
                        onClick={() => onView(lead)}
                        aria-label="View Lead"
                        title="View Lead"
                        className="h-[26px] w-[26px] rounded-md flex items-center justify-center shrink-0 cursor-pointer bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400 hover:bg-blue-600 hover:text-white hover:scale-105 hover:shadow-sm hover:shadow-blue-500/25 dark:hover:bg-blue-500 dark:hover:text-white active:scale-95 transition-all duration-150 ease-out"
                      >
                        <Eye size={12} strokeWidth={2} />
                      </button>

                      {/* Edit — Amber */}
                      <button
                        onClick={() => onEdit(lead)}
                        aria-label="Edit Lead"
                        title="Edit Lead"
                        className="h-[26px] w-[26px] rounded-md flex items-center justify-center shrink-0 cursor-pointer bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 hover:bg-amber-500 hover:text-white hover:scale-105 hover:shadow-sm hover:shadow-amber-500/25 dark:hover:bg-amber-500 dark:hover:text-white active:scale-95 transition-all duration-150 ease-out"
                      >
                        <Pencil size={12} strokeWidth={2} />
                      </button>

                      {/* Delete — Red */}
                      <button
                        onClick={() => onDelete(lead)}
                        aria-label="Delete Lead"
                        title="Delete Lead"
                        className="h-[26px] w-[26px] rounded-md flex items-center justify-center shrink-0 cursor-pointer bg-red-50 text-red-500 dark:bg-red-500/15 dark:text-red-400 hover:bg-red-600 hover:text-white hover:scale-105 hover:shadow-sm hover:shadow-red-500/25 dark:hover:bg-red-500 dark:hover:text-white active:scale-95 transition-all duration-150 ease-out"
                      >
                        <Trash2 size={12} strokeWidth={2} />
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
