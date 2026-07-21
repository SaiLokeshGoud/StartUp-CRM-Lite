import { Users, Trophy, XCircle, TrendingUp } from "lucide-react";

import { useLeads } from "../context/LeadContext";

import StatsCard from "../components/dashboard/StatsCard";
import PipelineOverview from "../components/dashboard/PipelineOverview";
import RecentLeads from "../components/dashboard/RecentLeads";
import QuickActions from "../components/dashboard/QuickActions";
import FadeIn from "../components/common/FadeIn";

export default function Dashboard() {
  const { leads } = useLeads();

  const totalLeads = leads.length;
  const wonLeads = leads.filter((l) => l.status === "Won").length;
  const lostLeads = leads.filter((l) => l.status === "Lost").length;
  const conversionRate = totalLeads === 0 ? 0 : Math.round((wonLeads / totalLeads) * 100);

  return (
    <div className="space-y-6 text-gray-900 dark:text-white">
      <FadeIn>
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500 sm:text-base dark:text-gray-300">
            Welcome back! Here is your pipeline at a glance.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={50}>
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatsCard title="Total Leads" value={totalLeads} icon={Users} change={12} color="#2563EB" />
          <StatsCard title="Won" value={wonLeads} icon={Trophy} change={8} color="#22C55E" />
          <StatsCard title="Lost" value={lostLeads} icon={XCircle} change={3} color="#EF4444" />
          <StatsCard title="Conversion" value={`${conversionRate}%`} icon={TrendingUp} change={6} color="#F59E0B" />
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <PipelineOverview leads={leads} />
      </FadeIn>

      <FadeIn delay={150}>
        <div className="grid gap-6 xl:grid-cols-2">
          <RecentLeads leads={leads} />
          <QuickActions />
        </div>
      </FadeIn>
    </div>
  );
}
