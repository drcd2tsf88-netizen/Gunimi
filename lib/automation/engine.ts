import { AUTOMATION_RULES } from "./rules";
import type {
  AutomationContext,
  AutomationTrigger,
  CustomAutomationRule,
  RuleCondition,
} from "./types";
import { automationCreateTask, automationLogExecution } from "./actions";
import { logger } from "@/lib/logger";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { cookies, headers } from "next/headers";

type WorkspacePrefs = {
  disabledAutomations?: string[];
  language?: string;
};

const SUPPORTED_LOCALES = ["en", "sk", "cs"] as const;

function parseBrowserLocale(hint: string | null, acceptLang: string): string | null {
  if (hint && (SUPPORTED_LOCALES as readonly string[]).includes(hint)) return hint;
  for (const part of acceptLang.split(",")) {
    const lang = part.trim().split(";")[0].trim().split("-")[0].toLowerCase();
    if ((SUPPORTED_LOCALES as readonly string[]).includes(lang)) return lang;
  }
  return null;
}

async function loadWorkspacePrefs(workspaceId: string): Promise<WorkspacePrefs> {
  try {
    const { data } = await supabaseAdmin
      .from("workspaces")
      .select("preferences")
      .eq("id", workspaceId)
      .maybeSingle();
    const prefs = (data?.preferences as WorkspacePrefs | null) ?? {};

    if (!prefs.language) {
      const cookieStore = await cookies();
      const localeCookie = cookieStore.get("GUNIMI_LOCALE");
      if (localeCookie?.value) {
        prefs.language = localeCookie.value;
      }
    }

    if (!prefs.language) {
      const headerStore = await headers();
      const browserLocale = parseBrowserLocale(
        headerStore.get("x-gunimi-locale-hint"),
        headerStore.get("accept-language") ?? ""
      );
      if (browserLocale) prefs.language = browserLocale;
    }

    return prefs;
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
