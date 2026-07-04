import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getProvider } from "@/lib/calendar/providers";
import { errorResponse } from "@/lib/server/apiResponse";
import { createOAuthState } from "@/lib/server/oauth/state";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return errorResponse("Unauthorized", 401);

    const workspace = await getCurrentWorkspace();
    if (!workspace) return errorResponse("Workspace not found", 404);

    const provider = getProvider("google");
    const state = createOAuthState(workspace.id, user.id);

    const authUrl = provider.getAuthUrl(state);

    return new Response(null, {
      status: 302,
      headers: { Location: authUrl },
    });
  } catch (error) {
    console.error("calendar connect error:", error);
    return errorResponse("Server error", 500);
  }
}
