import { getTranslations } from "next-intl/server";
import {
  getAutomationHistory,
  getAutomationStats,
} from "@/server/actions/automation/getAutomationHistory";
import { getWorkspaceSettings } from "@/server/actions/workspace/getWorkspaceSettings";
import AutomationCenterView from "@/components/automations/AutomationCenterView";

export async function generateMetadata() {
  const t = await getTranslations("automations");
  return { title: t("pageTitle") };
}

export default async function AutomationsPage() {
  const [history, stats, settings] = await Promise.all([
    getAutomationHistory(30),
    getAutomationStats(),
    getWorkspaceSettings(),
  ]);

  const disabledAutomations = settings?.preferences?.disabledAutomations ?? [];

  return (
    <AutomationCenterView
      history={history}
      stats={stats}
      disabledAutomations={disabledAutomations}
    />
  );
}
