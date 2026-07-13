# Gunimi Blueprint — Business Memory v1.1

**Version:** 1.1
**Status:** Foundational — permanent
**Authority:** Gunimi Product Bible v1.0 · Workspace Grammar v1.0 · Signal Engine Blueprint v1.0 · Today Experience Blueprint v1.0
**Applies to:** All long-term intelligence in Gunimi — AI Core, Workspaces, Today, Signal Engine

> *"Most software makes you remember. Gunimi remembers for you — but only what matters."*

---

## Preface

Every tool that touches a business relationship accumulates information. CRMs accumulate fields. Email clients accumulate threads. Note-taking apps accumulate documents. Project tools accumulate tasks.

None of them accumulate understanding.

A salesperson returns from a two-week vacation to find forty interactions in their CRM, three hundred emails, and eleven notes. They have more information than they had before they left. They have no more understanding. They must read everything, synthesize everything, and rebuild the context they had before they went away — before they can make a single intelligent decision.

This is the problem Business Memory solves.

Business Memory is Gunimi's long-term intelligence layer. It does not store more data. It accumulates understanding — the synthesized, persistent intelligence that makes every Workspace recommendation more accurate, every signal more specific, and every morning briefing more relevant than the day before.

When a business owner opens a Contact Workspace after two weeks away, Business Memory is what allows the system to say: "Maria mentioned she was presenting your proposal to the board on August 15th. That date passed 3 days ago." That context was in a note. The significance of August 15th came from Memory. The synthesis — understanding that the date has passed and this is now urgent — came from AI Core working with Memory.

The salesperson did not have to remember. The system remembered, and surfaced the right thing at the right moment.

This is what Business Memory is for.

---

## Chapter 1 — Purpose

### Why Business Memory exists

Three surfaces in Gunimi generate intelligence: the Signal Engine (what needs attention now), the Workspace (what is true for this entity right now), and Today (what matters across all entities right now).

All three suffer the same limitation: they operate on the present. The Signal Engine detects current conditions. The Workspace resolves the current state. Today surfaces today's priorities.

None of them accumulate. Every time a Workspace opens, it resolves from zero. Every time Today renders, it evaluates from the current data. The intelligence these surfaces produce is no smarter on Day 300 than it was on Day 1 — because they have no memory of what came before.

Business Memory changes this. It is the layer that persists between sessions, across entities, and over time. It is what allows Gunimi to be genuinely smarter the longer a team uses it.

### The business question Business Memory answers

Business Memory answers one question that no other layer can answer:

> **"What does Gunimi know about this relationship — beyond what is visible in its current state?"**

Not: "What fields are filled in?"
Not: "What happened today?"
Not: "What signal is firing right now?"

Business Memory answers: "What patterns have we observed? What commitments have been made? What outcomes have we seen? What context did this person share that is now relevant again?"

### What Business Memory is not

**Business Memory is not Notes.**
Notes are raw input written by users. Memory is synthesized understanding extracted from notes and other sources. A note says "Maria mentioned they're restructuring in Q4." Memory says "This company goes through structural changes in Q4 — deal timing should account for this." The note is a record. The memory is an insight.

**Business Memory is not the Story section.**
The Story section is a curated narrative for one entity, showing how a specific relationship or opportunity evolved. Story is user-facing, chronological, and scoped to a single Workspace. Memory is invisible infrastructure, cross-entity, atemporal (memories are not shown in order — they are retrieved by relevance), and scoped to the entire workspace.

**Business Memory is not CRM data.**
CRM data is structured records: fields, stages, dates. Business Memory is unstructured understanding: patterns, preferences, outcomes, commitments. A CRM field says `stage: Negotiation`. Memory says "This company stalls in the negotiation phase when legal review takes over — their previous deal took 45 days from proposal to signature." That insight is not in any CRM field.

**Business Memory is not Signal history.**
The Signal Engine archives resolved signals (see Signal Engine Blueprint, Chapter 11). Archived signals are the raw material from which Memory is built — but the archive is not Memory. An archive is a log. Memory is an inference drawn from the log. "This deal has fired `deal_stale` three times in six months" is in the archive. "This deal's owner may not be following up consistently" is the Memory drawn from that archive.

**Business Memory is not a chat interface.**
Business Memory is never a place users go to ask questions. It is the invisible layer that makes every other surface answer better. A chat interface inverts the relationship — it makes the user do the work of formulating questions. Memory works proactively: it surfaces what is relevant before the user asks.

### The mission

> Business Memory ensures that Gunimi grows smarter over time by persisting the synthesized understanding of relationships, commitments, patterns, and outcomes — so that the system's intelligence on Day 300 is meaningfully better than its intelligence on Day 1.

---

## Chapter 2 — Position in the Architecture Chain

Business Memory sits at a distinct layer in the Gunimi intelligence stack, above raw data and Signals, and below AI Core outputs:

```
Raw Data
(notes, emails, interactions, tasks, deal outcomes)
      ↓
Signal Engine
(ephemeral — what needs attention NOW)
      ↓
Business Memory
(persistent — what Gunimi knows across time and entities)
      ↓
AI Core
(uses Memory to produce Memory Signals and enhance recommendations)
      ↓
Surfaces
(Today, Workspaces — where intelligence becomes visible)
```

### What Memory receives

Business Memory receives input from three sources:

1. **Signal archive** — archived (resolved) signals from the Signal Engine. These are the primary input for pattern detection.
2. **User-authored content** — notes, explicit commitments, context marked as significant by the user.
3. **AI Core extraction** — AI-derived insights from interaction content that the user has not explicitly noted (post-Alpha, requires email integration and user consent).

### What Memory produces

Business Memory produces output consumed by two consumers:

1. **AI Core** — reads Memory to produce Memory Signals (Tier 4 in the Signal Engine), calibrate signal thresholds, and enhance the context surfaced in Workspace sections.
2. **Workspace surfaces** — specific Memory items are surfaced in Preparation and Situation sections when they are relevant to the current entity and the current Decision action.

### What Memory does not produce

Business Memory does not produce its own surface. There is no "Memory tab" or "Memory view" in v1.0. Memory is infrastructure. Users experience it through the improvement in surface quality — not through direct access to the memory store.

---

## Chapter 3 — Memory Lifecycle

Every memory item follows a defined lifecycle. Memory is not static — it forms, reinforces, evolves, decays, and eventually archives.

```
FORMATION
  ↓
A meaningful event or pattern crosses the threshold for memory creation.
A memory item is created with type, confidence, evidence source, and entity.

REINFORCEMENT
  ↓
Subsequent events are consistent with the existing memory.
The memory's confidence level increases.
The memory's evidence base grows.

EVOLUTION
  ↓
New evidence contradicts or extends the existing memory.
The memory updates: content changes, confidence recalibrates.
The previous version is retained in the memory's history — never overwritten without trace.

DECAY
  ↓
Time passes without reinforcement.
For decay-eligible memory types, confidence level decreases.
When confidence falls below the surfacing threshold, the memory is no longer
surfaced to AI Core or Workspace surfaces — but it is not deleted.

ARCHIVAL
  ↓
The entity the memory describes becomes inactive (deal won/lost, contact archived).
OR
The memory decays below the minimum confidence threshold.
OR
The user explicitly deletes the memory.
Archived memories are retained permanently for historical context but are not
surfaced to any active intelligence layer.

RETRIEVAL
  ↓
Not a sequential lifecycle stage — retrieval happens at any point from FORMATION
through ARCHIVAL (active memories only). AI Core queries Memory for relevant
items when evaluating a Workspace entity or generating Today signals.
Retrieval is context-driven: only memories relevant to the current entity and
current decision context are retrieved.
```

### The five states

| State | Description | Surfaced to AI Core? | Surfaced to Workspaces? |
|-------|-------------|---------------------|------------------------|
| `active` | Confidence above threshold, entity is active | Yes | Yes, if relevant |
| `weakened` | Confidence below surfacing threshold, not yet archived | No | No |
| `evolved` | Updated by new evidence — prior version retained | Yes (current version) | Yes (current version) |
| `decayed` | Below minimum threshold — in decay path to archival | No | No |
| `archived` | Entity inactive or memory explicitly retired | No | No |

---

## Chapter 4 — Memory Types

Business Memory recognizes seven distinct types of memory item. Each type has a different creation path, confidence trajectory, decay behavior, and usage.

---

### Type 1 — Commitment Memory

**What it is:** A specific commitment or expectation that was expressed by the user or by the contact in an interaction and has not yet been fulfilled.

**Examples:**
- "You told Maria you would send the updated proposal by end of week."
- "Marcus asked for a case study to share with his team."
- "The contact said their board reviews new vendors in Q1."

**What creates it:** Notes containing commitment language ("I'll send...", "By Friday...", "They asked for..."), tasks created from specific interactions, email content analysis (post-Alpha).

**Confidence trajectory:** Created at `stated` (from notes/tasks) or `inferred` (AI-extracted from email). Increases to `observed` if the commitment pattern is confirmed in subsequent interactions. Does not decay — commitment memories persist until the commitment is fulfilled or explicitly dismissed.

