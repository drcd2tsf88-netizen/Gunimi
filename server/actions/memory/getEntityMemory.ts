"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { getEntityMemoryEvents } from "@/lib/memory/queries";
import type { MemoryEvent } from "@/lib/memory/types";

export async function getEntityMemory(
  entityType: "deal" | "contact" | "company",
  entityId: string,
  limit = 20
): Promise<MemoryEvent[]> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return [];
  return getEntityMemoryEvents(workspace.id, entityType, entityId, limit);
}
