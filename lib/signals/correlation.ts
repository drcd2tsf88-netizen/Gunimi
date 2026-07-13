// Signal Engine — Correlation Context
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md Chapter 18
//            docs/blueprints/AI_PLATFORM_ARCHITECTURE.md
//
// Utility for grouping signals produced by the same user action under a shared
// correlationId. When a server action creates a deal and triggers multiple signals
// (deal_stale, contact_deal_stalling, company_closing_deal), all signals in that
// context should share one correlationId so AI Core can later ask:
//   "What was happening when this deal was created?"
//
// Usage (future — producers not yet wired):
//
//   const ctx = createCorrelationContext();
//   await produceDealSignals({ ..., correlationContext: ctx });
//   await produceContactSignals({ ..., correlationContext: ctx });
//
// Current status: Infrastructure complete. Producers accept correlationContext
// as an optional parameter but do not yet pass correlationId to produceSignal().
// Wiring is a single-line change per producer when ready.
//
// DO NOT redesign producers to require this. This is additive opt-in.

import { randomUUID } from "crypto";

/** Shared context for signals produced by the same user action or scan batch. */
export type CorrelationContext = {
  /** Groups all signals from the same triggering event. */
  correlationId: string;
  /** If these signals derive from a parent signal, record the parent's ID. */
  parentSignalId?: string;
};

/**
 * Creates a new correlation context for a user action or scan batch.
 * Call once at the top of a server action, then pass to all producers.
 */
export function createCorrelationContext(): CorrelationContext {
  return { correlationId: randomUUID() };
}

/**
 * Creates a child context that inherits the parent's correlationId.
 * Use when signals are derived from an existing signal (e.g., AI Core
 * produces a Memory Signal in response to an archived business signal).
 */
export function createChildContext(
  parent: CorrelationContext,
  parentSignalId?: string,
): CorrelationContext {
  return {
    correlationId: parent.correlationId,
    parentSignalId,
  };
}

/**
 * Merges a CorrelationContext into ProduceSignalParams-compatible fields.
 * Producers can spread this into their produceSignal() calls:
 *
 *   await produceSignal({ ...params, ...correlationFields(ctx) });
 */
export function correlationFields(
  ctx: CorrelationContext | undefined,
): { correlationId?: string; parentSignalId?: string } {
  if (!ctx) return {};
  return {
    correlationId: ctx.correlationId,
    parentSignalId: ctx.parentSignalId,
  };
}
