const STORAGE_KEY = "orbit_recent_commands";
const MAX_ENTRIES = 8;
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

type RecentEntry = {
  id: string;
  lastExecutedAt: number;
  count: number;
};

function load(): RecentEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const entries = JSON.parse(raw) as RecentEntry[];
    // Evict entries older than TTL on every read
    const cutoff = Date.now() - TTL_MS;
    return entries.filter((e) => e.lastExecutedAt > cutoff);
  } catch {
    return [];
  }
}

function save(entries: RecentEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // storage unavailable — silent fail
  }
}

/**
 * Blended score: 60% recency (decays to 0 over 30 days) + 40% frequency
 * (caps at 20 executions). This prevents a burst of recent executions from
 * permanently burying a frequently used command.
 */
function score(entry: RecentEntry): number {
  const ageDays = (Date.now() - entry.lastExecutedAt) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.max(0, 1 - ageDays / 30);
  const frequencyScore = Math.min(entry.count / 20, 1);
  return 0.6 * recencyScore + 0.4 * frequencyScore;
}

function record(commandId: string): void {
  const entries = load();
  const existing = entries.find((e) => e.id === commandId);
  if (existing) {
    existing.lastExecutedAt = Date.now();
    existing.count++;
  } else {
    entries.push({ id: commandId, lastExecutedAt: Date.now(), count: 1 });
  }
  entries.sort((a, b) => score(b) - score(a));
  save(entries.slice(0, MAX_ENTRIES));
}

function getRecent(limit = 5): string[] {
  return load()
    .sort((a, b) => score(b) - score(a))
    .slice(0, limit)
    .map((e) => e.id);
}

export const recentCommands = { record, getRecent };
