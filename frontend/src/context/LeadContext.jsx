import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import * as leadService from '../services/leadService';

const LeadContext = createContext(null);

export function LeadProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 20, pages: 0 });

  useEffect(() => {
    fetchLeads();
  }, []);

  /**
   * Fetch leads from the API using optional query parameters.
   */
  const fetchLeads = async (params = {}) => {
    setIsLoading(true);

    try {
      const { data, pagination: pageData } = await leadService.getLeads(params);
      setLeads(data);
      setPagination(pageData || { total: 0, page: 1, limit: 20, pages: 0 });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch leads';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Create a lead through the backend API and update local state.
   */
  const addLead = async (leadData) => {
    setIsLoading(true);

    try {
      const { data } = await leadService.createLead(leadData);
      setLeads((prev) => [data, ...prev]);
      toast.success('Lead created successfully');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create lead';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update an existing lead through the backend API and sync state.
   */
  const updateLead = async (id, leadData) => {
    setIsLoading(true);

    try {
      const { data } = await leadService.updateLead(id, leadData);
      setLeads((prev) => prev.map((lead) => (lead._id === id || lead.id === id ? data : lead)));
      toast.success('Lead updated successfully');
      return data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update lead';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete a lead through the backend API and remove it from local state.
   */
  const deleteLead = async (id) => {
    setIsLoading(true);

    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((lead) => lead._id !== id && lead.id !== id));
      toast.success('Lead deleted successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete lead';
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LeadContext.Provider value={{ leads, isLoading, pagination, fetchLeads, addLead, updateLead, deleteLead }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);

  if (!context) {
    throw new Error('useLeads must be used within LeadProvider');
  }

  return context;
}
