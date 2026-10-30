import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { sendAIBudgetAlert } from "@/lib/email/sendAIBudgetAlert";
import { logger } from "@/lib/logger";

const COOLDOWN_HOURS = 24;

export async function notifyAIBudgetExceeded(
  workspaceId: string,
  tokensUsed: number,
  dailyLimit: number,
  percentUsed: number,
): Promise<void> {
  const { data: workspace } = await supabaseAdmin
    .from("workspaces")
    .select("id, name, preferences")
    .eq("id", workspaceId)
    .maybeSingle();

  if (!workspace) return;

  const prefs = (workspace.preferences ?? {}) as Record<string, unknown>;
  const lastNotifiedAt = prefs.aiBudgetNotifiedAt as string | undefined;

  if (lastNotifiedAt) {
    const msSinceLast = Date.now() - new Date(lastNotifiedAt).getTime();
    if (msSinceLast < COOLDOWN_HOURS * 3_600_000) return;
  }

  // Get workspace owner user_id via workspace_members
  const { data: ownerMember } = await supabaseAdmin
    .from("workspace_members")
    .select("user_id")
    .eq("workspace_id", workspaceId)
    .eq("role", "owner")
    .maybeSingle();

  if (!ownerMember?.user_id) return;

  const { data: userData } = await supabaseAdmin.auth.admin.getUserById(ownerMember.user_id as string);
  const ownerEmail = userData?.user?.email;
  if (!ownerEmail) return;

  try {
    await sendAIBudgetAlert({
      email: ownerEmail,
      workspaceName: (workspace.name as string) ?? "Your workspace",
      tokensUsed,
      dailyLimit,
      percentUsed,
      dashboardUrl: process.env.NEXT_PUBLIC_APP_URL ?? "https://app.gunimi.com",
    });

    // Mark notified — update preferences
    await supabaseAdmin
      .from("workspaces")
      .update({
        preferences: { ...prefs, aiBudgetNotifiedAt: new Date().toISOString() },
      })
      .eq("id", workspaceId);
  } catch (err) {
    logger.error("[AIBudget] Failed to send budget alert", {
      workspaceId,
      error: err instanceof Error ? err.message : "Unknown",
    });
  }
}
