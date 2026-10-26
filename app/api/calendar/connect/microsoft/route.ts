import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getProvider } from "@/lib/calendar/providers";
import { createOAuthState } from "@/lib/server/oauth/state";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return new Response(null, { status: 401 });

    const workspace = await getCurrentWorkspace();
    if (!workspace) return new Response(null, { status: 404 });

    const state = createOAuthState(workspace.id, user.id);
    const authUrl = getProvider("microsoft").getAuthUrl(state);

    return new Response(null, { status: 302, headers: { Location: authUrl } });
  } catch (err) {
    logger.error("Microsoft calendar connect error:", err);
    return new Response(null, { status: 500 });
  }
}
