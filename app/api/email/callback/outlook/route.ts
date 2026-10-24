import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/lib/server/auth";
import { getProvider } from "@/lib/email/providers";
import { syncEmailConnection } from "@/lib/email/sync";
import { verifyOAuthState } from "@/lib/server/oauth/state";
import { logger } from "@/lib/logger";
import { runScanToCompletion, getAllScanTypes } from "@/lib/signals/scan";
import { generateEmailConnectionWakeup } from "@/server/actions/crm/generateEmailConnectionWakeup";
import { encryptToken } from "@/lib/server/crypto";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  if (errorParam) {
    return NextResponse.redirect(new URL("/dashboard/email?error=access_denied", request.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL("/dashboard/email?error=missing_params", request.url));
  }

  const verified = verifyOAuthState(state);
  if (!verified) {
    return NextResponse.redirect(new URL("/dashboard/email?error=invalid_state", request.url));
  }
  const { workspaceId, userId } = verified;

  const sessionUser = await getUser();
  if (!sessionUser) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (sessionUser.id !== userId) {
    logger.error(`Outlook OAuth state mismatch: session ${sessionUser.id} !== state ${userId}`);
    return NextResponse.redirect(new URL("/dashboard/email?error=session_mismatch", request.url));
  }

  const { data: membership } = await supabaseAdmin
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", sessionUser.id)
    .maybeSingle();

  if (!membership) {
    return NextResponse.redirect(new URL("/dashboard/email?error=workspace_forbidden", request.url));
  }

  try {
    const provider = getProvider("microsoft365");
    const tokens = await provider.exchangeCode(code);
    const connectedEmail = await provider.getConnectedEmail(tokens.accessToken);

    const { data: connection, error: upsertError } = await supabaseAdmin
      .from("email_connections")
      .upsert(
        {
          workspace_id: workspaceId,
          user_id: userId,
          provider: "microsoft365",
          provider_account_email: connectedEmail,
          access_token: encryptToken(tokens.accessToken),
          refresh_token: tokens.refreshToken ? encryptToken(tokens.refreshToken) : null,
          token_expires_at: tokens.expiresAt.toISOString(),
          scope: tokens.scope ?? null,
          connected_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "workspace_id,user_id,provider" }
      )
      .select("id")
      .single();

    if (upsertError || !connection) {
      logger.error("Outlook connection upsert failed", upsertError);
      return NextResponse.redirect(new URL("/dashboard/email?error=connection_failed", request.url));
    }

    await supabaseAdmin.from("workspace_activity").insert({
      workspace_id: workspaceId,
      user_id: userId,
      type: "email_connected",
      title: "Email Connected",
      description: `Connected Outlook account ${connectedEmail}`,
    });

    void (async () => {
      await syncEmailConnection(connection.id).catch((err) =>
        logger.error("Initial Outlook sync failed", err),
      );
      await generateEmailConnectionWakeup({ workspaceId }).catch(() => undefined);
    })();

    ;(async () => {
      const scanTypes = getAllScanTypes();
      for (const scanType of scanTypes) {
        await runScanToCompletion(scanType, workspaceId).catch(() => undefined);
      }
    })().catch(() => undefined);

    return NextResponse.redirect(new URL("/dashboard/email?connected=true", request.url));
  } catch (err) {
    logger.error("Outlook OAuth callback failed", err);
    return NextResponse.redirect(new URL("/dashboard/email?error=oauth_failed", request.url));
  }
}
