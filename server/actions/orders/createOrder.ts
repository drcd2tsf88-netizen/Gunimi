"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { checkWriteRateLimit } from "@/lib/server/rateLimit";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { Order } from "@/types/order";

export type CreateOrderInput = {
  title: string;
  notes?: string;
  currency?: string;
  due_date?: string;
  company_id?: string;
  contact_id?: string;
  deal_id?: string;
};

export async function createOrder(input: CreateOrderInput): Promise<Order | null> {
  try {
    if (!input.title.trim()) return null;

    const user = await getUser();
    if (!user) return null;

    if (!await checkWriteRateLimit()) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    // Validate compatibility bridge FKs exist within workspace scope
    if (input.company_id) {
      const { data: company } = await supabase
        .from("workspace_companies")
        .select("id")
        .eq("workspace_id", workspace.id)
        .eq("id", input.company_id)
        .maybeSingle();
      if (!company) return null;
    }

    if (input.contact_id) {
      // compatibility bridge: references workspace_people.id (ADR-002 → workspace_people post-migration)
      const { data: contact } = await supabase
        .from("workspace_people")
        .select("id")
        .eq("workspace_id", workspace.id)
        .eq("id", input.contact_id)
        .maybeSingle();
      if (!contact) return null;
    }

    if (input.deal_id) {
      const { data: deal } = await supabase
        .from("workspace_deals")
        .select("id")
        .eq("workspace_id", workspace.id)
        .eq("id", input.deal_id)
        .maybeSingle();
      if (!deal) return null;
    }

    const { data: order, error } = await supabase
      .from("workspace_orders")
      .insert({
        workspace_id: workspace.id,
        title: input.title.trim(),
        notes: input.notes?.trim() || null,
        currency: input.currency ?? "EUR",
        due_date: input.due_date ?? null,
        company_id: input.company_id ?? null,
        contact_id: input.contact_id ?? null,
        deal_id: input.deal_id ?? null,
        // number is set by DB trigger (generate_order_number)
        // status defaults to 'draft', communication_state to 'not_sent'
      })
      .select()
      .maybeSingle();

    if (error || !order) {
      logger.error(error);
      return null;
    }

    revalidatePath("/dashboard/orders");

    return order as Order;
  } catch {
    return null;
  }
}
