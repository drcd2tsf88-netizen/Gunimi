import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

type AuditEvent = {
  actorId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  workspaceId?: string;
  metadata?: Record<string, unknown>;
};

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  await supabaseAdmin.from("audit_logs").insert({
    actor_id:    event.actorId,
    action:      event.action,
    entity_type: event.entityType ?? null,
    entity_id:   event.entityId ?? null,
    workspace_id: event.workspaceId ?? null,
    metadata:    event.metadata ?? {},
  });
}
