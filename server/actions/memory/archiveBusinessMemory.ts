"use server";

import { getCurrentWorkspace } from "@/lib/workspace/getCurrentWorkspace";
import { archiveBusinessMemoryById } from "@/lib/memory/businessMemoryQueries";

export async function archiveBusinessMemory(
  memoryId: string
): Promise<{ ok: boolean }> {
  const workspace = await getCurrentWorkspace();
  if (!workspace) return { ok: false };
  const ok = await archiveBusinessMemoryById(workspace.id, memoryId);
  return { ok };
}
