import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { syncTeamsChats } from "@/lib/teams/sync";
import { ratelimit } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

export async function POST() {
  const [user, workspace] = await Promise.all([getUser(), getCurrentWorkspace()]);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success } = await ratelimit.limit(user.id);
  if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const { data: connections } = await supabaseAdmin
    .from("email_connections")
    .select("id")
    .eq("workspace_id", workspace.id)
    .eq("user_id", user.id)
    .eq("provider", "microsoft365")
    .not("access_token", "is", null);

  if (!connections?.length) {
    return NextResponse.json({ error: "No Microsoft 365 connection" }, { status: 404 });
  }

  try {
    const results = await Promise.all(connections.map((c) => syncTeamsChats(c.id)));
    const synced = results.reduce((s, r) => s + r.synced, 0);
    const linked = results.reduce((s, r) => s + r.linked, 0);
    return NextResponse.json({ synced, linked });
  } catch (err) {
    logger.error("Teams sync failed", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
