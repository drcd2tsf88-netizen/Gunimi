import { getUser } from "@/lib/server/auth";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getProvider } from "@/lib/calendar/providers";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { syncCalendarConnection } from "@/lib/calendar/sync";

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
  const oauthError = searchParams.get("error");

  if (oauthError || !code) {
    return redirect("/dashboard/calendar?error=oauth_denied");
  }

  try {
    const user = await getUser();
    if (!user) return redirect("/login");

    const workspace = await getCurrentWorkspace();
    if (!workspace) return redirect("/dashboard/calendar?error=workspace_not_found");

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
      console.error("calendar_connections upsert failed:", dbError);
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
      console.error("Initial calendar sync failed:", err)
    );

    return redirect("/dashboard/calendar?connected=true");
  } catch (error) {
    console.error("calendar callback error:", error);
    return redirect("/dashboard/calendar?error=server_error");
  }
}
