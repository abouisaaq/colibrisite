import { VisitAnalyticsDashboard } from "@/components/admin/visit-analytics-dashboard";
import { getVisitAnalytics, type VisitPeriod } from "@/lib/analytics-queries";

function parsePeriod(value?: string): VisitPeriod {
  if (value === "7" || value === "90") return Number(value) as VisitPeriod;
  return 30;
}

export default async function AdminStatisticsPage({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const params = await searchParams;
  const period = parsePeriod(params.period);
  const analytics = await getVisitAnalytics(period);

  return (
    <VisitAnalyticsDashboard
      analytics={analytics}
      activePeriod={period}
    />
  );
}
