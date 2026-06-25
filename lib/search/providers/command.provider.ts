import { commandRegistry } from "@/lib/commands/registry";
import type { OrbitCommand } from "@/lib/commands/types";

import { searchRegistry } from "@/lib/search/registry";
import type { CommandResult, SearchProvider, SearchQuery } from "@/lib/search/types";

// Simple keyword scoring — intentionally readable over clever.
// Fuzzy matching, tf-idf, and phonetics belong to a future search sprint.
function score(command: OrbitCommand, input: string): number {
  const q = input.toLowerCase();
  const id = command.id.toLowerCase();
  const keywords = (command.keywords ?? []).map((k) => k.toLowerCase());
  const group = command.group.toLowerCase();

  if (id === q) return 1.0;
  if (id.startsWith(q)) return 0.9;
  if (keywords.includes(q)) return 0.85;
  if (id.includes(q)) return 0.75;
  if (keywords.some((k) => k.startsWith(q))) return 0.7;
  if (keywords.some((k) => k.includes(q))) return 0.55;
  if (group === q) return 0.5;
  if (group.startsWith(q)) return 0.45;

  return 0;
}

// Fallback English title for contexts without React (tests, server code).
// The UI resolves the localized title via t(`items.${commandId}.title`).
function fallbackTitle(id: string): string {
  return id.charAt(0).toUpperCase() + id.slice(1);
}

const commandSearchProvider: SearchProvider = {
  id: "command-registry",
  name: "Commands",
  priority: 10,

  async search({ query, limit = 20 }: SearchQuery): Promise<CommandResult[]> {
    if (!query.trim()) return [];

    return commandRegistry
      .getAll()
      .map((command): CommandResult | null => {
        const relevance = score(command, query);
        if (relevance === 0) return null;

        return {
          kind: "command",
          id: `command:${command.id}`,
          commandId: command.id,
          title: fallbackTitle(command.id),
          category: command.group,
          icon: command.icon,
          score: relevance,
          priority: 10,
          metadata: { type: command.type },
        };
      })
      .filter((r): r is CommandResult => r !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  },
};

// Auto-registers when this module is imported
searchRegistry.register(commandSearchProvider);
