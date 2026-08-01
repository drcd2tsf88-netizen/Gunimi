import {
  automationCreateNote,
  automationCreateTask,
  automationLogExecution,
} from "./actions";
import type { AutomationActionResult, AutomationContext, AutomationRule } from "./types";

// ─── Localized task title templates ───────────────────────────────────────────

const TITLES = {
  deal_won_onboarding: {
    en: (deal: string) => `Onboard customer: ${deal}`,
    sk: (deal: string) => `Onboardovať zákazníka: ${deal}`,
    cs: (deal: string) => `Onboardovat zákazníka: ${deal}`,
  },
  deal_lost_recovery: {
    en: (deal: string) => `Post-mortem: ${deal} — review why we lost`,
    sk: (deal: string) => `Post-mortem: ${deal} — prečo sme prehrali`,
    cs: (deal: string) => `Post-mortem: ${deal} — proč jsme prohráli`,
  },
  deal_created_qualify: {
    en: (deal: string) => `Qualify opportunity: ${deal}`,
    sk: (deal: string) => `Kvalifikovať príležitosť: ${deal}`,
    cs: (deal: string) => `Kvalifikovat příležitost: ${deal}`,
  },
  deal_high_value_review: {
    en: (deal: string) => `Senior review required: ${deal}`,
    sk: (deal: string) => `Potrebná senior kontrola: ${deal}`,
    cs: (deal: string) => `Vyžadována senior kontrola: ${deal}`,
  },
  contact_created_intro: {
    en: (contact: string) => `Schedule introduction with ${contact}`,
    sk: (contact: string) => `Naplánovať úvodné stretnutie s ${contact}`,
    cs: (contact: string) => `Naplánovat úvodní schůzku s ${contact}`,
  },
  company_created_setup: {
    en: (company: string) => `Add first contact to ${company}`,
    sk: (company: string) => `Pridať prvý kontakt do ${company}`,
    cs: (company: string) => `Přidat první kontakt do ${company}`,
  },
  deal_won_note_title: {
    en: (deal: string) => `Won Deal: ${deal}`,
    sk: (deal: string) => `Získaný deal: ${deal}`,
    cs: (deal: string) => `Získaný obchod: ${deal}`,
  },
} as const;

type TitleKey = keyof typeof TITLES;

function t(key: TitleKey, locale: string | undefined, arg: string): string {
  const lang = (locale ?? "en") as keyof (typeof TITLES)[TitleKey];
  const map = TITLES[key] as Record<string, (s: string) => string>;
  const fn = map[lang] ?? map.en;
  return fn(arg);
}

// ─── Deal Won ─────────────────────────────────────────────────────────────────

const dealWonRule: AutomationRule = {
  id: "deal_won_onboarding",
  name: "Deal Won — Customer Onboarding",
  trigger: "deal.won",
  description:
    "Creates an onboarding task and a welcome note when a deal is marked as won.",
  execute: async (context: AutomationContext): Promise<AutomationActionResult[]> => {
    const results: AutomationActionResult[] = [];

    const taskTitle = t("deal_won_onboarding", context.locale, context.dealTitle ?? "New Customer");
    results.push(await automationCreateTask(context, taskTitle, "high"));

    const noteTitle = t("deal_won_note_title", context.locale, context.dealTitle ?? "Unnamed Deal");
    const noteContent = [
      `Deal closed on ${new Date().toLocaleDateString()}.`,
      "",
      "Next steps:",
      "- Welcome the customer",
      "- Schedule onboarding call",
      "- Set up access and accounts",
      "- Define success criteria",
    ].join("\n");
    results.push(await automationCreateNote(context, noteTitle, noteContent));

    await automationLogExecution(context, dealWonRule.id, dealWonRule.name, "deal.won", results);
    return results;
  },
};

// ─── Deal Lost ────────────────────────────────────────────────────────────────

