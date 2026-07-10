"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { Deal } from "@/types/deal";
import { logger } from "@/lib/logger";

export async function getContactDeals(contactId: string): Promise<Deal[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_deals")
      .select(`
        *,
        owner:profiles!owner_id(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("workspace_id", workspace.id)
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("getContactDeals error:", error);
      return [];
    }

    return (data || []) as unknown as Deal[];
  } catch (error) {
    logger.error("getContactDeals failed:", error);
    return [];
  }
}
