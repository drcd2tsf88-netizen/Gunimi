import { NextResponse } from "next/server";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getProvider } from "@/lib/email/providers";
import { createOAuthState } from "@/lib/server/oauth/state";

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workspace = await getCurrentWorkspace();
  if (!workspace) return NextResponse.json({ error: "Workspace not found" }, { status: 404 });

  const state = createOAuthState(workspace.id, user.id, "/dashboard/communications");
  const authUrl = getProvider("microsoft365").getAuthUrl(state);

  return new Response(null, {
    status: 302,
    headers: { Location: authUrl },
  });
}