**Decay behavior:** None. A commitment that has not been fulfilled is as valid six months after it was made as the day it was made. Expiry happens only through fulfillment (event-driven resolution), explicit user dismissal, or entity archival.

**Usage:** Surfaces in Preparation (relevant open commitments for the current entity), triggers `memory_reminder` Signals when a commitment is time-sensitive.

---

### Type 2 — Relationship Pattern Memory

**What it is:** A recurring pattern of behavior in the relationship between the user and a specific contact or company.

**Examples:**
- "Maria typically responds to emails within hours on Tuesday and Wednesday mornings."
- "This company's deals slow down significantly in December."
- "Follow-ups sent on Monday morning consistently get a reply; Friday follow-ups are rarely acknowledged."

**What creates it:** Pattern analysis by AI Core across the accumulated interaction history with a specific entity (minimum 5 data points before pattern confidence reaches `inferred`).

**Confidence trajectory:** Starts at `uncertain` (1–2 data points insufficient for pattern), rises to `inferred` (3–5 data points consistent), rises to `observed` (6+ data points with no contradictions). Falls toward `uncertain` if contradictions appear.

**Decay behavior:** Decays if the pattern is not reinforced in 6 consecutive months. A cadence pattern learned from 2024 interactions may no longer be valid in 2026 if the relationship has changed. Decayed pattern memories move to `weakened`, then `decayed`, then archive.

