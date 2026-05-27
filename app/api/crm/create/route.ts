import {
  errorResponse,
  successResponse,
}
from "@/lib/server/apiResponse";

import { sanitize }
from "@/lib/server/sanitize";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";
import { getUser }
from "@/lib/server/auth";

import { createAuditLog }
from "@/lib/server/audit";

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

    const user = await getUser();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    if (
      !companyId ||
      !user.id ||
      !name
    ) {

      return errorResponse(
        "Missing fields",
        400
      );
    }

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

    const { error } =
      await supabaseAdmin
        .from("workspace_contacts")
        .insert({

          company_id:
            companyId,

          user_id:
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

        });

    if (error) {

      return errorResponse(
        error.message
      );
    }

    await supabaseAdmin
      .from("workspace_activity")
      .insert({

        company_id:
          companyId,

        user_id:
          user.id,

        type:
          "contact_created",

        message:
          `Created CRM contact "${cleanName}"`,

      });

   await createAuditLog({

  companyId,

  userId:
    user.id,

  action:
    "crm_contact_created",

  entity:
    "crm_contact",

  metadata: {

    name:
      cleanName,

    email:
      cleanEmail,

  },

});

    return successResponse();

  } catch (error) {

    console.error(error);

    return errorResponse(
      "Server error"
    );
  }
}