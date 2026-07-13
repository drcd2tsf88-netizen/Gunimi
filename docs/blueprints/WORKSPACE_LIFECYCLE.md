# Workspace Lifecycle

**Document type:** Product Authority  
**Status:** Canonical — do not modify without architectural review  
**Version:** 1.0 — 2026-07-12  
**Relates to:** `SIGNAL_ENGINE_BLUEPRINT.md`, `BUSINESS_MEMORY_BLUEPRINT.md`, `AI_PLATFORM_ARCHITECTURE.md`

---

## Purpose

A Gunimi workspace is not a static container. It is a living entity that evolves through discrete states as it accumulates context, builds understanding, and develops intelligence.

This document defines those states, their entry and exit conditions, what the product promises in each state, and the behaviors that are permanently forbidden regardless of state.

Any feature that touches workspace intelligence must be evaluated against this document first.

---

## The State Machine

```
Awakening  ──►  Active  ──►  Learning  ──►  Autonomous
```

Progression is always forward and always sequential. No state may be skipped. No state may be reached out of order. Regression is permitted (see §9).

---

## States

---

### 1. Awakening

> *The workspace exists. The intelligence has not yet begun.*

**Definition**  
The workspace has been created but contains no business context. There are no companies, no contacts, and no deals. There is nothing for Gunimi to reason about.

**Entry Condition**  
- `companies == 0 AND contacts == 0 AND deals == 0`
- Satisfied at workspace creation and maintained until any one entity is added.

**Exit Condition**  
- `companies > 0 OR contacts > 0 OR deals > 0`
- Exit is automatic. No user action beyond adding an entity is required.

**UX Expectations**  
- The user sees the Workspace Awakening surface — not an empty state, not an error, not a wizard.
- The copy speaks of readiness, not absence. The workspace is not broken. It is waiting.
- Three activation paths are offered: company, contact, deal. No other paths are presented.
- Upon exit, the Awakened Moment is shown exactly once: *"Your workspace has awakened."*
- After the Awakened Moment, Today becomes the primary surface.

**AI Expectations**  
- AI must not generate suggestions. There is no context to reason about.
- AI must not surface signals. There are no entities to produce signals from.
- AI must not simulate intelligence. No placeholder insights, no example recommendations.
- Gunimi is present as a mark and a promise — not yet as an active system.

**Signal Expectations**  
- The Signal Engine does not scan this workspace.
- No signals exist. No signal history is being built.
- The scan scheduler must check workspace state before initiating any scan run.

**Memory Expectations**  
- No memories are stored.
- No entity relationships are tracked.
- The Memory Graph does not yet exist.

---

### 2. Active

> *The workspace has context. The intelligence has begun.*

**Definition**  
The workspace contains at least one business entity. Gunimi can observe, track, and surface signals based on real data. Intelligence is reactive: it responds to what exists, not to what might happen.

**Entry Condition**  
- Exit from Awakening (see §1 Exit Condition).

**Exit Condition**  
- The workspace has accumulated sufficient signal history for pattern formation to be meaningful.
- Minimum thresholds (subject to calibration): 25+ distinct signals across 14+ calendar days, spanning at least 2 signal types.
- Exit to Learning is automatic when thresholds are met.

**UX Expectations**  
- Today is the primary surface.
- Health, Focus, Attention, Relationships, and Work are surfaced based on real signals.
- The workspace feels useful from the first entity added.
- No AI copy implies predictive intelligence. Gunimi surfaces what it observes, not what it predicts.

**AI Expectations**  
- AI generates signals from real entity data (stale deals, overdue tasks, contact gaps, etc.).
- AI can surface attention items and focus recommendations.
- AI cannot make forward-looking predictions. It cannot say "this deal is likely to close" or "this relationship is at risk."
- AI confidence is low by design — it does not have enough history to trust its own patterns yet.

**Signal Expectations**  
- The Signal Engine scans this workspace on its regular schedule.
- All 25 signal types from the Signal Engine Blueprint are eligible for production.
- Signal deduplication and suppression are active.
- Signal history begins accumulating. This history is the precondition for Learning.

**Memory Expectations**  
- Memory begins forming.
- Entity creation events, interaction records, and relationship observations are stored.
- Memory confidence is low — insufficient history for high-confidence claims.
- The Memory Graph is initializing but not yet meaningful.

---

### 3. Learning

> *The workspace has history. The intelligence is forming patterns.*

**Definition**  
The workspace has enough signal history that Gunimi can begin detecting reliable patterns. Intelligence shifts from purely reactive to observational: Gunimi notices trends, repeats, and anomalies across time.

**Entry Condition**  
- Exit from Active (see §2 Exit Condition).
- Signal history thresholds met.
- At least one Memory node with confidence ≥ 0.6 exists.

