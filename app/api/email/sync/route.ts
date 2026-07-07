import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { syncEmailConnection } from "@/lib/email/sync";
import { ratelimit } from "@/lib/ratelimit";

export async function POST() {
  const [user, workspace] = await Promise.all([getUser(), getCurrentWorkspace()]);

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success } = await ratelimit.limit(user.id);
  if (!success) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const { data: connection, error: connError } = await supabaseAdmin
    .from("email_connections")
    .select("id")
    .eq("workspace_id", workspace.id)
    .eq("user_id", user.id)
    .limit(1)
    .single();

  if (connError || !connection) {
    return NextResponse.json({ error: "No email connection found" }, { status: 404 });
  }

  const result = await syncEmailConnection(connection.id);

  return NextResponse.json({ synced: result.synced, linked: result.linked });
}
