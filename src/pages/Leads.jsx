import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";

import LeadForm from "../components/leads/LeadForm";
import LeadTable from "../components/leads/LeadTable";
import LeadCard from "../components/leads/LeadCard";
import SearchBar from "../components/common/SearchBar";
import FilterBar from "../components/common/FilterBar";
import EmptyState from "../components/common/EmptyState";
import { useLeads } from "../context/LeadContext";

export default function Leads() {
  const { leads, addLead, updateLead, deleteLead } = useLeads();
  const location = useLocation();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState("cards");
  const [isDesktop, setIsDesktop] = useState(false);

  const handleCreateLead = (data) => {
    addLead(data);
    toast.success("Lead created successfully");
    setIsModalOpen(false);
  };

  const handleUpdateLead = (data) => {
    updateLead(selectedLead.id, data);
    toast.success("Lead updated successfully");
    setSelectedLead(null);
    setIsModalOpen(false);
  };

  const handleDeleteLead = (id) => {
    deleteLead(id);
    toast.error("Lead deleted");
  };

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    if (params.get("modal") === "add") {
      setSelectedLead(null);
      setIsModalOpen(true);
      navigate("/leads", { replace: true });
    }
  }, [location.search, navigate]);

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

  const filteredLeads = leads
    .filter((lead) => activeFilter === "All" || lead.status === activeFilter)
    .filter(
      (lead) =>
        lead.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lead.company.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        lead.email.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

  return (
    <div className="space-y-6 dark:text-white">
      <Toaster position="top-right" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Lead Management</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 sm:text-base">
            Manage all your leads from one place.
          </p>
        </div>

        <button
          onClick={handleAddClick}
          className="inline-flex min-h-[44px] items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
        >
          Add Lead
        </button>
      </div>

      <div className="space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} leads={leads} />
      </div>

      {!isDesktop && (
        <div className="flex items-center justify-end gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setViewMode("cards")}
            className={`min-h-[44px] rounded-xl px-3 py-2 text-sm font-medium ${viewMode === "cards" ? "bg-blue-600 text-white" : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"}`}
          >
            Cards
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`min-h-[44px] rounded-xl px-3 py-2 text-sm font-medium ${viewMode === "table" ? "bg-blue-600 text-white" : "bg-white text-gray-700 dark:bg-gray-800 dark:text-gray-200"}`}
          >
            Table
          </button>
        </div>
      )}

      <div className="md:hidden">
        {filteredLeads.length === 0 ? (
          <EmptyState hasLeads={leads.length > 0} />
        ) : (
          <div className="grid gap-4">
            {filteredLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onEdit={handleEditClick} onDelete={handleDeleteLead} />
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:block">
        {filteredLeads.length === 0 ? (
          <EmptyState hasLeads={leads.length > 0} />
        ) : viewMode === "cards" ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredLeads.map((lead) => (
              <LeadCard key={lead.id} lead={lead} onEdit={handleEditClick} onDelete={handleDeleteLead} />
            ))}
          </div>
        ) : (
          <LeadTable leads={filteredLeads} onEdit={handleEditClick} onDelete={handleDeleteLead} />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start bg-black/45 p-0 sm:items-center sm:p-4">
          <div className="h-full w-full overflow-y-auto bg-white p-4 shadow-2xl dark:bg-gray-800 sm:h-auto sm:max-w-lg sm:rounded-2xl sm:p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
              {selectedLead ? "Edit Lead" : "Add Lead"}
            </h2>

            <LeadForm
              initialData={selectedLead}
              onSubmit={selectedLead ? handleUpdateLead : handleCreateLead}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
