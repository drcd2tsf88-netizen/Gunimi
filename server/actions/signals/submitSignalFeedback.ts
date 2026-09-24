"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type SignalFeedback = "useful" | "not_useful";

export async function submitSignalFeedback(
  signalId: string,
  feedback: SignalFeedback,
): Promise<{ success: boolean }> {
  const user = await getUser();
  if (!user) return { success: false };

  const workspace = await getCurrentWorkspace();
  if (!workspace) return { success: false };

  const { error } = await supabaseAdmin
    .from("workspace_signals")
    .update({
      feedback,
      feedback_at: new Date().toISOString(),
    })
    .eq("id", signalId)
    .eq("workspace_id", workspace.id);

  return { success: !error };
}
