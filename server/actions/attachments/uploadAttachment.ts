"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { logger } from "@/lib/logger";

const BUCKET = "workspace-attachments";
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

export type UploadAttachmentResult =
  | { success: true; id: string; file_name: string }
  | { success: false; error: string };

export async function uploadAttachment(
  formData: FormData
): Promise<UploadAttachmentResult> {
  try {
    const file = formData.get("file") as File | null;
    const entityType = formData.get("entityType") as string | null;
    const entityId = formData.get("entityId") as string | null;

    if (!file || !entityType || !entityId) {
      return { success: false, error: "invalid_params" };
    }

    if (!["deal", "contact", "company"].includes(entityType)) {
      return { success: false, error: "invalid_entity_type" };
    }

    if (file.size > MAX_BYTES) {
      return { success: false, error: "file_too_large" };
    }

    const user = await getUser();
    if (!user) return { success: false, error: "unauthorized" };

    if (!await checkWriteRateLimit(user.id)) {
      return { success: false, error: "rate_limited" };
    }

    const workspace = await getCurrentWorkspace();
    if (!workspace) return { success: false, error: "no_workspace" };

    // Build a stable, collision-free storage path
    const ext = file.name.split(".").pop() ?? "bin";
    const uuid = crypto.randomUUID();
    const storagePath = `${workspace.id}/${entityType}/${entityId}/${uuid}.${ext}`;

    const bytes = await file.arrayBuffer();
    const { error: storageError } = await supabaseAdmin.storage
      .from(BUCKET)
      .upload(storagePath, bytes, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (storageError) {
      logger.error("uploadAttachment storage error", storageError);
      return { success: false, error: "storage_failed" };
    }

    const { data, error: dbError } = await supabaseAdmin
      .from("workspace_attachments")
      .insert({
        workspace_id: workspace.id,
        uploaded_by: user.id,
        entity_type: entityType,
        entity_id: entityId,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type || "application/octet-stream",
        storage_path: storagePath,
      })
      .select("id, file_name")
      .single();

    if (dbError || !data) {
      // Rollback storage upload if DB insert fails
      await supabaseAdmin.storage.from(BUCKET).remove([storagePath]);
      logger.error("uploadAttachment db error", dbError);
      return { success: false, error: "db_failed" };
    }

    revalidatePath("/dashboard");
    return { success: true, id: data.id, file_name: data.file_name };
  } catch (err) {
    logger.error("uploadAttachment failed", err);
    return { success: false, error: "unknown" };
  }
}
