"use server";

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";

const BUCKET = "workspace-attachments";

export async function getAttachmentUrl(storagePath: string): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET)
      .createSignedUrl(storagePath, 3600);

    if (error || !data?.signedUrl) return null;
    return data.signedUrl;
  } catch {
    return null;
  }
}
