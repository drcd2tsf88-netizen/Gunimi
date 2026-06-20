import { getAnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";
import AnalyticsPageView from "@/components/analytics/AnalyticsPageView";

export default async function AnalyticsPage() {
  const stats = await getAnalyticsOverview();

  return <AnalyticsPageView stats={stats} />;
}
