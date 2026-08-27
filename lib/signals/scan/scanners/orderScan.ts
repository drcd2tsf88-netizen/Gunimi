// Signal Scanner — Order Stale
//
// Evaluates ALL non-terminal orders in the workspace for temporal conditions:
//   - order_overdue (due_date passed, not completed/cancelled)
//   - order_draft_stale (in draft for 7+ days)
//   - order_not_acknowledged (sent but not acknowledged for 3+ days)
//
// Delegates to produceOrderSignals() — no signal evaluation logic here.

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { produceOrderSignals } from "@/lib/signals/producers/orderProducer";
import type { ScanContext, ScanResult } from "../types";

type OrderRow = {
  id: string;
  status: string;
  communication_state: string;
  due_date: string | null;
  updated_at: string | null;
  created_at: string;
};

export async function orderScan(context: ScanContext): Promise<ScanResult> {
  const startMs = Date.now();

  let query = supabaseAdmin
    .from("workspace_orders")
    .select("id, status, communication_state, due_date, updated_at, created_at")
    .eq("workspace_id", context.workspaceId)
    .not("status", "in", '("completed","cancelled")')
    .order("id")
    .limit(context.batchSize);

  if (context.cursor) {
    query = query.gt("id", context.cursor);
  }

  const { data } = await query;
  const orders = (data ?? []) as OrderRow[];

  if (orders.length === 0) {
    return {
      scanType: "order_stale",
      workspaceId: context.workspaceId,
      entitiesScanned: 0,
      signalsProduced: 0,
      signalsResolved: 0,
      completed: true,
      nextCursor: null,
      durationMs: Date.now() - startMs,
    };
  }

  let resumeCursor = context.cursor;
  let scanned = 0;
  let signalsProduced = 0;
  let signalsResolved = 0;

  for (const order of orders) {
    if (context.signal?.aborted) break;

    const stats = await produceOrderSignals({
      workspaceId: context.workspaceId,
      orderId: order.id,
      status: order.status,
      communicationState: order.communication_state,
      dueDate: order.due_date,
      updatedAt: order.updated_at,
      createdAt: order.created_at,
    });

    signalsProduced += stats.signalsProduced;
    signalsResolved += stats.signalsResolved;
    scanned++;
    resumeCursor = order.id;
  }

  const hasMore = orders.length === context.batchSize && !context.signal?.aborted;

  return {
    scanType: "order_stale",
    workspaceId: context.workspaceId,
    entitiesScanned: scanned,
    signalsProduced,
    signalsResolved,
    completed: !hasMore,
    nextCursor: hasMore ? resumeCursor : null,
    durationMs: Date.now() - startMs,
  };
}
