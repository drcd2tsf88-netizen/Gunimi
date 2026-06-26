import { searchTasks } from "@/server/actions/search/searchTasks";
import type { TaskRow } from "@/server/actions/search/searchTasks";

import { searchRegistry } from "@/lib/search/registry";
import type { EntityResult, SearchProvider, SearchQuery } from "@/lib/search/types";

// Title matches rank higher than description-only matches.
function scoreTask(title: string, description: string | null, query: string): number {
  const q = query.toLowerCase();
  const t = title.toLowerCase();

  if (t === q) return 1.0;
  if (t.startsWith(q)) return 0.9;
  if (t.split(" ").some((word) => word.startsWith(q))) return 0.8;
  if (t.includes(q)) return 0.7;
  if (description?.toLowerCase().includes(q)) return 0.5;

  return 0.6;
}

const MAX_DESCRIPTION_LENGTH = 60;

function truncate(text: string | null): string | undefined {
  if (!text) return undefined;
  return text.length > MAX_DESCRIPTION_LENGTH
    ? `${text.slice(0, MAX_DESCRIPTION_LENGTH)}…`
    : text;
}

function mapTask(task: TaskRow, query: string): EntityResult {
  return {
    kind: "entity",
    id: `task:${task.id}`,
    entityType: "task",
    entityId: task.id,
    // Deep-link to task detail once a /dashboard/tasks/[id] route exists.
    // For now, navigates to the task list.
    href: "/dashboard/tasks",
    title: task.title,
    description: truncate(task.description),
    category: "tasks",
    score: scoreTask(task.title, task.description, query),
    priority: 30,
    metadata: { status: task.status, taskPriority: task.priority },
  };
}

const taskSearchProvider: SearchProvider = {
  id: "workspace-tasks",
  name: "Tasks",
  priority: 30,

  async search({ query, limit = 20 }: SearchQuery): Promise<EntityResult[]> {
    if (!query.trim()) return [];

    const { tasks } = await searchTasks(query);

    return tasks
      .map((task) => mapTask(task, query))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },
};

// Auto-registers when this module is imported
searchRegistry.register(taskSearchProvider);
