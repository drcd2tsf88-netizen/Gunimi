// Signal Scanner — Long-Running Tasks
//
// Evaluates all non-done tasks in the workspace for temporal conditions:
//   - task_overdue (due_date < today, not yet done)
//   - task_due_today (due_date = today)
//   - task_blocked / task_waiting_customer (status-based, re-evaluated here to
//     cover tasks created before the scan engine was deployed)
//   - contact_overdue_task (cross-entity per task, taskLevelDedup)
//
// Temporal gap: a task created with a future due date may become overdue
// between mutations if nobody edits the task. The scan detects this drift.
//
// Delegates to produceTaskSignals() — no signal evaluation duplication.

import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { produceTaskSignals } from "@/lib/signals/producers/taskProducer";
import type { ScanContext, ScanResult } from "../types";

type TaskRow = {
  id: string;
};

export async function longRunningTaskScan(context: ScanContext): Promise<ScanResult> {
  const startMs = Date.now();

  let query = supabaseAdmin
    .from("workspace_tasks")
    .select("id")
    .eq("workspace_id", context.workspaceId)
    .not("status", "eq", "done")
    .order("id")
    .limit(context.batchSize);

  if (context.cursor) {
    query = query.gt("id", context.cursor);
  }

  const { data } = await query;
  const tasks = (data ?? []) as TaskRow[];

  if (tasks.length === 0) {
    return {
      scanType: "long_running_tasks",
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

  for (const task of tasks) {
    if (context.signal?.aborted) {
      return {
        scanType: "long_running_tasks",
        workspaceId: context.workspaceId,
        entitiesScanned: scanned,
        signalsProduced,
        signalsResolved,
        completed: false,
        nextCursor: resumeCursor,
        durationMs: Date.now() - startMs,
      };
    }

    const stats = await produceTaskSignals({
      workspaceId: context.workspaceId,
      taskId: task.id,
    });

    signalsProduced += stats.signalsProduced;
    signalsResolved += stats.signalsResolved;
    resumeCursor = task.id;
    scanned++;
  }

  const hasMore = tasks.length === context.batchSize;

  return {
    scanType: "long_running_tasks",
    workspaceId: context.workspaceId,
    entitiesScanned: scanned,
    signalsProduced,
    signalsResolved,
    completed: !hasMore,
    nextCursor: hasMore ? resumeCursor : null,
    durationMs: Date.now() - startMs,
  };
}
