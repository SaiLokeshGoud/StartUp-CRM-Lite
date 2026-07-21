import { Plus, List, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLeads } from "../../context/LeadContext";

/**
 * Dashboard quick actions
 */
export default function QuickActions() {
  const navigate = useNavigate();
  const { leads } = useLeads();

  const handleAddLead = () => {
    navigate("/leads?modal=add");
  };

  const handleViewAllLeads = () => {
    navigate("/leads");
  };

  const handleExportData = () => {
    const headers = ["Name", "Company", "Email", "Status", "Created At"];
    const rows = leads.map((lead) => [
      lead.name,
      lead.company,
      lead.email,
      lead.status,
      new Date(lead.createdAt).toLocaleDateString(),
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "leads-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Quick Actions</h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Jump straight into the next step for your pipeline.</p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleAddLead}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-semibold text-white cursor-pointer btn-animate"
        >
          <Plus size={18} />
          Add New Lead
        </button>

        <button
          type="button"
          onClick={handleViewAllLeads}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 cursor-pointer btn-animate"
        >
          <List size={18} />
          View All Leads
        </button>

        <button
          type="button"
          onClick={handleExportData}
          className="flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300 cursor-pointer btn-animate"
        >
          <Download size={18} />
          Export Data
        </button>
      </div>
    </div>
  );
}
