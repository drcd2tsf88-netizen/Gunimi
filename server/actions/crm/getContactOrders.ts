"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import type { Order } from "@/types/order";

export async function getContactOrders(contactId: string): Promise<Order[]> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return [];

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("workspace_orders")
      .select(`
        id, workspace_id, number, title, currency,
        status, communication_state, due_date, created_at, updated_at,
        company_id, contact_id, deal_id,
        company:workspace_companies(id, name),
        contact:workspace_people(id, name, email)
      `)
      .eq("workspace_id", workspace.id)
      .eq("contact_id", contactId)
      .order("created_at", { ascending: false });

    if (error) return [];

    return (data ?? []).map((row) => ({
      ...row,
      company: Array.isArray(row.company) ? row.company[0] ?? undefined : row.company ?? undefined,
      contact: Array.isArray(row.contact) ? row.contact[0] ?? undefined : row.contact ?? undefined,
    })) as Order[];
  } catch {
    return [];
  }
}
