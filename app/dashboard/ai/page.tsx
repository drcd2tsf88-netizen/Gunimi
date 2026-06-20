import { getAnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";
import AIPageView from "@/components/ai/AIPageView";

export default async function AIPage() {
  const stats = await getAnalyticsOverview();

  return <AIPageView stats={stats} />;
}
