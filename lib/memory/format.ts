import type { MemoryEvent } from "./types";
import { getImportance } from "./importance";

type ActivityRow = {
  id: string;
  type: string | null;
  title: string | null;
  description: string | null;
  deal_id: string | null;
  contact_id: string | null;
  company_id: string | null;
  created_at: string;
  metadata?: unknown;
};

export function formatAsMemoryEvent(row: ActivityRow): MemoryEvent {
  const type = row.type ?? "unknown";
  return {
    id: row.id,
    type,
    title: row.title ?? "",
    description: row.description ?? null,
    importance: getImportance(type),
    dealId: row.deal_id ?? null,
    contactId: row.contact_id ?? null,
    companyId: row.company_id ?? null,
    createdAt: row.created_at,
    metadata: (row.metadata as Record<string, unknown>) ?? null,
  };
}
