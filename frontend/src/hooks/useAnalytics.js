import { useMemo } from "react";
import {
  getStatusDistribution,
  getMonthlyLeads,
  getConversionByMonth,
  getRevenueByMonth,
  getLeadSourceStats,
  getSalesVelocity,
  getForecastRevenue,
  getFunnelData,
  getTopPerformers,
  getPipelineValue,
  getWonRevenue,
  getAverageSalesCycle,
  getLostRate,
  getConversionRate,
} from "../utils/analyticsHelpers";

/**
 * Memoized analytics view model for the analytics dashboard.
 *
 * @param {Array<Object>} leads - Lead records used for analytics.
 * @param {string} selectedRange - Time range filter label.
 * @returns {{ filteredLeads: Array<Object>, statusData: Array<Object>, monthlyLeads: Array<Object>, conversionTrend: Array<Object>, revenueData: Array<Object>, sourceData: Array<Object>, funnelData: Array<Object>, performers: Array<Object>, stats: Object, salesVelocity: number, forecastRevenue: number }}
 */
export default function useAnalytics(leads = [], selectedRange = "30 Days") {
  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads) || !leads.length) return [];

    const now = new Date();
    const daysToInclude = {
      "7 Days": 7,
      "30 Days": 30,
      "90 Days": 90,
      "This Year": 365,
    }[selectedRange] ?? 30;

    return leads.filter((lead) => {
      if (!lead?.createdAt) return false;
      const createdAt = new Date(lead.createdAt);
      if (Number.isNaN(createdAt.getTime())) return false;
      const diffDays = (now - createdAt) / (1000 * 60 * 60 * 24);
      return diffDays <= daysToInclude;
    });
  }, [leads, selectedRange]);

  const statusData = useMemo(() => getStatusDistribution(filteredLeads), [filteredLeads]);
  const monthlyLeads = useMemo(() => getMonthlyLeads(filteredLeads), [filteredLeads]);
  const conversionTrend = useMemo(() => getConversionByMonth(filteredLeads), [filteredLeads]);
  const revenueData = useMemo(() => getRevenueByMonth(filteredLeads), [filteredLeads]);
  const sourceData = useMemo(() => getLeadSourceStats(filteredLeads), [filteredLeads]);
  const funnelData = useMemo(() => getFunnelData(filteredLeads), [filteredLeads]);
  const performers = useMemo(() => getTopPerformers(filteredLeads), [filteredLeads]);
  const salesVelocity = useMemo(() => getSalesVelocity(filteredLeads), [filteredLeads]);
  const forecastRevenue = useMemo(() => getForecastRevenue(filteredLeads), [filteredLeads]);

  const stats = useMemo(
    () => ({
      totalLeads: filteredLeads.length,
      conversionRate: getConversionRate(filteredLeads),
      pipelineValue: getPipelineValue(filteredLeads),
      wonRevenue: getWonRevenue(filteredLeads),
      averageSalesCycle: getAverageSalesCycle(filteredLeads),
      lostRate: getLostRate(filteredLeads),
    }),
    [filteredLeads]
  );

  return {
    filteredLeads,
    statusData,
    monthlyLeads,
    conversionTrend,
    revenueData,
    sourceData,
    funnelData,
    performers,
    salesVelocity,
    forecastRevenue,
    stats,
  };
}
