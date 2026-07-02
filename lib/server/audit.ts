import { supabaseAdmin }
from "./supabaseAdmin";

type AuditLogParams = {

  workspace_id?: string;

  user_id?: string;

  action: string;

  entity?: string;

  entity_id?: string;

  metadata?: Record<string, unknown>;
};

export async function createAuditLog({

  workspace_id,

  user_id,
  

  action,

  entity,

  entity_id,

  metadata,

}: AuditLogParams) {

  await supabaseAdmin
    .from("audit_logs")
    .insert({

      workspace_id:
        workspace_id,

      user_id:
        user_id,
        

      action,

      entity,

      entity_id:
        entity_id,

      metadata,

    });
}