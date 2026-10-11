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
import { ratelimit }
from "@/lib/ratelimit";
import { getCurrentWorkspace }
from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import { z } from "zod";

const createNoteSchema = z.object({
  companyId: z.string().uuid().optional().nullable(),
  title: z.string().min(1).max(500),
  content: z.string().max(50000).optional().nullable(),
});

export async function POST(
  req: Request
) {

  try {

    const parsed = createNoteSchema.safeParse(await req.json());
    if (!parsed.success) {
      return errorResponse("Invalid input", 400);
    }
    const { companyId, title, content } = parsed.data;

    const user = await getUser();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const workspace =
      await getCurrentWorkspace();

    if (!workspace) {
      return errorResponse(
        "Workspace not found",
        404
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

    const cleanTitle =
      sanitize(title);

    const cleanContent =
      sanitize(content ?? "");

    const { error } =
      await supabaseAdmin
        .from("workspace_notes")
        .insert({

          workspace_id:
            workspace.id,

          company_id:
            companyId || null,

          user_id:
            user.id,

          title:
            cleanTitle,

          content:
            cleanContent,

        });

    if (error) {

      return errorResponse(
        error.message
      );
    }

    const {
      error: activityError,
    } = await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id:
          workspace.id,

        user_id:
          user.id,

        company_id:
          companyId || null,

        type:
          "note_created",

        title:
          "Note Created",

        description:
          `Created note "${cleanTitle}"`,
      });

    if (activityError) {
      logger.error("Note activity insert failed", activityError);
    }

    return successResponse();

  } catch (error) {
    logger.error("Notes creation failed", error);

    return errorResponse(
      "Server error"
    );
  }
}