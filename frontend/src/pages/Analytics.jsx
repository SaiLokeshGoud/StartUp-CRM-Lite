import { useMemo, useState } from "react";

import { useLeads } from "../context/LeadContext";
import useAnalytics from "../hooks/useAnalytics";

import StatsCards from "../components/analytics/StatsCards";
import PieChartCard from "../components/analytics/PieChartCard";
import BarChartCard from "../components/analytics/BarChartCard";
import LineChartCard from "../components/analytics/LineChartCard";
import EmptyAnalyticsState from "../components/analytics/EmptyAnalyticsState";
import RevenueChartCard from "../components/analytics/RevenueChartCard";
import LeadSourceChart from "../components/analytics/LeadSourceChart";
import SalesVelocityCard from "../components/analytics/SalesVelocityCard";
import ForecastCard from "../components/analytics/ForecastCard";
import FunnelChartCard from "../components/analytics/FunnelChartCard";
import TopPerformersCard from "../components/analytics/TopPerformersCard";
import ActivityHeatmap from "../components/analytics/ActivityHeatmap";
import AnalyticsFilters from "../components/analytics/AnalyticsFilters";
import FadeIn from "../components/common/FadeIn";

export default function Analytics() {
  const { leads } = useLeads();
  const [selectedRange, setSelectedRange] = useState("30 Days");
  const { statusData, monthlyLeads, conversionTrend, revenueData, sourceData, salesVelocity, forecastRevenue, funnelData, performers, stats } = useAnalytics(leads, selectedRange);

  const hasData = useMemo(() => leads.length > 0, [leads.length]);

  if (!hasData) {
    return <EmptyAnalyticsState />;
  }

  return (
    <div className="space-y-6 text-gray-900 dark:text-white">
      <FadeIn>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover-card hover-shine transition-colors dark:border-slate-700 dark:bg-slate-800">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">Analytics Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300 sm:text-base">
                Track sales performance, conversion health, and growth trends.
              </p>
            </div>

            <AnalyticsFilters selected={selectedRange} onChange={setSelectedRange} />
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={50}>
        <StatsCards
          totalLeads={stats.totalLeads}
          conversionRate={stats.conversionRate}
          pipelineValue={stats.pipelineValue}
          wonRevenue={stats.wonRevenue}
          averageSalesCycle={stats.averageSalesCycle}
          lostRate={stats.lostRate}
        />
      </FadeIn>

      <FadeIn delay={100}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <PieChartCard data={statusData} total={stats.totalLeads} />
          <BarChartCard data={monthlyLeads} />
        </div>
      </FadeIn>

      <FadeIn delay={150}>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover-card hover-shine transition-colors dark:border-slate-700 dark:bg-slate-800">
          <LineChartCard data={conversionTrend} />
        </div>
      </FadeIn>

      <FadeIn delay={200}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RevenueChartCard data={revenueData} />
          <LeadSourceChart data={sourceData} />
        </div>
      </FadeIn>

      <FadeIn delay={250}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SalesVelocityCard value={salesVelocity} />
          <ForecastCard forecast={forecastRevenue} />
        </div>
      </FadeIn>

      <FadeIn delay={300}>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <FunnelChartCard data={funnelData} />
          <TopPerformersCard data={performers} />
        </div>
      </FadeIn>

      <FadeIn delay={350}>
        <ActivityHeatmap leads={leads} />
      </FadeIn>
    </div>
  );
}