**Exit Condition**  
- Gunimi has established a pattern library with sufficient coverage and confidence.
- AI confidence scores consistently exceed the autonomous action threshold (defined in AI Platform Architecture).
- At least one rule set has been defined for the workspace (explicit or inferred from observed behavior).
- Exit to Autonomous is gated — it requires both data maturity and rule availability.

**UX Expectations**  
- Today remains the primary surface, but its intelligence deepens.
- "I've noticed…" language may begin to appear — observations about patterns, not just events.
- The workspace begins to feel like it understands the business, not just records it.
- No autonomous actions are taken or proposed. Gunimi observes and reports.

**AI Expectations**  
- AI may surface pattern observations: recurring deal stalls, contact gaps that repeat, deal stages that correlate with outcomes.
- AI may begin generating anticipatory signals in addition to reactive signals.
- AI confidence scores are computed and tracked per signal type and per entity.
- AI cannot recommend autonomous actions. It cannot say "I will do X." It can only say "I've noticed X."

**Signal Expectations**  
- Signal confidence scoring is active.
- Signal deduplication becomes more sophisticated — the engine understands which signals represent a pattern versus a one-time event.
- The Signal Graph (causal chain between signals) begins forming.
- Anticipatory signals (predicted future states based on observed patterns) are now eligible for production.

**Memory Expectations**  
- Memory versioning is active. Memories are updated as new evidence arrives.
- Memory Provenance is tracked: every memory knows its source chain.
- Memory confidence is meaningful and used to weight AI observations.
- The Memory Graph connects entities, signals, and stories into a navigable web of understanding.

---

### 4. Autonomous

> *The workspace has intelligence. The intelligence may act.*

**Definition**  
The workspace has established patterns, defined rules, and sufficient confidence that Gunimi may generate proactive recommendations — and, within defined boundaries, initiate actions on behalf of the user.

This is the final forward state. It is earned, not configured.

**Entry Condition**  
- Exit from Learning (see §3 Exit Condition).
- At least one explicit rule set exists and has been reviewed (AI Platform Architecture, §Autonomous Action Rules).
- No autonomous action may be taken before rule review is complete.

**Exit Condition (Regression)**  
- Autonomous may regress to Learning if:
  - Signal quality degrades below the learning threshold for 30+ consecutive days.
  - The user explicitly revokes autonomous permissions.
  - A prohibited action is detected in the system audit log.
- Regression is automatic and silent. The workspace does not notify unless the user has configured regression alerts.

**UX Expectations**  
- Proactive recommendations appear before the user thinks of them.
- Gunimi may propose actions: "Follow up with Jana — her last engagement was 21 days ago and the renewal is in 14 days."
- Every proactive recommendation includes an explainability trace: why this, why now.
- High-impact actions (sending an email, modifying a deal, archiving a contact) require explicit user confirmation. Always.
- The user always feels in control. Autonomous does not mean invisible.

**AI Expectations**  
- AI may initiate proactive signal production outside the regular scan schedule.
- AI may propose actions within the boundaries defined in AI Platform Architecture.
- AI must never act without a corresponding rule.
- AI must never take an irreversible action without explicit user confirmation.
- AI must never exceed the permissions defined in the workspace's rule set.
- Every autonomous recommendation must be explainable in plain language.

**Signal Expectations**  
- Signals may be generated proactively — not only in response to observable events, but in anticipation of future ones.
- Signal confidence is high and tracked continuously.
- The Signal Engine may adjust its scan schedule based on observed workspace activity patterns.
- All proactive signals carry an `origin: "autonomous"` tag and are auditable.

**Memory Expectations**  
- Memory is the primary input to autonomous reasoning.
- Every autonomous recommendation is grounded in at least one Memory node with confidence ≥ 0.7.
- Memory decay is actively managed — stale memories are demoted or invalidated before being used for recommendations.
- The AI Trust Boundary (defined in Business Memory Blueprint) is enforced at all times.

---

## Forbidden Behaviors

These invariants apply across all states. They may never be violated by any feature, at any time, under any condition.

### State Machine Invariants

1. **No state skipping.** A workspace cannot advance from Awakening to Learning without passing through Active. It cannot advance from Active to Autonomous without passing through Learning.

2. **No direct Awakening-to-Autonomous transition.** The distance between "no data" and "acting on your behalf" must always include observed context, signal history, and pattern formation. This is non-negotiable.

3. **No manual state override.** Workspace state is always derived from observable data — entity counts, signal history, confidence scores. It is never stored as a database field and never set by a UI action.

4. **Transitions are automatic.** No user should ever see a "Upgrade to Learning" button. State transitions are a product of the workspace's own accumulation, not a feature to unlock.

### AI Invariants

5. **Learning cannot begin without signal history.** Gunimi cannot form patterns from zero observations. The Learning state requires real signals from real data across real time.

6. **Autonomous cannot act without rules.** No autonomous recommendation or action may be generated without a corresponding rule defined in the AI Platform Architecture. Rules are not inferred. They are defined and reviewed.

