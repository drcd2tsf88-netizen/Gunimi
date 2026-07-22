import { getTranslations } from "next-intl/server";
import {
  getAutomationHistory,
  getAutomationStats,
} from "@/server/actions/automation/getAutomationHistory";
import AutomationCenterView from "@/components/automations/AutomationCenterView";

export async function generateMetadata() {
  const t = await getTranslations("automations");
  return { title: t("pageTitle") };
}

export default async function AutomationsPage() {
  const [history, stats] = await Promise.all([
    getAutomationHistory(30),
    getAutomationStats(),
  ]);

  return <AutomationCenterView history={history} stats={stats} />;
}
