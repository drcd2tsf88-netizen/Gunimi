"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import type { Order, OrderItem } from "@/types/order";

export async function getOrder(orderId: string): Promise<Order | null> {
  try {
    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data: order, error } = await supabase
      .from("workspace_orders")
      .select(`
        id, workspace_id, number, title, notes, currency,
        status, communication_state, due_date, created_at, updated_at,
        company_id, contact_id, deal_id,
        company:workspace_companies(id, name),
        contact:workspace_people(id, name, email),
        deal:workspace_deals(id, title),
        items:workspace_order_items(
          id, order_id, description, quantity, unit_price,
          discount_percent, tax_rate_percent, position, created_at
        )
      `)
      .eq("workspace_id", workspace.id)
      .eq("id", orderId)
      .maybeSingle();

    if (error || !order) return null;

    return {
      ...order,
      company: Array.isArray(order.company) ? order.company[0] ?? undefined : order.company ?? undefined,
      contact: Array.isArray(order.contact) ? order.contact[0] ?? undefined : order.contact ?? undefined,
      deal: Array.isArray(order.deal) ? order.deal[0] ?? undefined : order.deal ?? undefined,
      items: ((order.items ?? []) as OrderItem[]).sort((a, b) => a.position - b.position),
    } as unknown as Order;
  } catch {
    return null;
  }
}
