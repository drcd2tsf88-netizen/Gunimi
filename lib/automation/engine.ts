import { AUTOMATION_RULES } from "./rules";
import type { AutomationContext, AutomationTrigger } from "./types";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

async function loadDisabled(workspaceId: string): Promise<Set<string>> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("workspaces")
      .select("preferences")
      .eq("id", workspaceId)
      .maybeSingle();
    const prefs = data?.preferences as { disabledAutomations?: string[] } | null;
    return new Set(prefs?.disabledAutomations ?? []);
  } catch {
    return new Set();
  }
}

export async function executeAutomations(
  trigger: AutomationTrigger,
  context: AutomationContext
): Promise<void> {
  const disabled = await loadDisabled(context.workspaceId);
  const matchingRules = AUTOMATION_RULES.filter(
    (r) => r.trigger === trigger && !disabled.has(r.id)
  );

  for (const rule of matchingRules) {
    try {
      await rule.execute(context);
    } catch (error) {
      logger.error(`[automation] rule "${rule.id}" failed for trigger "${trigger}":`, error);
    }
  }
}
