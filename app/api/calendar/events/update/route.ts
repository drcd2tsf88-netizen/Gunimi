import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getProvider } from "@/lib/calendar/providers";
import { getWorkspaceAccessToken } from "@/lib/calendar/getAccessToken";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { errorResponse } from "@/lib/server/apiResponse";
import { logger } from "@/lib/logger";

export async function PATCH(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const workspace = await getCurrentWorkspace();
    if (!workspace) return errorResponse("Workspace not found", 404);

    const body = await req.json() as {
      eventId?: string;
      title?: string;
      startAt?: string;
      endAt?: string;
    };

    if (!body.eventId) return errorResponse("eventId is required", 400);

    // Look up the event to get provider_event_id + connection
    const { data: eventRow } = await supabaseAdmin
      .from("calendar_events")
      .select("id, provider_event_id, connection_id")
      .eq("workspace_id", workspace.id)
      .eq("id", body.eventId)
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
    const updated = await provider.updateEvent(tokenResult.accessToken, {
      providerEventId: eventRow.provider_event_id as string,
      title: body.title,
      startAt: body.startAt ? new Date(body.startAt) : undefined,
      endAt: body.endAt ? new Date(body.endAt) : undefined,
    });

    // Persist updates
    await supabaseAdmin
      .from("calendar_events")
      .update({
        title: updated.title,
        start_at: updated.startAt.toISOString(),
        end_at: updated.endAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", body.eventId);

    return NextResponse.json({
      title: updated.title,
      start_at: updated.startAt.toISOString(),
      end_at: updated.endAt.toISOString(),
    });
  } catch (err) {
    logger.error("Calendar update event failed:", err);
    const msg = String(err);
    if (msg.includes("403")) {
      return NextResponse.json({ error: "permission_denied" }, { status: 403 });
    }
    return errorResponse("Failed to update event", 500);
  }
}
