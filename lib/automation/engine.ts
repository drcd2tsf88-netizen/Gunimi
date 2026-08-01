import { AUTOMATION_RULES } from "./rules";
import type { AutomationContext, AutomationTrigger } from "./types";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

type WorkspacePrefs = {
  disabledAutomations?: string[];
  language?: string;
};

async function loadWorkspacePrefs(workspaceId: string): Promise<WorkspacePrefs> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("workspaces")
      .select("preferences")
      .eq("id", workspaceId)
      .maybeSingle();
    return (data?.preferences as WorkspacePrefs | null) ?? {};
  } catch {
    return {};
  }
}

export async function executeAutomations(
  trigger: AutomationTrigger,
  context: AutomationContext
): Promise<void> {
  const prefs = await loadWorkspacePrefs(context.workspaceId);
  const disabled = new Set(prefs.disabledAutomations ?? []);

  // Inject workspace locale so rules produce localized task titles
  const contextWithLocale: AutomationContext = {
    ...context,
    locale: context.locale ?? prefs.language ?? "en",
  };

  const matchingRules = AUTOMATION_RULES.filter(
    (r) => r.trigger === trigger && !disabled.has(r.id)
  );

  for (const rule of matchingRules) {
    try {
      await rule.execute(contextWithLocale);
    } catch (error) {
      logger.error(`[automation] rule "${rule.id}" failed for trigger "${trigger}":`, error);
    }
  }
}
