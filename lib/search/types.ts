import type { LucideIcon } from "lucide-react";

// ─── Query ────────────────────────────────────────────────────────────────────

export type SearchResultKind = "page" | "command" | "entity" | "ai";

export type SearchQuery = {
  query: string;
  limit?: number;
  // Optional: restrict results to specific kinds
  kinds?: SearchResultKind[];
};

// ─── Results ──────────────────────────────────────────────────────────────────

type BaseSearchResult = {
  id: string;
  title: string;
  description?: string;
  category: string;        // display grouping label (e.g. "Navigation", "CRM")
  score: number;           // 0–1; higher = more relevant
  priority: number;        // tiebreaker; lower = shown first
  metadata?: Record<string, unknown>;
};

// A navigatable page in the application
export type PageResult = BaseSearchResult & {
  kind: "page";
  href: string;
  icon?: LucideIcon;
};

// A command palette action
export type CommandResult = BaseSearchResult & {
  kind: "command";
  commandId: string;       // used by the UI to resolve t(`items.${commandId}.title`)
  icon?: LucideIcon;
};

// A domain entity — contact, company, deal
export type EntityResult = BaseSearchResult & {
  kind: "entity";
  entityType: "contact" | "company" | "deal" | "task";
  entityId: string;
  href: string;
};

// An AI-driven result — prompt injection point for Sprint 3+ streaming
export type AIResult = BaseSearchResult & {
  kind: "ai";
  prompt: string;
};

export type SearchResult = PageResult | CommandResult | EntityResult | AIResult;

// ─── Provider Interface ───────────────────────────────────────────────────────

export interface SearchProvider {
  readonly id: string;       // unique, kebab-case
  readonly name: string;     // human-readable, used in debug/telemetry
  readonly priority: number; // lower = provider results ranked first on score ties
  search(query: SearchQuery): Promise<SearchResult[]>;
}
