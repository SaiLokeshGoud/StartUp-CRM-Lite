import { Check, X, Clock, Phone, Calendar, FileText } from "lucide-react";

const statusConfig = {
  New: {
    classes: "bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/25",
    icon: Clock,
  },
  Contacted: {
    classes: "bg-cyan-50 text-cyan-700 border-cyan-100 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/25",
    icon: Phone,
  },
  "Meeting Scheduled": {
    classes: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/25",
    icon: Calendar,
  },
  "Proposal Sent": {
    classes: "bg-orange-50 text-orange-700 border-orange-100 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/25",
    icon: FileText,
  },
  Won: {
    classes: "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25",
    icon: Check,
  },
  Lost: {
    classes: "bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/25",
    icon: X,
  },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.New;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${config.classes}`}>
      <Icon size={12} className="stroke-[2.5]" />
      {status}
    </span>
  );
}
