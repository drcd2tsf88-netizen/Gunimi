"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { Order, OrderStatus, OrderCommunicationState } from "@/types/order";

export type UpdateOrderInput = {
  title?: string;
  notes?: string;
  currency?: string;
  due_date?: string | null;
  company_id?: string | null;
  contact_id?: string | null;
  deal_id?: string | null;
};

export async function updateOrder(
  orderId: string,
  input: UpdateOrderInput
): Promise<Order | null> {
  try {
    const user = await getUser();
    if (!user) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    // Validate compatibility bridge FKs when changed
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

    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (input.title !== undefined) {
      if (!input.title.trim()) return null;
      patch.title = input.title.trim();
    }
    if (input.notes !== undefined) patch.notes = input.notes?.trim() || null;
    if (input.currency !== undefined) patch.currency = input.currency;
    if (input.due_date !== undefined) patch.due_date = input.due_date;
    if (input.company_id !== undefined) patch.company_id = input.company_id;
    if (input.contact_id !== undefined) patch.contact_id = input.contact_id;
    if (input.deal_id !== undefined) patch.deal_id = input.deal_id;

    const { data: order, error } = await supabase
      .from("workspace_orders")
      .update(patch)
      .eq("workspace_id", workspace.id)
      .eq("id", orderId)
      .select()
      .maybeSingle();

    if (error || !order) {
      logger.error(error);
      return null;
    }

    revalidatePath(`/dashboard/orders/${orderId}`);
    revalidatePath("/dashboard/orders");

    return order as Order;
  } catch {
    return null;
  }
}

// Lifecycle transition — status dimension only
export async function transitionOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<Order | null> {
  try {
    const user = await getUser();
    if (!user) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data: order, error } = await supabase
      .from("workspace_orders")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("workspace_id", workspace.id)
      .eq("id", orderId)
      .select()
      .maybeSingle();

    if (error || !order) {
      logger.error(error);
      return null;
    }

    revalidatePath(`/dashboard/orders/${orderId}`);
    revalidatePath("/dashboard/orders");

    return order as Order;
  } catch {
    return null;
  }
}

// Communication state transition — independent dimension
export async function transitionCommunicationState(
  orderId: string,
  newState: OrderCommunicationState
): Promise<Order | null> {
  try {
    const user = await getUser();
    if (!user) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const { data: order, error } = await supabase
      .from("workspace_orders")
      .update({
        communication_state: newState,
        updated_at: new Date().toISOString(),
      })
      .eq("workspace_id", workspace.id)
      .eq("id", orderId)
      .select()
      .maybeSingle();

    if (error || !order) {
      logger.error(error);
      return null;
    }

    revalidatePath(`/dashboard/orders/${orderId}`);

    return order as Order;
  } catch {
    return null;
  }
}
