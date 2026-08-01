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
  /** BCP-47 locale derived from workspace language preference, e.g. "en", "sk", "cs". */
  locale?: string;
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

export type RuleConditionField = "deal_value";
export type RuleConditionOperator = "gt" | "lt" | "gte" | "lte" | "eq";

export type RuleCondition = {
  field: RuleConditionField;
  operator: RuleConditionOperator;
  value: number;
};

export type RuleActionType = "create_task";

export type RuleActionParams = {
  title_template: string;
  priority: "low" | "medium" | "high";
};

export type CustomAutomationRule = {
  id: string;
  workspace_id: string;
  user_id: string;
  name: string;
  trigger: AutomationTrigger;
  conditions: RuleCondition[];
  action_type: RuleActionType;
  action_params: RuleActionParams;
  enabled: boolean;
  created_at: string;
};
