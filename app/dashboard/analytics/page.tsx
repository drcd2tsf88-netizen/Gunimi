import { getAnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";
import { getAnalyticsCharts } from "@/server/actions/analytics/getAnalyticsCharts";
import AnalyticsPageView from "@/components/analytics/AnalyticsPageView";

export default async function AnalyticsPage() {
  const [stats, charts] = await Promise.all([
    getAnalyticsOverview(),
    getAnalyticsCharts(),
  ]);

  return <AnalyticsPageView stats={stats} charts={charts} />;
}
