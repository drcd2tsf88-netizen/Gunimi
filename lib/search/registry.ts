import type { SearchProvider } from "./types";

// Module-level singleton — same pattern as the command registry.
// Providers register on import; the engine reads on query.
const _providers = new Map<string, SearchProvider>();

function register(provider: SearchProvider): void {
  _providers.set(provider.id, provider);
}

function unregister(id: string): void {
  _providers.delete(id);
}

// Returns providers sorted by ascending priority so higher-priority providers
// have their results interleaved earlier when scores are equal.
function getProviders(): SearchProvider[] {
  return Array.from(_providers.values()).sort((a, b) => a.priority - b.priority);
}

export const searchRegistry = { register, unregister, getProviders };
