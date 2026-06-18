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

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const {
      companyId,
      name,
      email,
      phone,
      company,
      position,
      notes,
    } = body;

    const user =
      await getUser();

    if (!user) {
      return errorResponse(
        "Unauthorized",
        401
      );
    }

    if (!name) {
      return errorResponse(
        "Contact name required",
        400
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
      sanitize(email);

    const cleanPhone =
      sanitize(phone);

    const cleanCompany =
      sanitize(company);

    const cleanPosition =
      sanitize(position);

    const cleanNotes =
      sanitize(notes);

    // CREATE CONTACT
const {
  data: contact,
  error: contactError,
} =
  await supabaseAdmin
    .from(
      "workspace_contacts"
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

    // CONTACT TIMELINE

    await supabaseAdmin
  .from(
    "workspace_contact_activity"
  )
  .insert({
    workspace_id:
      workspaceId,

    contact_id:
      contact.id,

    type:
      "contact_created",

    title:
      "Contact Created",

    description:
      `Created contact "${cleanName}"`,
  });

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

    return successResponse({
      id:
        contact.id,
    });
  } catch (error) {
    console.error(
      "CRM CREATE ERROR",
      error
    );

    return errorResponse(
      "Server error"
    );
  }
}