import { Check, X, Clock, Phone, Calendar, FileText } from "lucide-react";

const statusConfig = {
  New: {
    classes: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/40 dark:text-slate-350 dark:border-slate-700/80",
    icon: Clock,
  },
  Contacted: {
    classes: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-300 dark:border-blue-900/40",
    icon: Phone,
  },
  "Meeting Scheduled": {
    classes: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-300 dark:border-amber-900/40",
    icon: Calendar,
  },
  "Proposal Sent": {
    classes: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-900/40",
    icon: FileText,
  },
  Won: {
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40",
    icon: Check,
  },
  Lost: {
    classes: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-300 dark:border-rose-900/40",
    icon: X,
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.New;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${config.classes}`}>
      <Icon size={12} className="stroke-[2.5]" />
      {status}
    </span>
  );
}
