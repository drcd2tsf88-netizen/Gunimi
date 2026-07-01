export type MemoryImportance = "critical" | "high" | "normal" | "low";

export type MemoryEvent = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  importance: MemoryImportance;
  dealId: string | null;
  contactId: string | null;
  companyId: string | null;
  createdAt: string;
  metadata?: Record<string, unknown> | null;
};

export type WorkspaceTimeline = {
  events: MemoryEvent[];
  milestones: MemoryEvent[];
};
