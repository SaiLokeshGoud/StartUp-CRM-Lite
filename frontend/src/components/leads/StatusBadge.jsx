import { Check, X, Clock, Phone, Calendar, FileText } from "lucide-react";

const statusConfig = {
  New: {
    classes: "bg-blue-500/10 text-blue-400 border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/25",
    icon: Clock,
  },
  Contacted: {
    classes: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 dark:bg-cyan-500/15 dark:text-cyan-400 dark:border-cyan-500/25",
    icon: Phone,
  },
  "Meeting Scheduled": {
    classes: "bg-purple-500/10 text-purple-400 border-purple-500/20 dark:bg-purple-500/15 dark:text-purple-400 dark:border-purple-500/25",
    icon: Calendar,
  },
  "Proposal Sent": {
    classes: "bg-orange-50 text-orange-500 border-orange-500/20 dark:bg-orange-500/15 dark:text-orange-400 dark:border-orange-500/25",
    icon: FileText,
  },
  Won: {
    classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/25",
    icon: Check,
  },
  Lost: {
    classes: "bg-rose-500/10 text-rose-450 border-rose-500/20 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/25",
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