const dealLostRule: AutomationRule = {
  id: "deal_lost_recovery",
  name: "Deal Lost — Post-Mortem",
  trigger: "deal.lost",
  description:
    "Creates a post-mortem review task when a deal is marked as lost.",
  execute: async (context: AutomationContext): Promise<AutomationActionResult[]> => {
    const results: AutomationActionResult[] = [];

    const taskTitle = t("deal_lost_recovery", context.locale, context.dealTitle ?? "Lost Deal");
    results.push(await automationCreateTask(context, taskTitle, "medium"));

    await automationLogExecution(context, dealLostRule.id, dealLostRule.name, "deal.lost", results);
    return results;
  },
};

// ─── Deal Created ─────────────────────────────────────────────────────────────

const dealCreatedRule: AutomationRule = {
  id: "deal_created_qualify",
  name: "Deal Created — Qualify",
  trigger: "deal.created",
  description:
    "Creates a qualification task when a new deal enters the pipeline.",
  execute: async (context: AutomationContext): Promise<AutomationActionResult[]> => {
    const results: AutomationActionResult[] = [];

    const taskTitle = t("deal_created_qualify", context.locale, context.dealTitle ?? "New Deal");
    results.push(await automationCreateTask(context, taskTitle, "medium"));

    await automationLogExecution(context, dealCreatedRule.id, dealCreatedRule.name, "deal.created", results);
    return results;
  },
};

// ─── Contact Created ──────────────────────────────────────────────────────────

const contactCreatedRule: AutomationRule = {
  id: "contact_created_intro",
  name: "New Contact — Schedule Introduction",
  trigger: "contact.created",
  description:
    "Creates an introduction task when a new contact is added to the workspace.",
  execute: async (context: AutomationContext): Promise<AutomationActionResult[]> => {
    const results: AutomationActionResult[] = [];

    const taskTitle = t("contact_created_intro", context.locale, context.contactName ?? "new contact");
    results.push(await automationCreateTask(context, taskTitle, "medium"));

    await automationLogExecution(context, contactCreatedRule.id, contactCreatedRule.name, "contact.created", results);
    return results;
  },
};

// ─── Company Created ──────────────────────────────────────────────────────────

const companyCreatedRule: AutomationRule = {
  id: "company_created_setup",
  name: "Company Created — Initial Setup",
  trigger: "company.created",
  description:
    "Creates a setup task when a new company is added to the workspace.",
  execute: async (context: AutomationContext): Promise<AutomationActionResult[]> => {
    const results: AutomationActionResult[] = [];

    const taskTitle = t("company_created_setup", context.locale, context.companyName ?? "new company");
    results.push(await automationCreateTask(context, taskTitle, "medium"));

    await automationLogExecution(context, companyCreatedRule.id, companyCreatedRule.name, "company.created", results);
    return results;
  },
};

// ─── High Value Deal ──────────────────────────────────────────────────────────

const HIGH_VALUE_THRESHOLD = 10_000;

const dealHighValueRule: AutomationRule = {
  id: "deal_high_value_review",
  name: "High Value Deal — Senior Review",
  trigger: "deal.created",
  description: `Creates a senior review task when a new deal exceeds ${HIGH_VALUE_THRESHOLD.toLocaleString()}.`,
  execute: async (context: AutomationContext): Promise<AutomationActionResult[]> => {
    if (!context.dealValue || context.dealValue < HIGH_VALUE_THRESHOLD) return [];

    const results: AutomationActionResult[] = [];
    const taskTitle = t("deal_high_value_review", context.locale, context.dealTitle ?? "High Value Deal");
    results.push(await automationCreateTask(context, taskTitle, "high"));

    await automationLogExecution(context, dealHighValueRule.id, dealHighValueRule.name, "deal.created", results);
    return results;
  },
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const AUTOMATION_RULES: AutomationRule[] = [
  dealWonRule,
  dealLostRule,
  dealCreatedRule,
  dealHighValueRule,
  contactCreatedRule,
  companyCreatedRule,
];
