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
  Website: { classes: "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-950/20 dark:text-sky-350 dark:border-sky-900/30", icon: Globe },
  Referral: { classes: "bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/20 dark:text-teal-350 dark:border-teal-900/30", icon: Users },
  LinkedIn: { classes: "bg-indigo-50 text-indigo-700 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-350 dark:border-indigo-900/30", icon: LinkedinIcon },
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

export default function LeadCard({ lead, onEdit, onDelete, onView }) {
  const source = sourceConfig[lead.source] || sourceConfig.Other;
  const SourceIcon = source.icon;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 dark:border-slate-800/60 dark:bg-slate-900/40 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{lead.name}</h3>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-450">{lead.company}</p>
        </div>

        <StatusBadge status={lead.status} />
      </div>

      <div className="mt-4 space-y-2.5 border-t border-slate-100/80 pt-3 dark:border-slate-800/40 text-xs text-slate-600 dark:text-slate-350">
        <div className="flex items-center gap-2">
          <Mail size={14} className="opacity-70" />
          <a
            href={`mailto:${lead.email}`}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition hover:underline truncate"
          >
            {lead.email}
          </a>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar size={14} className="opacity-70" />
          <span>Added {formatDate(lead.createdAt)}</span>
        </div>

        <div className="mt-2.5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border text-[10px] font-bold capitalize tracking-wide ${source.classes}`}>
            <SourceIcon size={10} className="opacity-80" />
            {lead.source}
          </span>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 border-t border-slate-100/85 pt-3.5 dark:border-slate-800/40">
        <button
          onClick={() => onView(lead)}
          className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800 transition-all active:scale-95"
        >
          <Eye size={14} />
          Details
        </button>

        <button
          onClick={() => onEdit(lead)}
          className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800 transition-all active:scale-95"
        >
          <Pencil size={14} />
          Edit
        </button>

        <button
          onClick={() => onDelete(lead)}
          className="flex min-h-[40px] items-center justify-center gap-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 px-3 py-2 text-xs font-bold hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-350 dark:border-rose-900/35 transition-all active:scale-95"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>
    </div>
  );
}
