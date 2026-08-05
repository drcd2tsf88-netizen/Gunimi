import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getProvider } from "@/lib/calendar/providers";
import { getWorkspaceAccessToken } from "@/lib/calendar/getAccessToken";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { errorResponse } from "@/lib/server/apiResponse";
import { logger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const workspace = await getCurrentWorkspace();
    if (!workspace) return errorResponse("Workspace not found", 404);

    const body = await req.json() as {
      title?: string;
      startAt?: string;
      endAt?: string;
      description?: string;
    };

    const title = (body.title ?? "").trim();
    if (!title) return errorResponse("Title is required", 400);
    if (!body.startAt || !body.endAt) return errorResponse("Start and end time required", 400);

    const tokenResult = await getWorkspaceAccessToken(workspace.id, user.id);
    if (!tokenResult) return errorResponse("No calendar connection", 404);

    const { data: connection } = await supabaseAdmin
      .from("calendar_connections")
      .select("provider")
      .eq("id", tokenResult.connectionId)
      .maybeSingle();

    if (!connection) return errorResponse("Connection not found", 404);

    const provider = getProvider(connection.provider as string);
    const event = await provider.createEvent(tokenResult.accessToken, {
      title,
      startAt: new Date(body.startAt),
      endAt: new Date(body.endAt),
      description: body.description,
    });

    // Persist the new event to our local DB
    await supabaseAdmin
      .from("calendar_events")
      .insert({
        workspace_id: workspace.id,
        connection_id: tokenResult.connectionId,
        provider_event_id: event.providerEventId,
        title: event.title,
        description: event.description ?? null,
        start_at: event.startAt.toISOString(),
        end_at: event.endAt.toISOString(),
        organizer_email: event.organizerEmail ?? null,
        organizer_name: event.organizerName ?? null,
        location: event.location ?? null,
        html_link: event.htmlLink ?? null,
        status: event.status,
        all_day: event.allDay,
        synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    return NextResponse.json({
      id: event.providerEventId,
      title: event.title,
      start_at: event.startAt.toISOString(),
      end_at: event.endAt.toISOString(),
      html_link: event.htmlLink,
    });
  } catch (err) {
    logger.error("Calendar create event failed:", err);
    const msg = String(err);
    if (msg.includes("403")) {
      return NextResponse.json({ error: "permission_denied" }, { status: 403 });
    }
    return errorResponse("Failed to create event", 500);
  }
}
