"use server";

import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { logger } from "@/lib/logger";

export type FeedbackCategory =
  | "ux" | "bug" | "performance" | "copy" | "ai"
  | "signal" | "today" | "workspace" | "settings" | "other";

export type FeedbackSeverity = "low" | "medium" | "high" | "critical";

export type SubmitFeedbackInput = {
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  message: string;
  sessionNote: boolean;
  route: string | null;
  browser: string | null;
  viewport: string | null;
  language: string | null;
  timezone: string | null;
};

export async function submitFeedback(input: SubmitFeedbackInput): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;
    if (!await checkWriteRateLimit(user.id)) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    // Verify dogfood mode is enabled for this workspace
    const { data: ws } = await supabaseAdmin
      .from("workspaces")
      .select("preferences")
      .eq("id", workspace.id)
      .maybeSingle();

    const prefs = ws?.preferences as Record<string, unknown> | null;
    if (!prefs?.dogfoodEnabled) return false;

    const { error } = await supabaseAdmin
      .from("dogfood_feedback")
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        category: input.category,
        severity: input.severity,
        message: input.message.trim(),
        session_note: input.sessionNote,
        route: input.route,
        browser: input.browser,
        viewport: input.viewport,
        language: input.language,
        timezone: input.timezone,
        status: "open",
      });

    if (error) {
      logger.error("submitFeedback insert failed", error);
      return false;
    }

    return true;
  } catch (err) {
    logger.error("submitFeedback unexpected error", err);
    return false;
  }
}
