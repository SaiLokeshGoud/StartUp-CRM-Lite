import { Pencil, Trash2, Eye, Mail, Globe, Users, PhoneCall, MailOpen, HelpCircle, Calendar } from "lucide-react";
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

export default function LeadCard({ lead, onEdit, onDelete, onView }) {
  const source = sourceConfig[lead.source] || sourceConfig.Other;
  const SourceIcon = source.icon;

  return (
    <div className="rounded-2xl border border-[#243145] bg-[#111827] p-5 shadow-lg transition-all duration-200 hover:bg-[#1E293B]/20">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#F8FAFC]">{lead.name}</h3>
          <p className="text-xs font-semibold text-[#94A3B8]">{lead.company}</p>
        </div>

        <StatusBadge status={lead.status} />
      </div>

      <div className="mt-4 space-y-2.5 border-t border-[#243145]/60 pt-3 text-xs text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <Mail size={14} className="opacity-70" />
          <a
            href={`mailto:${lead.email}`}
            className="hover:text-[#3B82F6] transition-colors hover:underline truncate"
          >
            {lead.email}
          </a>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar size={14} className="opacity-70" />
          <span>Added {formatDate(lead.createdAt)}</span>
        </div>

        <div className="mt-2.5">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[10px] font-bold capitalize tracking-wide ${source.classes}`}>
            <SourceIcon size={10} className="opacity-80" />
            {lead.source}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 border-t border-[#243145]/60 pt-3.5">
        <button
          onClick={() => onView(lead)}
          className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-[#243145] bg-[#111827] px-3 py-2 text-xs font-bold text-[#F8FAFC] hover:bg-[#1B2235]/65 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <Eye size={14} />
          Details
        </button>

        <button
          onClick={() => onEdit(lead)}
          className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-[#243145] bg-[#111827] px-3 py-2 text-xs font-bold text-[#F8FAFC] hover:bg-[#1B2235]/65 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          onClick={() => onDelete(lead)}
          className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-rose-500/10 text-rose-450 border border-rose-500/20 px-3 py-2 text-xs font-bold hover:bg-rose-500/20 transition-all duration-200 active:scale-95 cursor-pointer"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}
