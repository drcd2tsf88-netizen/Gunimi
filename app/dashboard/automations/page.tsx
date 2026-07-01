import {
  getAutomationHistory,
  getAutomationStats,
} from "@/server/actions/automation/getAutomationHistory";
import AutomationCenterView from "@/components/automations/AutomationCenterView";

export default async function AutomationsPage() {
  const [history, stats] = await Promise.all([
    getAutomationHistory(30),
    getAutomationStats(),
  ]);

  return <AutomationCenterView history={history} stats={stats} />;
}
