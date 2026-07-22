import { getTranslations } from "next-intl/server";
import { getAnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";
import { getAnalyticsCharts } from "@/server/actions/analytics/getAnalyticsCharts";
import AnalyticsPageView from "@/components/analytics/AnalyticsPageView";

export async function generateMetadata() {
  const t = await getTranslations("analytics");
  return { title: t("pageTitle") };
}

export default async function AnalyticsPage() {
  const [stats, charts] = await Promise.all([
    getAnalyticsOverview(),
    getAnalyticsCharts(),
  ]);

  return <AnalyticsPageView stats={stats} charts={charts} />;
}
