"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";

export type WorkspaceAttachment = {
  id: string;
  entity_type: string;
  entity_id: string;
  file_name: string;
  file_size: number;
  mime_type: string;
  storage_path: string;
  created_at: string;
  uploaded_by: string;
};

export async function getAttachments(
  entityType: "deal" | "contact" | "company",
  entityId: string
): Promise<WorkspaceAttachment[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();
    const { data } = await supabase
      .from("workspace_attachments")
      .select("*")
      .eq("workspace_id", workspace.id)
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });

    return (data ?? []) as WorkspaceAttachment[];
  } catch {
    return [];
  }
}
