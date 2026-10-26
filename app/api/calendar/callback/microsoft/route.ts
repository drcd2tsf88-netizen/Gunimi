import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getProvider } from "@/lib/calendar/providers";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { syncCalendarConnection } from "@/lib/calendar/sync";
import { verifyOAuthState } from "@/lib/server/oauth/state";
import { logger } from "@/lib/logger";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

function redirect(path: string) {
  return new Response(null, { status: 302, headers: { Location: `${APP_URL}${path}` } });
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");
  const oauthError = searchParams.get("error");

  if (oauthError || !code) return redirect("/dashboard/calendar?error=oauth_denied");
  if (!stateParam) return redirect("/dashboard/calendar?error=invalid_state");

  const verified = verifyOAuthState(stateParam);
  if (!verified) return redirect("/dashboard/calendar?error=invalid_state");

  const { workspaceId, userId } = verified;

  try {
    const user = await getUser();
    if (!user) return redirect("/login");
    if (user.id !== userId) {
      logger.error(`MS Calendar OAuth state mismatch: ${user.id} !== ${userId}`);
      return redirect("/dashboard/calendar?error=session_mismatch");
    }

    const workspace = await getCurrentWorkspace();
    if (!workspace || workspace.id !== workspaceId) {
      return redirect("/dashboard/calendar?error=workspace_mismatch");
    }

    const provider = getProvider("microsoft");
    const tokens = await provider.exchangeCode(code);
    const email = await provider.getConnectedEmail(tokens.accessToken);

    const { data: connection, error: dbError } = await supabaseAdmin
      .from("calendar_connections")
      .upsert(
        {
          workspace_id: workspace.id,
          user_id: user.id,
          provider: "microsoft",
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
      logger.error("MS Calendar connection upsert failed", dbError);
      return redirect("/dashboard/calendar?error=connection_failed");
    }

    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspace.id,
      user_id: user.id,
      type: "calendar_connected",
      title: "Calendar Connected",
      description: `Outlook Calendar connected (${email})`,
    });

    syncCalendarConnection(connection.id as string).catch((err) =>
      logger.error("Initial Outlook calendar sync failed", err)
    );

    return redirect(`/dashboard/calendar?connected=true&provider=microsoft&email=${encodeURIComponent(email)}`);
  } catch (err) {
    logger.error("MS Calendar OAuth callback failed", err);
    return redirect("/dashboard/calendar?error=server_error");
  }
}
