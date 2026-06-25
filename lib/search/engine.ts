import { searchRegistry } from "./registry";
import type { SearchQuery, SearchResult } from "./types";

async function search(query: SearchQuery): Promise<SearchResult[]> {
  if (!query.query.trim()) return [];

  const providers = searchRegistry.getProviders();
  if (providers.length === 0) return [];

  const limit = query.limit ?? 20;

  // Parallel execution — one failing provider never blocks the rest.
  const settled = await Promise.allSettled(
    providers.map((p) => p.search({ ...query, limit }))
  );

  const merged: SearchResult[] = [];

  settled.forEach((result, index) => {
    if (result.status === "rejected") {
      console.error(
        `[SearchEngine] provider "${providers[index].id}" failed:`,
        result.reason
      );
      return;
    }
    merged.push(...result.value);
  });

  // Optional kind filter — applied after merge so providers don't need to know
  const kinds = query.kinds;
  const filtered = kinds
    ? merged.filter((r) => kinds.includes(r.kind))
    : merged;

  // Primary sort: score descending. Tiebreaker: priority ascending.
  return filtered
    .sort((a, b) => b.score - a.score || a.priority - b.priority)
    .slice(0, limit);
}

export const searchEngine = { search };