**Usage:** Calibrates Signal Engine thresholds for this entity (e.g., `contact_stale` fires at 28 days instead of 21 if the pattern shows this contact's natural cadence is 4 weeks). Enhances Preparation with timing context.

---

### Type 3 — Preference Memory

**What it is:** A stated or inferred preference expressed by a contact or company about how they like to work.

**Examples:**
- "This contact prefers quarterly check-ins over monthly calls."
- "The company's procurement team requires two weeks of review time before any signature."
- "Maria's communication channel preference is email over phone."

**What creates it:** Explicit notes ("They prefer..."), user corrections of behavior patterns, AI Core inference from interaction data (post-Alpha).

**Confidence trajectory:** `stated` if from explicit notes, `inferred` if AI-derived. Increases if reinforced; decreases or inverts if contradicted.

**Decay behavior:** Does not decay by time. Evolves when contradicted by new evidence. A preference memory for "prefers monthly calls" that is followed by six consecutive quarterly interactions evolves — the monthly preference memory updates to "quarterly."

**Usage:** Enhances Preparation content (timing, channel selection for outreach), improves Situation assessments (relationship health calibrated to the contact's actual preferences, not global defaults).

---

### Type 4 — Outcome Memory

**What it is:** The result of a significant business event: a deal outcome, a negotiation result, a relationship inflection point.

**Examples:**
- "The previous deal with Acme Corp stalled at the legal review stage — it took 45 days from proposal to signature."
- "Maria rejected the first pricing proposal but accepted the second at a 12% discount."
- "This company's previous partnership ended due to scope creep — they are sensitive to well-defined deliverables."

**What creates it:** Deal won/lost events, deal stage progression history, significant notes associated with major events.

**Confidence trajectory:** Created as `observed` (outcomes are facts, not inferences). Confidence does not decay.

**Decay behavior:** None. Outcomes are historical facts. They do not expire. A deal that stalled in negotiation in 2023 is still relevant context for a new deal with the same company in 2026.

**Usage:** Enhances Deal Workspace Decision section with historical precedent. Informs risk assessment when a similar pattern is detected in a new deal. Feeds `ai_pattern_detected` Signals when historical risk patterns match current deal state.

---

### Type 5 — Context Memory

**What it is:** Significant business context shared in an interaction that is not captured in any structured field but is relevant to future interactions.

**Examples:**
- "Maria mentioned in October that her company is going through a major ERP migration — internal budgets are frozen until Q2."
- "The CEO of Acme Corp was replaced in June — the new CEO is focused on cost reduction."
- "Marcus is moving to a new role at the end of Q3 and may not be the decision-maker after September."

**What creates it:** Notes containing significant context, AI Core extraction from email content (post-Alpha, with user consent).

**Confidence trajectory:** `stated` if from user-authored notes, `inferred` if AI-extracted. Context memory created from a single data point starts at `stated/uncertain` and requires confirmation (user acknowledgment or subsequent event consistency) to rise above `uncertain`.

**Decay behavior:** Decays in 12 months unless reinforced by a new reference to the same context. Business contexts change: the ERP migration is complete, the new CEO has been in role for 18 months and is no longer "new," the budget freeze has lifted. Unconfirmed context that is not reinforced within 12 months moves to `weakened`.

**Usage:** Surfaces in Preparation when context is relevant to the current Decision action. Triggers `context_memory_reminder` when a time-bounded context is approaching a significant date (e.g., "Marcus said he is moving to a new role at end of Q3 — that is in 3 weeks").

---

### Type 6 — Team Memory

**What it is:** Institutional knowledge about the relationship between specific team members and specific entities — who knows whom, who has history with what, who should be involved in what.

**Examples:**
- "Alex has a personal relationship with the CEO of Orbit Systems — deals with this company go faster when Alex is involved."
- "The previous account manager for Acme Corp was Sarah — she has context on the 2023 contract dispute."
- "This contact was originally introduced through a referral from our board member Julia."

**What creates it:** Interaction attribution patterns (who sends what to whom), explicit notes, relationship connections.

**Confidence trajectory:** `stated` if from explicit notes, `inferred` if from interaction attribution. Increases with reinforcement.

**Decay behavior:** Slow decay — 24 months of no reinforcement triggers `weakened` status. Team relationships tend to be durable; decay reflects reality (people leave, relationships become stale).

**Usage:** Enhances Deal and Contact Workspaces with team relationship context. Prevents coordination failures (two team members unknowingly working the same contact). Feeds team coordination Signals (post-Alpha).

---

### Type 7 — Risk Memory

**What it is:** A historical pattern or event that represents a risk profile relevant to future interactions with this entity.

**Examples:**
- "This contact stopped responding after a price negotiation began — previous deal was lost to silence."
- "This company's procurement team has ghosted two proposals in the past 18 months — they may not be serious buyers."
- "Deal velocity with this company drops sharply in August — likely due to summer vacations."

**What creates it:** Lost deal analysis, patterns of signal recurrence (a deal that fires `deal_stale` three times is a risk pattern), AI Core pattern detection from outcome + signal history.

**Confidence trajectory:** Starts at `inferred` (pattern detected, not yet confirmed as generalizable). Rises to `observed` if the pattern recurs. Risk Memory based on a single data point remains `inferred` permanently unless reinforced.

**Decay behavior:** Slow decay — 36 months without reinforcement. Risk patterns are historically significant and should not fade too quickly. However, a risk that was relevant in 2023 may no longer be relevant if the company has new leadership or the relationship has substantially changed.

**Usage:** Enhances Situation sections with risk context. Informs Decision priorities (a deal showing early signs of a previously-observed risk pattern should receive higher urgency). Feeds `ai_pattern_detected` Signals.

---

## Chapter 5 — Memory Sources

Memory is built from six input sources. Each source has different trust levels and different downstream confidence implications.

### Source 1 — User-authored Notes

**Trust level:** Highest. Notes are explicit, intentional statements by someone with direct knowledge of the relationship.

**What it produces:** Commitment Memory (commitments extracted from note content), Context Memory (business context explicitly noted), Preference Memory (stated preferences), Risk Memory (explicitly noted risks).

**Confidence contribution:** Notes create `stated` confidence memories. A note is not a pattern — it is a single data point. `stated` confidence memories require corroboration from another source to rise above `stated`.

**Limitation:** Notes may be outdated. A note from 18 months ago stating "Maria prefers weekly calls" may no longer be accurate. Memory must account for note age in confidence assessment.

---

### Source 2 — Deal Outcomes

**Trust level:** Highest. Deal outcomes are observable, unambiguous facts.

**What it produces:** Outcome Memory (what happened to this deal and why), Risk Memory (patterns of deal failure with this entity), Context Memory (company behavior derived from the deal lifecycle).

**Confidence contribution:** Outcome-based memories are created as `observed`. They do not require corroboration.

---

### Source 3 — Signal Archive

**Trust level:** High. Archived Signals represent conditions that were verified at threshold-crossing moments.

**What it produces:** Risk Memory (a deal that fired `deal_stale` three times is a risk pattern), Relationship Pattern Memory (a contact that fires `contact_stale` every 21 days has a natural 3-week cadence), Commitment Memory (overdue tasks that recur reveal follow-through patterns).

**Confidence contribution:** A single archived signal is `inferred` evidence. Three corroborating archived signals of the same type for the same entity become `observed` pattern evidence.

**Key principle:** The Signal Engine archives signals. Business Memory reads the archive. Business Memory never reads active signals — only archived (resolved) ones. Memory is built from history, not from current state.

---

### Source 4 — Interaction Patterns

**Trust level:** Medium. Patterns are AI-inferred from the timing, frequency, and attribution of interactions — not from explicit user statements.

**What it produces:** Relationship Pattern Memory (cadence, response behavior), Preference Memory (channel preference, meeting frequency), Team Memory (who interacts with whom).

**Confidence contribution:** Patterns begin as `uncertain` (single data point), rise to `inferred` with 3–5 consistent data points, and may reach `observed` with 6+ consistent data points across time.

---

### Source 5 — AI Core Extraction (post-Alpha)

**Trust level:** Medium. AI Core can extract meaningful context from email content, meeting transcripts, and structured interaction records — but AI extraction is always `inferred`, never `observed` or `stated`.

**What it produces:** Context Memory, Commitment Memory (commitments found in email threads), Preference Memory (communication style inferred from email tone and patterns).

**Confidence contribution:** AI-extracted memories start at `inferred`. They can rise to `stated` if the user confirms them, or to `observed` if corroborating evidence exists from another source.

**Requirement:** AI-extracted memories must pass the same evidence standard as all Memory items — they must name a specific, observable fact. "The email suggests Maria is uncertain about the timeline" is not valid evidence. "Maria's email states 'we won't be in a position to decide until after our Q3 board meeting'" is valid evidence.

**Privacy constraint:** Email content extraction requires explicit user consent per workspace. Opt-in, not opt-out. Memory derived from email content is marked with its source type and cannot be accessed by other workspace members without additional consent.

---

### Source 6 — User Corrections

**Trust level:** Highest. When a user explicitly corrects a memory item, the correction supersedes all other evidence.

**What it produces:** Updates to any existing memory type.

**Confidence contribution:** A user correction sets confidence to `stated` regardless of the previous confidence level. The user's direct knowledge overrides any system inference.

**What happens to prior evidence:** Prior evidence is retained in the memory item's history. The correction is marked as the authoritative current state. If the user later confirms the original inference was correct, they can revert.

---

## Chapter 6 — Memory Ownership

Memory belongs to the workspace. Not to a user. Not to the system. To the workspace.

### Workspace-level ownership

A memory item created in Workspace A is private to Workspace A. It is not visible to other workspaces. A company that operates multiple independent workspaces does not automatically share memory between them.

This is intentional. Memory is the accumulated intelligence of a specific team working with specific relationships. Sharing memory across workspaces without authorization would mix contexts — the memory about a prospect in one team's pipeline does not belong in another team's context.

### Entity-level scope

Within a workspace, memory is scoped to an entity (contact, company, deal). A Commitment Memory for Contact Maria Chen is retrievable when the Maria Chen Contact Workspace is open. It is also retrievable when the Deal Workspace for a deal linked to Maria Chen is open — because the deal context is related to the contact context.

Cross-entity memory retrieval is governed by the relationship graph: entities that are linked share memory relevance, but not memory ownership. Maria's Commitment Memory belongs to her Contact entity. When a Deal Workspace opens, it may retrieve that memory — but it does not own it.

### Ownership transfer

When an entity is reassigned (a contact's owner changes from Alex to Sarah), the entity's Memory transfers with it. Memory belongs to the relationship, not to the person who built it. Sarah inherits Alex's accumulated understanding of Maria Chen — she does not start from zero.

This is the institutional memory principle from the Product Bible: Gunimi remembers so that the organization does not lose context when individuals change.

### What ownership does not mean

Ownership is not permission control at the memory-item level in v1.0. A workspace member who can see a Contact Workspace can see the memory items surfaced in that Workspace. Memory-level access control is a post-Alpha consideration.

---

## Chapter 7 — Memory Confidence

Memory confidence is the system's honest assessment of how reliable a memory item is.

| Level | Meaning | Surfacing behavior |
|-------|---------|-------------------|
| `observed` | Directly observable fact or strongly corroborated inference | Surfaced to AI Core and to Workspace surfaces when relevant |
| `stated` | Explicitly written by a user | Surfaced to AI Core and to Workspace surfaces; flagged for corroboration over time |
| `inferred` | AI-derived pattern, not yet corroborated | Surfaced to AI Core; surfaced to Workspace surfaces only with supporting evidence, not as standalone fact |
| `uncertain` | Single data point, not enough to claim pattern | Not surfaced; held in Memory for potential reinforcement |

### Confidence is transparent to AI Core

AI Core uses confidence level as a weight in its processing. A `stated` memory about a commitment is more reliable than an `inferred` pattern about a cadence. AI Core does not treat all memories equally.

### Confidence is never exposed to users

Users do not see confidence levels. They do not see "Maria's preference for quarterly calls (confidence: inferred)." They see the preference expressed in natural language, and they have the agency to confirm or correct it. The confidence system is internal — it governs what is surfaced and how prominently, but it does not create a UI layer that users must interpret.

### Confidence and the Grammar

Workspace Grammar Invariant 10: "When evidence is insufficient, this is stated honestly. Fabricated confidence destroys trust."

Memory applies this invariant directly: a memory item at `uncertain` confidence is never surfaced to any user-facing surface. The system is honest about what it knows and what it does not know. Surfacing an `uncertain` memory as if it were reliable is a confidence fabrication violation.

---

## Chapter 8 — Memory Visibility

Memory is invisible infrastructure. Users do not browse memory. Users do not manage memory lists. Users experience memory through the quality of intelligence in other surfaces.

### How Memory becomes visible

**In Preparation sections (Workspace):**
Memory items relevant to the current entity and the current Decision action appear in the Preparation section as contextual items. They are expressed in natural language, as assembled facts — not as "memory entries." The user reads: "Last conversation: Maria mentioned their Q4 budget freeze lifts in January." They do not read "Context Memory: confidence:stated, source:notes, created:2025-10-14."

**In Situation sections (Workspace):**
Pattern Memory and Risk Memory may inform the Situation section when they are directly relevant to the current state. "This contact's last three interactions have followed a 21-day response cycle — the current 28-day silence is unusual" is a Situation observation that Memory made possible.

**In Decision sections (Workspace):**
Memory informs the evidence sentence in the Decision recommendation. "Follow up on this deal — Maria's previous deal took 6 weeks at this stage, and you're now at week 8" is a Decision that uses Outcome Memory. The recommendation is grounded in specific historical evidence that only Memory can provide.

**In Today (Memory Signals, Tier 4):**
Memory Signals surface when a memory item becomes time-sensitive — a commitment approaching its implied deadline, a context that is about to expire (Marcus's new role starts next week). These signals only appear in Today when no Tier 1, 2, or 3 signals exist. See Signal Engine Blueprint, Chapter 5, Category 6.

### What Memory never does

Memory never:
- Creates its own tab, section, or view in any Workspace
- Shows its confidence level, source, or creation date to users
- Surfaces "AI says..." or "Memory suggests..." labels
- Creates a notification separate from the Signal Engine
- Becomes a searchable database in v1.0

Memory is ambient intelligence. It improves the environment without announcing itself.

---

## Chapter 9 — Memory Editing

Users have complete agency over their Memory. The system's memory is always subordinate to the user's direct knowledge.

### What users can do

**Confirm a memory:**
When Memory surfaces a memory item in Preparation or Situation, the user may confirm it ("Yes, this is accurate"). Confirmation raises the confidence level and marks the memory as user-verified.

**Correct a memory:**
When a surfaced memory is wrong, the user corrects it. The correction becomes the authoritative current state. The prior content is retained in the memory item's history — not deleted. Confidence resets to `stated` under the correction.

**Delete a memory:**
Users may permanently delete a memory item. Deletion is permanent and cannot be recovered. Deletion removes the item from the active Memory store and marks it in the archive as user-deleted. Deleted memories are not fed to AI Core.

**Add a memory manually:**
Users may create a memory item directly from a note or from a conversation. This is a direct write to Memory — the most reliable path. Manually added memories are created with `stated` confidence.

### What editing does not do

Editing a memory does not retroactively change the signals or decisions that were influenced by it while it was active. Memory is used at the moment of retrieval — past retrievals are not retroactively corrected.

Editing a memory does not prevent the system from detecting the same pattern again from new evidence. If a user deletes a Risk Memory about a company stalling in negotiations, and that company stalls again in a new deal, AI Core will detect the new signal archive pattern and may create a new Risk Memory item. Memory deletion removes the item, not the underlying reality.

### The editing principle

The system never prevents editing. It never warns users that "deleting this memory may reduce recommendation quality." Users know their business better than the system does. Their agency is absolute.

---

## Chapter 10 — Memory Decay

Not all memory types are permanent. Memory that is not reinforced by new evidence gradually becomes unreliable and must eventually stop being surfaced.

### Decay rates by memory type

| Memory Type | Decay period | What triggers decay |
|-------------|-------------|---------------------|
| Commitment Memory | No decay | Resolves on fulfillment only |
| Relationship Pattern Memory | 6 months without reinforcement | Pattern not observed in 6 consecutive months |
| Preference Memory | No time decay — evolves on contradiction | New contradicting evidence |
| Outcome Memory | No decay | Historical facts are permanent |
| Context Memory | 12 months without reinforcement | Context not referenced in 12 months |
| Team Memory | 24 months without reinforcement | Relationship not observed in 24 months |
| Risk Memory | 36 months without reinforcement | Risk pattern not observed in 36 months |

### The decay process

Decay is not binary (active → archived). It is gradual:

```
Active (confidence: inferred or observed)
  ↓ [decay period begins without reinforcement]
Weakened (confidence: uncertain — no longer surfaced)
  ↓ [additional time without reinforcement]
Decayed (confidence below minimum — queued for archival)
  ↓ [archival trigger]
Archived (retained for historical reference, not surfaced)
```

A weakened memory that receives reinforcement (a new interaction consistent with the pattern) is restored to its prior confidence level without going through the full formation process.

### Why decay matters

Memory that persists indefinitely without reinforcement becomes noise. A Relationship Pattern Memory from 2024 about a contact who has since changed companies is worse than no memory — it surfaces outdated context as if it were current intelligence. Decay ensures Memory ages appropriately with reality.

---

## Chapter 11 — Memory Merging

When multiple memory items describe the same insight from different sources, they should merge into a single, higher-confidence memory.

### Merge conditions

Two memory items are candidates for merging when:
1. They describe the same entity
2. They describe the same observable phenomenon (same pattern, same preference, same risk)
3. They are of the same memory type
4. They are not contradictory (contradictory memories evolve, not merge)

### What merging produces

A merged memory item:
- Inherits the content of both source items (synthesized, not concatenated)
- Carries the higher of the two confidence levels as its starting confidence
- Records both source types in its evidence list
- Retains the older creation date (the insight was first formed earlier)

**Example:**

Memory A: "Maria prefers morning calls" (Source: user note, confidence: `stated`)
Memory B: Interaction pattern showing Maria replies to morning emails within 30 minutes (Source: AI Core, confidence: `inferred`)

Merged Memory: "Maria is most responsive in the morning" (Sources: stated + inferred, confidence: `observed` through corroboration)

The merged memory is stronger than either source individually. Corroboration is the mechanism by which inferred patterns become trustworthy intelligence.

### What merging does not do

Merging does not produce a new memory type. Two Preference Memories merge into a Preference Memory with broader evidence. A Preference Memory and a Context Memory for the same entity about the same phenomenon do not merge — they remain separate types that may both be surfaced in relevant contexts.

Merging is performed by AI Core, not by users. Users may see the merged result in Workspace surfaces and may correct or confirm it. They do not initiate merges manually.

---

## Chapter 12 — Memory Summarization

Over time, the evidence base for a memory item grows. A Relationship Pattern Memory with two years of interaction data has accumulated hundreds of individual interaction records contributing to its confidence. The memory system does not retain every raw data point indefinitely.

### How summarization works

When a memory item's evidence base exceeds a density threshold, AI Core summarizes the evidence into a higher-level statement and retains a representative sample of the raw data points rather than every instance.

**Before summarization:** "Maria responded within 2 hours on 2024-03-14 (Tuesday morning), within 1.5 hours on 2024-03-26 (Tuesday morning), within 3 hours on 2024-04-09 (Wednesday morning)... [47 more entries]..."

**After summarization:** "Maria consistently responds within 1–3 hours to morning messages. Pattern observed across 50 interactions over 18 months. Representative examples: [3 data points]."

The summarized memory is functionally identical for AI Core purposes — it carries the same pattern, the same confidence, and the same entity scope. The summarization makes the evidence base manageable without losing the intelligence.

### What summarization never does

Summarization never changes the memory's confidence level downward. If the full evidence base supported `observed` confidence, the summarized version retains `observed` confidence. Summarization compresses evidence — it does not degrade it.

Summarization never removes Outcome Memory or Commitment Memory data. These memory types are not density-based — they are event-based. Every outcome and every unfulfilled commitment is retained in full.

---

## Chapter 13 — Memory Retrieval

Memory is retrieved when AI Core needs it — not continuously. Retrieval is context-driven and selective.

### Retrieval triggers

**Workspace load:** When a user opens a Deal, Contact, or Company Workspace, AI Core queries Memory for all active memory items scoped to that entity. This query is the basis for Preparation and Situation enhancements.

**Signal evaluation:** When AI Core evaluates a potential Memory Signal (Tier 4), it queries Memory for the specific entity to determine whether the signal is warranted and what evidence to include.

**Today preparation:** When Today renders, AI Core queries Memory across all workspace entities to determine whether any Commitment Memory or Context Memory is time-sensitive enough to produce a Memory Signal.

**Threshold calibration:** When Signal Engine resolvers are parameterized, AI Core queries Relationship Pattern Memory to determine whether entity-specific thresholds apply (e.g., a contact with an `observed` 4-week response cadence uses 28 days as the `contact_stale` threshold instead of the global 21 days).

### Retrieval ranking

Memory items retrieved for a specific context are ranked by relevance. Not all active Memory for an entity is surfaced — only what is relevant to the current context.

Relevance criteria (in priority order):
1. **Time-sensitivity** — Commitment Memories with an implied deadline are ranked first
2. **Decision alignment** — Memory items directly relevant to the current Decision action are ranked higher
3. **Recency of reinforcement** — Recently reinforced memories are preferred over stale ones
4. **Confidence level** — Higher-confidence memories are ranked above lower-confidence ones

Memory items that are active but not ranked in the relevant set for a specific retrieval are not discarded — they remain in Memory for the next retrieval.

### What retrieval surfaces

The Preparation section may surface 1–3 Memory items per Workspace load, depending on relevance. More than 3 Memory items in Preparation is a violation of the Workspace Grammar (Preparation assembles; it does not enumerate all known context). The most relevant Memory items are selected; the rest remain available for future retrievals.

---

## Chapter 14 — Memory Relationships

Memory items are not isolated facts. They exist in relationship to each other.

### Entity relationships

A memory item is scoped to an entity (contact, company, deal). When entities are related — a contact belongs to a company, a deal is linked to both a contact and a company — their memories are related.

A Commitment Memory for Maria Chen (contact) is retrievable in the context of Deal X (deal linked to Maria) and Acme Corp (company where Maria works). The memory is scoped to the contact entity, but its retrieval scope extends to related entities.

### Temporal relationships

A Context Memory and an Outcome Memory for the same entity may be temporally related: "Maria mentioned their Q4 budget freeze" (Context Memory, created November 2024) → "Deal stalled in December 2024 when pricing discussion began" (Outcome Memory, created December 2024). These two memories, viewed together, tell a richer story than either alone.

AI Core maintains temporal relationships between memory items for the same entity. When generating enhanced Situation content, AI Core may synthesize across temporally related memories to produce a richer assessment.

### Causal relationships

Some memory items have causal relationships: an Outcome Memory may have been preceded by a Risk Memory that predicted the outcome. When AI Core detects this causal pattern, it strengthens the Risk Memory's confidence — if the risk was predicted and confirmed, the risk profile is reliable.

### Memory relationship limits

In v1.0, memory relationships are not user-visible. Users do not see a "memory graph." Memory relationships are internal to AI Core. Their existence improves the quality of AI Core's reasoning without creating a navigable structure that users must manage.

---

## Chapter 15 — The Ten Design Questions

These questions must be answered whenever a new business practice, workflow, or product decision might affect Business Memory. They are the evaluative framework for any proposed change to the Memory layer.

---

### Question 1 — What becomes Memory?

An event or observation becomes Memory when:
1. It represents understanding that cannot be re-derived from current structured data alone
2. It is specific enough to name a fact about a relationship, pattern, commitment, or outcome
3. It meets the evidence threshold for at least `uncertain` confidence
4. It belongs to one of the seven defined Memory types (Chapter 4)

**What this excludes:**
- Generic observations without entity specificity ("business in Q4 is often slow" — no named entity)
- Observations that can be re-derived from structured data at any time ("this contact has 3 active deals" — derivable from the database)
- Current-state facts ("the deal is in Proposal stage" — this is a live data field, not memory)
- Activity log entries ("email sent at 14:32 on 2026-07-01" — this is a record, not intelligence)

---

### Question 2 — What never becomes Memory?

The following never enter Business Memory, regardless of source:

**Product engagement data.** How often a user logs in, what features they use, how many records they've created — these are product metrics, not business intelligence. Memory is about the user's relationships, not the user's relationship with Gunimi.

**Sentiment scores.** "This relationship has a positive sentiment score of 0.74." Scores require interpretation. Memory surfaces understanding. See Today Experience Blueprint Task 5 — natural language health assessments, not scores.

**Volume metrics.** "47 emails sent to this contact." Volume is a record. "Maria responds fastest to emails sent on Tuesday morning" is Memory drawn from that volume.

**Conversations about the software.** User discussions about Gunimi features, onboarding questions, support interactions — these are not business relationship memory.

**Unverified AI speculation.** "Based on sentiment analysis, this contact may be losing interest." May be — is not evidence. Memory requires a specific, named fact. Speculation is not memory.

**Deleted or withdrawn content.** A note that a user deletes has been intentionally removed. Its content does not become Memory. A memory item derived from that note (before deletion) is not automatically deleted — but the user may delete the memory item separately.

---

### Question 3 — When does Memory expire?

Memory expires through four mechanisms:

1. **Event resolution** (Commitment Memory) — a commitment is fulfilled; the memory resolves.
2. **Time-based decay** (Relationship Pattern, Context, Team, Risk Memory) — see Chapter 10 for decay periods per type.
3. **Contradiction evolution** (Preference Memory) — a preference is contradicted by new evidence; the memory evolves rather than expires.
4. **User deletion** — explicit user action; permanent.

Entity archival triggers archival of all associated memories. When a deal is closed (won or lost), all memory items scoped primarily to that deal move to archived status. Memory items shared with the associated contact or company (cross-entity scope) remain active.

---

### Question 4 — When should Memory merge?

Memory should merge when two items:
1. Describe the same entity
2. Describe the same phenomenon
3. Are the same memory type
4. Are corroborating (not contradictory)

Merge is performed by AI Core. The result is a higher-confidence, synthesized memory item. The contributing items are retained in archive. The merged item replaces both in the active Memory store.

Memory should NOT merge when:
- Items describe related but distinct phenomena (a Preference Memory for meeting frequency and a Preference Memory for communication channel are distinct even for the same entity)
- Items are contradictory (contradictions trigger evolution, not merge)
- Items are of different types (a Commitment Memory and an Outcome Memory are not merge candidates even if they describe the same event)

---

### Question 5 — How does AI update Memory?

AI Core updates Memory through four operations:

1. **Creation** — detecting a new pattern, commitment, or insight from source data and creating a new memory item.
2. **Reinforcement** — detecting evidence consistent with an existing memory and increasing its confidence level.
3. **Evolution** — detecting evidence that contradicts an existing memory and updating the memory's content while retaining the prior version.
4. **Merging** — detecting two memory items that describe the same insight and merging them into a single, higher-confidence item.

AI Core never:
- Deletes memory items autonomously (only users delete)
- Changes memory confidence from `stated` to `inferred` (stated memories are user-authored; AI Core may only add corroborating evidence, not downgrade user authority)
- Creates memory without specific, named evidence (the same evidence standard as the Signal Engine applies)
- Updates memory at a rate that would produce noise (Memory updates are batch operations, not real-time)

---

### Question 6 — How do users edit Memory?

See Chapter 9 (Memory Editing) for the full specification.

The key principle: user agency is absolute. The system never resists, warns against, or limits user editing of Memory. Users know their business better than the system does. The system's role is to accumulate understanding; the user's role is to ensure that understanding is accurate.

---

### Question 7 — How does Memory interact with Signals?

The relationship is circular by design:

```
Interactions → Signals (ephemeral, active)
Signals (resolved) → Signal Archive
Signal Archive → AI Core reads archived signals
AI Core → creates Memory from signal patterns
Memory → AI Core calibrates Signal thresholds
Memory → AI Core produces Memory Signals (Tier 4)
Memory Signals → Today (Focus, when no higher-tier signals exist)
```

**Memory reads signals, never produces them.**
Business Memory reads the Signal Archive as one of its sources. It does not read active signals — only resolved and archived ones. Memory is built from history.

**Signals read Memory, through AI Core.**
Signal Engine resolvers (deterministic) do not read Memory directly. AI Core reads Memory, calibrates resolver thresholds, and produces Tier 4 Signals. The Signal Engine itself is never Memory-aware — AI Core is the intermediary.

**Memory does not suppress Signals.**
A memory item that indicates a relationship is healthy does not suppress a `contact_stale` signal. Signals are based on current state. Memory provides historical context. They operate independently, with AI Core as the bridge.

---

### Question 8 — How does Memory interact with Workspaces?

Memory enhances three of the five Workspace sections:

**Preparation:** Memory items relevant to the current Decision action are surfaced as contextual briefing items. The Preparation section shows the assembled context the user needs for the current recommended action — Memory provides the historical portion of that context (what was promised, what was said, what happened last time).

**Situation:** Pattern Memory and Risk Memory inform the Situation section's assessment. "This contact has historically taken 4 weeks to respond — the current 5-week silence is a significant deviation from their pattern" requires Pattern Memory. Without Memory, the Situation can only report "no contact in 35 days."

**Story:** The Story section is Memory made legible. The Story is the curated narrative of what happened — Memory is the engine that synthesizes raw interaction data into a narrative arc. Memory tells Story which events were milestones and which were routine. The Story section renders; Memory provides the meaning.

**Decision:** Memory enhances the evidence sentence in the Decision recommendation, grounding it in specific historical facts rather than general observations.

Memory does not affect:
- **Context:** The Context tab shows current connections, not historical patterns. Memory is historical; Context is present.

---

### Question 9 — How does Today use Memory?

**In Open Alpha:** Today uses Memory indirectly — through the Signal Engine's Tier 4 signals. When AI Core detects a time-sensitive Memory item (a commitment approaching its implied deadline, a context that is about to expire), it produces a Memory Signal. If no Tier 1, 2, or 3 signals exist for the current user, Today may surface a Tier 4 Memory Signal in the Focus card.

**Post-Alpha (AI Daily Brief):** Today will use Memory directly through AI Core to generate a natural language daily brief. This brief synthesizes the current state of the business (from signals) with historical patterns and stored context (from Memory) to produce an orientation that is impossible to generate from current data alone.

**What Today never does with Memory:**
- Today does not show raw memory items
- Today does not create a "memory digest" section
- Today does not surface memory items in Relationship Signals (that section is driven by Tier 2 signals, not Memory)
- Today does not surface Memory in a form that the user must read separately from the Focus card or Attention Required

Memory in Today is invisible — it makes Focus better, not more cluttered.

---

### Question 10 — How does AI use Memory?

AI Core uses Memory in four distinct ways:

**1. Threshold calibration**
AI Core reads Relationship Pattern Memory for each entity before applying Signal Engine resolver thresholds. If a contact's observed cadence is 28 days (Pattern Memory: `observed`), the `contact_stale` threshold for that contact is calibrated to 35 days rather than the global 21-day default. The Signal fires less aggressively for contacts where silence is normal — and more significantly when the silence genuinely exceeds their established pattern.

**2. Memory Signal production**
AI Core reads active Memory for all workspace entities and evaluates whether any memory item is time-sensitive. A Commitment Memory with an implied deadline, a Context Memory about a date-bound event approaching — these become Memory Signals (Tier 4, Category 6 in the Signal Engine).

**3. Workspace surface enhancement**
When a Workspace loads, AI Core retrieves relevant Memory items and provides them to Workspace resolvers (Preparation, Situation, Decision). The resolvers incorporate these items into their output using the same locale-key pattern as all other resolver content. AI Core does not render directly — it provides data to the resolvers.

**4. Pattern synthesis (post-Alpha)**
AI Core analyzes the relationship between Signal archive patterns, Outcome Memory, and Context Memory to detect complex patterns that no single Memory type reveals. "This company's deals consistently stall in Q4, particularly in December — and the current deal has shown `deal_stale` signal behavior twice in the past 3 months" is a synthesis that requires cross-type Memory analysis.

---

## Chapter 16 — What Must Never Happen

These are the anti-patterns that Business Memory must prevent by design.

---

**Anti-pattern 1 — Memory as a browsable list**

Memory items are exposed in a "Memory" tab or section where users can scroll through their stored memories, filter them, and manage them like a database.

*What goes wrong:* Memory becomes another surface the user must maintain. Instead of the system remembering for the user, the user is now managing the system's memory. The cognitive burden is transferred, not absorbed.

*Prevention:* Memory is invisible infrastructure. It has no dedicated view in v1.0. Users interact with memory through Workspace surfaces and through the correction flows in Preparation and Situation sections — never through a memory browser.

---

**Anti-pattern 2 — Fabricated memory from insufficient evidence**

AI Core creates a Risk Memory item: "This contact is likely to ghost after price negotiation" based on one deal interaction.

*What goes wrong:* A single data point is `uncertain`. Surfacing it as memory — especially as a Risk Memory — attributes a risk profile to the contact that is not yet supported. The system claims knowledge it does not have.

*Prevention:* Confidence rules (Chapter 7) and evidence standards (Chapter 15, Question 1) prohibit single-data-point pattern claims. One instance starts at `uncertain` and does not surface.

---

**Anti-pattern 3 — Memory exposed as AI**

A Preparation item reads: "Gunimi AI Memory: Maria prefers morning calls (detected from 47 interactions)."

*What goes wrong:* The AI identification violates Workspace Grammar Invariant 8. The user's attention shifts to evaluating the AI rather than acting on the information.

*Prevention:* Memory items surface as assembled facts in natural language. "Maria is most responsive to morning outreach" — no source attribution, no confidence badge, no AI label. The intelligence is infrastructure.

---

**Anti-pattern 4 — Memory replacing current data**

A Risk Memory says "this company stalls at legal review." The current deal is at the legal review stage. The Situation section skips the normal state assessment and surfaces only the Risk Memory: "This company historically stalls here — the deal may be at risk."

*What goes wrong:* Memory has replaced Signal and current-state assessment. The current deal may be proceeding on schedule — but Memory has created urgency where none exists. Memory informs current assessment; it does not replace it.

*Prevention:* Memory enhances Signal-driven assessments. The Situation section uses current signals as primary and Memory as secondary context. If no Signal supports the Risk assessment, Memory does not create one independently.

---

**Anti-pattern 5 — Memory that never decays**

Every Context Memory created is treated as permanent. A context note from 2023 about a company's restructuring continues to be surfaced in 2026 as relevant context.

*What goes wrong:* Outdated memory becomes noise, then misinformation. The 2023 restructuring is complete. The context is no longer relevant. But the Preparation section continues to surface it, creating false context for current interactions.

*Prevention:* Decay rules (Chapter 10) are enforced. Context Memory decays in 12 months without reinforcement. Users who encounter outdated Memory in Preparation can correct or delete it.

---

**Anti-pattern 6 — User edits blocked**

The system warns: "Deleting this memory may reduce AI recommendation quality. Are you sure?" before allowing a user to delete a memory item.

*What goes wrong:* The system is placing its own intelligence above the user's judgment. The user knows their relationship better than the system does. Friction on user edits is a form of coercion — the system is making it harder to correct its own errors.

*Prevention:* Editing and deletion have no friction beyond a standard confirmation for permanent actions. No quality warnings. No quality scores. User agency is absolute.

---

## Chapter 17 — Memory Invariants

These are the non-negotiable properties of Business Memory. Any implementation that violates these invariants is incorrect.

---

**Invariant 1 — Evidence before formation.**
A memory item is not created without specific, named evidence. General patterns, vague observations, and AI speculation do not qualify as evidence. The evidence standard is the same as the Signal Engine: name the entity, name the fact, name the observable condition.

**Invariant 2 — Confidence is honest.**
A memory item's confidence level reflects the quality and quantity of its evidence base. No memory is surfaced above its actual confidence level. `uncertain` memories are never surfaced to any user-facing layer.

**Invariant 3 — Memory is not visible as memory.**
No surface exposes memory items as "memory." Users see the assembled facts that Memory provides — not the memory layer itself. Memory has no UI in v1.0.

**Invariant 4 — No AI identification.**
Memory items surfaced in Workspace sections do not carry labels, badges, icons, or language that identifies them as AI-generated or as memory-derived. They are expressed as assembled facts in natural business language.

**Invariant 5 — User editing is unconditional.**
Users may confirm, correct, or delete any memory item without restriction, friction, or warning beyond a standard permanent-action confirmation. The system never resists user edits.

**Invariant 6 — User corrections supersede all other evidence.**
When a user corrects a memory item, the correction is the authoritative current state regardless of what other evidence exists. Prior evidence is retained in history — the user's knowledge is always the primary source.

**Invariant 7 — Memory belongs to the workspace.**
Memory is workspace-scoped. No memory crosses workspace boundaries without explicit authorization. Ownership transfers with entity reassignment.

**Invariant 8 — Decay is enforced.**
Decay-eligible memory types (see Chapter 10) must decay when the decay period is reached without reinforcement. Undecayed outdated memory is worse than no memory.

**Invariant 9 — Memory reads signals; signals do not read memory.**
Business Memory reads the Signal Archive (Consumer 7 in the Signal Engine). Signal Engine resolvers do not read Memory directly. The AI Core is the intermediary. This separation prevents circular dependencies between the Signal Engine and Business Memory.

**Invariant 10 — Memory informs; it does not replace.**
Memory enhances current-state assessments in Workspace sections. It does not override or replace Signal-driven assessments. If Memory suggests a risk and no current Signal corroborates it, the Decision section does not surface the risk as a recommendation.

**Invariant 11 — Deleted memories are not re-created from the same data.**
When a user deletes a memory item, the deletion is recorded against the source event or data point that created it. AI Core will not re-create the same memory item from the same evidence. New evidence from new interactions may eventually produce a new memory of the same type — but deleted memories are not revived.

**Invariant 12 — Product engagement is never Memory.**
User interaction with Gunimi (login frequency, feature usage, records created) does not enter Business Memory. Business Memory is about the user's relationships, not the user's relationship with the software.

---

## Chapter 18 — Open Alpha Scope

### In scope for Business Memory v1.0

Business Memory v1.0 is post-Alpha. The full Memory layer requires AI Core and is not available at Open Alpha launch.

However, the architectural foundation must be established in Open Alpha so that Memory can be built incrementally:

**Signal archive:** The Signal Engine must archive all resolved signals from Day 1. This is the primary input for Memory pattern detection. If signals are not archived from the beginning, the pattern detection that Memory depends on has no historical data to work with. Signal archival is a v1.0 (Open Alpha) requirement, even though Business Memory itself is post-Alpha.

**User-authored notes structure:** Notes must be structured to support memory extraction. This does not require AI extraction in Open Alpha — it requires that notes are stored with sufficient metadata (entity scope, timestamp, author) that AI Core can process them post-Alpha.

**Memory type definitions:** All seven Memory types are defined in this document. Implementations that touch relevant data (notes, outcomes, signals) should be designed with these memory types in mind, even if the extraction layer does not yet exist.

### Deferred to post-Alpha

**AI Core integration** — Memory creation, reinforcement, evolution, and merging all require AI Core.

**Memory Signals (Tier 4)** — defined in Signal Engine Blueprint Category 6; requires AI Core.

**Threshold calibration** — AI Core calibrating Signal Engine resolver thresholds based on Pattern Memory.

**Email content extraction** — AI Core extracting Commitment and Context Memory from email threads (requires email integration AND explicit user consent).

**Memory surfaces** — any UI for confirming, correcting, or editing memory items (requires Memory to exist first).

**Cross-entity memory synthesis** — AI Core synthesizing across related entity memories to detect compound patterns.

**AI Daily Brief in Today** — the post-Alpha Today feature that requires Memory to generate natural language day preparation.

### What Memory enables that cannot be done without it

These are the intelligence improvements that are explicitly impossible at Open Alpha and become possible when Business Memory is complete:

1. Signal thresholds calibrated per entity (Maria's `contact_stale` fires at 28 days, not 21)
2. Decision evidence sentences grounded in historical precedent ("Maria's previous deal took 6 weeks at this stage")
3. Preparation items that reference commitments made in prior interactions ("You committed to sending a case study")
4. Situation assessments that detect deviations from established patterns ("This contact's silence is unusual given their typical 2-week response cycle")
5. Tier 4 Memory Signals surfacing dormant but time-sensitive context ("Marcus mentioned he's moving to a new role — this week is the transition")
6. AI Daily Brief — a natural language morning orientation that incorporates historical intelligence

---

## Chapter 19 — Memory Identity

A memory item that cannot be traced is a memory item that cannot be trusted.

As Gunimi builds toward the intelligence chain `Signal → Memory → Decision → Automation`, every step must be auditable. Memory Identity is the layer that makes auditing possible — not just for debugging, but for enterprise trust, regulatory readiness, and the AI reasoning that will traverse this chain in the future.

### The Identity Contract

Every memory item carries the following identity fields in addition to its type and content:

| Field | Type | Description |
|-------|------|-------------|
| `memoryId` | string | Globally unique, stable identifier. Never reused after archive. The anchor of the traceability chain. |
| `workspaceId` | string | The workspace this memory belongs to. Memory never crosses workspace boundaries. |
| `entityId` | string | The specific entity this memory describes (contact, deal, company). |
| `entityType` | `EntityType` | `deal · contact · company` |
| `createdFrom` | `MemorySource` | The category of input that created this memory: `note · signal_archive · interaction_pattern · ai_extraction · user_manual` |
| `signalIds` | string[] | Array of `signalId`s from the Signal Archive that contributed to forming or reinforcing this memory. Empty for memories created exclusively from notes. The bridge between the Signal Engine and Business Memory. |
| `evidenceIds` | string[] | Array of specific record IDs that constitute the evidence base: note IDs, email IDs, activity IDs, meeting IDs. Provenance at the record level. |
| `revision` | integer | The current revision number. Starts at 1. Increments with every update — reinforcement, evolution, correction, or merge. |
| `version` | string | Semantic version (`major.minor`). See Chapter 20. |
| `createdBy` | `MemoryActor` | Who created this memory: `system · user · ai_core` |
| `updatedBy` | `MemoryActor` | Who last updated this memory: `system · user · ai_core` |
| `createdAt` | Date | When this memory was first formed. |
| `updatedAt` | Date | When this memory was last modified. |

### Why Memory Identity matters

**Full chain traceability:**
The intelligence chain `Signal → Memory → Decision → Automation` is only traversable if every node carries a stable identity. `signalIds` links Memory to the Signal Engine. `memoryId` is what a Decision surface records when it used this memory item. When an automation fires, it records the `memoryId` that justified the trigger. The chain is reconstructible end-to-end.

**Provenance on demand:**
`evidenceIds` answers "what specific records made this memory true?" at the record level. A Commitment Memory can point to the exact note ID where the commitment was written. An Outcome Memory can point to the specific deal record that produced the outcome. This is not logging — it is structured evidence linkage.

**Correction scoping:**
If a user deletes a note (`note_id:abc123`) that was listed in a memory item's `evidenceIds`, the system can identify which memory items depended on that note and flag them for review. The user is not automatically losing memory they rely on — they are being informed that a source has changed.

**Audit readiness:**
An enterprise customer asks: "Why did Gunimi recommend not pressuring this contact in Q2?" The answer is traceable: `memoryId:m_771` → `signalIds: [sig_4821, sig_4903]` → `evidenceIds: [note_id:n_012, email_id:e_089]` → "Contact declined two follow-up calls in three weeks after a pricing conversation." That is an auditable answer. A black box is not.

**CreatedBy and UpdatedBy in practice:**
A memory created by `ai_core` and never touched by a user carries different inherent weight than a memory created by `user` directly. When `updatedBy: user` is present, the memory has been explicitly validated by a human — it carries the highest trust level regardless of original `confidence`. This distinction informs how AI Core weights memories in its reasoning.

---

## Chapter 20 — Memory Versioning

Evolution (Chapter 3) describes that a memory changes over time. Versioning is the explicit, auditable record of what it said at each point in that change.

Without versioning, a memory that has been corrected three times shows only its current content. The history of what was believed at each stage — who believed it, on what evidence, when — is lost. Versioning preserves that history permanently.

### Version structure

Every version in a memory item's version history records:

| Field | Type | Description |
|-------|------|-------------|
| `version` | string | Semantic version string: `1.0`, `1.1`, `2.0` |
| `content` | string | The full text of the memory item at this version |
| `confidence` | `MemoryConfidence` | Confidence level at this version |
| `changedBy` | `MemoryActor` | `system · user · ai_core` |
| `changeReason` | `VersionChangeReason` | `initial · reinforcement · contradiction · correction · merge · summarization` |
| `timestamp` | Date | When this version was created |
| `evidenceIds` | string[] | Evidence base at this version (may differ from current) |

### Major vs minor versions

**Major version** (v1 → v2): The substance of the memory changes. This happens when:
- A user corrects the memory (`correction`)
- New evidence fundamentally contradicts the prior content (`contradiction`)
- Two memories merge and the result is a new synthesis (`merge`)
- AI Core detects the memory is no longer valid and replaces it

**Minor version** (v1.0 → v1.1): The confidence level or evidence base changes without the core content changing. This happens when:
- AI Core reinforces the memory with new corroborating evidence (`reinforcement`)
- Evidence is summarized (`summarization`) — content simplified but meaning preserved
- Wording is clarified without changing meaning

### Versioning in practice

A Relationship Pattern Memory for a contact might evolve over 18 months:

```
v1.0 (2024-09-01 · created by ai_core · confidence: uncertain)
  "Maria tends to respond to messages in the morning."
  Evidence: 2 email interactions with morning response times.

v1.1 (2024-11-14 · updated by ai_core · confidence: inferred)
  "Maria tends to respond to messages in the morning."
  Evidence: 11 interactions now corroborate the morning pattern.

v2.0 (2025-02-20 · updated by user · confidence: stated)
  "Maria is available for calls between 8–10am and explicitly prefers morning outreach."
  Evidence: Note added by user: 'Maria confirmed morning preference in our call today.'
  ChangeReason: correction — user clarified with direct confirmation.

v2.1 (2025-08-07 · updated by ai_core · confidence: observed)
  "Maria is available for calls between 8–10am and explicitly prefers morning outreach."
  Evidence: 34 additional interactions confirm morning response pattern.
  ChangeReason: reinforcement — no content change, confidence upgraded.
```

This version history tells a complete story: AI Core detected the pattern, built confidence over time, a user confirmed it directly, and AI Core continued to validate it for months afterward. An enterprise auditor can read this history and understand exactly how this knowledge was formed.

### What versioning enables

**Knowledge audit:** "What did we know about this company in Q3 2024 vs Q1 2026?" is a query over version history.

**Trust calibration:** A memory that has been corrected by a user three times may indicate that AI Core consistently extracts the wrong pattern for this entity type. That is a signal for AI Core improvement.

**Rollback:** If a user corrects a memory and later determines the original was correct, the prior version is available in history. The user can revert explicitly.

**No version is ever deleted:** Version history is append-only. The current content is the latest version. All prior versions are retained permanently. This is the audit trail.

---

## Chapter 21 — Memory Provenance

Provenance answers the question every enterprise deployment will eventually ask:

> **"Why does this memory exist?"**

Not just "what is it?" — but "where did it come from, what evidence produced it, and who was involved at each step?"

Provenance is the chain from raw event to memory item, made explicit and traversable.

### The Provenance Record

Every memory item carries a `provenance` list — one entry per source that contributed to forming or reinforcing this memory. Each provenance entry records:

| Field | Type | Description |
|-------|------|-------------|
| `provenanceId` | string | Unique identifier for this provenance entry |
| `sourceType` | `ProvenanceSourceType` | `note · signal · email · meeting · activity · user_correction · ai_synthesis` |
| `sourceId` | string | The specific record ID (`note_id:n_012`, `signal_id:sig_4821`, `email_id:e_089`) |
| `sourceDate` | Date | When the source event occurred (not when it was processed — when it happened) |
| `extractedOn` | Date | When AI Core or the user processed this source and added it to the memory |
| `extractedBy` | `MemoryActor` | `user · ai_core` |
| `contribution` | `ProvenanceContribution` | `created · reinforced · evolved · merged · corrected` |
| `versionAt` | string | Which memory version this provenance entry contributed to |

### Provenance in practice

A Commitment Memory for Maria Chen:

```
Memory: "Maria Chen expects a case study by end of this week."
MemoryId: m_1044
Confidence: stated

Provenance:
  [1] sourceType: note
      sourceId: note_id:n_089
      sourceDate: 2026-07-08
      extractedOn: 2026-07-08
      extractedBy: user
      contribution: created
      versionAt: 1.0
      → User wrote note: "Maria asked for a SaaS case study — needs it before the board call on Friday."

  [2] sourceType: signal
      sourceId: signal_id:sig_5103
      sourceDate: 2026-07-10
      extractedOn: 2026-07-10
      extractedBy: ai_core
      contribution: reinforced
      versionAt: 1.1
      → Signal task_overdue fired for "Send case study to Maria" task — corroborating that commitment exists and is unfulfilled.
```

A user or auditor reading this provenance knows: the memory exists because a user explicitly wrote a note on July 8th, and it was reinforced when a task associated with the commitment went overdue two days later. The provenance is complete. The answer to "why does this memory exist?" is specific and traceable.

### What provenance enables

**Correction scoping:** If the user deletes `note_id:n_089`, the system identifies `m_1044` as depending on it. The memory is flagged for user review — not automatically deleted, because `signal_id:sig_5103` also contributed. The user decides whether the memory remains valid.

**Source integrity:** If an email is later found to have been misattributed to the wrong contact, the system can identify all memory items whose provenance includes that email and flag them for review.

**Explainability to the user:** Post-Alpha, when a user asks "where did this come from?", the provenance record is the direct answer. Not a UI the user must navigate — a readable chain of sources, in natural language.

**Legal and regulatory readiness:** For enterprise customers in regulated industries (financial services, healthcare-adjacent), the ability to produce a complete provenance chain for any AI-assisted recommendation is a prerequisite for deployment. Provenance is architected now so it is available when required.

### The provenance principle

Every memory item must have at least one provenance entry. A memory without provenance is a memory without a source — and a memory without a source violates Invariant 1 (evidence before formation). Provenance is not optional metadata. It is the evidence chain made explicit.

---

## Chapter 22 — Memory Graph

Memory items are not isolated facts connected only to the entities they describe. They are nodes in a graph — connected to each other, to signals, to stories, and to workspace surfaces.

Just as the Signal Graph (Signal Engine Blueprint Chapter 20) maps how signals connect to decisions and automations, the Memory Graph maps how intelligence accumulates and flows through the system.

AI will reason over this graph. Not over tables.

### The Graph

```
Raw Events
(notes, emails, meetings, deal outcomes, signal archive)
      ↓ formed_from (Provenance)
Memory Item
      ↓ corroborates / contradicts
Memory Item
      ↓ merged_into
Memory Item (higher confidence)
      ↓ informs
Decision
(Workspace Decision section — one recommendation)
      ↓ referenced_in
Story
(curated narrative — Memory made legible)
      ↓ surfaced_in
Workspace
(Preparation section · Situation section)
      ↓ triggers (via AI Core)
Memory Signal (Tier 4)
      ↓ appears_in
Today (Focus, when business is calm)
```

### Memory-to-Memory relationships

| Relationship | From → To | Meaning |
|-------------|-----------|---------|
| `corroborates` | Memory A → Memory B | A provides additional evidence for the same insight B describes. Merge candidate. |
| `contradicts` | Memory A → Memory B | A and B describe mutually exclusive states of the same entity. One must evolve. |
| `merges_into` | Memory A + B → Memory C | A and B combined into a higher-confidence synthesis. A and B are archived; C is active. |
| `derived_from` | Memory A → Memory B | A is a higher-level insight synthesized from the pattern B represents (e.g., a Risk Memory derived from three Outcome Memories). |
| `supersedes` | Memory A → Memory B | A is the current version; B is a prior version that A replaced (via correction or contradiction resolution). |

### Memory-to-Workspace relationships

| Relationship | From → To | Meaning |
|-------------|-----------|---------|
| `surfaced_in_preparation` | Memory → Workspace session | This memory was surfaced in the Preparation section during a specific Workspace session. |
| `surfaced_in_situation` | Memory → Workspace session | This memory contributed to a Situation section observation. |
| `referenced_in_story` | Memory → Story | This memory informed which events were surfaced as milestones in the Story section. |
| `informed_decision` | Memory → Decision | This memory was part of the evidence basis for a specific Decision recommendation. |

### Memory-to-Signal relationships

| Relationship | From → To | Meaning |
|-------------|-----------|---------|
| `formed_from` | Memory ← Signal Archive | This memory was created from a pattern in archived signals. `signalIds` in the Identity Contract (Chapter 19) records these. |
| `produced_signal` | Memory → Memory Signal | This memory item (via AI Core) produced a Tier 4 Memory Signal. |
| `calibrated_threshold` | Memory → Signal Resolver | This Relationship Pattern Memory caused a resolver threshold to be adjusted for this entity. |

### Cross-entity memory relationships

Memory items scoped to different entities may carry cross-entity references when the insight spans multiple entities.

A Commitment Memory for Contact Maria Chen and a Context Memory for Company Acme Corp may share content — "the board review timeline Maria mentioned also applies to the broader Acme relationship." These remain separate memory items (separate entities) but the Memory Graph records the cross-entity reference. AI Core can traverse this relationship when assessing a deal involving both Maria and Acme.

### Why the graph matters

**AI reasoning over time:** AI does not reason over isolated rows. It reasons over connected intelligence. "What do we know about deals with this company that involved legal review?" is a graph query: Deal Workspace → Outcome Memory nodes → filter by `legal_review` in content → traverse `formed_from` to find the Signal patterns that corroborated them → return the synthesized insight.

**Contradiction detection:** Two memory items that `contradict` each other but are both `observed` confidence must be resolved. The graph makes contradictions detectable. Without the graph, two contradictory memories exist in the same pool with no relationship between them — they will produce inconsistent recommendations.

**Propagation of corrections:** If a user corrects a Contact Memory ("Maria is NOT the decision-maker — it's actually her manager John"), the graph can identify that a Deal Memory (`derived_from` the same Contact Memory) may also need updating. The graph propagates the implication of the correction to related memories — flagging, not auto-correcting.

**The Memory Graph in v1.0:** Like the Signal Graph, the Memory Graph is conceptual in v1.0. The Identity Contract (Chapter 19) and Provenance (Chapter 21) are the data foundations. The `signalIds` field links Memory to Signals. The version history links memories across time. The entity scope links memories across workspace entities. These are the nodes. The edges — the explicit traversable relationships — become queryable when AI Core arrives.

Build the nodes correctly now.

---

## Chapter 23 — AI Trust Boundary

Business Memory will be populated increasingly by AI Core. As AI Core's role expands — from reinforcing patterns to extracting commitment context to synthesizing cross-entity insights — the question of what AI is and is not permitted to remember becomes critical.

Without an explicit Trust Boundary, Memory gradually fills with inference layered on inference. Assumptions are stored alongside facts. Personality analyses appear next to behavioral observations. Sentiment interpretations are recorded with the same confidence language as deal outcomes. Over time, users cannot distinguish what the system observed from what it guessed.

The Trust Boundary is the line AI Core is never permitted to cross.

### What AI Core is NEVER permitted to create as Memory

**Assumptions**

An assumption presents something as likely true without named, observable evidence.

- ❌ "This contact probably has budget authority." — AI Core does not know this. It is an inference from job title and deal context with no direct evidence.
- ❌ "The deal is likely stalled because of internal politics." — AI Core cannot observe internal company dynamics.
- ❌ "This company is probably evaluating competitors." — "Probably" is not evidence.

**Sentiment without observable evidence**

Sentiment is subjective interpretation of tone, word choice, or communication style. It is not observable from the data available to Gunimi.

- ❌ "Maria seems enthusiastic about this proposal." — Enthusiasm is not observable from email metadata or response time.
- ❌ "The tone of these emails suggests declining interest." — Tone interpretation is subjective and unreliable.
- ❌ "This contact appears frustrated with the delay." — Emotional states are not business intelligence.

Valid alternative: *"Maria's email response time has increased from 2 hours to 4 days across the last 6 interactions."* This is observable. The user draws their own conclusion about what it means.

**Estimated motivations**

Motivations are inferred from incomplete information and are almost always wrong in ways that cannot be detected.

- ❌ "Marcus is pushing this deal through because he wants to make quota." — AI Core cannot know Marcus's motivations.
- ❌ "The procurement delay may be because they are evaluating our competitors." — This is a guess.
- ❌ "The company seems motivated primarily by cost reduction." — "Motivated by" is analysis without observation.

Valid alternative: *"Marcus sent three follow-up emails in one week — a significantly higher frequency than his prior cadence."* This is observable. The user interprets the motivation.

**Psychological conclusions**

Psychological analysis of business contacts is outside the scope of business intelligence and creates significant trust and legal risks.

- ❌ "This contact has a risk-averse personality." — Personality assessment is not business memory.
- ❌ "Maria is introverted and prefers written communication." — Introversion is a psychological classification, not a business observation.
- ❌ "This contact is likely to respond negatively to pressure." — Behavioral prediction without evidence.

Valid alternative: *"Maria has accepted all 8 email outreach attempts and declined 3 phone call requests across 6 months."* This is observable behavior. No personality conclusion is drawn.

**Probabilistic statements presented as facts**

- ❌ "There is a 73% chance this deal closes in Q3." — Probability estimates are not Memory items. They are analytical outputs. They belong in a future analytics surface, not in Memory.
- ❌ "This contact is likely to renew." — "Likely" without named evidence is an assumption.

**Second-order inferences**

AI Core may not create Memory by chaining inferences. If A is inferred from B, and B is inferred from C, and C is a stated fact — then A is two inference steps away from evidence and is not permitted as Memory.

Inference depth limit: Memory may be inferred from observed or stated facts (one step). Memory may not be inferred from inferred memory (two steps).

**Speculative future states**

- ❌ "This relationship will likely go cold in August based on seasonal patterns." — Prediction is not Memory.
- ❌ "The deal is at risk of being lost to a competitor by Q3." — Future state is not observable.

Future states belong in Signals (when a threshold condition is met) or in Today recommendations. They do not enter Memory.

### The Trust Boundary test

Before creating any memory item, AI Core must be able to answer yes to all of the following:

- [ ] Can I name the specific entity this is about?
- [ ] Can I name the specific, observable fact that makes this true?
- [ ] Can I point to at least one source record that contains this evidence?
- [ ] Is this fact currently true — not predicted, not estimated, not assumed?
- [ ] Is this the kind of statement a business professional would accept as a factual briefing — without needing to know it came from AI?

If any answer is no, the memory item is not created.

### The Trust Boundary is not a filter

The Trust Boundary is enforced at creation time by AI Core itself — not by a filter that screens outputs after the fact. A filter that catches bad memory items after creation implies that AI Core created them and they exist in some intermediate state. The Trust Boundary prevents creation. Memory that would violate the boundary is discarded before it is formed.

### Why this matters

**User trust:** If a user discovers that Memory contains a stored belief that "Maria seems emotionally distant in negotiations," they will distrust all Memory — not just that item. The Trust Boundary prevents the accumulation of the speculative inferences that destroy user trust.

**Legal exposure:** In many jurisdictions, storing psychological profiles or inferred motivations about individuals — even in a business context — creates data protection risk. The Trust Boundary is a compliance precaution, not just a product quality decision.

**Enterprise readiness:** Enterprise customers will ask: "Can you show me everything this system believes about our contacts?" The answer must be a set of observable business facts, not a mixture of facts and personality analyses. The Trust Boundary is what makes that answer defensible.

**AI reasoning integrity:** An AI that stores assumptions will reason from those assumptions in future recommendations. Assumptions compound. A speculative motivation stored in Memory becomes the basis for a next recommendation, which generates a new inference, which is stored as a new Memory. The Trust Boundary is the only mechanism that prevents the accumulation of compounded speculation.

---

## Final Note — The Invisible Layer

The success of Business Memory is measured by what users do not notice.

They do not notice that the Preparation section knew about the commitment Maria made three months ago. They do not notice that the signal threshold for their most responsive contact is different from the threshold for a newer relationship. They do not notice that the system remembered something they had long forgotten.

They notice only that Gunimi seems to understand their business — that recommendations feel grounded, that context feels assembled rather than retrieved, that the system acts like someone who has been paying attention.

That is the experience Business Memory is designed to produce: not a feature users discover, but an intelligence users rely on without examining it.

Memory earns trust not by announcing itself, but by being right.

---

**Version:** 1.1
**Created:** 2026-07-11
**Updated:** 2026-07-11 — Added Chapters 19–23: Memory Identity, Memory Versioning, Memory Provenance, Memory Graph, AI Trust Boundary
**Authority:** Gunimi Product Bible v1.0 · Workspace Grammar v1.0 · Signal Engine Blueprint v1.0 · Today Experience Blueprint v1.0
**Applies to:** All long-term intelligence in Gunimi — AI Core, Signal Engine (archive), Workspace surfaces, Today
**Next review:** When AI Core integration begins — review Memory types, confidence levels, and Trust Boundary rules against implementation capabilities

---

### Changelog

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-07-11 | Initial document — 18 chapters |
| 1.1 | 2026-07-11 | Added Memory Identity (Ch. 19), Memory Versioning (Ch. 20), Memory Provenance (Ch. 21), Memory Graph (Ch. 22), AI Trust Boundary (Ch. 23) |
