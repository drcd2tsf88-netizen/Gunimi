export type AutomationTrigger =
  | "deal.won"
  | "deal.lost"
  | "deal.created"
  | "contact.created"
  | "company.created"
  | "task.completed";

export type AutomationContext = {
  workspaceId: string;
  userId: string;
  dealId?: string;
  dealTitle?: string;
  dealValue?: number | null;
  contactId?: string | null;
  contactName?: string | null;
  companyId?: string | null;
  companyName?: string | null;
  taskId?: string;
  taskTitle?: string;
};

export type AutomationActionResult = {
  action: string;
  status: "success" | "failed";
  detail?: string;
};

export type AutomationRule = {
  id: string;
  name: string;
  trigger: AutomationTrigger;
  description: string;
  execute: (context: AutomationContext) => Promise<AutomationActionResult[]>;
};
