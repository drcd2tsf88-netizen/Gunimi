import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getProvider } from "@/lib/calendar/providers";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { syncCalendarConnection } from "@/lib/calendar/sync";
import { verifyOAuthState } from "@/lib/server/oauth/state";
import { logger } from "@/lib/logger";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

function redirect(path: string) {
  return new Response(null, {
    status: 302,
    headers: { Location: `${APP_URL}${path}` },
  });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");
  const oauthError = searchParams.get("error");

  if (oauthError || !code) {
    return redirect("/dashboard/calendar?error=oauth_denied");
  }

  if (!stateParam) {
    return redirect("/dashboard/calendar?error=invalid_state");
  }

  const verified = verifyOAuthState(stateParam);
  if (!verified) {
    return redirect("/dashboard/calendar?error=invalid_state");
  }
  const { workspaceId: stateWorkspaceId, userId: stateUserId } = verified;

  try {
    const user = await getUser();
    if (!user) return redirect("/login");

    if (user.id !== stateUserId) {
      logger.error(`Calendar OAuth state mismatch: session user ${user.id} !== state userId ${stateUserId}`);
      return redirect("/dashboard/calendar?error=session_mismatch");
    }

    const workspace = await getCurrentWorkspace();
    if (!workspace) return redirect("/dashboard/calendar?error=workspace_not_found");

    if (workspace.id !== stateWorkspaceId) {
      logger.error(`Calendar OAuth workspace mismatch: active workspace ${workspace.id} !== state workspaceId ${stateWorkspaceId}`);
      return redirect("/dashboard/calendar?error=workspace_mismatch");
    }

    const provider = getProvider("google");

    const tokens = await provider.exchangeCode(code);
    const email = await provider.getConnectedEmail(tokens.accessToken);

    const { data: connection, error: dbError } = await supabaseAdmin
      .from("calendar_connections")
      .upsert(
        {
          workspace_id: workspace.id,
          user_id: user.id,
          provider: "google",
          provider_account_email: email,
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken ?? null,
          token_expires_at: tokens.expiresAt.toISOString(),
          scope: tokens.scope ?? null,
          connected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "workspace_id,user_id,provider" }
      )
      .select("id")
      .single();

    if (dbError || !connection) {
      logger.error("Calendar connection upsert failed", dbError);
      return redirect("/dashboard/calendar?error=connection_failed");
    }

    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      type: "calendar_connected",
      title: "Calendar Connected",
      description: `Google Calendar connected (${email})`,
    });

    // Initial sync — fire and forget, do not block redirect
    syncCalendarConnection(connection.id as string).catch((err) =>
      logger.error("Initial calendar sync failed", err)
    );

    return redirect("/dashboard/calendar?connected=true");
  } catch (error) {
    logger.error("Calendar OAuth callback failed", error);
    return redirect("/dashboard/calendar?error=server_error");
  }
}
