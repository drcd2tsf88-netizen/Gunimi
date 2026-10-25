import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { syncEmailConnection } from "@/lib/email/sync";
import { ratelimit } from "@/lib/ratelimit";
import { logger } from "@/lib/logger";

type SyncErrorCode = "token_revoked" | "token_expired" | "api_disabled" | "unknown";

function classifyError(err: unknown): SyncErrorCode {
  const msg = String(err).toLowerCase();
  if (msg.includes("invalid_grant")) return "token_revoked";
  if (msg.includes("401") || msg.includes("unauthorized")) return "token_expired";
  if (msg.includes("403") || msg.includes("permission_denied") || msg.includes("disabled")) return "api_disabled";
  return "unknown";
}

export async function POST() {
  const [user, workspace] = await Promise.all([getUser(), getCurrentWorkspace()]);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success } = await ratelimit.limit(user.id);
  if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const { data: connections, error: connError } = await supabaseAdmin
    .from("email_connections")
    .select("id")
    .eq("workspace_id", workspace.id)
    .eq("user_id", user.id)
    .not("access_token", "is", null);

  if (connError || !connections?.length) {
    return NextResponse.json({ error: "No email connection found" }, { status: 404 });
  }

  try {
    const results = await Promise.all(connections.map((c) => syncEmailConnection(c.id)));
    const synced = results.reduce((s, r) => s + r.synced, 0);
    const linked = results.reduce((s, r) => s + r.linked, 0);
    return NextResponse.json({ synced, linked });
  } catch (err) {
    logger.error("Email sync failed", err);
    return NextResponse.json({ error: "Sync failed", code: classifyError(err) }, { status: 500 });
  }
}
