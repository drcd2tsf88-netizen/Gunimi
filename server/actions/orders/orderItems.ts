"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/server/actions/auth/getUser";
import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { logger } from "@/lib/logger";
import type { OrderItem } from "@/types/order";

export type CreateOrderItemInput = {
  order_id: string;
  description: string;
  quantity: number;
  unit_price: number;      // INTEGER minor currency units (cents)
  discount_percent?: number;
  tax_rate_percent?: number;
  position?: number;
};

export async function createOrderItem(
  input: CreateOrderItemInput
): Promise<OrderItem | null> {
  try {
    if (!input.description.trim()) return null;
    if (input.quantity <= 0) return null;
    if (input.unit_price < 0) return null;

    const user = await getUser();
    if (!user) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    // Verify order belongs to this workspace
    const { data: order } = await supabase
      .from("workspace_orders")
      .select("id")
      .eq("workspace_id", workspace.id)
      .eq("id", input.order_id)
      .maybeSingle();

    if (!order) return null;

    // Default position: append after last item
    let position = input.position;
    if (position === undefined) {
      const { count } = await supabase
        .from("workspace_order_items")
        .select("id", { count: "exact", head: true })
        .eq("order_id", input.order_id);
      position = count ?? 0;
    }

    const { data: item, error } = await supabase
      .from("workspace_order_items")
      .insert({
        order_id: input.order_id,
        workspace_id: workspace.id,
        description: input.description.trim(),
        quantity: input.quantity,
        unit_price: Math.round(input.unit_price), // guard: always integer
        discount_percent: input.discount_percent ?? 0,
        tax_rate_percent: input.tax_rate_percent ?? 0,
        position,
      })
      .select()
      .maybeSingle();

    if (error || !item) {
      logger.error(error);
      return null;
    }

    revalidatePath(`/dashboard/orders/${input.order_id}`);

    return item as OrderItem;
  } catch {
    return null;
  }
}

export type UpdateOrderItemInput = {
  description?: string;
  quantity?: number;
  unit_price?: number;
  discount_percent?: number;
  tax_rate_percent?: number;
  position?: number;
};

export async function updateOrderItem(
  itemId: string,
  orderId: string,
  input: UpdateOrderItemInput
): Promise<OrderItem | null> {
  try {
    const user = await getUser();
    if (!user) return null;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return null;

    const supabase = await createClient();

    const patch: Record<string, unknown> = {};

    if (input.description !== undefined) {
      if (!input.description.trim()) return null;
      patch.description = input.description.trim();
    }
    if (input.quantity !== undefined) {
      if (input.quantity <= 0) return null;
      patch.quantity = input.quantity;
    }
    if (input.unit_price !== undefined) {
      if (input.unit_price < 0) return null;
      patch.unit_price = Math.round(input.unit_price);
    }
    if (input.discount_percent !== undefined) patch.discount_percent = input.discount_percent;
    if (input.tax_rate_percent !== undefined) patch.tax_rate_percent = input.tax_rate_percent;
    if (input.position !== undefined) patch.position = input.position;

    const { data: item, error } = await supabase
      .from("workspace_order_items")
      .update(patch)
      .eq("workspace_id", workspace.id)
      .eq("id", itemId)
      .select()
      .maybeSingle();

    if (error || !item) {
      logger.error(error);
      return null;
    }

    revalidatePath(`/dashboard/orders/${orderId}`);

    return item as OrderItem;
  } catch {
    return null;
  }
}

export async function deleteOrderItem(
  itemId: string,
  orderId: string
): Promise<boolean> {
  try {
    const user = await getUser();
    if (!user) return false;

    const workspace = await getCurrentWorkspace();
    if (!workspace) return false;

    const supabase = await createClient();

    const { error } = await supabase
      .from("workspace_order_items")
      .delete()
      .eq("workspace_id", workspace.id)
      .eq("id", itemId);

    if (error) {
      logger.error(error);
      return false;
    }

    revalidatePath(`/dashboard/orders/${orderId}`);

    return true;
  } catch {
    return false;
  }
}
