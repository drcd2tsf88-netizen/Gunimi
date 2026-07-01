export type AutomationRegistryEntry = {
  id: string;
  name: string;
  trigger: string;
  description: string;
};

export const AUTOMATION_REGISTRY: AutomationRegistryEntry[] = [
  {
    id: "deal_won_onboarding",
    name: "Deal Won — Customer Onboarding",
    trigger: "deal.won",
    description:
      "Creates an onboarding task and a welcome note when a deal is marked as won.",
  },
  {
    id: "deal_lost_recovery",
    name: "Deal Lost — Post-Mortem",
    trigger: "deal.lost",
    description:
      "Creates a post-mortem review task when a deal is marked as lost.",
  },
  {
    id: "deal_created_qualify",
    name: "Deal Created — Qualify",
    trigger: "deal.created",
    description:
      "Creates a qualification task when a new deal enters the pipeline.",
  },
  {
    id: "contact_created_intro",
    name: "New Contact — Schedule Introduction",
    trigger: "contact.created",
    description:
      "Creates an introduction task when a new contact is added to the workspace.",
  },
  {
    id: "company_created_setup",
    name: "Company Created — Initial Setup",
    trigger: "company.created",
    description:
      "Creates a setup task when a new company is added to the workspace.",
  },
];
