import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Search, X, Plus, ChevronLeft, ChevronRight, Eye, Pencil, Trash2 } from "lucide-react";

import LeadForm from "../components/leads/LeadForm";
import LeadTable from "../components/leads/LeadTable";
import LeadCard from "../components/leads/LeadCard";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/leads/StatusBadge";
import { useLeads } from "../context/LeadContext";

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useLeads();
  const location = useLocation();
  const navigate = useNavigate();

  // Dialog and Action states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [leadToView, setLeadToView] = useState(null);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCompany, setSelectedCompany] = useState("All");
  const [selectedSource, setSelectedSource] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sort state
  const [sortBy, setSortBy] = useState({ field: "createdAt", direction: "desc" });

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // View states
  const [viewMode, setViewMode] = useState("table");
  const [isDesktop, setIsDesktop] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset to first page when any filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, activeFilter, selectedCompany, selectedSource, startDate, endDate]);

  // Handle modals triggers from URL params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("modal") === "add") {
      setSelectedLead(null);
      setIsModalOpen(true);
      navigate("/leads", { replace: true });
    }
  }, [location.search, navigate]);

  // Responsive layout listener
  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setViewMode((current) => (desktop ? "table" : current === "table" ? "cards" : current));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute unique companies list from leads dynamically
  const uniqueCompanies = ["All", ...new Set(leads.map((l) => l.company).filter(Boolean))].sort();

  // Handlers for lead mutations
  const handleCreateLead = (data) => {
    addLead(data);
    setIsModalOpen(false);
  };

  const handleUpdateLead = (data) => {
    updateLead(selectedLead.id || selectedLead._id, data);
    setSelectedLead(null);
    setIsModalOpen(false);
  };

  const handleDeleteClick = (lead) => {
    setLeadToDelete(lead);
  };

  const handleDeleteConfirm = async () => {
    if (leadToDelete) {
      try {
        await deleteLead(leadToDelete.id || leadToDelete._id);
        setLeadToDelete(null);
      } catch (err) {
        // error toast handles in LeadContext
      }
    }
  };

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveFilter("All");
    setSelectedCompany("All");
    setSelectedSource("All");
    setStartDate("");
    setEndDate("");
  };

  const handleSort = (field) => {
    setSortBy((prev) => {
      if (prev.field === field) {
        return { field, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { field, direction: "asc" };
    });
  };

  // 1. Filter Leads
  const filteredLeads = leads
    .filter((lead) => activeFilter === "All" || lead.status === activeFilter)
    .filter((lead) => selectedCompany === "All" || lead.company === selectedCompany)
    .filter((lead) => selectedSource === "All" || lead.source === selectedSource)
    .filter((lead) => {
      if (!startDate && !endDate) return true;
      const leadDate = new Date(lead.createdAt);
      if (startDate && leadDate < new Date(startDate)) return false;
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (leadDate > end) return false;
      }
      return true;
    })
    .filter(
      (lead) =>
        lead.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lead.company.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lead.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

  // 2. Sort Leads
  const sortedLeads = [...filteredLeads].sort((a, b) => {
    let aVal = a[sortBy.field] || "";
    let bVal = b[sortBy.field] || "";

    if (sortBy.field === "createdAt") {
      aVal = new Date(a.createdAt).getTime();
      bVal = new Date(b.createdAt).getTime();
    }

    if (typeof aVal === "string") {
      return sortBy.direction === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return sortBy.direction === "asc" ? aVal - bVal : bVal - aVal;
    }
  });

  // 3. Paginate Leads
  const totalRecords = sortedLeads.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedLeads = sortedLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6 text-slate-800 dark:text-white transition-colors duration-200">
      <Toaster position="top-right" />

      {/* Header and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl tracking-tight">Leads Operations</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-gray-400">
            Track, filter, and organize your pipeline prospect leads.
          </p>
        </div>

        <button
          onClick={handleAddClick}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus size={16} className="stroke-[2.5]" />
          Add Lead
        </button>
      </div>

      {/* Redesigned Search & Filters Toolbar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/70 p-5 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/50 backdrop-blur-md space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              aria-label="Search leads"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, company, or email..."
              className="w-full min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-10 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-950/45 dark:text-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex min-h-[30px] min-w-[30px] -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filtering Dropdowns */}
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center">
            {/* Status Dropdown */}
            <select
              aria-label="Filter by Status"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              className="min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-955 dark:text-gray-200"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Meeting Scheduled">Meeting Scheduled</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>

            {/* Company Dropdown */}
            <select
              aria-label="Filter by Company"
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-955 dark:text-gray-200 max-w-[160px]"
            >
              <option value="All">All Companies</option>
              {uniqueCompanies.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* Source Dropdown */}
            <select
              aria-label="Filter by Source"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="min-h-[44px] rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-955 dark:text-gray-200"
            >
              <option value="All">All Sources</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Email Campaign">Email Campaign</option>
              <option value="Other">Other</option>
            </select>

            {/* Date Range Fields */}
            <div className="col-span-2 flex items-center gap-2 min-h-[44px]">
              <input
                type="date"
                aria-label="Start date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-955 dark:text-gray-200 min-h-[44px]"
              />
              <span className="text-xs text-slate-400 dark:text-slate-600">to</span>
              <input
                type="date"
                aria-label="End date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-800 dark:bg-slate-955 dark:text-gray-200 min-h-[44px]"
              />
            </div>
          </div>
        </div>

        {/* Clear Filters Toolbar summary */}
        {(searchQuery || activeFilter !== "All" || selectedCompany !== "All" || selectedSource !== "All" || startDate || endDate) && (
          <div className="flex items-center justify-between border-t border-slate-100/80 pt-3 dark:border-slate-800/40 text-xs">
            <span className="text-slate-500 dark:text-gray-400">
              Found <strong className="text-slate-700 dark:text-slate-200">{totalRecords}</strong> matching leads
            </span>
            <button
              onClick={handleClearFilters}
              className="font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Switch Cards/Table View on Mobile */}
      {!isDesktop && (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${viewMode === "cards" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-gray-200"}`}
          >
            Cards
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`min-h-[40px] px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${viewMode === "table" ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-gray-200"}`}
          >
            Table
          </button>
        </div>
      )}

      {/* Card List View (Mobile) */}
      <div className="lg:hidden">
        {totalRecords === 0 ? (
          <EmptyState hasLeads={leads.length > 0} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {paginatedLeads.map((lead) => (
              <LeadCard key={lead.id || lead._id} lead={lead} onEdit={handleEditClick} onDelete={handleDeleteClick} onView={setLeadToView} />
            ))}
          </div>
        )}
      </div>

      {/* Table View (Desktop) */}
      <div className="hidden lg:block">
        {totalRecords === 0 ? (
          <EmptyState hasLeads={leads.length > 0} />
        ) : (
          <LeadTable
            leads={paginatedLeads}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onView={setLeadToView}
            sortBy={sortBy}
            onSort={handleSort}
          />
        )}
      </div>

      {/* Pagination Controls */}
      {totalRecords > 0 && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/80 bg-white/70 p-4 shadow-sm dark:border-slate-800/50 dark:bg-slate-900/50 backdrop-blur-md text-xs text-slate-650 dark:text-slate-350">
          <div className="flex items-center gap-4 justify-between sm:justify-start">
            <span>
              Showing <strong className="text-slate-850 dark:text-slate-100">{Math.min((currentPage - 1) * pageSize + 1, totalRecords)}–{Math.min(currentPage * pageSize, totalRecords)}</strong> of <strong className="text-slate-850 dark:text-slate-100">{totalRecords}</strong>
            </span>

            {/* Page Size Select */}
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Show:</span>
              <select
                aria-label="Rows per page"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50/50 px-2 py-1 text-xs outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-gray-200 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Navigation Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center transition active:scale-95 cursor-pointer"
                title="First Page"
              >
                {"<<"}
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => c - 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center transition active:scale-95 cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page Number Pills */}
              <div className="flex items-center gap-1 mx-1">
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pg = idx + 1;
                  if (totalPages > 5 && Math.abs(currentPage - pg) > 1 && pg !== 1 && pg !== totalPages) {
                    if (pg === 2 || pg === totalPages - 1) {
                      return <span key={pg} className="px-1 text-slate-400">...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`min-h-[36px] min-w-[36px] rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                        currentPage === pg
                          ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                          : "border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-gray-300 dark:hover:bg-slate-850"
                      }`}
                    >
                      {pg}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((c) => c + 1)}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center transition active:scale-95 cursor-pointer"
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center transition active:scale-95 cursor-pointer"
                title="Last Page"
              >
                {">>"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Edit/Add Lead Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-0 sm:items-center sm:p-4">
          <div className="h-full w-full overflow-y-auto bg-white p-6 shadow-2xl dark:bg-slate-900 sm:h-auto sm:max-w-lg sm:rounded-3xl border border-slate-200/50 dark:border-slate-800">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              {selectedLead ? "Edit Lead" : "Create New Lead"}
            </h2>

            <LeadForm
              initialData={selectedLead}
              onSubmit={selectedLead ? handleUpdateLead : handleCreateLead}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* View Lead Details Modal */}
      {leadToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Lead Profile</h3>
              <button
                onClick={() => setLeadToView(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center text-sm font-semibold rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Name</span>
                  <p className="text-sm font-semibold text-gray-950 dark:text-white mt-0.5">{leadToView.name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Company</span>
                  <p className="text-sm font-semibold text-gray-950 dark:text-white mt-0.5">{leadToView.company}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Email</span>
                  <p className="text-sm font-semibold text-gray-950 dark:text-white mt-0.5 truncate">
                    <a href={`mailto:${leadToView.email}`} className="text-blue-600 hover:underline dark:text-blue-400">
                      {leadToView.email}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Phone</span>
                  <p className="text-sm font-semibold text-gray-950 dark:text-white mt-0.5">{leadToView.phone || "-"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</span>
                  <div className="mt-1">
                    <StatusBadge status={leadToView.status} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Source</span>
                  <p className="text-sm font-semibold text-gray-950 dark:text-white mt-0.5 capitalize">{leadToView.source}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Deal Value</span>
                  <p className="text-sm font-bold text-emerald-650 dark:text-emerald-400 mt-0.5">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(leadToView.value || 0)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Created At</span>
                  <p className="text-sm font-semibold text-gray-950 dark:text-white mt-0.5">
                    {new Date(leadToView.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {leadToView.notes && (
                <div className="border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Notes & Description</span>
                  <p className="mt-1.5 text-xs text-slate-650 dark:text-slate-350 rounded-xl bg-slate-50/50 dark:bg-slate-950/20 p-3 border border-slate-150 dark:border-slate-800/40 leading-relaxed max-h-[140px] overflow-y-auto">
                    {leadToView.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800/60 pt-4">
              <button
                onClick={() => {
                  setLeadToView(null);
                  handleEditClick(leadToView);
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition active:scale-95 cursor-pointer min-h-[40px]"
              >
                Edit Lead
              </button>
              <button
                onClick={() => setLeadToView(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer min-h-[40px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Lead</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-gray-400">
              Are you sure you want to delete lead <strong className="text-slate-850 dark:text-slate-100">{leadToDelete.name}</strong>? This action will permanently remove the prospect from the system.
            </p>
            <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800/60 pt-4">
              <button
                onClick={() => setLeadToDelete(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-850 dark:bg-slate-900 dark:text-slate-250 dark:hover:bg-slate-800 transition active:scale-95 cursor-pointer min-h-[40px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition active:scale-95 cursor-pointer min-h-[40px]"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
