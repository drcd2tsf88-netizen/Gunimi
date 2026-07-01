import { getWorkspaceMemory } from "@/lib/memory/queries";

export async function loadMemory(workspaceId: string) {
  const events = await getWorkspaceMemory(workspaceId, 20);

  return events.map((e) => ({
    role: "system" as const,
    content: `[${e.importance.toUpperCase()}] ${e.title}${e.description ? ` — ${e.description}` : ""} (${new Date(e.createdAt).toLocaleDateString()})`,
  }));
}
