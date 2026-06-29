const statusStyles = {
  New: "bg-slate-100 text-slate-700 dark:bg-slate-700/80 dark:text-slate-100",
  Contacted: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200",
  "Meeting Scheduled": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200",
  "Proposal Sent": "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-200",
  Won: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  Lost: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[status] || "bg-slate-100 text-slate-700 dark:bg-slate-700/80 dark:text-slate-100"}`}>
      {status}
    </span>
  );
}
