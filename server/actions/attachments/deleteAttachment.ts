"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";

const BUCKET = "workspace-attachments";

export async function deleteAttachment(attachmentId: string): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    // Fetch the record — verify ownership and get storage_path
    const { data: attachment } = await supabaseAdmin
      .from("workspace_attachments")
      .select("id, storage_path, uploaded_by, workspace_id")
      .eq("id", attachmentId)
      .maybeSingle();

    if (!attachment) return false;

    // Must be same workspace
    if (attachment.workspace_id !== workspace.id) return false;

    // Only uploader or admin/owner may delete
    if (attachment.uploaded_by !== user.id) {
      const { data: member } = await supabaseAdmin
        .from("workspace_members")
        .select("role")
        .eq("workspace_id", workspace.id)
        .eq("user_id", user.id)
        .maybeSingle();

      const role = member?.role ?? "";
      if (!["owner", "admin"].includes(role)) return false;
    }

    await supabaseAdmin.storage.from(BUCKET).remove([attachment.storage_path]);

    const { error } = await supabaseAdmin
      .from("workspace_attachments")
      .delete()
      .eq("id", attachmentId);

    if (error) {
      logger.error("deleteAttachment db error", error);
      return false;
    }

    revalidatePath("/dashboard");
    return true;
  } catch (err) {
    logger.error("deleteAttachment failed", err);
    return false;
  }
}