7. **No AI simulation.** In Awakening, AI must not simulate intelligence by showing placeholder signals, example recommendations, or dummy insights. The workspace is honest about what it knows.

8. **Confidence must be earned.** AI confidence scores cannot be seeded, assumed, or initialized at a high value. They are computed from observed data and begin low.

9. **Explainability is non-optional.** Every AI recommendation in Learning or Autonomous state must answer: why this entity, why this recommendation, why now, what data supports this. If it cannot be explained, it must not be surfaced.

### UX Invariants

10. **The Awakened Moment is shown exactly once.** It is never shown to a workspace that has been active for weeks. It is never re-triggered by re-adding data after deletion. Once seen, it is gone.

11. **Empty states are never errors.** Awakening is not a failure state. It is the honest representation of a new workspace. The product never apologizes for the absence of data — it invites the user to begin.

12. **State is never exposed as a label.** Users do not see "Your workspace is in Learning state." State influences the experience invisibly — through what is surfaced, how confident the AI sounds, and what recommendations appear.

### Memory Invariants

13. **AI may never store what the Business Memory Blueprint forbids.** The AI Trust Boundary is absolute. No autonomous capability, no matter how sophisticated, may expand what the system stores beyond what the user has consented to.

14. **Memory decay cannot be bypassed.** A stale memory must not be used to power an autonomous recommendation, even if no fresher memory exists. Staleness is a signal, not an obstacle.

---

## State Summary Table

| Dimension | Awakening | Active | Learning | Autonomous |
|---|---|---|---|---|
| Entity Data | None | Exists | Growing | Established |
| Signal History | None | Building | Sufficient | Mature |
| Memory Graph | None | Initializing | Forming | Active |
| AI Intelligence | None | Reactive | Observational | Proactive |
| AI Confidence | N/A | Low | Medium | High |
| Signal Engine | Off | On (reactive) | On (reactive + anticipatory) | On (proactive) |
| Proactive Recommendations | Never | Never | Never | Permitted (within rules) |
| Autonomous Actions | Never | Never | Never | Permitted (with confirmation) |
| UX Surface | Workspace Awakening | Today | Today (deepened) | Today (proactive) |

---

## Design Questions This Document Answers

**"Can we show AI suggestions on an empty workspace to demonstrate the product's value?"**  
No. This violates Forbidden Behavior §7 (No AI simulation) and the Awakening AI Expectations.

**"Can we let power users manually activate Learning mode?"**  
No. This violates Forbidden Behavior §4 (Transitions are automatic).

**"Can we seed a new workspace with example signals to help the AI start faster?"**  
No. This violates Forbidden Behavior §8 (Confidence must be earned) and Learning Entry Conditions.

**"Can Autonomous state draft an email on behalf of the user without confirmation?"**  
No. This violates Forbidden Behavior §6 (rules required) and Autonomous AI Expectations (irreversible actions always require confirmation).

**"Can we show 'Your workspace is Learning' as a product milestone?"**  
No. This violates Forbidden Behavior §12 (state is never exposed as a label).

---

## Relationship to Other Blueprints

| Blueprint | Relationship |
|---|---|
| Signal Engine Blueprint | Defines which signals are produced in Active/Learning/Autonomous. Section §Signal Expectations references signal types, deduplication, and confidence from that document. |
| Business Memory Blueprint | Defines what is stored, how confidence is computed, what the AI Trust Boundary prohibits. Section §Memory Expectations is subordinate to that document. |
| AI Platform Architecture | Defines the rule sets required for Autonomous state, the explainability chain, and the trust model. Autonomous state cannot function without the rule infrastructure defined there. |

---

## Amendment Protocol

This document is canonical. Changes require:

1. A written rationale explaining what changed and why.
2. Review against all three related blueprints for consistency.
3. A version bump and date update in the header.
4. Corresponding updates to any `WorkspaceState` type declarations in the codebase.

Do not add states. Do not remove forbidden behaviors. Do not soften entry conditions to ship faster.

---

---

## Evolution Diagram

```
┌─────────────────────────────────────────┐
│                                         │
│   Awakening      "I know nothing."      │
│                                         │
│        │                                │
│        ▼                                │
│                                         │
│   Active         "I observe."           │
│                                         │
│        │                                │
│        ▼                                │
│                                         │
│   Learning       "I understand."        │
│                                         │
│        │                                │
│        ▼                                │
│                                         │
│   Autonomous     "I can help."          │
│                                         │
└─────────────────────────────────────────┘
```

This is not a feature roadmap.  
This is not a technical specification.  
This is a description of what it means for a workspace to grow.

A new team member who reads only this diagram understands the product philosophy in fifteen seconds. A workspace earns the right to help. It does not start there.

---

*Gunimi — Workspace Lifecycle v1.0*  
*This document defines what a workspace is allowed to become, and in what order.*
