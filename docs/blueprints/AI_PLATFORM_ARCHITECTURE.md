# Gunimi Blueprint — AI Platform Architecture v1.0

**Version:** 1.0
**Status:** Foundational — permanent
**Authority:** Gunimi Product Bible v1.0 · Gunimi Engineering Charter v1.0 · Workspace Principles · Workspace Contract v1.0 · Workspace Grammar v1.0 · Signal Engine Blueprint v1.1 · Business Memory Blueprint v1.1
**Applies to:** Every AI subsystem in Gunimi — present and future
**This document supersedes:** All informal AI architecture discussions, all feature-level AI proposals that contradict this document.

> *"The most powerful AI in a business product is the AI nobody notices. Not because it is hidden — but because it has become as natural as good judgement."*

---

## AI Platform Foundation — Implementation Status

| Dimension | Status |
|-----------|--------|
| **AI Platform Foundation** | COMPLETE |
| **Completed** | 11 July 2026 |
| **Architecture** | FROZEN |
| **Business Memory** | READY |

---

## Preface

Eleven foundational pillars now exist in the Gunimi architecture:

- Product Bible — why the product exists
- Engineering Charter — how engineering decisions are made
- Workspace Principles — what every Workspace contains
- Workspace Grammar — how every Workspace thinks
- Workspace Contract — what every Workspace must do
- Workspace Engine — how Workspaces are built
- Today Experience — how cross-entity intelligence is surfaced
- Deal, Contact, Company Workspace Blueprints — how the three foundational Workspace types apply all of the above
- Signal Engine Blueprint — what every business signal is and how it flows
- Business Memory Blueprint — what long-term intelligence is and how it accumulates

These eleven documents each define a specific layer of the product. None of them defines how all of these layers connect into a coherent AI Business Operating System.

This document does.

**The AI Platform Architecture is the map.** It does not replace any authority document — it integrates them. Every layer defined in those documents finds its position here. Every connection between layers is named here. Every boundary between subsystems is enforced here.

When a future AI feature is proposed — an AI assistant, a coordination agent, an intelligent email composer, a strategic planning module — this document is the authority that determines where it fits, what it is allowed to do, and where it must stop.

This document is written to outlive every specific AI model, every API, every framework. The architecture it defines is not tied to how AI works today. It is tied to what Gunimi fundamentally is: a Business Operating System where AI is infrastructure, not a feature.

---

## Chapter 1 — Mission

### What is the AI Platform?

The AI Platform is the complete architecture of how AI subsystems in Gunimi are organized, connected, governed, and constrained.

It is not a single service. It is not an API. It is not a model integration. It is the specification of how every layer of Gunimi that involves AI reasoning, AI memory, AI signal production, AI recommendation, or AI automation relates to every other layer — and what each layer is permitted to do.

The AI Platform has eleven layers, from raw business data at the base to autonomous agents at the horizon. Each layer has one responsibility. No layer duplicates another. No layer bypasses the layer below it. Every layer is auditable.

### Why does it exist?

Without architectural governance, AI features accumulate in the wrong way.

A recommendation feature is built independently. A memory feature is built independently. A signal detection feature is built independently. An automation feature is built independently. Over time, each feature develops its own concept of what "AI" means. Each one stores intelligence differently. Each one reasons differently. Each one explains itself (or does not) differently. The product has four AI features that the user experiences as inconsistent, contradictory, and untrustworthy.

The AI Platform exists to prevent this. It defines one architecture that every AI feature in Gunimi is built inside. The Signal Engine is one layer of that architecture. Business Memory is another. AI Core is another. When a new AI feature is proposed, it is not a new architecture — it is an extension of one of these defined layers, built according to the rules of that layer.

The result: the user experiences one coherent intelligence that gets better over time, rather than a collection of disconnected AI features that each solve one problem independently.

### Why Gunimi is not an AI chatbot

The chatbot model inverts the relationship between user and intelligence.

In a chatbot, the user must formulate the question. The user must know what to ask, when to ask it, and how to phrase it. The AI then responds. The quality of the output depends entirely on the quality of the input. If the user is tired, distracted, or does not know what they do not know — the chatbot is silent and useless.

Gunimi inverts this. Gunimi has already done the thinking. When the user opens Today, the priority is already identified. When the user opens a Deal Workspace, the recommended action is already prepared. When a relationship goes stale, the signal is already produced. When a commitment pattern is detected across contacts, the memory item is already formed.

The user never has to ask. The system has already answered.

This is not a chatbot. This is an intelligent infrastructure layer that operates continuously beneath every workflow. The difference between a chatbot and infrastructure is: a chatbot waits to be asked. Infrastructure thinks ahead.

The distinction has architectural consequences. A chatbot architecture is: request → model → response. A platform architecture is: event → signal → memory → reasoning → recommendation, all triggered by the state of the business rather than by user input.

Gunimi is built on a platform architecture. This document defines it.

### Why AI is a layer of the Business Operating System

In most products, AI is a feature. It lives in a specific place (an AI assistant panel, an AI-generated summary section, an AI chat button). Users interact with it explicitly. They feel they are "using AI."

In a Business Operating System, AI is a layer. It operates beneath every workflow. It is not located in one place — it is present in every place. Users do not feel they are "using AI." They feel they are using a business tool that is particularly intelligent.

The architectural implication: AI in Gunimi does not have a home in the navigation. There is no AI page, no AI section, no AI dashboard. AI exists in the intelligence that surfaces in Today, in the recommendations that appear in Decision cards, in the Memory that enriches Workspace context, in the Automation that executes approved intent.

The AI layer touches everything because intelligence is not separate from the product. It is the product.

This has a specific design rule: AI must never announce itself. The intelligence should be experienced as the system understanding the business — not as AI thinking about it.

---

## Chapter 2 — Platform Layers

The AI Platform has eleven layers. Each layer has a defined responsibility, defined inputs, defined outputs, and a defined boundary it must not cross.

The layers are described from base to surface — from raw data at the foundation to autonomous agents at the horizon.

---

### Layer 0 — Business Data

**What it is:** The raw substrate. Business entities — deals, contacts, companies, tasks, notes, emails, calendar events, activities — and the events that change them. This is not structured intelligence. It is the observed reality of a business's interactions and relationships.

**Responsibility:** Store business state. Reflect what has happened. Be the ground truth that every layer above it reads from.

**What it does NOT do:** Business Data does not evaluate itself. It does not produce signals. It does not form memories. It does not have opinions about its own urgency. It is inert data.

**Architecture note:** Every layer above Business Data reads it — but none of them modify it based on AI reasoning. AI cannot write to Business Data. Business Data is modified only by user actions (creating a deal, completing a task, sending an email) or by automated executions that the user has explicitly approved. This is a permanent constraint.

---

### Layer 1 — Workspace Engine

**What it is:** The structural framework for all Workspace types. The Engine provides the Grammar, the Contract, and the component system that every Workspace uses to answer the Five Questions (Situation, Decision, Preparation, Story, Context) in a consistent language.

**Responsibility:** Enforce Workspace structure, Grammar, and Contract compliance across all entity types. Provide the resolver architecture (decision → preparation → story → context) that transforms raw business data into structured Workspace intelligence.

**How it relates to AI:** The Workspace Engine is the presentation layer for AI outputs. When AI Core produces enriched context for a Workspace, the Workspace Engine's Decision Card, Situation section, and Preparation section are the surfaces that present it. The Engine does not reason — it presents. Reasoning happens in layers above.

**The resolver pattern is initially rule-based.** In Open Alpha, all resolvers produce their outputs from deterministic business logic: "if no activity in N days, produce stale signal." As Business Memory accumulates and AI Core integrates, resolver outputs will be enriched by AI-synthesized context — but the Engine itself never changes. The Intelligence layer (Layer 5) enriches what is presented; the Engine controls how it is presented.

---

### Layer 2 — Signal Engine

**What it is:** The single source of truth for every business signal in Gunimi. The Signal Engine defines every signal type, classifies signals by tier and severity, enforces deduplication, manages the signal lifecycle (produced → evaluated → claimed → suppressed → resolved → archived), and routes signals to exactly the surfaces that should receive them.

**Responsibility:** Ensure every business signal is produced once, classified correctly, routed to the right surface, suppressed when claimed, and retired when resolved. Maintain the Signal Archive, which is the permanent record of every signal ever produced.

**How it relates to AI:** The Signal Engine is the gateway between observed business conditions and AI reasoning. AI Core reads the Signal Archive — not raw Business Data. The Archive is the curated history of every condition that crossed the threshold of consequence. This curated history is the input set that AI Core uses to detect patterns, extract insights, and form Business Memory items.

AI Core can also produce signals — but only within the Signal Contract. An AI-produced signal must satisfy every field in the Signal Contract (type, tier, severity, confidence, evidenceKey, evidenceData, etc.). If it cannot, the signal does not exist in the Engine.

**The Archive is mandatory from Day 1.** Signal archival must be active at Open Alpha even though Business Memory (Layer 3) and AI Core (Layer 4) are post-Alpha capabilities. Without a Signal Archive built from Day 1 of user activity, there is no historical pattern data when AI Core is integrated. Day 1 signals are the seed of future intelligence.

---

### Layer 3 — Business Memory

**What it is:** The long-term intelligence layer. Business Memory is structured, queryable, institutional knowledge about business relationships, behaviors, patterns, and outcomes. It is NOT chat history. It is NOT notes. It is NOT the Signal Archive. It is the intelligence synthesized from all of these sources.

**Responsibility:** Accumulate, maintain, and serve long-term structured knowledge about entities. Detect patterns from the Signal Archive. Synthesize insights from user-authored notes and deal outcomes. Preserve institutional knowledge that survives individual employees and sessions.

**Seven memory types:**
- Commitment Memory (no decay)
- Relationship Pattern Memory (6-month decay)
- Preference Memory (no time decay — evolves on contradiction)
- Outcome Memory (permanent)
- Context Memory (12-month decay)
- Team Memory (24-month decay)
- Risk Memory (36-month decay)

**How it relates to AI:** Business Memory is both consumer and producer relative to AI Core. AI Core reads Business Memory when reasoning about a specific entity. AI Core writes to Business Memory when it extracts a new insight or detects a new pattern — but only within the Trust Boundary (Chapter 23 of the Business Memory Blueprint). Business Memory provides the context that elevates AI Core's reasoning from generic to specific: "What does this system already know about this entity?" is answered by Business Memory.

**The Memory Graph** is the conceptual framework for how memory items connect: to each other (corroborates, contradicts, merges_into, derived_from), to Signals (formed_from), to Workspace surfaces (informed_decision, surfaced_in_preparation), and to cross-entity relationships. AI Core reasons over this graph, not over isolated rows.

---

### Layer 4 — AI Core

**What it is:** The reasoning layer. AI Core is the analytical engine that reads from the Signal Archive and Business Memory, reasons about business conditions, extracts new insights, synthesizes patterns, produces enriched recommendations, and writes structured intelligence back to Business Memory.

**Responsibility:** Read, reason, synthesize, and produce. AI Core is the only layer that reasons. Every other layer either stores, routes, enforces, or presents — but does not reason. Reasoning is AI Core's exclusive responsibility and exclusive limitation.

