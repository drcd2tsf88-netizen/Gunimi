import { NextResponse } from "next/server";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getProvider } from "@/lib/email/providers";

function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET() {
  const user = await getUser();
  if (!user) return errorResponse("Unauthorized", 401);

  const workspace = await getCurrentWorkspace();
  if (!workspace) return errorResponse("Workspace not found", 404);

  const state = Buffer.from(
    JSON.stringify({ workspaceId: workspace.id, userId: user.id })
  ).toString("base64url");

  const authUrl = getProvider("gmail").getAuthUrl(state);

  return new Response(null, {
    status: 302,
    headers: { Location: authUrl },
  });
}
