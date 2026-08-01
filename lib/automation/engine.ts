import { AUTOMATION_RULES } from "./rules";
import type {
  AutomationContext,
  AutomationTrigger,
  CustomAutomationRule,
  RuleCondition,
} from "./types";
import { automationCreateTask, automationLogExecution } from "./actions";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

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

  await executeCustomRules(trigger, contextWithLocale);
}

async function loadCustomRules(workspaceId: string): Promise<CustomAutomationRule[]> {
  try {
    const { data } = await supabaseAdmin
      .from("workspace_automation_rules")
      .select("*")
      .eq("workspace_id", workspaceId)
      .eq("enabled", true);
    return (data ?? []) as CustomAutomationRule[];
  } catch {
    return [];
  }
}

function evaluateConditions(conditions: RuleCondition[], context: AutomationContext): boolean {
  return conditions.every((cond) => {
    if (cond.field === "deal_value") {
      const val = context.dealValue ?? 0;
      switch (cond.operator) {
        case "gt": return val > cond.value;
        case "lt": return val < cond.value;
        case "gte": return val >= cond.value;
        case "lte": return val <= cond.value;
        case "eq": return val === cond.value;
      }
    }
    return true;
  });
}

function interpolate(template: string, context: AutomationContext): string {
  return template
    .replace(/\{deal\}/g, context.dealTitle ?? "")
    .replace(/\{contact\}/g, context.contactName ?? "")
    .replace(/\{company\}/g, context.companyName ?? "");
}

async function executeCustomRules(
  trigger: AutomationTrigger,
  context: AutomationContext
): Promise<void> {
  const rules = await loadCustomRules(context.workspaceId);
  const matching = rules.filter((r) => r.trigger === trigger);

  for (const rule of matching) {
    try {
      if (!evaluateConditions(rule.conditions, context)) continue;

      const title = interpolate(rule.action_params.title_template, context);
      const result = await automationCreateTask(context, title, rule.action_params.priority);
      await automationLogExecution(context, rule.id, rule.name, trigger, [result]);
    } catch (error) {
      logger.error(`[automation] custom rule "${rule.id}" failed:`, error);
    }
  }
}