**Position in the architecture:** AI Core is above Signal Engine and Business Memory (it reads from them) and below Workspace Intelligence and Today (which present AI Core's outputs). AI Core does not interact with users directly. It enriches the layers that do.

**What AI Core is permitted to do:**
- Read the Signal Archive
- Read Business Memory items
- Extract patterns from the Signal Archive (pattern = multiple archived signals sharing a type and entity suggesting a stable condition)
- Form Business Memory items within the Trust Boundary
- Evolve existing Memory items when new evidence changes their content
- Produce AI Signals within the Signal Contract
- Synthesize cross-entity insights from the Memory Graph
- Enrich Workspace Intelligence context panels
- Draft recommendations with evidence chains
- Draft communications (emails, follow-ups) for human review and approval

**What AI Core is never permitted to do:**
- Access raw Business Data directly (must go through Signal Archive)
- Store assumptions, sentiment, estimated motivations, or psychological conclusions (Trust Boundary)
- Make consequential decisions without human approval
- Produce signals that do not satisfy the Signal Contract
- Reason across permission walls
- Fabricate confidence or evidence
- Identify itself in user-facing output
- Bypass Business Memory and write conclusions directly to Workspace surfaces
- Execute actions without the Automation layer's approval workflow

**Post-Alpha:** AI Core integration begins after Open Alpha. The Signal Archive must contain sufficient historical data to make pattern detection meaningful. The first AI Core integrations are: Memory formation from Signal Archive patterns, and Workspace Intelligence enrichment (the AI Context Panel).

---

### Layer 5 — Workspace Intelligence

**What it is:** The entity-specific intelligence layer. Workspace Intelligence takes the outputs of Signal Engine, Business Memory, and AI Core and translates them into the Five Questions that every Workspace must answer (Situation, Decision, Preparation, Story, Context).

**Responsibility:** Produce the specific intelligence content that appears inside individual Workspace surfaces. The Situation section's content. The Decision card's recommendation and evidence sentence. The Preparation section's briefing items. This intelligence is entity-scoped: it describes the state of one specific deal, one specific contact, one specific company.

**Two modes of operation:**
- **Alpha mode (rule-based):** Workspace Intelligence is produced by deterministic resolvers in `lib/{entity}/decision.ts`, `lib/{entity}/preparation.ts`, `lib/{entity}/story.ts`, `lib/{entity}/context.ts`. These resolvers apply business logic rules to the entity's current state.
- **Phase 3 mode (AI-enriched):** Workspace Intelligence is enriched by AI Core synthesis, incorporating Memory, cross-entity insights, and pattern awareness. The resolver outputs are deepened by AI context that the rule-based resolvers cannot access. The AI Context Panel is the pre-loaded surface for this enrichment.

**What does not change between modes:** The Workspace Engine's structure, Grammar, and Contract. The Five Questions are answered in both modes. The Decision section always shows one recommendation. No AI labels appear. Natural language is always used. The mode of reasoning changes; the form of expression does not.

---

### Layer 6 — Today

**What it is:** The cross-entity intelligence layer. Today is the surface where intelligence about the entire business is assembled and prioritized for the current day. It draws from Signal Engine (for current active signals) and Business Memory (for relationship context) and presents the result as four ordered sections: Focus, Attention Required, Relationship Signals, Today's Work.

**Responsibility:** Answer one question for the entire business: "What does my business need from me in the next few hours?" Apply the priority algorithm (time proximity → value at risk → relationship depth → commitment age) across all entities and all signal tiers. Surface the single most important action first.

**What Today does NOT do:** Today does not own signals — it reads them from the Signal Engine. Today does not own intelligence — it presents it. Today does not create new intelligence — it synthesizes existing intelligence into a morning briefing. Today is the convergence surface, not a reasoning layer.

**Post-Alpha intelligence:** When AI Core is integrated, Today's intelligence deepens. The Focus card's recommendation can draw on Business Memory (relationship history, pattern detection, institutional knowledge) rather than only on current signals. Today's health statement can reflect synthesized understanding of the business state, not just current active signals.

---

### Layer 7 — Recommendations

**What it is:** The action layer. A Recommendation is the specific, actionable output of the AI Platform that is surfaced to the user. It is grounded in evidence, explains its reasoning in one sentence, and suggests one action.

**Responsibility:** Surface exactly one recommendation per Workspace and one recommendation (Focus) in Today. Every Recommendation is traceable to the evidence that produced it. Every Recommendation is overridable — the user is never compelled to follow one.

**Where Recommendations appear:** In the Decision Card of each Workspace. In the Focus card of Today. In the Attention Required section of Today (which are secondary recommendations, each less urgent than Focus).

**What a Recommendation is:** A Recommendation is the collapsed output of everything the AI Platform knows about a specific entity at a specific moment. The Signal Engine identified the condition. Business Memory provided context about the relationship. AI Core synthesized the recommendation. Workspace Intelligence formatted it. The Recommendation is the moment all of this becomes useful to the user.

**Recommendation lifecycle:** Produced by Workspace Intelligence or Today. Surfaced to the user. User acts on it (Recommendation drives an action) or dismisses it (signal is suppressed for the configured TTL). If dismissed and the condition persists, the signal may re-enter the pool after suppression expires.

---

### Layer 8 — Automation

**What it is:** The execution layer. Automation executes approved business actions — creating tasks, sending follow-ups, moving deal stages, scheduling meetings — without requiring the user to perform each step manually.

**Responsibility:** Execute approved actions reliably, traceably, and reversibly. Automation never executes a consequential action without explicit human approval or a pre-established automation rule that the user has explicitly configured.

**The trust gradient:** Automation earns autonomy gradually. First, the AI Platform prepares actions for human review (Phase 1). Then it recommends with high confidence that users consistently approve (Phase 2). Then users can establish automation rules for conditions they have approved many times (Phase 3). Automation at full autonomy is the product of years of earned trust, not an architectural assumption.

**What Automation must never do:** Execute an action without a traceable approval. Modify business data without leaving an audit record. Operate outside the scope the user has explicitly defined. Bypass the Signal Engine to surface the outcome of an automated action as if it were a new user action.

---

### Layer 9 — Autonomous Agents

**What it is:** The horizon layer. Autonomous Agents are coordination entities that can perform sequences of business actions on behalf of the user, within a defined scope, with a defined escalation path for situations that exceed their mandate.

**Current status:** Architectural specification only. Not an Alpha or Beta feature. Autonomous Agents are defined here to ensure that the layers below them — Automation, AI Core, Business Memory, Signal Engine — are built with agent readiness in mind. No implementation without explicit Product Bible authorization.

**What distinguishes Agents from Automation:** Automation executes a single approved action. An Agent executes a workflow — a sequence of related actions that together accomplish a business goal (e.g., "re-engage this relationship: identify the best outreach moment, draft the message, send it pending approval, record the outcome, update the memory"). Agents reason between steps. Automation does not.

**Architecture constraint:** Autonomous Agents must be built on top of all layers below them — using the Signal Engine for triggers, Business Memory for context, AI Core for reasoning, Automation for execution. They do not bypass any layer. An Agent that bypasses Business Memory is not a Gunimi Agent — it is an uncontrolled external process.

---

## Chapter 3 — Data Flow

The AI Platform processes every meaningful business event through a defined lifecycle. The lifecycle has nine stages. Each transition is governed by the layer responsible for it.

```
Business Event
      ↓ [1] WORKSPACE CAPTURE
Workspace
      ↓ [2] SIGNAL PRODUCTION
Signal Engine
      ↓ [3] SIGNAL ARCHIVAL
Signal Archive
      ↓ [4] AI EXTRACTION
AI Core
      ↓ [5] MEMORY FORMATION
Business Memory
      ↓ [6] INTELLIGENCE SYNTHESIS
Workspace Intelligence / Today
      ↓ [7] RECOMMENDATION
Decision Card / Focus Card
      ↓ [8] USER DECISION
Approval / Dismissal
      ↓ [9] EXECUTION
Automation → Outcome → New Business Event
```

### Transition 1 — Business Event → Workspace

A business event is any change to the state of a business entity: a deal stage changes, a task is completed, an email is sent, a meeting is recorded, a note is added, a contact is created. The Workspace captures this event as part of the entity's context.

The Workspace does not evaluate whether this event is significant. It stores. Evaluation happens in the Signal Engine. The Workspace's role in this transition is to maintain the current state of the entity so the Signal Engine can read it.

### Transition 2 — Workspace → Signal Engine

The Signal Engine continuously evaluates business entities against defined thresholds. When a threshold is crossed — a deal goes N days without activity, a proposal goes unanswered for M days, a task becomes overdue — the Signal Engine produces a signal.

Signal production is the moment of classification: this condition is Tier 1 or Tier 2, critical or warning, high confidence or medium confidence. This classification is permanent for the lifetime of the signal. It cannot be changed after production.

The Signal Engine also evaluates deduplication: if a signal for this condition and this entity already exists in the active pool, the existing signal is updated rather than a new one created.

### Transition 3 — Signal Engine → Signal Archive

Every resolved signal is archived. The Archive is permanent. It is the historical record of every business condition that crossed the threshold of consequence in this workspace.

Archival is the bridge between the real-time intelligence layer (Signal Engine) and the long-term intelligence layer (Business Memory). The Archive is what AI Core reads. Without the Archive, AI Core has no history. Without history, there are no patterns. Without patterns, Business Memory cannot form.

The Archive must be active from Open Alpha Day 1, even though AI Core is a post-Alpha capability. Building the Archive early means that when AI Core is integrated, it finds a rich history to reason over — not an empty one.

### Transition 4 — Signal Archive → AI Core

AI Core reads the Signal Archive to detect patterns. A pattern is a signal type recurring for the same entity multiple times, or the same signal type recurring across multiple entities of the same type, or a sequence of signal types that consistently co-occur.

AI Core does not read raw Business Data. The Archive is its input. The Archive is a curated, consequence-filtered view of business history — it contains only what crossed the threshold of significance. This curation is what allows AI Core to reason efficiently rather than processing every minor event.

### Transition 5 — AI Core → Business Memory

When AI Core detects a pattern or extracts an insight from the Signal Archive, it evaluates whether this insight is Memory-eligible. The Trust Boundary (Business Memory Blueprint Chapter 23) determines eligibility:

- Can the insight name a specific, observable fact?
- Can it point to at least one source record?
- Is it currently true — not predicted, not estimated, not assumed?
- Is it the kind of statement a business professional would accept as a factual briefing?

If yes to all: a Memory item is formed. If any answer is no: no Memory item is created. Memory items are never formed from inference alone.

### Transition 6 — Business Memory → Workspace Intelligence / Today

When a user opens a Workspace or Today, the intelligence layer reads Business Memory for the relevant entities. Memory provides the context that elevates Workspace Intelligence from "what the resolver knows" to "what the system has learned over time."

In Alpha mode (rule-based resolvers), this transition is not yet active — resolvers read Business Data directly. In Phase 3 (AI-enriched), this transition provides the AI Context Panel: a pre-loaded synthesis of Memory, current signals, and relationship history, assembled before the user opens the Workspace.

### Transition 7 — Workspace Intelligence → Recommendation

Workspace Intelligence collapses the full context — current signals, Memory, relationship history, priority algorithm — into one recommendation. The Recommendation is the moment the intelligence is made actionable.

The Recommendation must satisfy three constraints: it names one specific action, it explains the action with one sentence of specific evidence, and it can be traced to its sources. A Recommendation that cannot be traced is not a Recommendation — it is an assertion.

### Transition 8 — Recommendation → User Decision

The user sees the Recommendation. They have three responses:

1. **Follow:** The user acts on the Recommendation. This outcome is recorded (the action completes, the entity state changes, the signal resolves).
2. **Dismiss:** The user deliberately dismisses the Recommendation. The signal is suppressed for the configured TTL (24h, 7d, or until-reset). If the condition persists after the TTL, the signal re-enters the active pool.
3. **Ignore:** The user leaves the Workspace without interacting with the Recommendation. The signal remains active and surfaces again on the next session.

Human decision is always required before execution. There is no path from Recommendation to Execution that bypasses the user.

### Transition 9 — Execution → New Business Event

Automated execution (or user-initiated action following a Recommendation) changes the state of a business entity. This change is a new Business Event. The lifecycle begins again.

The circular nature of this architecture is intentional. Every Outcome produces new data, which produces new Signals, which accumulates in the Archive, which AI Core reads, which enriches Memory, which informs future Recommendations. The system gets smarter as the business accumulates history.

This is the compound intelligence effect: a workspace with 3 years of history produces materially better Recommendations than one with 3 weeks of history — not because the rules changed, but because the Memory layer has accumulated the knowledge to enrich them.

---

## Chapter 4 — Ownership

For each subsystem, this chapter defines: who owns it, what goes in, what comes out, what it depends on, who consumes it, who produces for it, and what it is forbidden from doing.

---

### Business Data

| Dimension | Definition |
|-----------|-----------|
| **Owner** | Supabase data layer — structured by entity type (deals, contacts, companies, tasks, notes, emails) |
| **Inputs** | User actions, automated executions (with approval), imports, email/calendar sync |
| **Outputs** | Typed entity records, event streams, interaction history |
| **Dependencies** | None — foundational layer |
| **Consumers** | Workspace Engine, Signal Engine resolvers, Memory formation (via Signal Archive, not directly) |
| **Producers** | Users, approved Automation, email/calendar sync engines |
| **Forbidden responsibilities** | AI reasoning, signal classification, recommendation production, pattern detection |

---

### Workspace Engine

| Dimension | Definition |
|-----------|-----------|
| **Owner** | Engineering — certified frozen in `docs/certification/WORKSPACE_ENGINE_V1_CERTIFIED.md` |
| **Inputs** | Pre-translated strings from View components; data from Resolver layer |
| **Outputs** | Rendered Workspace surfaces (Situation, Decision, Preparation, Story, Context tabs) |
| **Dependencies** | Business Data (via Resolvers), Workspace Grammar, Workspace Contract |
| **Consumers** | Users (directly — this is the presentation layer) |
| **Producers** | Entity resolvers (`lib/{entity}/decision.ts`, `lib/{entity}/preparation.ts`, etc.) |
| **Forbidden responsibilities** | Entity-specific logic, AI reasoning, signal classification, business data access, memory reads |

---

### Signal Engine

| Dimension | Definition |
|-----------|-----------|
| **Owner** | Signal Engine Blueprint — `docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md` |
| **Inputs** | Entity state (from Business Data), AI Core signal candidates, user-produced signals (post-Alpha) |
| **Outputs** | Active signal pool, Signal Archive, claimed signals per consumer, suppression state |
| **Dependencies** | Business Data, Signal Contract (15 fields every signal must satisfy) |
| **Consumers** | Today (Focus, Attention, Relationship Signals), Workspace Situation, Workspace Decision, Business Memory Archive reader (AI Core) |
| **Producers** | Deal Resolver, Contact Resolver, Company Resolver, Task Engine, Email Engine, AI Core (post-Alpha), User (post-Alpha) |
| **Forbidden responsibilities** | Reasoning about why a signal exists, storing long-term patterns, producing recommendations, displaying UI |

---

### Business Memory

| Dimension | Definition |
|-----------|-----------|
| **Owner** | Business Memory Blueprint — `docs/blueprints/BUSINESS_MEMORY_BLUEPRINT.md` |
| **Inputs** | Signal Archive (via AI Core pattern extraction), user-authored notes, deal outcomes, user corrections |
| **Outputs** | Memory items (typed, confidence-rated, versioned, provenance-linked), Memory Graph (conceptual), Memory Signals (Tier 4, post-Alpha) |
| **Dependencies** | Signal Archive, AI Core (for extraction), user notes system |
| **Consumers** | AI Core (reads Memory when reasoning), Workspace Intelligence (Preparation section, Situation context), Today (relationship context enrichment) |
| **Producers** | AI Core (primary, post-Alpha), Users (corrections, manual entries, highest trust) |
| **Forbidden responsibilities** | Real-time signal production, direct workspace recommendation, user-facing browsing interface (v1.0 is invisible infrastructure), storing Trust Boundary violations |

---

### AI Core

| Dimension | Definition |
|-----------|-----------|
| **Owner** | `lib/ai/` — AI agents, context builders, execution, OpenAI provider integration |
| **Inputs** | Signal Archive, Business Memory items, Memory Graph relationships, Workspace context (entity state), cross-entity relationship data |
| **Outputs** | Business Memory items (formed within Trust Boundary), AI Signals (within Signal Contract), Workspace Intelligence enrichments (AI Context Panel), draft recommendations, draft communications |
| **Dependencies** | Signal Engine (Archive access), Business Memory (read/write), Workspace Engine (presentation layer for its outputs) |
| **Consumers** | Business Memory layer (receives AI Core formation), Workspace Intelligence (receives AI Context Panel), Today (receives AI-enriched briefing) |
| **Producers for AI Core** | Signal Archive, Business Memory, user correction events |
| **Forbidden responsibilities** | Direct Business Data writes, bypassing Signal Engine, Trust Boundary violations, consequential action execution without approval, user-facing AI identification |

---

### Workspace Intelligence

| Dimension | Definition |
|-----------|-----------|
| **Owner** | Entity resolver layer — `lib/{entity}/` — constrained by Workspace Contract and Grammar |
| **Inputs** | Business Data (via entity queries), Signal Engine active pool, Business Memory (Phase 3), AI Core Context Panel (Phase 3) |
| **Outputs** | Situation content, Decision recommendation, Preparation items, Story events, Context sections — all as locale-key objects for translation |
| **Dependencies** | Workspace Engine (presentation), Signal Engine (signal routing), Business Memory (Phase 3 enrichment) |
| **Consumers** | Users (via Workspace Engine presentation) |
| **Producers** | Deterministic resolvers (Alpha), AI Core-enriched resolvers (Phase 3) |
| **Forbidden responsibilities** | Producing signals outside the Signal Engine, bypassing Workspace Grammar (e.g., showing multiple recommendations), storing intelligence directly (Memory layer's responsibility) |

---

### Today

| Dimension | Definition |
|-----------|-----------|
| **Owner** | Today Experience Blueprint — `docs/blueprints/TODAY_EXPERIENCE_BLUEPRINT.md`, `lib/today/` |
| **Inputs** | Active signals from Signal Engine (all tiers and entity types), Business Memory (relationship context, Phase 3), task data (Work section) |
| **Outputs** | Focus card (one recommendation), Attention Required (up to five secondary signals), Relationship Signals (degraded relationship health), Today's Work (due tasks) |
| **Dependencies** | Signal Engine (for active signals), Business Data (for task due dates), Business Memory (Phase 3 enrichment) |
| **Consumers** | Users (directly — morning briefing surface) |
| **Producers** | Signal Engine (all entity types contribute), Task Engine |
| **Forbidden responsibilities** | Owning signals (Signal Engine owns them), producing new intelligence (read-only consumption), storing anything (all state lives in Signal Engine and Business Data) |

---

### Recommendations

| Dimension | Definition |
|-----------|-----------|
| **Owner** | Decision layer — produced by Workspace Intelligence and surfaced by Workspace Engine / Today |
| **Inputs** | Signal Engine active pool (via Workspace Intelligence or Today priority algorithm), Business Memory context |
| **Outputs** | Typed recommendation (action, evidence sentence, reasoning) surfaced in Decision Card or Focus Card |
| **Dependencies** | Signal Engine, Workspace Intelligence, Workspace Grammar (one recommendation per surface) |
| **Consumers** | Users (direct — actionable output) |
| **Producers** | Workspace Intelligence (entity-scoped), Today (cross-entity scoped) |
| **Forbidden responsibilities** | Execution (Automation's responsibility), memory formation (Memory's responsibility), signal production (Signal Engine's responsibility) |

---

### Automation

| Dimension | Definition |
|-----------|-----------|
| **Owner** | Automation Engine — `lib/automation/` |
| **Inputs** | Approved Recommendations, user-configured automation rules, workflow trigger conditions |
| **Outputs** | Executed actions (task creation, email dispatch, stage changes, etc.) → new Business Events |
| **Dependencies** | User approval (required for every consequential action), Recommendation layer (approved Recommendations are the primary input), Business Data (target of executed actions) |
| **Consumers** | Business Data layer (Automation writes outcomes back) |
| **Producers** | Users (approved actions), user-configured rules, future AI approval workflow |
| **Forbidden responsibilities** | Reasoning (AI Core's responsibility), signal production (Signal Engine's responsibility), executing without traceable approval, modifying Business Memory directly |

---

## Chapter 5 — AI Core

### What AI Core is

AI Core is the reasoning engine. It is the only layer in the architecture that synthesizes — that takes multiple inputs, reasons about their relationships, and produces new intelligence that was not present in any single input.

Every other layer stores, routes, enforces, presents, or executes. AI Core alone reasons.

This concentration of reasoning authority in one layer is not a technical constraint. It is a design decision with accountability consequences: if AI reasoning is wrong, we know exactly where to look. If AI reasoning improves, every layer that consumes AI Core's outputs improves. Centralized reasoning means centralized accountability and centralized improvement.

### Responsibilities

**Pattern detection:** AI Core reads the Signal Archive to identify recurring conditions. "This contact type consistently shows a `customer_silent` signal 45 days after a proposal is sent" is a pattern detectable from the Signal Archive. Patterns become the input for Memory formation.

**Memory formation:** When AI Core detects a pattern or extracts an insight that meets the Trust Boundary criteria, it forms a Business Memory item. The Memory item is structured, versioned, and provenanced — it knows which signals contributed to it, who last updated it, and what version it currently is.

**Memory evolution:** When new evidence arrives that is consistent with an existing Memory item, AI Core reinforces it (updates confidence, adds evidence). When new evidence contradicts an existing Memory item, AI Core flags the contradiction for resolution (creating a `contradicts` edge in the Memory Graph) — never silently overwriting prior intelligence.

**Cross-entity synthesis:** AI Core reads the Memory Graph to detect relationships between memory items across entities. A Contact Memory ("Maria Chen prefers morning outreach") and a Deal Memory ("Acme Corp decisions require 60-day lead time") may combine into a Workspace Intelligence enrichment that AI Core produces when the user is about to outreach to Maria about an Acme deal.

**Workspace Intelligence enrichment (Phase 3):** AI Core pre-populates the AI Context Panel in each Workspace before the user opens it. The Context Panel is a synthesis of: current active signals, relevant Memory items, relationship history, and one suggested next action grounded in evidence. This synthesis happens asynchronously — not on demand.

**Signal production:** AI Core can produce signals within the Signal Contract. An AI-produced signal must have: a specific signal type, a specific entity, a tier assignment, a severity, a confidence level, named evidence with a locale key, and a resolution condition. Without all of these, the signal is not created. AI-produced signals are tagged with `producedBy: ai_core`.

**Draft communications (Phase 3+):** AI Core can draft email follow-ups, meeting briefs, and similar communications for human review. These drafts are not sent — they are prepared and surfaced for user approval.

### What AI is allowed to do

AI Core is allowed to:

- Observe patterns in archived signals
- Form memory from observable evidence
- Synthesize intelligence from the Memory Graph
- Produce signals within the Signal Contract
- Enrich Workspace Intelligence with synthesized context
- Draft recommendations with evidence chains
- Draft communications for human approval
- Adjust confidence levels as evidence accumulates
- Evolve Memory items when new evidence arrives

### What AI must never do

AI Core must never:

- Store assumptions without named observable evidence
- Store sentiment, emotional assessments, or tone interpretations
- Store estimated motivations ("pushing to make quota") or inferred intentions
- Store psychological conclusions about contacts
- Store probabilistic statements as facts ("73% likely to close")
- Reason across permission walls (a user cannot access entity X → AI cannot reason about X for that user)
- Make consequential decisions without human approval
- Execute any action (execution belongs to Automation)
- Identify itself in user-facing surfaces
- Produce signals that do not satisfy every field of the Signal Contract
- Write directly to Business Data (the user is the only agent that writes business facts)
- Bypass the Signal Engine to surface raw AI analysis in Workspace surfaces
- Second-order infer (A is inferred from B, B is inferred from C — A may not be stored as Memory)

These prohibitions are enforced by the Trust Boundary (Business Memory Blueprint Chapter 23) at creation time, not by a filter after creation. A reasoning output that violates the Trust Boundary is discarded, not quarantined.

### How AI reasons

AI Core reasons from the specific to the general, then from the general back to the specific.

**Specific → General (pattern detection):** AI Core observes individual signals ("deal stale after 14 days with this contact type"), groups them into patterns ("deals with procurement-led companies consistently stale after 12-16 days"), and generalizes into Memory ("this company type requires proactive check-ins at the 10-day mark").

**General → Specific (recommendation enrichment):** When a new situation arises, AI Core applies the generalized pattern to the specific situation ("Marcus from Procurement Corp has not responded in 11 days — based on memory of similar companies, outreach now is the highest-value action").

This bidirectional reasoning is what makes AI Core's output feel like institutional knowledge rather than generic rules. The generalization was earned from specific evidence. The specific recommendation is grounded in the generalization.

**Reasoning from evidence, not probability:** AI Core does not assign confidence levels based on model probability estimates. Confidence is assigned based on evidence density:
- `observed`: multiple direct interactions confirm the fact
- `stated`: a user explicitly confirmed or wrote the fact
- `inferred`: evidence supports the conclusion but without direct confirmation
- `uncertain`: early signal, not surfaced, held for reinforcement

### How AI consumes Signals

AI Core does not consume live signals. It consumes the Signal Archive.

The distinction: live signals are consumed by Today and Workspace surfaces. The Archive is consumed by AI Core. This separation means AI Core reasoning does not interfere with real-time signal routing, and real-time signal routing does not depend on AI Core being available.

When AI Core reads the Archive, it reads the complete history of a signal type for a given entity: when it was produced, what evidence it named, what tier and severity it carried, how long it was active, when it was resolved, what the resolution condition was. This full lifecycle context is what enables pattern detection — not just the presence of a signal, but its timing, frequency, and resolution trajectory.

### How AI consumes Memory

When AI Core enriches Workspace Intelligence, it reads the Memory items associated with the relevant entities and the Memory Graph relationships between them.

Memory is consumed by AI Core in order of trust level: `stated` Memory (directly confirmed by users) is weighted higher than `inferred` Memory (AI-extracted without user confirmation). `observed` Memory (multiple direct interaction confirmations) is weighted higher than `inferred` but below `stated` because direct user confirmation supersedes even dense observational evidence.

AI Core never overwrites a `stated` Memory item with a new extraction. A user who corrected a Memory item to `stated` has the highest trust level — AI Core may reinforce the item with new evidence, but cannot contradict a `stated` fact without creating a `contradicts` edge that surfaces for user resolution.

### How AI explains itself

Every AI Core output must be self-explaining. The explanation exists in the data structure, not in a separate explanation layer.

For a Memory item: the `provenance` array names every source — which signals contributed, when they were produced, which notes were referenced. The explanation of why a Memory item exists is the provenance.

For a Signal produced by AI Core: the `evidenceKey` and `evidenceData` name the specific observable fact. The explanation of why the signal was produced is the evidence.

For a Recommendation enriched by AI Core: the evidence sentence is the explanation. "I'd schedule a morning call — Maria has responded to all 8 outreach emails but declined 3 phone requests, and her last confirmed call was at 9am."

**Every AI output must pass the explainability test (from Signal Engine Blueprint Chapter 21, extended to AI Core outputs):**
- Why? — The evidence sentence or provenance chain
- When? — The timestamp of the triggering event or pattern detection
- From what? — The specific source records (evidenceIds, signalIds)
- Evidence? — The named, observable, specific facts
- Confidence? — The confidence level and the evidence density that produced it
- What changed? — The new information that caused this output
- How can it disappear? — The resolution condition or correction that would retire it

---

## Chapter 6 — Intelligence

Gunimi produces intelligence at five distinct levels. Each level answers different questions, operates at different scope, and feeds the levels above it.

---

### Workspace Intelligence

**What it is:** Entity-specific, present-tense intelligence about a single business entity (one deal, one contact, one company). Workspace Intelligence answers the Five Questions for a specific entity at a specific moment.

**Scope:** One entity.

**Time horizon:** Present (Situation, Decision, Preparation) and past (Story). Not predictive.

**Sources:** Business Data (current entity state), active signals from Signal Engine (Situation layer), Business Memory (Phase 3 enrichment for Decision and Preparation depth).

**How it appears to the user:** Inside Workspace tabs — the Situation section observes current conditions, the Decision card recommends one action, the Preparation section assembles supporting context, the Story section narrates the entity's history, the Context section maps connections.

**What makes it intelligent:** The resolver logic that evaluates entity state and produces typed action recommendations. In Phase 3, Memory enrichment deepens the recommendation with context that rule-based resolvers cannot access.

---

### Relationship Intelligence

**What it is:** People-centric intelligence about the health, depth, and trajectory of business relationships. Relationship Intelligence answers: "Who needs my attention, and why?"

**Scope:** Cross-entity (one person or company relative to the entire business).

**Time horizon:** Present (current relationship health) and historical (relationship depth, interaction frequency, outcome patterns).

**Sources:** Contact and Company Workspace Intelligence (activity signals), Business Memory (Relationship Pattern Memory, Preference Memory, Commitment Memory for the relationship), Signal Archive (historical staleness, re-engagement, communication patterns).

**How it appears to the user:** In Today's Relationship Signals section (cross-entity relationship health degradation). In Contact Workspace Situation (this specific relationship's current health). In Business Memory Preparation items (relationship context assembled before an action).

**What makes it intelligent:** The combination of current signal state (is the relationship active today?) with Memory depth (what has this relationship looked like over 18 months?). A relationship that went quiet for 3 weeks in a pattern of quarterly check-ins is not alarming. A relationship that went quiet for 3 weeks in a pattern of weekly contact is a signal. Relationship Intelligence requires Memory to distinguish between these.

---

### Business Intelligence

**What it is:** Pipeline-level and portfolio-level intelligence about the business's opportunities, revenues, and deal health. Business Intelligence answers: "What is happening across my entire pipeline?"

**Scope:** Business-wide (all deals, all companies, across the full pipeline).

**Time horizon:** Present state (current pipeline health, approaching close dates) with historical context (conversion patterns, deal velocity, outcome history).

**Sources:** Deal Workspace Intelligence (aggregated across all deals), Signal Engine (Tier 1 signals from all deals), Outcome Memory (historical deal outcomes by company type, deal size, stage).

**How it appears to the user:** In Today's Focus and Attention sections (the highest-priority pipeline signal for today). In future pipeline views that are enriched by Outcome Memory patterns. In role-aware Business Intelligence (Phase 5) where a CEO sees strategic risk and a salesperson sees next actions.

**What makes it intelligent:** Not just "which deals have signals" but "which signals, given the history of similar deals, represent genuine risk versus expected patterns." A deal going quiet at the negotiation stage may be normal for this deal type (Outcome Memory knows this). Business Intelligence applies that historical context to current signals.

---

### Operational Intelligence

**What it is:** Task-level and coordination-level intelligence about who is doing what, when it is due, and where work is blocked or duplicated. Operational Intelligence answers: "Is the work getting done?"

**Scope:** User-scoped (this user's tasks and commitments) with team-aware extension (Phase 4).

**Time horizon:** Present (tasks due today) and very near-future (tasks due this week, approaching commitments).

**Sources:** Task data (due dates, completion, assignment), Commitment Memory (tracked commitments from notes and email), Signal Engine Tier 3 signals (task overdue, blocked work).

**How it appears to the user:** In Today's Work section. In Workspace Work tabs. In Commitment Memory items that surface as Preparation when the Decision is "address this commitment."

**What makes it intelligent:** The distinction between a task due today (database query) and a commitment due today (Memory + Signal extraction). A user who said "I'll get that to you by Thursday" in a meeting note has created a Commitment Memory item that has a deadline — even without creating a task. Operational Intelligence recognizes both.

---

### Strategic Intelligence

**What it is:** Long-term, cross-entity intelligence about patterns, institutional knowledge, and organizational capabilities. Strategic Intelligence answers: "What has this business learned over time?"

**Scope:** Institutional (across all entities, all time, all relationships).

**Time horizon:** Historical (accumulated knowledge) with forward-relevance (applied to current situations).

**Sources:** Business Memory (all memory types, especially Outcome Memory and Risk Memory), Memory Graph (cross-entity relationships), Signal Archive (long-term pattern data).

**How it appears to the user:** As enriched context in Preparation items ("This company type typically requires 60 days for legal review — based on 4 previous deals"). As proactive warnings ("3 similar deals were lost after going quiet at this stage — this one has been quiet for 11 days"). As institutional briefings when new team members take over a relationship.

**What makes it intelligent:** Strategic Intelligence is the layer that makes Gunimi irreplaceable. It is the accumulated knowledge of the organization, preserved in Business Memory, applied to new situations. This intelligence cannot be replicated by a competing product that does not have the history. The longer a business uses Gunimi, the richer its Strategic Intelligence becomes.

**Open Alpha status:** Strategic Intelligence is a Phase 3+ capability. The Signal Archive must accumulate 6-12 months of history before pattern detection becomes meaningful. The Memory layer must have sufficient confirmed Memory items before cross-entity synthesis is reliable. Strategic Intelligence is the long-term value proposition, not an Alpha feature.

---

## Chapter 7 — Explainability

Every AI conclusion in Gunimi must be explainable. Not eventually explainable — explainable by design, from the data structures that produce it.

Explainability is not a feature. It is a constraint on every layer of the AI Platform. No output may be produced that cannot be explained. An unexplainable output is an invalid output.

---

### Evidence Chain

The evidence chain answers: "What was observed?"

Every AI output traces back to observable events. The chain runs from the output back through every reasoning step to the specific, observable, named source.

```
Memory Item ("Maria prefers morning outreach")
  ← formed_from: note_id:n_089 ("Maria confirmed morning preference")
  ← reinforced_by: signal_id:sig_4821 (customer_silent signal — observed morning recovery)
  ← reinforced_by: signal_id:sig_4903 (communication_pattern signal — 34 morning responses)
```

The evidence chain must be complete. A Memory item without provenance is a Memory item that cannot be explained — and therefore cannot be trusted.

**Implementation requirement:** Every Memory item carries a `provenance` array. Every item in the array names a specific source record, a specific date, and the contribution type (created, reinforced, evolved, merged). Provenance is append-only.

---

### Decision Chain

The decision chain answers: "Why was this recommendation made?"

Every Recommendation traces back through the priority algorithm, the signal that drove it, and the evidence that produced the signal.

```
Recommendation ("Schedule a morning call with Maria — she prefers mornings")
  ← driven_by: signal_id:sig_5201 (customer_silent — 18 days)
  ← enriched_by: memory_id:m_771 ("Maria prefers morning outreach")
  ← evidence: "18 days without response; last response was at 9am"
```

The decision chain makes the Recommendation auditable. A user who asks "why did you recommend this?" can see: the signal that triggered it, the Memory that enriched it, and the specific facts that produced both.

---

### Memory Chain

The memory chain answers: "How did this knowledge form?"

Business Memory items accumulate through versions. The version history records every change: what the Memory said at v1.0, who changed it at v2.0, what evidence caused the change.

```
Memory Item m_771 version history:
  v1.0 — AI Core extraction — "Maria tends to respond in the morning" — confidence: uncertain
  v1.1 — AI Core reinforcement — same content — confidence: inferred (11 interactions)
  v2.0 — User correction — "Maria confirmed morning preference, prefers 8-10am calls" — confidence: stated
  v2.1 — AI Core reinforcement — same content — confidence: observed (34 interactions)
```

The memory chain enables the audit question: "What did we know about this entity at any point in time?" It also enables trust calibration: Memory items that have been user-corrected multiple times may indicate systematic AI extraction errors for a specific entity type.

---

### Signal Chain

The signal chain answers: "How did this condition come to our attention?"

Every signal was produced at a specific moment, by a specific producer, based on a specific evidence condition.

```
Signal sig_5201 (customer_silent):
  producedAt: 2026-07-01T08:00:00Z
  producedBy: contact_resolver
  evidenceKey: "signals.customer_silent.evidence"
  evidenceData: { contactName: "Maria Chen", daysSinceLastInteraction: 18, dealName: "Acme Q3" }
  tier: 2
  severity: warning
  confidence: high
```

The signal chain enables the audit question: "When did this condition first reach our attention, and why?" It is the record that proves the system was tracking the right things at the right time.

If a signal evolved (Signal Evolution — Signal Engine Blueprint Chapter 19), the evolution history records the state at each stage: when it escalated from `warning` to `critical`, what triggered the escalation, what evidence was added.

---

### Automation Chain

The automation chain answers: "What action was taken, when, and on whose authority?"

Every automated action is traceable to the Recommendation it executed, the user approval that authorized it, and the specific record changes it produced.

```
Automation Record auto_3310:
  executedAt: 2026-07-02T09:14:22Z
  triggeredBy: recommendation_id:rec_8821
  authorizedBy: user_action (explicit approval at 09:14:19Z)
  action: create_task
  params: { title: "Follow up with Maria", dueDate: "2026-07-03", entityId: "contact_maria" }
  outcome: task_id:t_4412 created
```

The automation chain makes every action reversible-by-audit: the user can see exactly what was done, when, and why. For enterprise deployments, this chain is the compliance record that proves no action was taken without authorization.

---

## Chapter 8 — Trust Model

Trust is the foundational premise of the AI Platform. Not trust as a sentiment — trust as an architectural property: the system earns the right to autonomy gradually, in proportion to the evidence that its judgements are correct.

---

### User Authority

Users have absolute authority over every layer of the AI Platform.

**Corrections supersede everything.** A user who corrects a Business Memory item produces the highest-trust update in the system. AI Core's subsequent reasoning is constrained by that correction. The correction is `stated` confidence — the highest level — and `updatedBy: user` is the permanent record.

**Dismissals are respected.** A user who dismisses a signal suppresses it for the configured TTL. The system does not re-surface the same signal in a different form to work around the dismissal.

**Overrides are unconditional.** Any Recommendation can be ignored. Any automated action can be reversed. Any Memory item can be deleted. The user is always in control and the system never resists.

**Permission walls are absolute.** If a user does not have permission to access entity X, AI Core does not reason about entity X for that user. No cross-permission inference. No "I noticed something about a deal you can't see." Permissions are the boundary of AI reasoning scope.

---

### AI Authority

AI Core's authority is epistemic only — it is permitted to reason, to recognize, to recommend. It is never permitted to decide or to act.

The distinction: a Recommendation from AI Core is an observation about the current state of the business and a suggested action. The human decides whether to follow the suggestion. Until the human decides, nothing happens.

AI Core's authority increases with the quality of its track record. As users consistently approve certain Automation rules, as Memory items prove reliable over time, as Recommendations are followed and produce good outcomes — the trust basis grows. This is how Automation v2.0 earns its expanded scope: not through feature design, but through demonstrated accuracy over time.

---

### Confidence Model

| Level | Meaning | Surfaced when |
|-------|---------|--------------|
| `high` | Evidence is dense and consistent; decision layer eligible | All surfaces, including Decision/Focus |
| `medium` | Evidence supports the conclusion but is not dense | Situation layer and informational surfaces only |
| `low` | Early signal; evidence is weak | Not surfaced; held for reinforcement |
| `uncertain` | AI Core initial extraction; not yet reinforced | Not surfaced; held in Memory at `uncertain` |

Confidence is a statement about evidence density, not about AI model probability. This distinction is critical for user trust: a confidence level based on observable evidence is honest. A confidence level based on a model's internal probability estimate is opaque.

When evidence is insufficient, the system says so. "Limited history available — add more interaction history to improve this assessment" is a more trustworthy surface than a fabricated confidence level.

---

### Human Override

Every layer of the AI Platform has a defined override mechanism.

| Layer | Override mechanism |
|-------|------------------|
| Recommendation | Dismiss (TTL-suppressed) or ignore (signal remains active) |
| Business Memory | User correction (highest trust, creates v2.0 of the Memory item) |
| Signal | User dismissal (24h/7d/until-reset suppression) |
| Automation | Cancel before execution, reverse after execution |
| AI Context Panel | Close or dismiss (will not re-appear until next major entity change) |

Override is not failure. It is the expected behavior of a system that recommends rather than commands. Every override is a data point: if a specific Recommendation is consistently overridden, the underlying signal threshold may need calibration.

---

### Correction

User corrections to Business Memory are the highest-value input the AI Platform receives.

When a user corrects a Memory item — "Maria is NOT the decision-maker, it's her manager John" — the correction:
1. Creates a new version (v2.0) of the Memory item with `updatedBy: user` and `confidence: stated`
2. Records the correction as a provenance entry with `contribution: corrected`
3. Potentially flags related Memory items that may be derived from the corrected one
4. Informs AI Core that the previous extraction was incorrect — influencing future extraction for similar entity types

Corrections are never lost. They are part of the version history. A Memory item that was corrected by a user carries that correction permanently.

---

### Approval

Before any consequential action is executed, explicit human approval is required.

**Consequential actions:**
- Sending any external communication (email, message)
- Moving a deal to a new stage
- Creating a public-facing task on behalf of another user
- Deleting or archiving a business entity
- Executing a workflow that involves multiple steps

**Non-consequential actions** that may be automated without per-instance approval:
- Creating a task for the current user (if the user has configured this automation rule)
- Updating a field value that the user has defined as auto-updatable
- Producing a draft that the user must explicitly send

The approval model evolves with trust. At Alpha, all consequential actions require explicit approval. As automation rules are established and the system demonstrates accuracy, the approval threshold lowers — but only for specific, user-defined action types. General autonomy is never granted wholesale.

---

### Auditability

Every output of the AI Platform is permanently auditable.

**What can be audited:**
- Any Memory item → full provenance chain, full version history
- Any Signal → full lifecycle record (produced, claimed, suppressed, resolved, archived)
- Any Recommendation → the signal that drove it, the Memory that enriched it, the evidence sentence
- Any Automation execution → the Recommendation it executed, the approval that authorized it, the record changes it produced
- Any AI Core extraction → the Signal Archive records it read, the Memory items it produced, the Trust Boundary evaluation it performed

**Who can audit:** Workspace owners, workspace admins, and enterprise deployment administrators.

**Enterprise requirements:** Enterprise customers in regulated industries will require the full audit trail as a deployment prerequisite. The architecture builds this from Day 1 — not as a compliance add-on, but as an intrinsic property of every AI Platform layer. Provenance in Memory, evidence in Signals, traceable Recommendations, approved Automation: these are the building blocks of enterprise-grade auditability.

---

## Chapter 9 — Observability

Observability is how the engineering team knows the AI Platform is working correctly. It is distinct from Explainability (how users know what the AI Platform concluded) and from Auditability (how administrators review AI actions). Observability is the internal health monitoring layer.

---

### Signal Observability

**What to monitor:**
- Signal production rate per signal type (is the Signal Engine producing at expected frequency?)
- Signal resolution rate (are signals being resolved or accumulating indefinitely?)
- Signal suppression patterns (are too many signals being suppressed — indicating the priority algorithm is too aggressive?)
- Signal dismissal patterns (are users dismissing specific signal types at high rates — indicating a false positive pattern?)
- Signal Archive growth rate (accumulating at expected pace for Memory pre-requisite?)

**Healthy indicators:**
- Resolution rate > 80% within 7 days for Tier 1 signals
- User dismissal rate < 20% for any single signal type (above 20% indicates miscalibration)
- Signal Archive growing at 10-50 signals/workspace/month (too few means thresholds are too high; too many means too noisy)

---

### Memory Observability

**What to monitor:**
- Memory formation rate per memory type (is AI Core extracting at expected frequency?)
- Memory correction rate (how often are users correcting AI-formed Memory items?)
- Memory decay rate (are decaying memory items being properly retired?)
- Confidence distribution (is the ratio of `stated:inferred:uncertain` healthy?)
- Memory Graph connectivity (are cross-entity relationships forming?)

**Healthy indicators:**
- Correction rate < 10% for AI-formed Memory items (above 10% indicates Trust Boundary calibration issue)
- `stated` Memory items growing over time (users are confirming and correcting — trust is developing)
- Memory items with `observed` confidence showing strong correlation with Recommendation follow-through

---

### Reasoning Observability

**What to monitor:**
- AI Core processing time (Signal Archive reads, Memory formation, context synthesis)
- AI Core error rate (failed Memory formations, failed signal evaluations)
- Pattern detection latency (time between Archive accumulation and pattern-derived Memory formation)
- OpenAI API response time and error rate

**Healthy indicators:**
- No AI Core errors appearing in Sentry
- Signal-to-Memory latency within defined SLA (configurable by deployment)
- Zero Trust Boundary violations logged

---

### Recommendation Observability

**What to monitor:**
- Recommendation follow-through rate (Focus card → user action taken)
- Recommendation dismissal rate and TTL distribution (24h vs 7d vs until-reset)
- Which signal types drive the most followed Recommendations
- Which signal types drive the most dismissed Recommendations
- Decision card healthy state rate (what % of Workspace opens show a healthy state vs. an action)

**Healthy indicators:**
- Focus card follow-through rate > 60% (users are trusting and acting on the Focus card)
- Specific signal types with consistently high follow-through rate → potential automation candidates
- Specific signal types with consistently low follow-through rate → recalibration candidates

---

### Automation Observability

**What to monitor:**
- Automation execution success rate
- Automation reversal rate (users cancelling or reversing automated actions)
- Automation approval latency (time between automation proposal and user approval)
- Scope drift detection (is Automation being asked to execute actions outside its defined scope?)

**Healthy indicators:**
- Reversal rate < 5% (above 5% means Automation is exceeding user trust)
- No approval latency > 24h for Tier 1 signal automations (unaddressed automation proposals accumulate)
- Zero scope violations

---

### Platform Health Monitoring

**Sentry:** All unhandled AI Platform errors are captured by Sentry. This includes Signal Engine evaluation failures, AI Core extraction failures, Memory formation errors, and Automation execution failures. Sentry is the first alert for any platform error.

**Structured logging (`lib/logger.ts`):** AI Platform operations use structured logging on the server side. No `console.*` outside approved exceptions. Logger entries include: operation type, entity type, entity ID, signal ID (when relevant), memory ID (when relevant), duration, outcome.

**Metrics dashboard (Phase 3+):** A server-side dashboard (admin-only, never user-facing) that shows the health metrics listed above. Built on top of the existing analytics infrastructure.

**Health endpoint:** `GET /api/health` returns the status of all four major dependencies: database, AI provider, memory layer, signal engine. If any dependency is unhealthy, the endpoint signals degraded mode.

---

## Chapter 10 — Evolution

The AI Platform evolves through defined stages. Each stage builds on what was proven in the stage before. No stage is skipped. No capability is introduced before its prerequisite exists.

---

### Stage 1 — Today (Open Alpha)

**Capability:** Rule-based signal detection, rule-based Workspace Intelligence, real-time signal routing, Focus/Attention/Relationship/Work sections, three Workspace types (Deal, Contact, Company), Signal Archive accumulation (pre-requisite for Stage 2).

**What users experience:** A product that already knows the state of their business when they open it. One clear priority each morning. Workspace intelligence that tells them what to do next for each entity. No AI identification anywhere.

**What is happening underneath:** The Signal Engine is producing, routing, claiming, suppressing, and archiving signals. The Archive is accumulating. The resolver-based Workspace Intelligence is producing deterministic recommendations. Business Memory infrastructure exists but is not yet populated by AI Core.

**Stage 1 success criteria:** Users open Today daily. Focus card follow-through rate > 60%. Recommendation dismissal rate < 25%. Zero AI Platform errors in Sentry for the first 30 days of operation.

---

### Stage 2 — Recommendations (Post-Alpha, Phase 1)

**Capability:** AI Core integration begins. AI Core reads the Signal Archive from Stage 1 and forms initial Business Memory items. Business Memory begins to enrich Workspace Intelligence with relationship context and outcome patterns. Memory Signals (Tier 4) enter the Signal Engine.

**What users experience:** Workspace Preparation items that know the relationship history, not just the current entity state. Deal recommendations that reference how similar deals resolved. Relationship health assessments that account for pattern depth.

**What is happening underneath:** AI Core is running extraction cycles on the Signal Archive. The Memory layer is forming Relationship Pattern Memory items, Commitment Memory items, and Outcome Memory items. Trust Boundary validation is enforced on every Memory formation attempt. Version history begins accumulating.

**Stage 2 success criteria:** Business Memory correction rate < 10%. At least 50% of active workspaces have at least one Memory item within 90 days. Memory-enriched Recommendations show measurably higher follow-through rate than non-enriched Recommendations.

---

### Stage 3 — Planning (Phase 3)

**Capability:** AI Context Panel in every Workspace. Pre-loaded synthesis of Memory, current signals, and relationship history, assembled before the user opens the Workspace. Role-aware intelligence begins (different depth for different user roles). Strategic Intelligence first appearances (cross-entity outcome patterns applied to current situations).

**What users experience:** Every Workspace open finds context already assembled. "The system already knows this." The Invisible Assistant principle is made tangible at the Workspace level.

**What is happening underneath:** AI Core is running synthesis cycles triggered by entity state changes, not by user actions. When a deal stage changes, AI Core re-synthesizes the AI Context Panel for that deal. The Context Panel is stored in Business Memory as a synthesized Context Memory item, served from there rather than recomputed on every open.

**Stage 3 success criteria:** AI Context Panel opens without perceptible latency (served from cached Memory, not recomputed). Users who experience Stage 3 Workspace opens report significantly higher trust in Workspace recommendations. Context Panel dismissal rate < 15%.

---

### Stage 4 — Execution (Phase 4)

**Capability:** Collaboration Layer. Presence awareness, intent broadcasting, coordination conflict detection. AI Core begins detecting coordination failures before they happen: two users about to contact the same person, a deal about to be worked by two owners, a task about to be duplicated.

**What users experience:** The system warns them before coordination failures happen. "Your colleague Alex is composing a message to this contact right now." The business runs more smoothly without the users consciously coordinating.

**What is happening underneath:** Real-time entity presence tracking (Supabase channels). Intent broadcasting protocol. AI Core coordination pattern detection from Business Memory (Team Memory type). Conflict prevention signals (new signal type: `coordination_conflict`, Tier 1, critical).

**Stage 4 success criteria:** Zero duplicate outreach incidents in a team of 20 after 30 days of active use.

---

### Stage 5 — Automation (Phase 4+)

**Capability:** User-configurable automation rules. Approval workflows for automated actions. AI-suggested automation rules based on Recommendation follow-through patterns. When a user consistently follows a specific Recommendation type, AI Core suggests automating it.

**What users experience:** Repetitive coordination work disappears. "Every time a deal moves to negotiation, the legal review task is created automatically." "Every time a contact goes 21 days without engagement, a follow-up task appears in Today's Work."

**What is happening underneath:** Automation Engine v2.0 with user-visible rule configuration. AI Core analyzing Recommendation follow-through patterns to identify automation candidates. Approval workflow for every automation execution that touches external entities.

**Stage 5 success criteria:** At least 30% of active workspaces have at least one user-configured automation rule after 90 days. Automation reversal rate < 5%. No automation scope violations.

---

### Stage 6 — Autonomous Workflows (Year 2)

**Capability:** Autonomous Agents can perform sequences of related business actions within a defined scope, with defined escalation paths. The first agents operate in narrow, well-defined domains: relationship re-engagement, deal staleness recovery, meeting preparation.

**What users experience:** "Gunimi noticed the Acme relationship had gone quiet for 30 days, prepared a re-engagement plan, drafted the outreach, waited for my approval, sent it, recorded the outcome, and updated the memory." The user approved one action; the system coordinated the sequence.

**What is happening underneath:** Autonomous Agent architecture built on top of all existing layers. Signal Engine provides the trigger. Business Memory provides the context. AI Core reasons between steps. Automation executes each approved action. The Agent coordinates but does not bypass any layer.

**Stage 6 success criteria:** Each autonomous workflow has a defined scope. Zero scope violations. 100% of autonomous actions are traceable to user authorization. Reversal rate < 3%.

---

### Stage 7 — Autonomous Business OS (2030 Vision)

**Capability:** The operating system that businesses run inside. Most coordination happens automatically, within user-defined bounds. New team members inherit full institutional context on Day 1. Strategic Intelligence surfaces patterns that no individual human would detect across years of business history.

**What users experience:** "I don't think of it as software anymore." The system has become so accurate, so well-calibrated, and so deeply integrated into business workflows that it has become infrastructure — present, reliable, and invisible.

**What does not change:** AI never announces itself. Every recommendation is still grounded in evidence. Human judgment is still never replaced. The product never interrupts without a reason worth the interruption. Silence is still a feature. These principles are permanent — they are not negotiated as the product becomes more capable.

---

## Chapter 11 — Boundaries

Every subsystem has a defined boundary — the set of responsibilities it owns and the set of responsibilities it must not touch. These boundaries are the invariants that prevent the architecture from decaying into an undifferentiated mass of business logic.

---

### Workspace Engine Boundary

**Owns:** Visual structure and Grammar compliance for all Workspaces. The resolver pattern. Pre-translated string rendering. Five-question section layout. Four-tab structure. Header elements. Component library (`GunimiDecisionCard`, `GunimiPreparationCard`, etc.).

**Must not touch:** Business logic (resolver content). AI reasoning. Signal production. Memory formation. Direct business data access. Entity-specific rendering decisions.

**The line:** The Engine renders. It does not decide what to render (resolvers decide). It does not know why it renders (AI Core provides the why). It does not create what it renders (Business Data contains the raw material). It presents.

---

### Signal Engine Boundary

**Owns:** Signal type definitions. Signal lifecycle management. Deduplication. Routing to consumers. Suppression enforcement. Archive management. Signal Contract validation.

**Must not touch:** Memory formation (Memory layer's responsibility). AI reasoning. Workspace structure. User-facing presentation. Cross-signal pattern detection (AI Core's responsibility).

**The line:** The Signal Engine classifies. It does not explain (explainability comes from the evidence each signal carries). It does not remember (Memory layer stores what signals collectively mean). It does not act (Automation executes). It classifies and routes.

---

### Business Memory Boundary

**Owns:** Memory type definitions. Memory lifecycle (formation → reinforcement → evolution → decay → archival). Version history. Provenance. Memory Graph. Trust Boundary enforcement. Memory Confidence.

**Must not touch:** Real-time signal production (Signal Engine's responsibility). Workspace structure. Direct user-facing recommendations. Business Data writes. AI reasoning (AI Core reasons; Memory stores the conclusions of that reasoning).

**The line:** Business Memory stores. It does not reason (AI Core reasons, then stores in Memory). It does not route (Signal Engine routes). It does not present (Workspace Intelligence and Today present what Memory contains). It stores and serves.

---

### AI Core Boundary

**Owns:** Pattern detection from Signal Archive. Memory formation (within Trust Boundary). Memory evolution. Memory contradiction detection. Signal production (within Signal Contract). Cross-entity synthesis. Workspace Intelligence enrichment (AI Context Panel). Draft Recommendation enrichment. Draft communication production.

**Must not touch:** Business Data writes. Signal Engine lifecycle management. Workspace structure. Direct user-facing output (AI Core outputs go through Workspace Intelligence and Today, not directly to users). Automation execution. Storage of Trust Boundary violations.

**The line:** AI Core reasons and produces structured outputs. It does not own the surfaces that display those outputs. It does not own the data those outputs are stored in (Memory owns that). It does not own the routing of signals its reasoning produces (Signal Engine owns that). It reasons.

---

### Today Boundary

**Owns:** Cross-entity signal prioritization. Priority algorithm (time proximity → value at risk → relationship depth → commitment age). Four-section layout (Focus, Attention, Relationship Signals, Work). Morning briefing surface. Business health statement.

**Must not touch:** Signal production (Signal Engine's responsibility). Memory formation. Workspace-specific intelligence. Task management. Automation execution.

**The line:** Today reads and presents. It does not create. Every signal Today shows was produced by the Signal Engine. Every task Today shows lives in Business Data. Today's intelligence is 100% derived — it adds prioritization and presentation, not new intelligence.

---

### Recommendations Boundary

**Owns:** The collapse of all available intelligence into one actionable suggestion per Workspace (and one per Today/Focus). Evidence sentence. Recommendation action type.

**Must not touch:** Storage. Execution. Memory formation. Signal production. Workspace structure beyond the Decision section.

**The line:** A Recommendation is an output, not a process. It is the moment the AI Platform becomes useful to the user. It is not responsible for any of the work that produced it (Signal Engine, Memory, AI Core) or any of the work that follows it (Automation, execution, outcome recording).

---

### Automation Boundary

**Owns:** Execution of approved actions. Automation rule management (user-configured). Approval workflow. Execution audit trail. Outcome reporting back to Business Data.

**Must not touch:** Reasoning (AI Core's responsibility). Signal production. Memory formation. Bypassing user approval for consequential actions. Modifying Business Memory directly.

**The line:** Automation executes. It does not decide what to execute (that is the Recommendation's job, approved by the user). It does not reason about what to execute. It executes reliably, traceably, and within the scope the user has defined.

---

## Chapter 12 — Design Principles

These principles are permanent. They govern every AI feature in Gunimi, past, present, and future. They do not change with technology. They do not yield to competitive pressure. They do not negotiate with implementation constraints.

When an implementation conflicts with a principle, the implementation changes.

---

**Principle 1 — AI is infrastructure, not a feature.**
AI is not a destination, a button, a section, or a page. It is the layer of intelligence that operates beneath every workflow. Users experience better decisions — they do not experience AI.

**Principle 2 — AI never owns business data.**
Business data is owned by users. AI reads it, extracts from it, enriches it through Memory — but never writes to it directly. The only agent that modifies business facts is the user (or Automation with explicit user approval).

**Principle 3 — Signals describe reality.**
A signal is a specific, observable, currently-true fact about the state of a business entity. Signals do not predict. They do not assume. They do not estimate. They observe and report.

**Principle 4 — Memory preserves knowledge.**
Business Memory is the accumulated understanding of the organization. It survives sessions, employee turnover, and entity reassignment. Its purpose is not to show the user what the system remembers — its purpose is to make the system smarter about the user's specific business.

**Principle 5 — Today surfaces priorities.**
Today has already done the thinking. It presents the conclusion of that thinking — one priority, with supporting context. It does not present data for the user to synthesize. The synthesis is the product.

**Principle 6 — Automation executes approved intent.**
Automation never acts without explicit human approval or a pre-configured user-defined rule. Autonomy is earned gradually, in proportion to demonstrated accuracy. Every automated action is traceable.

**Principle 7 — Explainability is mandatory.**
Every AI conclusion must be explainable from its data structures. The evidence chain, the decision chain, the memory chain, the signal chain — all must be complete. An output that cannot be explained is an invalid output.

**Principle 8 — Humans remain authoritative.**
AI prepares decisions. It does not make them. Consequential business decisions — who to hire, whether to close a deal, how to respond to a difficult customer — always belong to humans. AI's role is to make those decisions more informed, not to replace them.

**Principle 9 — The Trust Boundary is absolute.**
AI is categorically prohibited from storing assumptions, sentiment, estimated motivations, psychological conclusions, probabilistic statements presented as facts, or second-order inferences. This boundary is enforced at creation time. There is no exception path.

**Principle 10 — Confidence reflects evidence, not model certainty.**
Confidence levels (high, medium, low, uncertain) describe the density of observable evidence supporting a conclusion. They never describe the AI model's internal probability estimate. Users can evaluate observable evidence. They cannot evaluate model probabilities.

**Principle 11 — Silence is a feature.**
When there is nothing to surface, the system surfaces nothing. No manufactured urgency, no placeholder recommendations, no AI theater ("analyzing your data..."). The honest empty state is more valuable than invented content.

**Principle 12 — One recommendation at a time.**
Every Workspace surfaces exactly one recommendation. Today surfaces exactly one Focus priority. A system that surfaces ten equal recommendations has done no thinking. A system that surfaces one has done its job.

**Principle 13 — AI never announces itself.**
No AI labels, Sparkles icons, "AI-generated" badges, or "Powered by AI" disclaimers anywhere in any user-facing surface. The intelligence belongs to Gunimi. The user experiences better decisions — they do not experience AI.

**Principle 14 — Each layer has one responsibility.**
No layer in the AI Platform duplicates another layer's function. The Signal Engine does not reason. Business Memory does not route. AI Core does not present. Today does not store. Boundaries are clean and permanent.

**Principle 15 — The Archive pre-dates the Memory.**
Signal archival must begin before Business Memory formation begins. You cannot detect patterns from empty data. The Signal Archive is the prerequisite for everything in Layers 3 and 4. Day 1 archive data is the seed of future intelligence.

**Principle 16 — Permission walls are AI walls.**
If a user cannot access an entity, AI cannot reason about that entity for that user. Permission scope is reasoning scope. AI never crosses a permission wall, not even to produce a sanitized summary.

**Principle 17 — Correction is input, not feedback.**
When a user corrects a Memory item, that correction is the highest-quality input in the system — higher than any AI extraction, higher than any pattern detection. It updates the Memory immediately, creates a version record, and informs AI Core about its extraction error.

**Principle 18 — User corrections propagate.**
When a user corrects a Memory item, the system identifies related Memory items that may be derived from the corrected fact and flags them for review. Corrections do not exist in isolation — they propagate through the Memory Graph.

**Principle 19 — Autonomy follows trust.**
Automation earns autonomy by demonstrating accuracy. The path is always: prepare → recommend → automate with approval → automate with standing rule. There is no shortcut. Autonomy granted before trust is earned is a design failure.

**Principle 20 — The architecture outlives the implementation.**
The layer structure defined in this document is permanent. Specific models change. Specific APIs change. Specific implementations change. The responsibility of each layer, the direction of each data flow, and the constraints of each boundary do not change.

---

## Chapter 13 — Open Alpha Scope

### What is included in Open Alpha

**Workspace Engine (Layers 1):** Complete. Certified. Frozen. Three Workspace types (Deal, Contact, Company) with full resolver architecture, Grammar compliance, and Contract compliance.

**Signal Engine (Layer 2) — partial:** Signal type definitions and thresholds are implemented within the existing resolver architecture. The unified Signal Engine as a centralized governance architecture is defined in the Blueprint but not yet implemented as a separate system. Signals are produced by entity resolvers and consumed by Today and Workspace surfaces.

**Signal Archive (Transition 3):** Active from Day 1 of Open Alpha. Every resolved signal is permanently archived. This is the mandatory pre-requisite for Business Memory and AI Core integration. Without the Archive, future intelligence is impossible.

**Today (Layer 6) — complete:** Focus card, Attention Required, Relationship Signals, Today's Work. Rule-based priority algorithm. Business health statement. Single priority per session.

**Workspace Intelligence (Layer 5) — rule-based:** All resolver functions active (decision, preparation, story, context) for all three Workspace types. Rule-based output only — AI Core enrichment is deferred.

**Recommendations (Layer 7):** Produced by rule-based resolvers. Evidence-grounded. One per Workspace. One per Today.

---

### What is intentionally deferred from Open Alpha

**Business Memory formation (Layer 3):** Business Memory infrastructure exists (`lib/memory/`) but AI Core-driven Memory formation is post-Alpha. The Signal Archive must accumulate meaningful history before pattern detection becomes reliable.

**AI Core synthesis (Layer 4):** AI Core integration (reading Signal Archive, forming Memory, enriching Workspace Intelligence) is Post-Alpha, Phase 1. Requires sufficient Signal Archive history and Memory infrastructure readiness.

**AI Context Panel (Phase 3):** Pre-loaded Workspace synthesis from Memory and signals. Deferred to Phase 3.

**Memory Signals (Tier 4):** Signals produced by Business Memory (e.g., "This relationship pattern suggests approaching renewal opportunity"). Deferred to Phase 1 post-Alpha.

**Collaboration Layer (Phase 4):** Presence awareness, intent broadcasting, coordination AI. Deferred — requires real-time infrastructure and Team Memory.

---

### What belongs to Beta

**AI-enriched Workspace Intelligence:** Decision card and Preparation section enriched by Business Memory context. Business Memory must be populated for 3-6 months before enrichment is meaningful.

**AI Context Panel:** Pre-loaded synthesis for every Workspace. Requires Phase 3 Memory architecture.

**Memory Graph connectivity:** Cross-entity Memory relationships. Requires Memory population from multiple entity types over time.

**Strategic Intelligence:** Cross-entity outcome patterns applied to current situations. Requires 6-12 months of Signal Archive data.

---

### What belongs to the future

**Autonomous Agents (Stage 6 — Year 2):** Multi-step workflows within defined scope. Requires all preceding stages to be proven and trusted.

**Role Awareness (Phase 5):** Workspace Intelligence differentiated by user role. Requires Business Memory depth and AI Context Panel.

**Institutional Memory transfer (Phase 5):** Full context inheritance for new team members. Requires years of Business Memory accumulation.

**Public API for third-party Workspace builders (Year 2+):** Exposing the Signal Engine and Memory layer to external integrations. Requires architectural audit of data isolation and permission model.

**Predictive signals (post-year 1):** AI Core producing signals based on pattern extrapolation rather than threshold crossing. Requires Trust Boundary extension and significant observational data. Subject to separate architectural review before introduction.

---

## Chapter 14 — Architecture Diagrams

Conceptual representations of the AI Platform's primary flows. These diagrams describe relationships and direction, not implementation.

---

### Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 9 — Autonomous Agents                    [Future]    │
├─────────────────────────────────────────────────────────────┤
│  LAYER 8 — Automation Engine                   [Alpha v1]   │
├─────────────────────────────────────────────────────────────┤
│  LAYER 7 — Recommendations                     [Alpha]      │
├──────────────────────────┬──────────────────────────────────┤
│  LAYER 6 — Today         │  LAYER 5 — Workspace Intelligence │
│  [Alpha]                 │  [Alpha — rule-based]            │
├──────────────────────────┴──────────────────────────────────┤
│  LAYER 4 — AI Core                              [Post-Alpha] │
├──────────────────────────┬──────────────────────────────────┤
│  LAYER 3 — Business      │  LAYER 2 — Signal Engine         │
│  Memory [Post-Alpha]     │  [Alpha — embedded in resolvers] │
├──────────────────────────┴──────────────────────────────────┤
│  LAYER 1 — Workspace Engine                     [Alpha]      │
├─────────────────────────────────────────────────────────────┤
│  LAYER 0 — Business Data                        [Alpha]      │
└─────────────────────────────────────────────────────────────┘
```

---

### Signal Lifecycle

```
Business condition crosses threshold
              ↓
         PRODUCED
    (type, tier, severity, confidence, evidence)
              ↓
         EVALUATED
    ┌─── Duplicate? ───────────────────────┐
    │ YES: Update existing signal timestamp│
    │ NO:  Enter active pool               │
    └──────────────────────────────────────┘
              ↓
          CLAIMED
    (by highest-priority eligible consumer)
              ↓
         SUPPRESSED
    (for all lower-priority consumers)
              ↓
         RESOLVED
    ┌─── How? ─────────────────────────────┐
    │ Event-driven: condition no longer    │
    │ true (user acted, entity changed)    │
    │ TTL: signal expired without action   │
    │ User dismissal: suppressed for TTL   │
    └──────────────────────────────────────┘
              ↓
          ARCHIVED
    (permanent — available to AI Core)
```

---

### Memory Lifecycle

```
Signal Archive → AI Core reads pattern
                       ↓
                Trust Boundary check
        ┌──── PASS: form Memory item ────┐
        │     FAIL: discard, log         │
        └────────────────────────────────┘
                       ↓
            FORMATION (v1.0, confidence: uncertain)
                       ↓
            REINFORCEMENT (v1.1, confidence rises)
       (new corroborating signals arrive)
                       ↓
            EVOLUTION (v2.0, content changes)
       (user correction, contradiction)
                       ↓
            DECAY (confidence weakens over time)
       (no reinforcing evidence, time threshold crossed)
                       ↓
            ARCHIVAL (memory no longer active)
                       ↓
            RETRIEVAL (historical query — audit, context)
```

---

### Reasoning Flow

```
Signal Archive
      ↓ [reads archived signals by entity]
AI Core — Pattern Detection
      ↓ [Trust Boundary evaluation]
Business Memory — Formation
      ↓ [Memory Graph connectivity]
AI Core — Cross-entity Synthesis
      ↓
Workspace Intelligence — Context Enrichment
      ↓
AI Context Panel (pre-loaded, Phase 3)
      ↓
User opens Workspace — context already assembled
```

---

### Recommendation Flow

```
Entity state (Business Data)
      ↓
Signal Engine — condition threshold crossed
      ↓
Signal — produced, evaluated, active pool
      ↓
Today / Workspace resolver — reads active signals
      ↓
Priority algorithm — selects highest-priority signal
      ↓
Memory context — enriches with relationship history (Phase 3)
      ↓
Recommendation — one action, one evidence sentence
      ↓
Decision Card / Focus Card — surfaced to user
      ↓
User decision: follow / dismiss / ignore
```

---

### Automation Flow

```
User follows Recommendation
      ↓
Automation proposal — specific action, specific parameters
      ↓
User approves
      ↓
Automation Engine — executes action
      ↓
Business Data — updated
      ↓
New Business Event — entity state changed
      ↓
Signal Engine — re-evaluates entity
      ↓
Signal Archive — previous signal resolved, archived
      ↓
AI Core — reads new Archive state (next cycle)
```

---

### Trust Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                   AI Core may never cross                    │
│                                                             │
│  ▸ Permission walls (entity A is not visible to user B)     │
│  ▸ Trust Boundary (assumption, sentiment, motivation,       │
│    psychology, probability-as-fact, 2nd-order inference)    │
│  ▸ Signal Contract (AI signals must satisfy all 15 fields)  │
│  ▸ Consequential action boundary (no execution without      │
│    user approval)                                           │
│  ▸ Business Data write boundary (AI reads; users write)     │
│  ▸ User correction boundary (stated facts cannot be         │
│    silently overwritten by AI extraction)                   │
└─────────────────────────────────────────────────────────────┘
```

---

### Data Ownership

```
Business Data     → Owned by: Users
                    Written by: Users + Automation (approved)
                    Read by: Workspace Engine, Signal Engine, AI Core (via Archive)

Signal Archive    → Owned by: Signal Engine
                    Written by: Signal Engine (resolution)
                    Read by: AI Core, Today, Workspace Intelligence

Business Memory   → Owned by: Business Memory layer
                    Written by: AI Core (within Trust Boundary) + Users (corrections)
                    Read by: AI Core, Workspace Intelligence, Today

AI Core outputs   → Owned by: Memory layer + Signal Engine
                    Written by: AI Core
                    Read by: Workspace Intelligence, Today, Automation

Recommendations   → Owned by: Recommendation layer
                    Written by: Workspace Intelligence + Today
                    Read by: Users (directly)
```

---

## Chapter 15 — Architecture Invariants

These invariants are permanent. They do not yield to feature pressure, implementation convenience, or competitive requirement. Any proposed exception to an invariant is a signal that the proposal needs to be redesigned, not that the invariant needs to change.

---

**Invariant 1 — There is exactly one Workspace Engine.**
The Workspace Engine is the single implementation of Workspace structure and Grammar. No entity type creates a parallel Workspace architecture. All future Workspace types extend the Engine's resolver pattern without modifying Engine components.

**Invariant 2 — There is exactly one Signal Engine.**
Every business signal in Gunimi is produced, classified, routed, suppressed, and archived by the Signal Engine. No surface invents its own signal taxonomy. No signal exists outside the Engine's authority.

**Invariant 3 — There is exactly one Business Memory.**
All long-term intelligence in Gunimi is stored in Business Memory. No Workspace type maintains its own intelligence store. No surface caches AI reasoning outside of Business Memory. Memory is the single source of long-term intelligence.

**Invariant 4 — There is exactly one AI Core.**
All AI reasoning in Gunimi happens in AI Core. No Workspace type implements its own AI reasoning layer. No surface calls AI models directly for reasoning. AI Core is the single point of intelligence synthesis.

**Invariant 5 — AI never bypasses the Signal Engine.**
AI Core reads the Signal Archive, not live Business Data. AI Core produces signals through the Signal Engine, not by writing directly to Workspace surfaces. No AI reasoning short-circuits the signal lifecycle.

**Invariant 6 — AI never bypasses Business Memory.**
AI Core's reasoning outputs are stored in Business Memory. AI Core does not produce reasoning outputs that go directly to Workspace surfaces without first being stored in Memory. Business Memory is the single source of AI-produced intelligence.

**Invariant 7 — Automation never bypasses Approval.**
Every consequential automated action requires explicit human approval or a pre-configured user-defined automation rule. There is no consequential action path that is autonomous from the moment of its inception. Autonomy is earned in stages, never assumed.

**Invariant 8 — No subsystem duplicates another.**
Each layer in the AI Platform has one responsibility. When a proposed feature spans two layers, it belongs to one of them. It does not create a new layer. The existing layer may be extended; it is not duplicated.

**Invariant 9 — Every recommendation is explainable.**
No Recommendation may be surfaced without a complete evidence chain. The evidence chain runs from the Recommendation back through the Signal that drove it, the Memory that enriched it, and the specific source records that produced the Memory. A Recommendation without a traceable evidence chain is invalid.

**Invariant 10 — Every automation is traceable.**
No automated action may be executed without a traceable record that includes: the Recommendation it executed, the user approval that authorized it, the specific parameters of the action, and the outcome produced. Traceability is permanent and append-only.

**Invariant 11 — Every Memory item has provenance.**
No Business Memory item may be created without a provenance record naming the specific source events that produced it. Provenance is not metadata — it is the evidence chain made explicit. A Memory item without provenance violates Invariant 9.

**Invariant 12 — The Trust Boundary is a creation-time gate.**
AI Core evaluates every prospective Memory item against the Trust Boundary before creating it. Items that violate the Trust Boundary are discarded, never created, never quarantined for later review. The Boundary is absolute.

**Invariant 13 — Permission walls are AI walls.**
AI Core's reasoning scope is bounded by the user's permission scope. AI may not synthesize, recommend, or form Memory items about entities the current user cannot access. Permission boundaries are enforced at the reasoning layer, not only at the presentation layer.

**Invariant 14 — AI identification is prohibited.**
No user-facing surface may identify its content as AI-generated through labels, icons, badges, disclaimers, or language. The intelligence is presented as the product's intelligence. Users experience better decisions — they do not experience AI.

**Invariant 15 — User corrections are the highest trust.**
A user correction to any Business Memory item produces the highest-trust update in the system. AI Core's subsequent reasoning is constrained by user corrections. AI cannot silently overwrite a user-corrected fact.

**Invariant 16 — The Signal Archive is permanent.**
Archived signals are never deleted. The Archive is append-only. Its purpose is pattern detection and Business Memory formation — and neither is possible without a complete historical record.

**Invariant 17 — Today surfaces priorities, not data.**
Today is the convergence surface for cross-entity intelligence. It presents one priority (Focus), supporting context (Attention), and two supplementary sections (Relationships, Work). Today never surfaces raw data, charts, activity feeds, unread counters, or pipeline metrics. It surfaces conclusions.

**Invariant 18 — Silence is valid.**
When no signal crosses the threshold, Today's Focus card shows a calm honest state. When no action is needed, the Decision Card shows a healthy state. The system never manufactures urgency to appear more useful. The honest empty state is a feature.

**Invariant 19 — The Archive pre-dates the Memory.**
Business Memory cannot be meaningfully formed without Signal Archive history. Signal archival is active from Open Alpha Day 1. Memory formation begins when sufficient Archive history exists. This ordering is permanent.

**Invariant 20 — Every layer is auditable.**
Signals, Memory, Recommendations, and Automation executions all carry permanent, structured audit records. No layer produces an output that cannot be retrospectively reviewed. Auditability is an architectural property, not a feature.

---

## Final Report

### 1. Architecture Summary

The Gunimi AI Platform is a nine-layer architecture (plus the foundation layer) that governs every AI subsystem in the product. The layers run from Business Data at the base through Workspace Engine, Signal Engine, Business Memory, AI Core, Workspace Intelligence, Today, Recommendations, Automation, and Autonomous Agents at the horizon.

Each layer has one responsibility. Data flows in one defined direction. Every output is explainable, every action is traceable, and every boundary is permanent.

The architecture is complete as a specification. Its Open Alpha implementation covers Layers 0, 1, 6 (fully), and Layers 2, 7, 8 (partially or in rule-based form). Layers 3, 4, and 5 (in AI-enriched form) are post-Alpha.

---

### 2. Platform Layers

| Layer | Name | Status |
|-------|------|--------|
| L0 | Business Data | ✅ Complete |
| L1 | Workspace Engine | ✅ Certified, frozen |
| L2 | Signal Engine | ✅ Embedded in resolvers (Alpha); full Engine post-Alpha |
| L3 | Business Memory | ⚡ Infrastructure exists; AI Core formation is post-Alpha |
| L4 | AI Core | ⚡ `lib/ai/` exists; synthesis integration is post-Alpha |
| L5 | Workspace Intelligence | ✅ Rule-based (Alpha); AI-enriched (Phase 3) |
| L6 | Today | ✅ Complete |
| L7 | Recommendations | ✅ Rule-based; Memory-enriched post-Alpha |
| L8 | Automation | ✅ Engine exists; user-configurable rules are Phase 4-5 |
| L9 | Autonomous Agents | 🔲 Future — Year 2 |

---

### 3. AI Responsibilities

**AI Core is responsible for:**
- Pattern detection from Signal Archive
- Memory formation within Trust Boundary
- Memory evolution and contradiction detection
- Cross-entity synthesis via Memory Graph
- AI Signal production within Signal Contract
- Workspace Intelligence enrichment (Phase 3)
- Draft Recommendation enrichment
- Draft communication production

**AI Core is never responsible for:**
- Business Data writes
- Signal lifecycle management
- Workspace presentation
- Consequential action execution
- Trust Boundary violations

---

### 4. Ownership Verification

| Subsystem | Owner verified in this document |
|-----------|-------------------------------|
| Business Data | ✅ — Users + approved Automation |
| Workspace Engine | ✅ — Engineering, certified frozen |
| Signal Engine | ✅ — Signal Engine Blueprint |
| Business Memory | ✅ — Business Memory Blueprint |
| AI Core | ✅ — `lib/ai/`, constrained by Trust Boundary and Signal Contract |
| Workspace Intelligence | ✅ — Entity resolver layer, constrained by Grammar and Contract |
| Today | ✅ — Today Experience Blueprint |
| Recommendations | ✅ — Decision layer, produced by Workspace Intelligence + Today |
| Automation | ✅ — Automation Engine, requires approval |

No ownership gap detected. No ownership overlap detected.

---

### 5. Boundary Verification

| Boundary | Status |
|----------|--------|
| Workspace Engine ↔ Signal Engine | ✅ Engine renders; Signal Engine classifies. No overlap. |
| Signal Engine ↔ Business Memory | ✅ Archive bridges them; AI Core is the bridge agent. No overlap. |
| Business Memory ↔ AI Core | ✅ Memory stores; AI Core reasons. Clear write/read roles. |
| AI Core ↔ Workspace Intelligence | ✅ AI Core produces context panels; WI presents them. No overlap. |
| Today ↔ Workspace Intelligence | ✅ Today is cross-entity; WI is entity-specific. No overlap. |
| Recommendations ↔ Automation | ✅ Recommendations suggest; Automation executes with approval. No overlap. |
| All layers ↔ Business Data | ✅ Only users and approved Automation write Business Data. All layers read only. |

No boundary violation detected. No responsibility overlap detected.

---

### 6. Invariant Verification

All 20 Architecture Invariants are defined in Chapter 15. Each invariant is grounded in one or more of the authority documents:

- Invariants 1-4 (single systems): Engineering Charter "one Workspace Engine, one Signal Engine" rule
- Invariants 5-6 (AI bypass prohibition): Product Bible §7 AI Philosophy + Trust Model
- Invariant 7 (Automation approval): Product Bible §8 Collaboration Philosophy
- Invariant 8 (no duplication): Engineering Charter "no duplicate architecture"
- Invariants 9-11 (explainability): Signal Engine Blueprint Ch. 21 + Business Memory Blueprint Ch. 21
- Invariant 12 (Trust Boundary): Business Memory Blueprint Ch. 23
- Invariant 13 (permission walls): Product Bible §7 AI Limitations
- Invariant 14 (AI identification): Workspace Grammar Invariant 8 + Product Bible §5 Invisible Assistant
- Invariant 15 (user corrections): Business Memory Blueprint Ch. 19 + Trust Model
- Invariant 16 (Archive permanent): Business Memory Blueprint Ch. 7 + Signal Engine Blueprint Ch. 15
- Invariants 17-18 (Today purpose + silence): Today Experience Blueprint §4 + Product Bible Principle 18
- Invariant 19 (Archive pre-dates Memory): Business Memory Blueprint Ch. 18 Open Alpha Scope
- Invariant 20 (auditability): Business Memory Blueprint Ch. 20-21 + Automation Chain (Ch. 7 this document)

All 20 invariants verified against source authority. No contradiction found.

---

### 7. Open Alpha Readiness

The AI Platform is Open Alpha ready in its current rule-based form.

**What is production-ready:**
- Layer 0 (Business Data): Complete
- Layer 1 (Workspace Engine): Certified, frozen, proven across three Workspace types
- Layer 2 (Signal Engine — rule-based): Embedded in resolvers, producing signals correctly
- Signal Archive: Active from Day 1 (required pre-requisite confirmed)
- Layer 5 (Workspace Intelligence — rule-based): Complete for all three Workspace types
- Layer 6 (Today): Complete with four sections, priority algorithm, health statement
- Layer 7 (Recommendations — rule-based): Produced by resolvers, evidence-grounded
- Layer 8 (Automation — basic): Automation Engine exists

**What is post-Alpha (by design):**
- Layer 3 (Business Memory — AI Core formation): Requires Signal Archive history
- Layer 4 (AI Core synthesis): Requires Memory infrastructure readiness
- Layer 5 (AI-enriched Workspace Intelligence): Requires Phase 3 AI Context Panel
- Layer 9 (Autonomous Agents): Year 2

The AI Platform's Open Alpha state is architecturally sound. The post-Alpha layers are deferred by design — they require the Alpha foundation to accumulate history before they can operate meaningfully.

---

### 8. Future Implementation Order

Based on the layer architecture, Data Flow, and Evolution stages defined in this document, the recommended implementation order is:

| Order | Capability | Layer | Stage | Pre-requisite |
|-------|-----------|-------|-------|--------------|
| 1 | Signal Archive accumulation | L2 | Open Alpha (Day 1) | None — currently active |
| 2 | Business Memory infrastructure (types, lifecycle, API) | L3 | Phase 1 | Signal Archive |
| 3 | AI Core Signal Archive reader + pattern detector | L4 | Phase 1 | Memory infrastructure + Archive history |
| 4 | Memory formation (Relationship Pattern, Commitment, Outcome) | L3+L4 | Phase 1 | AI Core + Memory |
| 5 | Memory-enriched Workspace Intelligence (Preparation depth) | L5 | Phase 2 | Memory populated |
| 6 | Memory Signals (Tier 4 signals from Memory layer) | L2+L3 | Phase 2 | Memory populated |
| 7 | AI Context Panel (pre-loaded Workspace synthesis) | L4+L5 | Phase 3 | Memory Graph + AI Core enrichment |
| 8 | Cross-entity synthesis (Strategic Intelligence) | L4 | Phase 3 | Multi-entity Memory + Memory Graph |
| 9 | Collaboration Layer (presence, intent, conflict) | L8 | Phase 4 | Real-time infra + Team Memory |
| 10 | Automation v2.0 (user-configurable, approval workflow) | L8 | Phase 4-5 | Trust established by Phase 3 |
| 11 | Role Awareness | L5 | Phase 5 | AI Context Panel + Business Memory depth |
| 12 | Autonomous Agents | L9 | Year 2 | All preceding layers proven |

---

### Final Question — Can every future AI capability be implemented without changing the architecture?

**Yes.**

The evidence:

**New signal types** are added to the Signal Engine's type registry without changing the Engine's lifecycle, routing, or suppression architecture. The Signal Contract remains the same. The 8 Design Questions remain the same. New types extend the Engine — the Engine itself does not change.

**New memory types** are added to the Business Memory type registry without changing the Memory lifecycle, confidence model, or Trust Boundary. The Memory Contract (Identity, Versioning, Provenance, Graph, Trust Boundary) remains the same. New types extend Memory — the architecture does not change.

**New workspace types** follow the established resolver pattern: four resolvers (`decision.ts`, `preparation.ts`, `story.ts`, `context.ts`), entity-specific logic, locale-key output, Workspace Engine presentation. The Engine has been proven across three types without modification. The pattern handles any future entity type.

**AI Context Panel** (Phase 3) extends AI Core's output and Workspace Intelligence's presentation. It uses the existing Memory layer (reads Memory items), the existing Signal Engine (reads active signals), and the existing Workspace Engine (new component in the existing tab structure). No new architecture.

**Autonomous Agents** (Year 2) are defined in this architecture as Layer 9. They are constrained to use Layers 0-8 below them. The architecture already defines their boundaries, their inputs (Signal Engine triggers, Business Memory context, AI Core reasoning), and their outputs (Automation executions). The architecture does not need to change when Agents are built — it already contains them.

**Role Awareness** (Phase 5) extends Workspace Intelligence (Layer 5) with role-specific context prioritization. The Five Questions remain. The Grammar remains. The Contract remains. The layer that presents the answers adapts its priority — the architecture does not change.

**Predictive signals** (if introduced after Year 1) are a new signal type in the Signal Engine (Layer 2) with `producedBy: ai_core`. They must satisfy the Signal Contract. They route to the same consumers. They follow the same lifecycle. The architecture does not change.

In every case, future AI capabilities are extensions of an existing layer or additions to an existing registry. None of them require a new architectural layer. None of them require modifying an existing layer's boundary, responsibility, or invariants.

The architecture is complete.

---

*This document is the architectural map for every future AI capability in Gunimi. It does not describe what Gunimi will build — it defines the space inside which Gunimi can build anything. Features change. Technology changes. The architecture defined here does not.*

---

**Version:** 1.0
**Created:** 2026-07-11
**Authority:** Gunimi Product Bible v1.0 · Gunimi Engineering Charter v1.0 · Workspace Principles · Workspace Contract v1.0 · Workspace Grammar v1.0 · Signal Engine Blueprint v1.1 · Business Memory Blueprint v1.1
**Applies to:** Every AI subsystem in Gunimi — present and future
**Next review:** After Phase 1 post-Alpha (AI Core integration begins) — verify that Signal Archive data is sufficient and Memory formation is behaving as specified

---

### Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-11 | Initial document — 15 chapters + Final Report |
