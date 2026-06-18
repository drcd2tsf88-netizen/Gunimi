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

export async function POST(
  req: Request
) {

  try {

    const body =
      await req.json();

    const {
      companyId,
      title,
      content,
    } = body;

    const user = await getUser();

    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    if (
      !companyId ||
      !title
    ) {
      return errorResponse(
        "Missing fields",
        400
      );
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
      sanitize(content);

    const { error } =
      await supabaseAdmin
        .from("workspace_notes")
        .insert({

          company_id:
            companyId,

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

    await supabaseAdmin
      .from("workspace_activity")
      .insert({
        workspace_id:
          workspace.id,

        company_id:
          companyId,

        user_id:
          user.id,

        type:
          "note_created",

        title:
          "Note Created",

        description:
          `Created note "${cleanTitle}"`,
      });

    return successResponse();

  } catch (error) {

    console.error(error);

    return errorResponse(
      "Server error"
    );
  }
}