import {
  errorResponse,
  successResponse,
}
from "@/lib/server/apiResponse";

import { sanitize }
from "@/lib/server/sanitize";

import { supabaseAdmin }
from "@/lib/server/supabaseAdmin";

import { createAuditLog }
from "@/lib/server/audit";

import { getUser }
from "@/lib/server/auth";

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
      title,
      description,
      priority,
    } = body;

    const user =
      await getUser();

    if (!user) {

      return errorResponse(
        "Unauthorized",
        401
      );
    }

    const { success } =
      await ratelimit.limit(
        user.id
      );

    if (!success) {

      return errorResponse(
        "Rate limit exceeded",
        429
      );
    }

    if (
      !companyId ||
      !user.id ||
      !title
    ) {

      return errorResponse(
        "Missing fields",
        400
      );
    }

    const cleanTitle =
      sanitize(title);

    const cleanDescription =
      sanitize(description);

    const { data, error } =

      await supabaseAdmin

        .from("tasks")

        .insert({

          company_id:
            companyId,

          user_id:
            user.id,

          assigned_to:
            user.id,

          title:
            cleanTitle,

          description:
            cleanDescription,

          priority,

          status:
            "todo",

        })

        .select()

        .single();

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
          "task_created",

        message:
          `Created task "${cleanTitle}"`,

      });

    await createAuditLog({

      workspace_id:
        companyId,

      user_id:
        user.id,

      action:
        "task_created",

      entity:
        "task",

      entity_id:
        data.id,

      metadata: {

        title:
          cleanTitle,

        description:
          cleanDescription,

        priority,

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