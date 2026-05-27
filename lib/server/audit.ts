import { supabaseAdmin }
from "./supabaseAdmin";

type AuditLogParams = {

  companyId: string;

  userId?: string;

  action: string;

  entity?: string;

  entityId?: string;

  metadata?: any;
};

export async function createAuditLog({

  companyId,

  userId,
  

  action,

  entity,

  entityId,

  metadata,

}: AuditLogParams) {

  await supabaseAdmin
    .from("audit_logs")
    .insert({

      company_id:
        companyId,

      userId,
        

      action,

      entity,

      entity_id:
        entityId,

      metadata,

    });
}