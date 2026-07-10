import { AUTOMATION_RULES } from "./rules";
import type { AutomationContext, AutomationTrigger } from "./types";
import { logger } from "@/lib/logger";

export async function executeAutomations(
  trigger: AutomationTrigger,
  context: AutomationContext
): Promise<void> {
  const matchingRules = AUTOMATION_RULES.filter((r) => r.trigger === trigger);

  for (const rule of matchingRules) {
    try {
      await rule.execute(context);
    } catch (error) {
      logger.error(`[automation] rule "${rule.id}" failed for trigger "${trigger}":`, error);
    }
  }
}
