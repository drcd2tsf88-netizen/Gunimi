"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import {
  getWorkspaceMemory,
  getWorkspaceMilestones,
  getWorkspaceMemoryStats,
} from "@/lib/memory/queries";
import type { MemoryEvent } from "@/lib/memory/types";

export async function getWorkspaceTimeline(limit = 50): Promise<MemoryEvent[]> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return [];
  return getWorkspaceMemory(workspace.id, limit);
}

export async function getWorkspaceMemoryMilestones(
  limit = 20
): Promise<MemoryEvent[]> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return [];
  return getWorkspaceMilestones(workspace.id, limit);
}

export async function getMemoryStats(): Promise<{
  total: number;
  milestones: number;
  critical: number;
}> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return { total: 0, milestones: 0, critical: 0 };
  return getWorkspaceMemoryStats(workspace.id);
}
