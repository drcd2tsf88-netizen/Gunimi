import {
  errorResponse,
  successResponse,
} from "@/lib/server/apiResponse";

import { sanitize }
from "@/lib/server/sanitize";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { getUser }
from "@/lib/server/auth";

import { createAuditLog }
from "@/lib/server/audit";
import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";
import { ratelimit }
from "@/lib/ratelimit";
import { logger } from "@/lib/logger";
import { produceContactSignals } from "@/lib/signals/producers/contactProducer";
import { z } from "zod";

const createContactSchema = z.object({
  companyId: z.string().uuid().optional().nullable(),
  name: z.string().min(1).max(200),
  email: z.string().email().max(254).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  position: z.string().max(200).optional().nullable(),
  notes: z.string().max(5000).optional().nullable(),
});

export async function POST(
  req: Request
) {
  try {
    const parsed = createContactSchema.safeParse(await req.json());
    if (!parsed.success) {
      return errorResponse("Invalid input", 400);
    }
    const { companyId, name, email, phone, company, position, notes } = parsed.data;

    const user =
      await getUser();

    if (!user) {
      return errorResponse(
        "Unauthorized",
        401
      );
    }

    // RATE LIMIT

    const { success } =
      await ratelimit.limit(user.id);

    if (!success) {
      return errorResponse(
        "Rate limit exceeded",
        429
      );
    }

    // WORKSPACE
   const workspace =
  await getCurrentWorkspace();

if (!workspace) {
  return errorResponse(
    "Workspace not found",
    404
  );
}

const workspaceId =
  workspace.id;
 

    // SANITIZE

    const cleanName =
      sanitize(name);

    const cleanEmail =
      sanitize(email ?? "");

    const cleanPhone =
      sanitize(phone ?? "");

    const cleanCompany =
      sanitize(company ?? "");

    const cleanPosition =
      sanitize(position ?? "");

    const cleanNotes =
      sanitize(notes ?? "");

    // CREATE CONTACT
const {
  data: contact,
  error: contactError,
} =
  await supabaseAdmin
    .from(
      "workspace_people"
    )
    .insert({
      workspace_id:
        workspaceId,

      company_id:
        companyId ||
        null,

      user_id:
        user.id,

      assigned_to:
        user.id,

      name:
        cleanName,

      email:
        cleanEmail,

      phone:
        cleanPhone,

      company_name:
        cleanCompany,

      position:
        cleanPosition,

      notes:
        cleanNotes,

      status:
        "lead",

      updated_at:
        new Date().toISOString(),
    })
    .select()
    .single();

    if (
      contactError ||
      !contact
    ) {
      return errorResponse(
        contactError?.message ||
          "Failed to create contact"
      );
    }

    // WORKSPACE ACTIVITY

    await supabaseAdmin
  .from(
    "workspace_activity"
  )
  .insert({
    workspace_id:
      workspaceId,

    user_id:
      user.id,

    contact_id:
      contact.id,

    type:
      "contact_created",

    title:
      "Contact Created",

    description:
      `Created contact "${cleanName}"`,
  });

    // AUDIT LOG

    await createAuditLog({
      workspace_id:
        workspaceId,

      user_id:
        user.id,

      action:
        "crm_contact_created",

      entity:
        "crm_contact",

      metadata: {
  contactId:
    contact.id,

  name:
    cleanName,

  email:
    cleanEmail,

  status:
    "lead",

  assignedTo:
    user.id,
},
    });

    await produceContactSignals({
      workspaceId,
      contactId: contact.id,
      lastContactedAt: contact.last_contacted_at ?? null,
      createdAt: contact.created_at,
      email: contact.email ?? null,
      phone: contact.phone ?? null,
      companyId: contact.company_id ?? null,
    });

    return successResponse({
      id:
        contact.id,
    });
  } catch (error) {
    logger.error("Contact creation failed", error);

    return errorResponse(
      "Server error"
    );
  }
}