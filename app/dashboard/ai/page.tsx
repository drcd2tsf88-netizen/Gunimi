import { getTranslations } from "next-intl/server";
import { getAnalyticsOverview } from "@/server/actions/analytics/getAnalyticsOverview";
import AIPageView from "@/components/ai/AIPageView";

export async function generateMetadata() {
  const t = await getTranslations("ai");
  return { title: t("pageTitle") };
}

export default async function AIPage() {
  const stats = await getAnalyticsOverview();

  return <AIPageView stats={stats} />;
}
