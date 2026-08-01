import { getTranslations } from "next-intl/server";
import {
  getAutomationHistory,
  getAutomationStats,
} from "@/server/actions/automation/getAutomationHistory";
import { getWorkspaceSettings } from "@/server/actions/workspace/getWorkspaceSettings";
import { getCustomRules } from "@/server/actions/automation/getCustomRules";
import AutomationCenterView from "@/components/automations/AutomationCenterView";

export async function generateMetadata() {
  const t = await getTranslations("automations");
  return { title: t("pageTitle") };
}

export default async function AutomationsPage() {
  const [history, stats, settings, customRules] = await Promise.all([
    getAutomationHistory(30),
    getAutomationStats(),
    getWorkspaceSettings(),
    getCustomRules(),
  ]);

  const disabledAutomations = settings?.preferences?.disabledAutomations ?? [];

  return (
    <AutomationCenterView
      history={history}
      stats={stats}
      disabledAutomations={disabledAutomations}
      customRules={customRules}
    />
  );
}
