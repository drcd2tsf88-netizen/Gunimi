import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { syncCalendarConnection } from "@/lib/calendar/sync";
import { errorResponse, successResponse } from "@/lib/server/apiResponse";
import { ratelimit } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

export async function POST() {
  try {
    const user = await getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const { success: rateLimitOk } = await ratelimit.limit(user.id);
    if (!rateLimitOk) return errorResponse("Rate limit exceeded", 429);

    const workspace = await getCurrentWorkspace();
    if (!workspace) return errorResponse("Workspace not found", 404);

    const { data: connection } = await supabaseAdmin
      .from("calendar_connections")
      .select("id")
      .eq("workspace_id", workspace.id)
      .eq("user_id", user.id)
      .order("connected_at", { ascending: false })
      .limit(1)
      .single();

    if (!connection) return errorResponse("No calendar connection found", 404);

    const result = await syncCalendarConnection(connection.id as string);

    return successResponse(result);
  } catch (error) {
    logger.error("Calendar sync failed", error);
    return errorResponse("Sync failed", 500);
  }
}
