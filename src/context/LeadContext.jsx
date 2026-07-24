/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
} from "react";

import useLocalStorage from "../hooks/useLocalStorage";

import sampleLeads from "../data/sampleLeads";

/**
 * Lead Object Shape
 * {
 *   id: string,
 *   name: string,
 *   company: string,
 *   email: string,
 *   phone: string,
 *   status: string,
 *   source: string,
 *   createdAt: string
 * }
 */

const LeadContext =
  createContext();

function LeadProvider({
  children,
}) {
  const [leads, setLeads] =
  useLocalStorage(
    "startup-crm-leads",
    sampleLeads
  );


  /**
   * Add Lead
   */
  const addLead = (leadData) => {
    const newLead = {
      ...leadData,
      id:
        crypto.randomUUID?.() ||
        Date.now().toString(),
      createdAt:
        new Date().toISOString(),
    };

    setLeads((prev) => [
      ...prev,
      newLead,
    ]);
  };

  /**
   * Update Lead
   */
  const updateLead = (
    id,
    updatedLead
  ) => {
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id
          ? {
              ...lead,
              ...updatedLead,
            }
          : lead
      )
    );
  };

  /**
   * Delete Lead
   */
  const deleteLead = (id) => {
    setLeads((prev) =>
      prev.filter(
        (lead) => lead.id !== id
      )
    );
  };

  /**
   * Get Lead By ID
   */
  const getLeadById = (id) => {
    return leads.find(
      (lead) => lead.id === id
    );
  };

  return (
    <LeadContext.Provider
      value={{
        leads,
        addLead,
        updateLead,
        deleteLead,
        getLeadById,
      }}
    >
      {children}
    </LeadContext.Provider>
  );
}

function useLeads() {
  const context =
    useContext(LeadContext);

  if (!context) {
    throw new Error(
      "useLeads must be used inside LeadProvider"
    );
  }

  return context;
}

export { LeadContext, LeadProvider, useLeads };
