// Signal Engine — Public API
// Authority: docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md
//
// Single import point for all Signal Engine functionality.
// Consumers import from here, not from individual modules.

export type {
  Signal,
  SignalType,
  EntityType,
  SignalTier,
  SignalSeverity,
  SignalConfidence,
  SignalState,
  SignalProducer,
  SignalClaimer,
  DismissalType,
  SignalEvolutionState,
  EvolutionEvent,
  EvidenceUpdate,
  SeverityDelta,
  ProduceSignalParams,
  SignalRow,
} from "./types";

export {
  rowToSignal,
  SIGNAL_CLAIMER_PRIORITY,
  DISMISSAL_TTL_HOURS,
} from "./types";

export type { SignalTypeDefinition } from "./registry";
export { SIGNAL_REGISTRY, isAlphaSignalType, getSignalVisibility } from "./registry";

export {
  produceSignal,
  claimSignal,
  suppressSignal,
  dismissSignal,
  resolveSignal,
  evolveSignal,
  expireSignals,
  restoreExpiredSuppressions,
  hasHigherClaimPriority,
} from "./engine";

export {
  getActiveSignalsForWorkspace,
  getActiveSignalsForEntity,
  getActiveSignalsByTier,
  getSignalsForConsumer,
  getArchivedSignalsForEntity,
  getArchivedSignalsForWorkspace,
  getSignalById,
  getSignalsByCorrelationId,
  getSignalEvolutionChain,
  getSuppressedSignals,
} from "./queries";

export type { CorrelationContext } from "./correlation";
export {
  createCorrelationContext,
  createChildContext,
  correlationFields,
} from "./correlation";
