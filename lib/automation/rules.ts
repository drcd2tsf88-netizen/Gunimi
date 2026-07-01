import {
  automationCreateNote,
  automationCreateTask,
  automationLogExecution,
} from "./actions";
import type { AutomationActionResult, AutomationContext, AutomationRule } from "./types";

// ─── Deal Won ─────────────────────────────────────────────────────────────────

const dealWonRule: AutomationRule = {
  id: "deal_won_onboarding",
  name: "Deal Won — Customer Onboarding",
  trigger: "deal.won",
  description:
    "Creates an onboarding task and a welcome note when a deal is marked as won.",
  execute: async (context: AutomationContext): Promise<AutomationActionResult[]> => {
    const results: AutomationActionResult[] = [];

    const taskTitle = `Onboard customer: ${context.dealTitle ?? "New Customer"}`;
    results.push(await automationCreateTask(context, taskTitle, "high"));

    const noteTitle = `Won Deal: ${context.dealTitle ?? "Unnamed Deal"}`;
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

    await automationLogExecution(
      context,
      dealWonRule.id,
      dealWonRule.name,
      "deal.won",
      results
    );
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

    const taskTitle = `Post-mortem: ${context.dealTitle ?? "Lost Deal"} — review why we lost`;
    results.push(await automationCreateTask(context, taskTitle, "medium"));

    await automationLogExecution(
      context,
      dealLostRule.id,
      dealLostRule.name,
      "deal.lost",
      results
    );
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

    const taskTitle = `Qualify opportunity: ${context.dealTitle ?? "New Deal"}`;
    results.push(await automationCreateTask(context, taskTitle, "medium"));

    await automationLogExecution(
      context,
      dealCreatedRule.id,
      dealCreatedRule.name,
      "deal.created",
      results
    );
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

    const taskTitle = `Schedule introduction meeting with ${context.contactName ?? "new contact"}`;
    results.push(await automationCreateTask(context, taskTitle, "medium"));

    await automationLogExecution(
      context,
      contactCreatedRule.id,
      contactCreatedRule.name,
      "contact.created",
      results
    );
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

    const taskTitle = `Add first contact to ${context.companyName ?? "new company"}`;
    results.push(await automationCreateTask(context, taskTitle, "medium"));

    await automationLogExecution(
      context,
      companyCreatedRule.id,
      companyCreatedRule.name,
      "company.created",
      results
    );
    return results;
  },
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const AUTOMATION_RULES: AutomationRule[] = [
  dealWonRule,
  dealLostRule,
  dealCreatedRule,
  contactCreatedRule,
  companyCreatedRule,
];
