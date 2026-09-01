"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { queryEntityBusinessMemories } from "@/lib/memory/businessMemoryQueries";
import type { BusinessMemory, BusinessMemoryEntityType } from "@/lib/memory/businessMemoryTypes";

export async function getEntityBusinessMemories(
  entityType: BusinessMemoryEntityType,
  entityId: string,
  limit = 6
): Promise<BusinessMemory[]> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return [];
  return queryEntityBusinessMemories(workspace.id, entityId, entityType, limit);
}
