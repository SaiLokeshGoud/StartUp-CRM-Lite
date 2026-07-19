import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { Search, X, Plus, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, Calendar } from "lucide-react";

import LeadForm from "../components/leads/LeadForm";
import LeadTable from "../components/leads/LeadTable";
import LeadCard from "../components/leads/LeadCard";
import EmptyState from "../components/common/EmptyState";
import StatusBadge from "../components/leads/StatusBadge";
import { useLeads } from "../context/LeadContext";

// Custom Dropdown Select for Dark Theme
function CustomSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value) || { label: placeholder, value };

  return (
    <div ref={containerRef} className="relative flex flex-col w-full sm:w-auto min-w-[150px]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-12 w-full items-center justify-between gap-2.5 rounded-xl border border-[#243145] bg-[#0F172A] px-4 py-3 text-sm text-[#F8FAFC] outline-none transition-all duration-200 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 cursor-pointer"
      >
        <span className="truncate font-medium">{selectedOption.label}</span>
        <span className="text-[#94A3B8] text-xs transition-transform duration-200 opacity-60">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-[52px] left-0 z-30 w-full min-w-[200px] rounded-xl border border-[#243145] bg-[#1B2235] p-1.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-[240px] overflow-y-auto space-y-0.5 scrollbar-thin">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors duration-150 cursor-pointer ${
                    isSelected ? "bg-[#3B82F6] text-white" : "text-[#F8FAFC] hover:bg-[#243145]/60"
                  }`}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && <span className="text-white text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

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
        // error handled in LeadContext
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

  // Custom Dropdowns Options Setup
  const statusOptions = [
    { label: "Status", value: "All" },
    { label: "New", value: "New" },
    { label: "Contacted", value: "Contacted" },
    { label: "Meeting Scheduled", value: "Meeting Scheduled" },
    { label: "Proposal Sent", value: "Proposal Sent" },
    { label: "Won", value: "Won" },
    { label: "Lost", value: "Lost" },
  ];

  const companyOptions = [
    { label: "Company", value: "All" },
    ...uniqueCompanies.filter((c) => c !== "All").map((c) => ({ label: c, value: c })),
  ];

  const sourceOptions = [
    { label: "Source", value: "All" },
    { label: "Website", value: "Website" },
    { label: "Referral", value: "Referral" },
    { label: "LinkedIn", value: "LinkedIn" },
    { label: "Cold Call", value: "Cold Call" },
    { label: "Email Campaign", value: "Email Campaign" },
    { label: "Other", value: "Other" },
  ];

  return (
    <div className="space-y-6 text-[#F8FAFC] transition-colors duration-200">
      <Toaster position="top-right" />

      {/* Header and Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl tracking-tight text-[#F8FAFC]">Leads Operations</h1>
          <p className="mt-1 text-sm text-[#94A3B8]">
            Track, filter, and organize your pipeline prospect leads.
          </p>
        </div>

        <button
          onClick={handleAddClick}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-600 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <Plus size={16} className="stroke-[2.5]" />
          Add Lead
        </button>
      </div>

      {/* Filter Bar with Soft Elevation and Spacing */}
      <div className="rounded-2xl border border-[#243145] bg-[#111827] p-6 shadow-xl space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          
          {/* Search bar */}
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]/90 group-focus-within:text-[#3B82F6] transition-colors" />
            <input
              type="text"
              aria-label="Search leads"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads..."
              className="w-full min-h-[48px] h-12 rounded-xl border border-[#243145] bg-[#0F172A] pl-11 pr-10 text-sm text-[#F8FAFC] placeholder-[#94A3B8] outline-none transition-all duration-200 focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 focus:shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-[#94A3B8] hover:bg-[#243145]/60 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Custom Select Dropdowns and Date Pickers */}
          <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:items-center">
            
            <CustomSelect
              value={activeFilter}
              onChange={setActiveFilter}
              options={statusOptions}
              placeholder="Status"
            />

            <CustomSelect
              value={selectedCompany}
              onChange={setSelectedCompany}
              options={companyOptions}
              placeholder="Company"
            />

            <CustomSelect
              value={selectedSource}
              onChange={setSelectedSource}
              options={sourceOptions}
              placeholder="Source"
            />

            {/* Date Range Inputs */}
            <div className="col-span-2 flex items-center gap-2 h-12">
              <div className="relative w-full h-full">
                <input
                  type="date"
                  aria-label="Start date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="Select Date"
                  className="w-full h-full rounded-xl border border-[#243145] bg-[#0F172A] pl-10 pr-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 cursor-pointer"
                />
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
              <span className="text-xs text-[#94A3B8] font-bold">to</span>
              <div className="relative w-full h-full">
                <input
                  type="date"
                  aria-label="End date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Select Date"
                  className="w-full h-full rounded-xl border border-[#243145] bg-[#0F172A] pl-10 pr-4 py-3 text-sm text-[#F8FAFC] outline-none transition focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 cursor-pointer"
                />
                <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

          </div>
        </div>

        {/* Clear Filters Info Summary */}
        {(searchQuery || activeFilter !== "All" || selectedCompany !== "All" || selectedSource !== "All" || startDate || endDate) && (
          <div className="flex items-center justify-between border-t border-[#243145]/40 pt-3 text-xs">
            <span className="text-[#94A3B8]">
              Found <strong className="text-[#F8FAFC]">{totalRecords}</strong> matching leads
            </span>
            <button
              onClick={handleClearFilters}
              className="font-bold text-[#3B82F6] hover:text-blue-400 transition-colors cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile Toggle View Modes */}
      {!isDesktop && (
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`min-h-[40px] px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              viewMode === "cards" ? "bg-[#3B82F6] text-white" : "bg-[#111827] border border-[#243145] text-[#F8FAFC] hover:bg-[#1B2235]/60"
            }`}
          >
            Cards
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`min-h-[40px] px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              viewMode === "table" ? "bg-[#3B82F6] text-white" : "bg-[#111827] border border-[#243145] text-[#F8FAFC] hover:bg-[#1B2235]/60"
            }`}
          >
            Table
          </button>
        </div>
      )}

      {/* Cards View (Mobile/Tablet) */}
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#243145] bg-[#111827] p-4 shadow-lg text-xs text-[#94A3B8]">
          <div className="flex items-center gap-4 justify-between sm:justify-start">
            <span>
              Showing <strong className="text-[#F8FAFC]">{Math.min((currentPage - 1) * pageSize + 1, totalRecords)}–{Math.min(currentPage * pageSize, totalRecords)}</strong> of <strong className="text-[#F8FAFC]">{totalRecords}</strong>
            </span>

            {/* Page Size Select */}
            <div className="flex items-center gap-2">
              <span className="opacity-70">Show:</span>
              <select
                aria-label="Rows per page"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-[#243145] bg-[#0F172A] px-2 py-1 text-xs text-[#F8FAFC] outline-none cursor-pointer focus:border-[#3B82F6] transition"
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
                className="p-2 rounded-lg border border-[#243145] bg-[#0F172A] text-[#F8FAFC] hover:bg-[#1B2235] disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center transition active:scale-95 cursor-pointer"
                title="First Page"
              >
                {"<<"}
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((c) => c - 1)}
                className="p-2 rounded-lg border border-[#243145] bg-[#0F172A] text-[#F8FAFC] hover:bg-[#1B2235] disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center transition active:scale-95 cursor-pointer"
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
                      return <span key={pg} className="px-1 text-slate-500">...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pg}
                      onClick={() => setCurrentPage(pg)}
                      className={`min-h-[36px] min-w-[36px] rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer ${
                        currentPage === pg
                          ? "bg-[#3B82F6] text-white shadow-sm shadow-[#3B82F6]/20"
                          : "border border-[#243145] bg-[#0F172A] text-[#94A3B8] hover:bg-[#1B2235] hover:text-[#F8FAFC]"
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
                className="p-2 rounded-lg border border-[#243145] bg-[#0F172A] text-[#F8FAFC] hover:bg-[#1B2235] disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center transition active:scale-95 cursor-pointer"
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="p-2 rounded-lg border border-[#243145] bg-[#0F172A] text-[#F8FAFC] hover:bg-[#1B2235] disabled:opacity-40 min-h-[36px] min-w-[36px] flex items-center justify-center transition active:scale-95 cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-0 sm:items-center sm:p-4 backdrop-blur-sm">
          <div className="h-full w-full overflow-y-auto bg-[#111827] p-6 shadow-2xl sm:h-auto sm:max-w-lg sm:rounded-3xl border border-[#243145]">
            <h2 className="mb-4 text-xl font-bold tracking-tight text-[#F8FAFC]">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-[#243145] bg-[#111827] p-6 shadow-2xl transition-colors duration-200">
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold tracking-tight text-[#F8FAFC]">Lead Details</h3>
              <button
                onClick={() => setLeadToView(null)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center text-sm font-semibold rounded-full hover:bg-[#243145]/60 transition"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Name</span>
                  <p className="text-sm font-semibold text-[#F8FAFC] mt-0.5">{leadToView.name}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Company</span>
                  <p className="text-sm font-semibold text-[#F8FAFC] mt-0.5">{leadToView.company}</p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Email</span>
                  <p className="text-sm font-semibold text-[#F8FAFC] mt-0.5 truncate">
                    <a href={`mailto:${leadToView.email}`} className="text-[#3B82F6] hover:underline">
                      {leadToView.email}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Phone</span>
                  <p className="text-sm font-semibold text-[#F8FAFC] mt-0.5">{leadToView.phone || "-"}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Status</span>
                  <div className="mt-1">
                    <StatusBadge status={leadToView.status} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Source</span>
                  <p className="text-sm font-semibold text-[#F8FAFC] mt-0.5 capitalize">{leadToView.source}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Deal Value</span>
                  <p className="text-sm font-bold text-[#10B981] mt-0.5">
                    {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(leadToView.value || 0)}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Created At</span>
                  <p className="text-sm font-semibold text-[#F8FAFC] mt-0.5">
                    {new Date(leadToView.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {leadToView.notes && (
                <div className="border-t border-[#243145]/40 pt-3">
                  <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Notes & Description</span>
                  <p className="mt-1.5 text-xs text-[#94A3B8] rounded-xl bg-[#0F172A] p-3 border border-[#243145]/60 leading-relaxed max-h-[140px] overflow-y-auto">
                    {leadToView.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-[#243145]/40 pt-4">
              <button
                onClick={() => {
                  setLeadToView(null);
                  handleEditClick(leadToView);
                }}
                className="rounded-xl bg-[#3B82F6] px-5 py-2 text-xs font-bold text-white hover:bg-blue-600 transition active:scale-95 cursor-pointer min-h-[40px]"
              >
                Edit Lead
              </button>
              <button
                onClick={() => setLeadToView(null)}
                className="rounded-xl border border-[#243145] bg-[#111827] px-5 py-2 text-xs font-bold text-[#F8FAFC] hover:bg-[#1B2235]/60 transition active:scale-95 cursor-pointer min-h-[40px]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#243145] bg-[#111827] p-6 shadow-2xl transition-colors duration-200">
            <h3 className="text-lg font-bold text-[#F8FAFC]">Delete Lead</h3>
            <p className="mt-2 text-sm text-[#94A3B8]">
              Are you sure you want to delete lead <strong className="text-[#F8FAFC]">{leadToDelete.name}</strong>? This action will permanently remove the prospect from the system.
            </p>
            <div className="mt-6 flex justify-end gap-3 border-t border-[#243145]/40 pt-4">
              <button
                onClick={() => setLeadToDelete(null)}
                className="rounded-xl border border-[#243145] bg-[#111827] px-5 py-2 text-xs font-bold text-[#F8FAFC] hover:bg-[#1B2235]/60 transition active:scale-95 cursor-pointer min-h-[40px]"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="rounded-xl bg-[#EF4444] px-5 py-2 text-xs font-bold text-white hover:bg-red-600 transition active:scale-95 cursor-pointer min-h-[40px]"
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
