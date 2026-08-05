import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getProvider } from "@/lib/calendar/providers";
import { getWorkspaceAccessToken } from "@/lib/calendar/getAccessToken";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { errorResponse } from "@/lib/server/apiResponse";
import { logger } from "@/lib/logger";

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const workspace = await getCurrentWorkspace();
    if (!workspace) return errorResponse("Workspace not found", 404);

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    if (!eventId) return errorResponse("eventId is required", 400);

    const { data: eventRow } = await supabaseAdmin
      .from("calendar_events")
      .select("id, provider_event_id, connection_id")
      .eq("workspace_id", workspace.id)
      .eq("id", eventId)
      .maybeSingle();

    if (!eventRow) return errorResponse("Event not found", 404);

    const { data: connection } = await supabaseAdmin
      .from("calendar_connections")
      .select("provider")
      .eq("id", eventRow.connection_id as string)
      .maybeSingle();

    if (!connection) return errorResponse("Connection not found", 404);

    const tokenResult = await getWorkspaceAccessToken(workspace.id, user.id);
    if (!tokenResult) return errorResponse("No calendar connection", 404);

    const provider = getProvider(connection.provider as string);
    await provider.deleteEvent(tokenResult.accessToken, eventRow.provider_event_id as string);

    await supabaseAdmin
      .from("calendar_events")
      .delete()
      .eq("id", eventId);

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    logger.error("Calendar delete event failed:", err);
    const msg = String(err);
    if (msg.includes("403")) {
      return NextResponse.json({ error: "permission_denied" }, { status: 403 });
    }
    return errorResponse("Failed to delete event", 500);
  }
}
