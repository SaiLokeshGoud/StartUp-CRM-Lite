export const getStatusDistribution = (leads = []) => {
  const counts = {};

  (leads || []).forEach((lead) => {
    if (!lead?.status) return;
    counts[lead.status] = (counts[lead.status] || 0) + 1;
  });

  return Object.entries(counts).map(([name, value]) => ({ name, value }));
};

export const getPipelineValue = (leads = []) => {
  return (leads || []).reduce((sum, lead) => sum + (lead?.value || 0), 0);
};

export const getWonRevenue = (leads = []) => {
  return (leads || [])
    .filter((lead) => lead?.status === "Won")
    .reduce((sum, lead) => sum + (lead?.value || 0), 0);
};

export const getConversionRate = (leads = []) => {
  if (!(leads || []).length) return 0;

  const won = (leads || []).filter((lead) => lead?.status === "Won").length;

  return Math.round((won / leads.length) * 100);
};

export const getLostRate = (leads = []) => {
  if (!(leads || []).length) return 0;

  const lost = (leads || []).filter((lead) => lead?.status === "Lost").length;

  return Math.round((lost / leads.length) * 100);
};

export const getAverageSalesCycle = (leads = []) => {
  const wonLeads = (leads || []).filter((lead) => lead?.status === "Won" && lead?.createdAt && lead?.wonAt);
  if (!wonLeads.length) return 0;

  const totalDays = wonLeads.reduce((sum, lead) => {
    const createdAt = new Date(lead.createdAt);
    const wonAt = new Date(lead.wonAt);
    if (Number.isNaN(createdAt.getTime()) || Number.isNaN(wonAt.getTime())) return sum;
    return sum + Math.max(1, Math.round((wonAt - createdAt) / (1000 * 60 * 60 * 24)));
  }, 0);

  return Math.round(totalDays / wonLeads.length);
};

export const getMonthlyLeads = (leads = []) => {
  const months = {};

  (leads || []).forEach((lead) => {
    if (!lead?.createdAt) return;
    const month = new Date(lead.createdAt).toLocaleString("default", { month: "short" });
    months[month] = (months[month] || 0) + 1;
  });

  return Object.entries(months).map(([month, count]) => ({ month, count }));
};

export const getConversionByMonth = (
  leads = []
) => {
    const months = {};

    leads.forEach((lead) => {
      const month = new Date(
        lead.createdAt
      ).toLocaleString(
        "default",
        {
          month: "short",
        }
      );

      if (!months[month]) {
        months[month] = {
          total: 0,
          won: 0,
        };
      }

      months[month].total++;

      if (
        lead.status === "Won"
      ) {
        months[month].won++;
      }
    });

    return Object.entries(
      months
    ).map(
      ([month, values]) => ({
        month,
        rate:
          values.total === 0
            ? 0
            : Math.round(
                (values.won /
                  values.total) *
                  100
              ),
      })
    );
};

export const getRevenueByMonth = (leads = []) => {
  const revenue = {};

  (leads || [])
    .filter((lead) => lead?.status === "Won")
    .forEach((lead) => {
      if (!lead?.createdAt) return;
      const month = new Date(lead.createdAt).toLocaleString("default", { month: "short" });
      revenue[month] = (revenue[month] || 0) + (lead.value || 0);
    });

  return Object.entries(revenue).map(([month, value]) => ({ month, value }));
};

export const getLeadSourceStats = (
  leads = []
) => {
  const sources = {};

  leads.forEach((lead) => {
    const source =
      lead.source || "Other";

    sources[source] =
      (sources[source] || 0) + 1;
  });

  return Object.entries(sources)
    .map(([source, count]) => ({
      source,
      count,
    }))
    .sort((a, b) => b.count - a.count);
};

export const getSalesVelocity = (
  leads = []
) => {
  const wonLeads = leads.filter(
    (lead) => lead.status === "Won"
  );

  if (!wonLeads.length) return 0;

  const avgDealSize =
    wonLeads.reduce(
      (sum, lead) =>
        sum + (lead.value || 0),
      0
    ) / wonLeads.length;

  const winRate =
    wonLeads.length /
    Math.max(leads.length, 1);

  const opportunities =
    leads.length;

  const avgSalesCycle = 30;

  return Math.round(
    (opportunities *
      winRate *
      avgDealSize) /
      avgSalesCycle
  );
};

export const getForecastRevenue = (
  leads = []
) => {
  const revenueData =
    getRevenueByMonth(leads);

  if (!revenueData.length) return 0;

  const total =
    revenueData.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );

  return Math.round(
    total / revenueData.length
  );
};

export const getFunnelData = (
  leads = []
) => {
  return [
    {
      name: "New",
      value: leads.filter(
        (l) => l.status === "New"
      ).length,
    },
    {
      name: "Contacted",
      value: leads.filter(
        (l) =>
          l.status ===
          "Contacted"
      ).length,
    },
    {
      name: "Meeting",
      value: leads.filter(
        (l) =>
          l.status ===
          "Meeting Scheduled"
      ).length,
    },
    {
      name: "Proposal",
      value: leads.filter(
        (l) =>
          l.status ===
          "Proposal Sent"
      ).length,
    },
    {
      name: "Won",
      value: leads.filter(
        (l) => l.status === "Won"
      ).length,
    },
  ];
};

export const getTopPerformers = (
  leads = []
) => {
  const owners = {};

  leads.forEach((lead) => {
    if (
      lead.status !== "Won"
    )
      return;

    const owner =
      lead.owner ||
      "Unassigned";

    owners[owner] =
      (owners[owner] || 0) +
      (lead.value || 0);
  });

  return Object.entries(owners)
    .map(([name, revenue]) => ({
      name,
      revenue,
    }))
    .sort(
      (a, b) =>
        b.revenue - a.revenue
    )
    .slice(0, 5);
};
