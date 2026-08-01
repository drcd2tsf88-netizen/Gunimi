# ADR-004: Knowledge Layers Architecture

Status: Accepted
Date: July 2026
Authors: Michal Guoth, Gunimi Architecture

---

## Context

A core design question for any AI platform: how does the system organize knowledge?

The naive approach is a flat model — everything is stored as "data" and AI queries
it all. This fails because different types of knowledge have fundamentally different
properties:

- A log of every email ever sent is objective and immutable
- An AI summary of what matters in those emails is interpretive and uncertain
- A pattern that "this customer type tends to churn after pricing discussions" is
  generalized and probabilistic

Treating these as equivalent — querying them with the same confidence, presenting
them with the same authority — is a trust and reliability failure.

The question was: how should Gunimi structure its understanding of business reality
in a way that is both trustworthy (knows what it knows and what it doesn't) and
useful (provides intelligence, not just records)?

---

## Decision

**Gunimi organizes knowledge as a four-layer stack: Reality → History → Memory → Wisdom.**

Each layer has distinct properties and a defined relationship to the layers above
and below it.

### The stack

```
Reality     ← exists independently of Gunimi; never invented
   ↓ capture
History     ← immutable records of observed events
   ↓ interpret (AI-mediated, confidence-gated)
Memory      ← AI interpretation of what matters; decays; has provenance
   ↓ generalize (pattern across multiple instances)
Wisdom      ← learned patterns; earned, not authored; updatable
```

### Layer contracts

**Reality:** Gunimi observes, never invents. If something did not happen in business
reality, it should not enter the system.

**History:** Events are immutable. Captured via user input, integrations, or system
observation. Every Event has: timestamp, entities involved, type, Workspace scope.
No Event is modified. Erroneous Events are corrected by compensating Events.

**Memory:** Created by AI from History. Every Memory has:
- `source_events` — which Events produced this Memory
- `confidence` — how certain AI is (0.0–1.0)
- `created_at` — when AI formed this interpretation
- `last_reinforced_at` — when this was most recently confirmed by new Events
- `expires_at` — when confidence falls below useful threshold

Memory is never stored without provenance. A Memory without `source_events` is
invalid and must be rejected at the application layer.

**Wisdom:** Derived from patterns across multiple Memories and entity types.
Requires minimum evidence threshold before formation. Has version history as
patterns are refined. Never authored by engineers as static rules.

### AI's role in the stack

AI may promote knowledge upward. AI may never invent or demote.

| Operation | AI involvement | Human confirmation required? |
|---|---|---|
| Reality → History | Records observation | For high-stakes corrections |
| History → Memory | Full AI interpretation | For high-impact Memory |
| Memory → Wisdom | Full AI generalization | For enterprise actions |
| Downward movement | Never | N/A — not permitted |

### Temporal decay model for Memory

Memory confidence decays on a time curve based on type:

| Memory type | Half-life (no reinforcement) |
|---|---|
| Tactical context (next steps, current mood) | 14 days |
| Relationship context (role, influence, preferences) | 90 days |
| Strategic context (company position, decision patterns) | 365 days |

When confidence falls below 0.3, Memory is flagged as stale and surfaced to users
for review, not used automatically to drive suggestions or automation.

---

## Rationale

**Why four layers and not fewer?**

Two-layer (facts + AI): Collapses the important distinction between AI interpretation
(Memory, specific to an entity) and AI generalization (Wisdom, across entities).
This means a single misinterpreted fact could influence cross-workspace patterns.

Three-layer (History + Memory + Wisdom): Correct, but loses the explicit modeling
of Reality as the ground truth layer that exists independently of Gunimi. Without
this layer being explicit, it becomes easy to design features that conflate "what
Gunimi knows" with "what is true." The Reality layer is a constant reminder that
Gunimi's knowledge is always incomplete.

Four-layer (Reality + History + Memory + Wisdom): The minimum number of layers
that correctly separates the distinct epistemological properties of different
knowledge types. Each layer has fundamentally different rules; no two layers can
be safely collapsed.

**Why not more than four?**

Additional sub-layers (e.g., separating "raw signals" from "interpreted signals")
belong within the implementation of specific layers, not as separate architectural
layers. The stack must be explainable to every engineer, product manager, and
designer on the team. Complexity within a layer is acceptable. Complexity in the
stack itself is not.

**Why must Memory decay?**

Stale Memory is actively harmful. A system that presents three-year-old relationship
context as current intelligence is worse than a system with no Memory — because it
provides false confidence. The decay model forces the system to acknowledge that
interpretations age, and to surface them for human review when they are no longer
freshly supported by Evidence.

**Why must Wisdom be earned, not authored?**

Engineer-authored "wisdom" is a rule. It is static, invisible to users, and fails
silently when business contexts change. Earned Wisdom is transparent — it can be
shown to derive from specific historical patterns, its evidence can be inspected,
and it updates as reality changes. One approach builds trust; the other erodes it.

---

## Consequences

**Positive:**
- Clear provenance chain from any AI output back to specific Events
- Trust boundaries are explicit — users understand what AI knows vs. what it infers
- Memory decay prevents the system from misleading users with stale context
- Wisdom formation is transparent and auditable

**Challenging:**
- More complex data model than a flat "AI context" table
- Decay model requires background jobs to update confidence scores
- Wisdom formation requires sufficient data accumulation — new Workspaces have no Wisdom

**Implementation note on bi-temporality:**
The History layer is designed to support bi-temporal queries in the future.
Currently, Events capture `occurred_at` (when something happened in reality) and
`recorded_at` (when it was entered into Gunimi). Full bi-temporal modeling —
enabling queries like "what did we know about this relationship on March 15, 2024?" —
requires additional infrastructure beyond Open Alpha scope. The schema is designed
to accommodate this evolution without breaking changes.

---

*Related: [KNOWLEDGE_LAYERS.md](../../foundation/KNOWLEDGE_LAYERS.md) — Full layer specification*
*Related: [DOMAIN_LAWS.md](../../foundation/DOMAIN_LAWS.md) — Law II (Memory provenance), Law IX (Memory decay), Law X (Wisdom not hardcoded)*
*Related: [AI_PLATFORM_ARCHITECTURE.md](../../blueprints/AI_PLATFORM_ARCHITECTURE.md) — AI subsystem implementation*
