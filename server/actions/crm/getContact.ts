"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { Contact } from "@/types/contact";

export async function getContact(contactId: string): Promise<Contact | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_contacts")
      .select(`
        id,
        company_id,
        workspace_id,
        name,
        email,
        phone,
        company_name,
        position,
        notes,
        status,
        last_contacted_at,
        created_at,
        updated_at,
        assigned_to,
        owner:profiles!assigned_to(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq("workspace_id", workspace.id)
      .eq("id", contactId)
      .single();

    if (error || !data) {
      console.error("getContact error:", error);
      return null;
    }

    return data as unknown as Contact;
  } catch (error) {
    console.error("getContact failed:", error);
    return null;
  }
}
