# Gunimi Blueprint — Signal Engine v1.0

**Version:** 1.0
**Status:** Foundational — permanent
**Authority:** Gunimi Product Bible v1.0 · Workspace Contract v1.0 · Workspace Grammar v1.0 · Today Experience Blueprint v1.0 · Workspace Principles v1.0
**Applies to:** Every business signal produced and consumed in Gunimi

> *"A signal that is correct but untimely is noise. A signal that is urgent but vague is anxiety. A signal that is specific, timely, and grounded in evidence is intelligence."*

---

## Preface

Gunimi surfaces business intelligence across multiple surfaces: Today, Deal Workspaces, Contact Workspaces, Company Workspaces, and future surfaces not yet built.

Every piece of intelligence in Gunimi is a signal — a specific, observable fact about the current state of a business relationship, opportunity, or commitment that meets a threshold for attention.

Without a governing architecture, signals multiply independently. Each surface invents its own signal taxonomy, its own priority rules, its own suppression logic. A stale relationship signal appears in three places simultaneously. A deal risk appears in Today and in the Deal Workspace with different wording. A dismissed signal reappears moments later in a different section. The user sees the same observation three times, in three forms, with three different urgency levels. They learn to ignore all of them.

The Signal Engine exists to prevent this.

The Signal Engine is the single source of truth for every business signal in Gunimi. It defines what a signal is, who produces it, who consumes it, what tier and severity it carries, when it expires, when it is suppressed, and what happens to it after it resolves.

Every surface in Gunimi that shows intelligence draws from the Signal Engine. No surface invents its own signals. No signal is born outside the Engine. No signal crosses surface boundaries without the Engine's authority.

This is not a notification system. Notification systems push all alerts to a center and leave the user to prioritize. The Signal Engine classifies signals at the point of production, routes them to exactly the surfaces that should receive them, enforces suppression when a signal has already been claimed, and is honest about its own silence.

---

## Chapter 1 — Purpose

### Why the Signal Engine exists

The Signal Engine solves three problems simultaneously.

**Problem 1 — Inconsistency.**
Without a central engine, every surface defines "signal" differently. Today's stale relationship threshold is 14 days. The Contact Workspace's stale threshold is 21 days. The notification system has no threshold — it sends an alert after any inactivity. Three surfaces, three definitions, three different urgencies for the same underlying condition. The user cannot trust any of them because they contradict each other.

The Signal Engine defines every signal type once, with one threshold, in one place. When the stale relationship threshold changes, it changes in one resolver. Every surface that reads from the Engine immediately reflects the change.

**Problem 2 — Duplication.**
The same condition surfaces simultaneously in multiple places without coordination. "Deal closing Thursday" appears in the Focus card, in the Deal Workspace Situation section, and in a notification badge. The user sees the same signal three times, each time framed slightly differently, and must reconcile whether they are the same signal or three independent observations.

The Signal Engine enforces single ownership. Once a signal is claimed by a consumer (Focus, Decision, Situation), it is suppressed for lower-priority consumers. The user sees it once, in the right place, at the right priority.

**Problem 3 — Noise.**
Without a governing confidence requirement, signals proliferate. Every minor condition becomes a signal. The user is warned about everything simultaneously. The warnings become background noise. When a genuinely urgent signal appears, it is lost in the noise.

The Signal Engine requires evidence. A signal that cannot name its specific, observable evidence does not exist in the Engine. The system is quiet until there is something worth saying.

### The mission

> The Signal Engine ensures that every business signal in Gunimi is produced once, classified correctly, routed to exactly the right surface, suppressed when claimed, and honest about its own silence.

### What the Signal Engine is not

The Signal Engine is not a notification center. Notification centers collect all alerts in one place. The Signal Engine routes signals to where they belong — Today for cross-entity intelligence, Workspaces for entity-specific intelligence — rather than accumulating them.

The Signal Engine is not an activity log. Activity logs record everything. The Signal Engine surfaces only what crosses the threshold of consequence.

The Signal Engine is not an AI feature. AI can produce signals, but the Engine defines whether those signals are valid, what tier they occupy, and whether they are surfaced or suppressed. The Engine governs AI signal production — not the reverse.

---

## Chapter 2 — Position in the Architecture Chain

The Signal Engine sits within the Gunimi architecture chain as the intelligence layer between raw data and user-facing surfaces:

```
Product Bible           — WHY signals exist (Principles 13, 18, AI Philosophy)
      ↓
Workspace Contract      — WHEN signals are suppressed (§6 Suppression, §12 One Decision)
      ↓
Workspace Grammar       — HOW signals are expressed (Five Questions, Grammar Rules)
      ↓
Signal Engine           — WHAT constitutes a signal, and how signals flow
      ↓
Workspace Blueprints    — WHERE each signal type belongs in each workspace type
      ↓
Today Experience        — HOW cross-entity signals are prioritized and displayed
      ↓
Implementation          — HOW the Engine is built in code
```

The Signal Engine is above the individual workspace blueprints and the Today experience because it defines the rules those surfaces must follow. The blueprints apply the Signal Engine's classifications to their specific business contexts. The Today Experience applies the Engine's priority tiers to its four-section structure.

### Authority relationships

The Signal Engine is authoritative over:
- Signal type definitions
- Tier assignments
- Severity rules
- Suppression logic
- Deduplication rules
- Evidence requirements
- Expiration conditions
- Consumer routing

The Signal Engine is constrained by:
- Product Bible Principles 13 and 18 (calm software, silence is a feature)
- Workspace Contract §6 (signal suppression)
- Workspace Contract §12 (one recommendation)
- Workspace Grammar Rule 3.12 (no duplicated signals)

No surface may route signals differently from what the Engine specifies. No blueprint may define a signal that the Engine has not classified.

---

## Chapter 3 — Signal Lifecycle

Every signal follows an identical lifecycle from production to retirement. No signal enters a Gunimi surface without completing this lifecycle.

```
PRODUCED
  ↓
A producer detects a condition that meets the evidence threshold.
Signal is created with type, tier, severity, confidence, evidence, entity.

EVALUATED
  ↓
The Engine evaluates: is this a duplicate of an existing active signal?
Duplicate → update existing signal's timestamp, do not create new.
Novel → signal enters the active pool.

CLAIMED
  ↓
A consumer (Today/Focus, Today/Attention, Workspace/Decision, Workspace/Situation)
selects this signal as its basis for a recommendation or observation.
Signal is marked as claimed by that consumer.
Lower-priority consumers suppress this signal.

SUPPRESSED
  ↓
The signal is claimed. Lower-priority surfaces do not surface it.
The signal remains active in the Engine — suppression is not retirement.
If the claiming consumer changes (because its condition changed),
suppression is lifted and the next consumer may claim.

RESOLVED
  ↓
The resolution condition is met (event-driven) or the TTL expires.
Signal is moved from active to archived.
Resolution is permanent for event-driven resolution.
Resolution is temporary for TTL expiration — if the condition recurs,
the producer generates a new signal.

ARCHIVED
  ↓
The signal is no longer active. It cannot be surfaced.
It is available to Business Memory for pattern detection (post-Alpha).
Archive is permanent.
```

### The five states

| State | Description | Visible to surfaces? |
|-------|-------------|---------------------|
| `active` | Signal exists, not yet claimed | Yes — eligible for any consumer at its tier |
| `claimed` | Signal is owned by a consumer | Yes — only to its claimer |
| `suppressed` | Claimed by a higher-priority consumer | No — blocked for lower-priority consumers |
| `resolved` | Resolution condition met | No |
| `archived` | Permanently retired | No (available to Memory only) |

---

## Chapter 4 — Signal Structure

Every signal in the Signal Engine satisfies the same structure. This is the contract every signal must fulfill to exist in the Engine.

### The Signal Contract

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Stable unique identifier. Never reused after archive. |
| `type` | `SignalType` | The specific signal category (see Chapter 5). |
| `entityType` | `EntityType` | `deal · contact · company · task · email` |
| `entityId` | string | The specific entity this signal describes. |
| `tier` | `1 · 2 · 3 · 4` | Urgency tier (see §4.2). |
| `severity` | `SignalSeverity` | `critical · warning · info` (see §4.3). |
| `confidence` | `SignalConfidence` | `high · medium · low` (see §4.4). |
| `evidenceKey` | string | Locale key for the specific, observable evidence sentence. |
| `evidenceData` | object | Runtime data that fills the evidence sentence (entity name, days, value). |
| `actionType` | `ActionType` | The typed action this signal suggests (locale-keyed, never hardcoded). |
| `producedBy` | `SignalProducer` | Who produced this signal (see Chapter 6). |
| `producedAt` | Date | When this signal was produced. |
| `expiresAt` | `Date or null` | When this signal expires by time. Null means event-driven expiration only. |
| `resolutionCondition` | string | Human-readable description of what resolves this signal. |
| `claimedBy` | `SignalClaimer or null` | The consumer that has claimed this signal. |
| `suppressedUntil` | `Date or null` | User-dismissal suppression expiry. |
| `resolvedAt` | `Date or null` | When this signal was resolved. |

### 4.1 Signal Type

Signal type is the precise category of business condition this signal represents. Types are not labels — they are identifiers that drive routing, suppression logic, deduplication, and action resolution. Signal types are defined in Chapter 5.

### 4.2 Priority Tier

Priority tier defines where in the urgency stack a signal belongs. Tier determines which surfaces are eligible to display the signal and in what position.

| Tier | Name | Time horizon | Surfaces |
|------|------|-------------|---------|
| **1** | Immediate consequence | Hours — same day | Today/Focus, Today/Attention, Workspace/Decision |
| **2** | Relationship health | Days — current week | Today/Relationship Signals, Workspace/Situation |
| **3** | Work execution | Current day | Today/Work, Workspace/Work tab |
| **4** | Team and pipeline | Post-Alpha | Future surfaces only |

Tier is assigned at signal definition time (Chapter 5) and never changed by individual signal instances at runtime. The tier of a signal type is permanent. Priority within a tier is computed at surface time based on the evidence data.

### 4.3 Severity

Severity defines the consequence of ignoring this signal.

| Severity | Meaning | Decision-layer eligible? |
|----------|---------|------------------------|
| `critical` | Ignoring this signal today changes the outcome | Yes — primary Decision candidate |
| `warning` | Ignoring this signal this week creates friction | Yes — Decision or Situation, by tier |
| `info` | Contextual awareness — no time pressure | Situation only, never Decision |

`info` severity signals never drive a primary Decision recommendation. They may appear in the Situation section as secondary observations when the Decision is already populated by a higher-severity signal.

### 4.4 Confidence

Confidence defines how certain the system is that this signal is valid, based on the quality of available evidence.

| Confidence | Evidence basis | Surfacing rule |
|------------|---------------|---------------|
| `high` | Named, observable, time-stamped fact | Eligible for Decision-layer recommendation |
| `medium` | Pattern-inferred from observable behavior | Eligible for Situation-layer observation |
| `low` | Insufficient data to make a specific claim | Not surfaced; Engine records data gap |

From Workspace Grammar Invariant 10: *"When evidence is insufficient for a recommendation, no recommendation is made."*

A low-confidence signal is not suppressed — it does not exist in the user-facing surface. The Engine acknowledges its own uncertainty. When data is genuinely insufficient, the Engine communicates the gap honestly ("Limited history — add interactions to improve this assessment") rather than fabricating a medium-confidence signal.

### 4.5 Ownership

Every signal has a single owner at a given moment. Ownership refers to the consumer that has claimed this signal (who is displaying it) — not the producer who created it.

Ownership is exclusive. When a signal is claimed by Focus, it cannot simultaneously be claimed by Attention Required or a Workspace Decision. A signal is always displayed in exactly one place.

Ownership transfers are valid: if the claiming consumer's condition changes (the deal that was in Focus is now closed), the claim is released and the signal either resolves or becomes available for the next eligible consumer.

---

## Chapter 5 — Signal Categories

Each signal category defines the business condition it represents, its tier, severity, default confidence, evidence requirement, and resolution condition.

### Category 1 — Deal Signals

| Signal Type | Tier | Severity | Evidence Required | Resolution |
|------------|------|---------|-----------------|-----------|
| `deal_approaching_close` | 1 | critical | Named deal + days to close date | Close date reached or deal won/lost |
| `deal_close_date_passed` | 1 | critical | Named deal + days past close date | Close date updated or deal won/lost |
| `deal_stale` | 1 | warning | Named deal + days since last activity | Activity recorded or deal won/lost |
| `proposal_unanswered` | 1 | critical | Named deal + days since proposal sent | Reply recorded or deal updated |
| `deal_no_primary_contact` | 2 | warning | Named deal + zero contacts linked | Contact linked to deal |
| `deal_missing_value` | 2 | info | Named deal without a value | Value added |
| `deal_missing_close_date` | 2 | info | Named deal without a close date | Close date added |

### Category 2 — Contact (Relationship) Signals

| Signal Type | Tier | Severity | Evidence Required | Resolution |
|------------|------|---------|-----------------|-----------|
| `contact_stale` | 2 | warning | Named contact + days since last contact | Interaction recorded |
| `contact_overdue_task` | 1 | warning | Named contact + overdue task name + days overdue | Task completed or removed |
| `contact_new_no_interaction` | 2 | info | Named contact + days since creation | First interaction recorded |
| `contact_no_company` | 2 | info | Named contact | Company linked |
| `contact_no_reach` | 2 | warning | Named contact + missing email and phone | Contact info added |
| `contact_deal_stalling` | 1 | warning | Named contact + named deal + days since deal activity | Activity recorded on deal |

### Category 3 — Company (Commercial Relationship) Signals

| Signal Type | Tier | Severity | Evidence Required | Resolution |
|------------|------|---------|-----------------|-----------|
| `company_stale` | 2 | warning | Named company + days since last activity | Activity recorded |
| `company_no_contacts` | 2 | warning | Named company + zero contacts | Contact added |
| `company_no_active_deals` | 2 | info | Named company + zero active deals | Deal created or opened |
| `company_closing_deal` | 1 | critical | Named company + named deal + days to close | Deal closed or updated |
| `company_incomplete_profile` | 2 | info | Named company + missing industry | Industry added |

### Category 4 — Commitment Signals

| Signal Type | Tier | Severity | Evidence Required | Resolution |
|------------|------|---------|-----------------|-----------|
| `task_due_today` | 3 | warning | Named task + today's date | Task completed or rescheduled |
| `task_overdue` | 3 | warning | Named task + days past due | Task completed or rescheduled |
| `task_blocked` | 3 | warning | Named task + blocked status | Block resolved |
| `task_waiting_customer` | 3 | info | Named task + waiting annotation | Response received |

### Category 5 — Communication Signals

| Signal Type | Tier | Severity | Evidence Required | Resolution |
|------------|------|---------|-----------------|-----------|
| `email_important_unanswered` | 1 | critical | Named contact + days unanswered | Reply sent |
| `meeting_approaching` | 1 | warning | Named meeting + named contact + hours to meeting | Meeting time passed |
| `meeting_no_preparation` | 1 | info | Named meeting within 4h + no recent notes | Note added or meeting time passed |

### Category 6 — Memory Signals (post-Alpha)

Memory signals require the Business Memory layer. They are defined here for architectural completeness.

| Signal Type | Tier | Severity | Evidence Required | Resolution |
|------------|------|---------|-----------------|-----------|
| `relationship_milestone` | 4 | info | Named contact/company + specific event + date | Event date passed |
| `ai_pattern_detected` | 4 | info | Named pattern + AI-derived specific fact | User acknowledgment or TTL |
| `memory_reminder` | 4 | info | Named entity + remembered specific context | User dismissal or TTL |

---

## Chapter 6 — Signal Production

A signal producer is any system component authorized to create signals in the Engine. Producers do not decide how signals are displayed — the Engine classifies and routes. Producers declare evidence; the Engine determines visibility.

### Authorized Producers

**Producer 1 — Deal Resolver** (`lib/deals/decision.ts`)

Produces: `deal_approaching_close`, `deal_close_date_passed`, `deal_stale`, `proposal_unanswered`, `deal_no_primary_contact`, `deal_missing_value`, `deal_missing_close_date`

Evidence source: Deal record — `expected_close_date`, `last_activity_at`, `value`, linked contacts

Production frequency: Per workspace load (resolver runs per-request)

**Producer 2 — Contact Resolver** (`lib/contacts/decision.ts`)

Produces: `contact_stale`, `contact_overdue_task`, `contact_new_no_interaction`, `contact_no_company`, `contact_no_reach`, `contact_deal_stalling`

Evidence source: Contact record + related tasks + related deals + `last_contacted_at`

Production frequency: Per workspace load (resolver runs per-request)

**Producer 3 — Company Resolver** (`lib/companies/decision.ts`)

Produces: `company_stale`, `company_no_contacts`, `company_no_active_deals`, `company_closing_deal`, `company_incomplete_profile`

Evidence source: Company record + contacts count + deals + `last_activity_at`

Production frequency: Per workspace load (resolver runs per-request)

**Producer 4 — Task Engine**

Produces: `task_due_today`, `task_overdue`, `task_blocked`, `task_waiting_customer`

Evidence source: Task records with `due_date`, `status`, `blocked` flag

Production frequency: Daily evaluation at Today load time

**Producer 5 — Email Engine** (`lib/email/`)

Produces: `email_important_unanswered`, `meeting_approaching`, `meeting_no_preparation`

Evidence source: Email records, calendar events, meeting activities

Production frequency: On Today load; on email sync completion

**Producer 6 — AI Core** (post-Alpha)

Produces: `ai_pattern_detected`, `relationship_milestone`, `memory_reminder`

Evidence source: Pattern analysis across entity history (requires Business Memory layer)

Evidence requirement for AI signals: AI Core must provide a named, specific, observable fact. "This relationship appears to be cooling" is not valid evidence. "No outreach from either side in 34 days across 3 active opportunities" is valid evidence.

**Producer 7 — User** (post-Alpha)

Manual signal flags are a future feature. In v1.0, user agency is expressed through dismissal, not production.

### Production Rules

**Rule P.1 — Evidence before production.**
No signal is produced without specific, named evidence. The producer must supply the entity name, the measurable condition, and the time dimension. A signal that cannot answer "what specific fact makes this signal true?" does not enter the Engine.

**Rule P.2 — Threshold before production.**
Each signal type has a defined threshold condition (Chapter 5). The producer evaluates the threshold. If the threshold is not met, the signal is not produced. Producers do not exercise subjective judgment — the threshold rule is definitive.

**Rule P.3 — Deduplication before production.**
The producer checks the active signal pool for an existing signal of the same `type + entityId`. If one exists, the existing signal is updated (timestamp refreshed). A new signal is not created. See Chapter 9.

---

## Chapter 7 — Signal Consumption

A signal consumer is any surface that reads from the Signal Engine to display intelligence to the user. Consumers do not produce signals — they claim, display, and suppress them.

### Authorized Consumers

**Consumer 1 — Today / Focus**

Tier consumed: 1 (critical severity only for single recommendation)

Behavior: Reads Tier 1 signals across all entities. Applies the priority algorithm (below). Claims exactly one signal as the Focus recommendation. Unclaimed Tier 1 signals are released to Attention Required.

Priority algorithm:
1. Time proximity — signals that expire soonest are evaluated first
2. Value at risk — higher-value entities receive stronger weighting when urgency is equal
3. Relationship depth — established relationships that have gone quiet are prioritized over new ones
4. Commitment age — overdue commitments receive escalating priority with time

**Consumer 2 — Today / Attention Required**

Tier consumed: 1 (all severity levels not claimed by Focus)

Behavior: Reads Tier 1 signals not claimed by Focus. Displays up to five. Suppresses signals already claimed by Focus. Shows the five most urgent; indicates if more exist.

**Consumer 3 — Today / Relationship Signals**

Tier consumed: 2 (relationship and company health signals)

Behavior: Reads Tier 2 signals across Contact and Company entities. Does not duplicate signals already claimed by Focus or Attention.

**Consumer 4 — Today / Today's Work**

Tier consumed: 3 (commitment signals for the current day)

Behavior: Reads Tier 3 signals for the current user. Displays tasks due today and immediately overdue. Linked to the Workspace where the task lives.

**Consumer 5 — Workspace Intelligence (Situation layer)**

Tier consumed: 1 + 2 (entity-specific signals only)

Behavior: For the entity whose Workspace is open, reads all active signals filtered to that `entityId`. Displays secondary signals — those not already claimed by the Workspace's own Decision layer. Suppresses the primary signal claimed by Decision.

**Consumer 6 — Workspace Decision Layer**

Tier consumed: 1 + 2 (entity-specific signals only)

Behavior: For the entity whose Workspace is open, reads the highest-priority active signal for that entity. Claims it as the basis for the Decision recommendation. This claim suppresses the signal from the Workspace's Situation layer.

**Consumer 7 — Business Memory** (post-Alpha)

Tier consumed: all (archived signals)

Behavior: Reads resolved and archived signals to detect patterns. Does not display signals directly — feeds AI Core with pattern data.

### Consumption Rules

**Rule C.1 — Consumers never produce.**
Consumer code has no write access to the signal pool. The boundary between production and consumption is absolute.

**Rule C.2 — One claim per signal.**
Once a signal is claimed by a consumer, no other consumer may claim the same signal simultaneously. Claim assignment is managed by the Engine, not by consumers competing to claim.

**Rule C.3 — Lower tiers do not override higher tiers.**
A consumer may only claim signals within its tier scope. The Focus consumer may not claim Tier 3 signals. The Today's Work consumer may not claim Tier 1 signals.

**Rule C.4 — Healthy state when no signals.**
When a consumer has no eligible signals to surface, it shows an explicit healthy state. Silence is never shown without declaration. See Workspace Grammar Rule 3.13.

---

## Chapter 8 — Suppression

Suppression ensures a signal is never shown in more than one place simultaneously. It is the mechanism that enforces Workspace Grammar Rule 3.12: "No duplicated signals."

### Suppression levels

**Level 1 — Claim suppression**

When a consumer claims a signal, all consumers of lower priority are blocked from claiming or displaying that signal.

Priority order for claim suppression:
1. Today / Focus (highest priority)
2. Workspace / Decision
3. Today / Attention Required
4. Workspace / Situation (Workspace Intelligence)
5. Today / Relationship Signals
6. Today / Today's Work
7. Business Memory (post-Alpha)

A signal claimed by Today/Focus is suppressed for all consumers from position 2 onward.
A signal claimed by Workspace/Decision is suppressed for Workspace/Situation.

**Level 2 — User dismissal suppression**

When a user dismisses a signal from a surface, the signal is suppressed for a defined TTL period.

| Dismissal type | TTL |
|---------------|-----|
| "Remind me later" (implicit) | 24 hours |
| "Not urgent" (explicit) | 7 days |
| "Not relevant" (explicit, strongest) | Until resolution condition next resets |

"Not relevant" is the strongest dismissal. Even so, if the underlying condition resolves and then recurs, a new signal instance is produced. Dismissal is recorded against the specific signal instance `id` — not against the signal type for this entity permanently.

**Level 3 — Context suppression**

Some signals are suppressed based on the current session context:

- If the user is inside a Deal Workspace, signals for that deal are not shown in Today simultaneously. The Workspace is the active context; Today does not interrupt with the same information.
- A Workspace Decision that has claimed a signal suppresses it from the Workspace's Situation layer, regardless of which tab the user is currently viewing.

### Suppression is not deletion

A suppressed signal is still active in the Engine. It has not resolved. If the claiming consumer's condition changes, the suppression is lifted and the signal re-enters the active pool for the next eligible consumer.

---

## Chapter 9 — Deduplication

Deduplication ensures that the same condition does not produce multiple signals. A stale deal is one signal, regardless of how many times the resolver runs.

### Deduplication key

Every signal type has a deduplication key:

```
type + entityType + entityId
```

Exception for task-level signals: tasks require `type + entityType + entityId + taskId` because a single entity may have multiple overdue tasks that are independent signals.

If the Engine finds an active signal with an identical deduplication key:
- The existing signal's `producedAt` is updated to the current time
- The existing signal's `evidenceData` is refreshed with current values
- No new signal is created

### When deduplication does not apply

Two signals of the same type but different entities are not duplicates. `deal_stale` for Deal A and `deal_stale` for Deal B are independent signals.

A resolved signal that re-enters because its condition recurs after resolution is a new signal, not a duplicate. Resolution clears the deduplication key. A new signal may be produced after resolution.

---

## Chapter 10 — Expiration

Signals expire by one of two mechanisms. Each signal type specifies which applies.

### Event-driven expiration

The signal resolves when a specific real-world event occurs.

| Signal | Resolution event |
|--------|----------------|
| `deal_stale` | Any activity recorded on the deal |
| `proposal_unanswered` | Reply recorded or deal stage updated |
| `deal_approaching_close` | Close date reached or deal won/lost |
| `contact_stale` | Interaction recorded for the contact |
| `contact_overdue_task` | Task completed or deleted |
| `task_due_today` | Task marked complete |
| `email_important_unanswered` | Reply sent from the workspace |
| `company_no_contacts` | Contact added and linked to the company |

### Time-based expiration (TTL)

The signal expires after a defined duration regardless of whether the underlying condition has changed.

| Signal | TTL |
|--------|-----|
| `meeting_approaching` | Meeting start time + 2 hours |
| `deal_close_date_passed` | 30 days (deal treated as abandoned if not actioned) |
| `meeting_no_preparation` | Meeting start time |
| `contact_new_no_interaction` | 30 days (no longer "new") |
| `ai_pattern_detected` | 7 days (post-Alpha) |

### Mixed expiration

Some signals use event-driven resolution with a TTL fallback. If the resolution event does not occur within the TTL, the signal expires by time and re-enters the next evaluation cycle.

| Signal | Resolution event | TTL fallback |
|--------|----------------|-------------|
| `deal_approaching_close` | Deal won/lost | Close date + 7 days |
| `company_stale` | Activity recorded | 60 days |

### Expiration is not deletion

When a signal expires, it moves to `archived` state. If the condition recurs, the producer generates a new signal in the next evaluation cycle. Expiration governs the current instance — not whether the condition can recur.

---

## Chapter 11 — History

Archived signals are retained permanently. This is not a v1.0 surface requirement — it is a foundation for future intelligence.

### What history enables

**Pattern detection (post-Alpha):** If a deal has been flagged `deal_stale` three separate times across six months, this pattern is meaningful. History allows AI Core to detect it.

**Relationship memory:** The arc of a contact relationship — when signals first appeared, how long they persisted, what resolved them — feeds the Story section of Workspaces.

**Trust calibration (post-Alpha):** If a user repeatedly dismisses `company_stale` for the same company, the system learns (via AI Core) what the user considers relevant staleness for that relationship type.

### What history is not

History is not an activity log. The Signal Engine records only signals that crossed the threshold of consequence — not every interaction or system event.

History is not user-facing in v1.0. Signal history is consumed by Business Memory and AI Core. It does not appear directly in any v1.0 surface.

---

## Chapter 12 — Visibility Map

The Visibility Map defines which signal types are eligible for which surfaces. A signal type not listed for a surface is never shown there, regardless of tier or severity.

```
Signal Type                    | Focus | Attn | Rel | Work | WS:Dec | WS:Sit |
-------------------------------|-------|------|-----|------|--------|--------|
deal_approaching_close         |  ✓    |  ✓   |     |      |   ✓    |   ✓    |
deal_close_date_passed         |  ✓    |  ✓   |     |      |   ✓    |   ✓    |
deal_stale                     |  ✓    |  ✓   |     |      |   ✓    |   ✓    |
proposal_unanswered            |  ✓    |  ✓   |     |      |   ✓    |   ✓    |
deal_no_primary_contact        |       |      |     |      |   ✓    |   ✓    |
deal_missing_value             |       |      |     |      |        |   ✓    |
deal_missing_close_date        |       |      |     |      |        |   ✓    |
contact_stale                  |       |  ✓   |  ✓  |      |   ✓    |   ✓    |
contact_overdue_task           |  ✓    |  ✓   |     |  ✓   |   ✓    |   ✓    |
contact_new_no_interaction     |       |      |  ✓  |      |        |   ✓    |
contact_no_company             |       |      |     |      |        |   ✓    |
contact_no_reach               |       |      |     |      |   ✓    |   ✓    |
contact_deal_stalling          |  ✓    |  ✓   |  ✓  |      |   ✓    |   ✓    |
company_stale                  |       |  ✓   |  ✓  |      |   ✓    |   ✓    |
company_no_contacts            |       |      |  ✓  |      |   ✓    |   ✓    |
company_no_active_deals        |       |      |     |      |        |   ✓    |
company_closing_deal           |  ✓    |  ✓   |     |      |   ✓    |   ✓    |
company_incomplete_profile     |       |      |     |      |        |   ✓    |
task_due_today                 |       |      |     |  ✓   |        |        |
task_overdue                   |       |  ✓   |     |  ✓   |        |        |
task_blocked                   |       |      |     |  ✓   |        |        |
task_waiting_customer          |       |      |     |  ✓   |        |        |
email_important_unanswered     |  ✓    |  ✓   |     |      |   ✓    |   ✓    |
meeting_approaching            |  ✓    |  ✓   |     |      |        |        |
meeting_no_preparation         |       |  ✓   |     |      |        |        |
```

Key:
- **Focus** = Today / Focus card
- **Attn** = Today / Attention Required
- **Rel** = Today / Relationship Signals
- **Work** = Today / Today's Work
- **WS:Dec** = Workspace / Decision layer
- **WS:Sit** = Workspace / Situation layer (Workspace Intelligence)

---

## Chapter 13 — The Eight Design Questions

Every signal type in the Signal Engine must answer these eight questions. A signal type that cannot answer all eight should not exist in the Engine.

These are the design questions applied whenever a new signal type is proposed. They prevent noise proliferation, enforce evidence standards, and ensure every signal serves a genuine business purpose.

### Question 1 — Why does this signal exist?

What specific business harm occurs if this signal is never surfaced?

A valid answer names a real business outcome: "A deal closes without follow-up because the salesperson forgot the proposal was unanswered." An invalid answer describes system state without naming a consequence: "The proposal field is populated but no response event has been recorded."

If a signal cannot name its specific business consequence, it does not earn a tier.

### Question 2 — Who produced it?

Which authorized producer in Chapter 6 is responsible for this signal?

A valid answer names one producer from the authorized list. If no existing producer can produce this signal, the business condition it describes may not be well-understood enough to define yet. New signal types require an authorized producer — if one doesn't exist, adding it to Chapter 6 is part of the definition work.

### Question 3 — Who consumes it?

Which consumer (Chapter 7) has the authority to surface this signal?

A valid answer names one or more consumers from the authorized list, consistent with the Visibility Map (Chapter 12). Placing a Tier 3 task signal in the Focus card is an invalid answer.

### Question 4 — When does it expire?

What real-world event resolves this signal, or what TTL applies?

A valid answer is specific: "When the user records any activity on the deal" or "When 30 days have elapsed since the signal was produced." An invalid answer: "When the situation is no longer relevant."

Signals without clear expiration conditions do not enter the Engine. An unexpiring signal accumulates indefinitely and becomes noise.

### Question 5 — Can it merge with or evolve from another signal?

If two signal conditions overlap on the same entity, should they be expressed as one signal or two?

Signal merging does not happen in the Engine — the Engine maintains individual signals. Signal prioritization (choosing which of two signals drives the Decision recommendation) happens in the consumer (the resolver). The question is answered at the resolver level: "if both `deal_stale` and `deal_close_date_passed` exist for the same deal, which does the resolver claim?"

The answer must be specified: `deal_close_date_passed` takes priority. The resolver claims it. `deal_stale` is suppressed by the claim and available to Situation as secondary context.

### Question 6 — Can AI produce it?

Is this signal type eligible for AI production (post-Alpha)?

AI production is reserved for Category 6 — Memory Signals that require pattern analysis across the full history of an entity. For a signal type to be AI-eligible, it must:
1. Require pattern analysis that cannot be expressed as a threshold condition
2. Have an evidence standard that AI can satisfy with a named, specific fact
3. Be in Tier 4 (post-Alpha)

AI never overrides a deterministic resolver's signal. If a contact is stale by the 21-day threshold, the Contact Resolver produces `contact_stale`. AI does not compete with or replace this.

### Question 7 — Can the user dismiss it?

What user agency exists over this signal?

All signals in v1.0 are dismissable. Dismissal does not resolve a signal. The signal re-enters when the dismissal TTL expires (if temporary) or when the underlying condition resolves and recurs (for signals marked permanent). Dismissal is recorded against the specific signal instance — not against the signal type for this entity permanently.

### Question 8 — What evidence is required for this signal to be valid?

What specific, named fact must be true for this signal to be produced?

Valid evidence: "The expected close date is within 7 days AND the date has not yet passed." "No interaction recorded for 21 or more days." "The task due date is today's date and status is not completed."

Invalid evidence: "The relationship feels quiet." "The deal might be at risk." "There has been limited activity."

The evidence requirement is enforced at production time. A producer that cannot provide the required evidence does not produce the signal.

---

## Chapter 14 — Signal Catalog

Eight representative signals illustrating how the Signal Engine governs real business conditions.

---

### Signal 1 — Deal Closing

**Signal type:** `deal_approaching_close`

**Q1 — Why?** If a deal's close date is within 7 days and no preparation has happened, the window to close on time is narrowing. Missing the close date damages pipeline reliability and creates renegotiation pressure.

**Q2 — Who produced it?** Deal Resolver (`lib/deals/decision.ts`). Threshold: `expected_close_date` within 7 days AND deal not yet won or lost.

**Q3 — Who consumes it?** Today/Focus (if highest-priority cross-entity signal), Today/Attention Required (if not claimed by Focus), Workspace/Decision (for the specific deal).

**Q4 — When does it expire?** Event: Deal marked won, lost, or close date updated beyond the 7-day threshold. TTL fallback: close date + 7 days.

**Q5 — Merge/evolve?** If `proposal_unanswered` also exists for this deal, they coexist. The Decision resolver claims `deal_approaching_close` as more time-bound. `proposal_unanswered` becomes available to Situation as secondary context.

**Q6 — AI?** No. Deterministic threshold condition.

**Q7 — Dismissal?** Yes. "Remind me later" (24h TTL) or "not urgent" (7 days). Signal re-appears when TTL expires if not resolved.

**Q8 — Evidence required?** Named deal + numeric days to close. Locale key: `signals.deal_approaching_close_evidence` — "{{dealName}} closes in {{daysToClose}} days."

---

### Signal 2 — Relationship Stale

**Signal type:** `contact_stale`

**Q1 — Why?** Business relationships require maintenance. A contact in an active deal who has not been engaged in 21+ days is a relationship at risk. Relationships lost to inaction are expensive to recover and often unrecoverable.

**Q2 — Who produced it?** Contact Resolver (`lib/contacts/decision.ts`). Threshold: `last_contacted_at` is 21 or more days ago AND contact has active deals or partnerships.

**Q3 — Who consumes it?** Today/Relationship Signals, Workspace/Decision (for the specific contact), Workspace/Situation (if a different signal claims the Decision).

**Q4 — When does it expire?** Event: Any interaction recorded for the contact. Clock resets. New signal produced if contact becomes stale again.

**Q5 — Merge/evolve?** If `contact_overdue_task` also exists, the Decision resolver picks `contact_overdue_task` (Tier 1, higher urgency). `contact_stale` becomes available to Situation as secondary context.

**Q6 — AI?** Not in v1.0. The 21-day threshold is deterministic. Post-Alpha, AI Core may adjust the threshold based on the contact's established cadence, but the signal type remains the same.

**Q7 — Dismissal?** Yes. "Not urgent" (7 days) — covers situations where the user has spoken to the contact outside of Gunimi.

**Q8 — Evidence required?** Named contact + days since last recorded contact. Locale key: `signals.contact_stale_evidence` — "No contact with {{contactName}} in {{daysSinceContact}} days."

---

### Signal 3 — Customer Silent

**Signal type:** `email_important_unanswered`

**Q1 — Why?** An unanswered email in the context of an active deal represents a communication gap that, if left unaddressed, cools the opportunity. The business consequence of no follow-up is the same whether the silence is objection, disinterest, or a missed email: the deal moves toward loss.

**Q2 — Who produced it?** Email Engine (`lib/email/`). Threshold: sent email in an active deal context with no recorded response beyond 7 days.

**Q3 — Who consumes it?** Today/Focus (if highest priority), Today/Attention Required, Workspace/Decision (for the deal or contact this email belongs to).

**Q4 — When does it expire?** Event: Reply recorded in the email thread, or user marks as resolved. TTL fallback: 30 days.

**Q5 — Merge/evolve?** May coexist with `deal_approaching_close` for the same entity. Decision resolver selects the more urgent.

**Q6 — AI?** Not in v1.0. Post-Alpha, AI Core may classify emails as "important" based on content analysis, elevating the signal tier.

**Q7 — Dismissal?** Yes. "Already handled" (immediate resolution) or "remind me later" (24h TTL).

**Q8 — Evidence required?** Named contact + days since email sent + optionally named deal. Locale key: `signals.email_unanswered_evidence` — "No response from {{contactName}} in {{daysSinceEmail}} days."

---

### Signal 4 — Task Overdue

**Signal type:** `task_overdue`

**Q1 — Why?** An overdue task represents a broken commitment — to a customer, a colleague, or a deal that needs an action to progress. Overdue tasks compound: one day overdue is friction; seven days overdue has business consequences.

**Q2 — Who produced it?** Task Engine. Threshold: task `due_date` is before today AND status is not `completed`.

**Q3 — Who consumes it?** Today/Attention Required (if more than 1 day overdue), Today/Work, Workspace/Decision (for the associated entity, if the task is the highest-priority condition for that entity).

**Q4 — When does it expire?** Event: Task marked complete or deleted. No TTL — an overdue task does not expire by time. It persists until resolved.

**Q5 — Merge/evolve?** Multiple overdue tasks for the same entity produce independent signals (deduplication key includes `taskId`). Each is its own signal.

**Q6 — AI?** No. Deterministic condition.

**Q7 — Dismissal?** Yes, TTL of 24 hours. Signal re-enters until the task is completed.

**Q8 — Evidence required?** Named task + days overdue + associated entity name. Locale key: `signals.task_overdue_evidence` — "\"{{taskName}}\" is {{daysOverdue}} days overdue."

---

### Signal 5 — Revenue Risk

**Signal type:** `deal_close_date_passed`

**Q1 — Why?** A deal whose close date has passed without being updated or closed is in ambiguous state. Each day this signal is not acted on, the deal's value becomes less recoverable.

**Q2 — Who produced it?** Deal Resolver. Threshold: `expected_close_date` is before today AND deal status is `open`.

**Q3 — Who consumes it?** Today/Focus (if the deal has significant value), Today/Attention Required, Workspace/Decision.

**Q4 — When does it expire?** Event: Close date updated to a future date, or deal won/lost. TTL: 30 days (signal archives if ignored — deal treated as abandoned).

**Q5 — Merge/evolve?** If `deal_stale` also exists for this deal, `deal_close_date_passed` takes priority. The Decision resolver claims it. `deal_stale` is suppressed by this claim.

**Q6 — AI?** No. Deterministic threshold.

**Q7 — Dismissal?** Yes. "Not urgent" (7 days) — covers informal negotiations past the official date.

**Q8 — Evidence required?** Named deal + days past close date + deal value (for priority weighting). Locale key: `signals.deal_close_date_passed_evidence` — "{{dealName}} ({{dealValue}}) passed its close date {{daysPassed}} days ago."

---

### Signal 6 — Important Email

**Signal type:** `email_important_unanswered`

This is the same signal type as Signal 3 — Customer Silent. The business condition is identical: an important email awaiting a response. The context differs (Signal 3 is viewed from the perspective of the customer going silent; Signal 6 from the perspective of an email needing a reply), but the signal type, structure, lifecycle, and evidence requirement are the same. A single signal type serves both framings.

---

### Signal 7 — Upcoming Meeting

**Signal type:** `meeting_approaching`

**Q1 — Why?** A meeting starting within 2–4 hours with a contact who has unreviewed recent history in Gunimi is a preparation opportunity. The user may not be aware of relevant context available to them. The signal creates awareness, not urgency.

**Q2 — Who produced it?** Email Engine (calendar integration). Threshold: meeting starts within 4 hours AND the primary contact for the meeting has a Contact Workspace.

**Q3 — Who consumes it?** Today/Focus (only in the absence of other critical Tier 1 signals — a calm morning where preparation is the most important thing), Today/Attention Required.

**Q4 — When does it expire?** TTL: Meeting start time. Time-bound by definition.

**Q5 — Merge/evolve?** May coexist with `contact_stale` for the same contact — the meeting is the opportunity to address the staleness. But they remain separate signals. The Decision resolver selects `meeting_approaching` as the more immediately time-bound.

**Q6 — AI?** Not in v1.0 (calendar integration not in Alpha scope). Post-Alpha, AI may enhance this signal with preparation context based on the contact's relationship history.

**Q7 — Dismissal?** Yes. The TTL is short enough (hours) that dismissal effectively equals resolution.

**Q8 — Evidence required?** Named meeting + named contact + hours until meeting. Locale key: `signals.meeting_approaching_evidence` — "Meeting with {{contactName}} in {{hoursToMeeting}} hours."

---

### Signal 8 — Memory Reminder

**Signal type:** `memory_reminder`

**Q1 — Why?** A stored business memory — a commitment made, a context noted, a follow-up promised — that has not been acted on within a meaningful timeframe is information the user needs without having to remember it themselves.

**Q2 — Who produced it?** AI Core (post-Alpha). Requires Business Memory layer. Not available in v1.0.

**Q3 — Who consumes it?** Today/Focus only in the complete absence of Tier 1, 2, and 3 signals. Memory reminders are the lowest urgency tier — they surface only when business is genuinely calm.

**Q4 — When does it expire?** TTL: 7 days. User acknowledgment. The stored memory is not deleted — the signal instance expires and AI Core may re-produce if the condition persists.

**Q5 — Merge/evolve?** May be elevated by AI Core to a Tier 1 signal if the memory reveals an imminent consequence (e.g., a committed delivery date is approaching). In that case, a separate Tier 1 signal is produced — the memory reminder itself is not elevated.

**Q6 — AI?** Yes — this is the primary AI-produced signal type in the Engine. AI Core produces it from pattern analysis across stored notes, commitments, and interaction history.

**Q7 — Dismissal?** Yes. Memory reminders are the most dismissible signal type. Dismissal is expected. The system does not re-surface dismissed memory reminders more than once per TTL period.

**Q8 — Evidence required?** Named entity + specific remembered context + specific reason the memory is still relevant. "You committed to sending a proposal update to Maria Chen by end of last week — no update was sent" is valid. "This relationship may need attention" is not valid and does not qualify for the `memory_reminder` signal type.

---

## Chapter 15 — What Must Never Happen

These are the anti-patterns the Signal Engine must prevent by design.

---

**Anti-pattern 1 — The same signal in two surfaces**

A deal is stale. The signal appears in Today/Focus, Today/Attention Required, and the Deal Workspace Situation layer simultaneously.

*Violates:* Workspace Grammar Rule 3.12 — "No duplicated signals." Workspace Contract §6 — signal suppression.

*Prevention:* Claim suppression (Chapter 8, Level 1). When Focus claims the signal, Attention Required and Workspace Situation are blocked.

---

**Anti-pattern 2 — Fabricated evidence**

A signal is produced for a deal described only as "this deal may need attention" with no specific named fact. Confidence is set to `high` despite no evidence.

*Violates:* Workspace Grammar Invariant 10 — "No fabricated information." Rule P.1 — "Evidence before production."

*Prevention:* A signal with empty or invalid evidence is rejected at ingestion. The Engine enforces the evidence standard — it is not left to the producer's discretion.

---

**Anti-pattern 3 — Manufactured urgency**

It is a calm business day. The Engine produces a `deal_missing_value` signal and elevates it to Tier 1 to fill the Focus card.

*Violates:* Product Bible Principle 13 (Calm Software). Today Experience Blueprint — "Never fabricate urgency."

*Prevention:* Tier assignments are permanent (Chapter 4.2). `deal_missing_value` is Tier 2, severity `info`. It cannot be elevated. When no Tier 1 signals exist, Focus shows an honest healthy state.

---

**Anti-pattern 4 — Signal proliferation**

A meeting produces a proposal to create eight new signal types for every missing contact profile field: `contact_missing_phone`, `contact_missing_linkedin`, `contact_missing_birthday`, and so on.

*Violates:* Product Bible Principle 18 (Silence Is A Feature). The Eight Design Questions — none of these signals can answer Q1 with a named business consequence.

*Prevention:* The Eight Design Questions are mandatory for every proposed signal type. Proposed signals that fail Q1 do not enter the Engine.

---

**Anti-pattern 5 — AI identity in output**

A signal produced by AI Core carries a badge: "AI detected" or a tooltip: "Generated by Gunimi AI."

*Violates:* Workspace Grammar Invariant 8 — "No AI identification." Product Bible AI Philosophy — AI never identifies itself.

*Prevention:* Signal rendering never exposes `producedBy`. The producer field is internal to the Engine. Consumer surfaces display the evidence — never the source.

---

**Anti-pattern 6 — Permanent dismissal that never re-enters**

A user dismisses `deal_stale` as "not relevant" for Deal X. The deal becomes active (proposal sent, reply received). Six weeks later, activity ceases again. The deal is stale again. But the Engine produces no new signal because the permanent dismissal is still in place.

*Violates:* Resolution condition semantics — dismissal does not equal resolution.

*Prevention:* Permanent dismissal is recorded against the specific signal instance (`id`). When the signal resolves (activity recorded) and then re-enters (goes stale again 21+ days later), the new signal has a new `id`. The dismissal from the previous instance does not carry forward.

---

**Anti-pattern 7 — Consumer producing signals**

The Today surface detects the user has not logged in for 3 days and creates a `user_inactivity` signal to encourage re-engagement.

*Violates:* Rule C.1 — "Consumers never produce." Today Experience Blueprint — signals based on product engagement metrics are explicitly prohibited.

*Prevention:* Consumer code has no write access to the signal pool. `user_inactivity` is not a signal type in the Engine — it serves the product, not the user's business.

---

## Chapter 16 — Signal Engine Invariants

These are the non-negotiable properties of the Signal Engine. Any implementation that violates these invariants is incorrect regardless of how it was designed.

---

**Invariant 1 — Evidence before existence.**
A signal does not exist in the Engine without specific, named, observable evidence. No signal may be created with vague or general evidence. Evidence is required at production time, not added later.

**Invariant 2 — Single ownership.**
At any moment, each signal instance is owned by at most one consumer. The same signal is never displayed in two surfaces simultaneously. Claim suppression is enforced by the Engine, not by individual consumers negotiating.

**Invariant 3 — Tiers are permanent.**
The tier of a signal type is defined at the type level and never changes at runtime for individual instances. A task signal is never elevated to Tier 1. A Tier 1 deal signal is never demoted to Tier 2. Runtime data affects priority within a tier, not the tier itself.

**Invariant 4 — No fabricated confidence.**
A signal with insufficient evidence for `high` confidence is classified as `medium` or `low`. The Engine never assigns a confidence level higher than the evidence supports. When evidence is insufficient, confidence is `low` and the signal is not surfaced.

**Invariant 5 — Deduplication at ingestion.**
The Engine never holds two active signals with identical deduplication keys. Deduplication is checked before a new signal is created, not after.

**Invariant 6 — Healthy state is explicit.**
When no signals exist for a given surface, the surface renders an explicit healthy state — not blank, not loading, not empty. Silence is never shown without declaration. The absence of signals is itself a valuable positive signal.

**Invariant 7 — Expiration conditions are required.**
Every signal type has a defined resolution condition (event or TTL). A signal type with no defined expiration is invalid and does not enter the Engine.

**Invariant 8 — AI signals carry evidence.**
Signals produced by AI Core are held to the same evidence standard as deterministic signals. A pattern-detected signal must name its specific evidence. "Pattern detected" is not evidence.

**Invariant 9 — Dismissal does not equal resolution.**
User dismissal suppresses a signal temporarily. The resolution condition must be met for the signal to archive. A dismissed signal re-enters when the dismissal TTL expires.

**Invariant 10 — No cross-tier claims.**
A consumer may only claim signals within its tier scope. Focus may not claim Tier 3 signals. Today's Work may not claim Tier 1 signals.

**Invariant 11 — No AI identification in output.**
The `producedBy` field is internal to the Engine. No signal rendering surface exposes the producer to the user.

**Invariant 12 — Producers do not route.**
A producer declares a signal's type, tier, severity, confidence, and evidence. The Engine routes the signal to appropriate consumers. Producers do not decide which surface displays their signals.

---

## Chapter 17 — Open Alpha Scope

### In scope for Signal Engine v1.0

All Tier 1, Tier 2, and Tier 3 signal types defined in Chapter 5, Categories 1–5.

All authorized producers from Chapter 6 except AI Core (Producer 6) and User manual flags (Producer 7).

All authorized consumers from Chapter 7 except Business Memory (Consumer 7).

Suppression (Chapter 8) — claim suppression and user dismissal suppression, both required.

Deduplication (Chapter 9) — full implementation required.

Expiration — event-driven and TTL, both required.

History — archived signals retained; Business Memory consumption deferred to post-Alpha.

### Deferred to post-Alpha

**Category 6 — Memory Signals** (`relationship_milestone`, `ai_pattern_detected`, `memory_reminder`) — require AI Core and Business Memory layer.

**Producer 6 — AI Core** — requires Business Memory layer.

**Producer 7 — User manual flags** — future feature, requires UI design.

**Consumer 7 — Business Memory** — requires Business Memory layer.

**Pattern detection from history** — requires sufficient archived signal data and AI Core.

**Role-aware signal routing** — different priorities for different user roles (CEO vs. salesperson vs. CS) — deferred per Today Experience Blueprint.

**Team coordination signals** — require presence features and collaboration data not in Alpha scope.

**Calendar integration** — `meeting_approaching` and `meeting_no_preparation` depend on calendar sync, which is post-Alpha.

### What must exist on Day 1 of Open Alpha

A user with 3 active deals, 5 contacts, and 4 pending tasks opens Today for the first time. Within 30 seconds they know:
1. The single most urgent action across their business (Focus)
2. The other things that need action today (Attention Required)
3. Which relationships need attention this week (Relationship Signals)
4. What work is committed for today (Today's Work)

The Signal Engine is the infrastructure that makes this possible. Without it, each surface makes independent, contradictory assessments of the same business state. The Engine must be operational on Day 1.

---

## Chapter 18 — Signal Identity

A signal that cannot be traced is a signal that cannot be trusted.

The Signal Engine will eventually be the source for Decisions, Automations, Business Memory, and AI recommendations. When a recommendation is made, or an automation fires, or a memory item is created, the question "why?" must have a traceable answer. Signal Identity is the layer that makes "why?" answerable — not just today, but a year from now, across a chain that looks like:

```
Email → Signal → Memory → Recommendation → Automation
```

Without Signal Identity, each step in this chain is opaque. Signal Identity makes the chain transparent.

### The Identity Contract

Every signal in the Engine carries the following identity fields in addition to its functional contract (Chapter 4):

| Field | Type | Description |
|-------|------|-------------|
| `signalId` | string | The signal's globally unique, stable identifier. Never reused after archive. The anchor of the entire traceability chain. |
| `workspaceId` | string | The workspace this signal belongs to. Signals do not cross workspace boundaries. |
| `entityId` | string | The specific entity this signal describes (also in the functional contract — included here as an identity field). |
| `entityType` | `EntityType` | `deal · contact · company · task · email` (also in the functional contract — included here as an identity field). |
| `origin` | string | The specific event or record that triggered this signal. Named and traceable: `email_thread_id:abc123`, `deal_record_id:xyz456`, `task_id:tsk789`. Not a generic description — a specific pointer to the source. |
| `correlationId` | string | A shared identifier that groups related signals together. Multiple signals produced from the same triggering event (e.g., the same email thread producing both `email_important_unanswered` and `contact_deal_stalling`) share a `correlationId`. This allows the full context of a triggering event to be reconstructed. |
| `parentSignalId` | `string or null` | If this signal was derived from or evolved from another signal (see Chapter 19), the parent signal's `signalId` is recorded here. Null for signals with no parent. |

### Why Signal Identity matters

**Traceability:** "Which signal caused which decision?" is answerable. Every Decision surface that claims a signal records the `signalId` it claimed. Every Memory item created from a signal pattern records the `signalId`s that contributed. Every automation that fires records the `signalId` that triggered it. The chain is reconstructible.

**Audit:** When a user asks "why did Gunimi recommend this?" the answer is: "Signal X (`signalId`) was produced from event Y (`origin`) on date Z because condition W was true (`evidenceKey + evidenceData`)." This is explainability (Chapter 21) made possible by Identity.

**Pattern analysis:** Business Memory reads the Signal Archive (Chapter 11). When Memory detects that the same `origin` type has produced the same signal type three times, it has a pattern. Without `origin`, the pattern is "three stale signals." With `origin`, the pattern is "three stale signals, all following email threads that went unanswered — this contact goes silent after email, not after calls." That is a recommendation. The `origin` field is what separates a count from an insight.

**Automation readiness:** When Gunimi adds Automation (post-Alpha), automations will be triggered by signal conditions. An automation that fires when `deal_approaching_close` is claimed by Focus needs to know the `signalId` it acted on, the `workspaceId` it belongs to, and the `entityId` it affects. Signal Identity provides all of this without additional architecture.

**CorrelationId in practice:**

A single email from Maria goes unanswered for 9 days while the deal close date is in 4 days. The Engine produces two signals from this situation:
- `email_important_unanswered` — `correlationId: corr_007`
- `deal_approaching_close` — `correlationId: corr_007`

Both signals share `corr_007`. When the Decision resolver must choose between them for the Focus card, it can use the correlation to understand they describe the same triggering situation. When AI Core later analyzes what preceded a deal win, it can ask: "show me all signals that shared a correlationId with the `deal_approaching_close` that fired before the win" — and find the full context of that situation, not just the signal that claimed the Decision.

---

## Chapter 19 — Signal Evolution

A signal does not die and get replaced by a new signal as context changes. A signal evolves.

This is not a naming preference. It is an architectural principle with significant consequences for traceability, Business Memory, and the quality of AI reasoning.

### Why evolution instead of replacement

Consider the journey of a single business situation:

```
Maria has not responded to the proposal in 12 days.
  ↓
User schedules a follow-up call.
  ↓
Call is held. Maria says she is waiting for board approval.
  ↓
Board approval received. Maria sends reply.
  ↓
Relationship is active. No further attention required.
```

Under a replacement model, this produces five signals — five separate `signalId`s. The chain is broken. Business Memory sees five disconnected data points, not one coherent journey.

Under an evolution model, this is one signal with four evolution events. The `signalId` is the same throughout. Business Memory sees the complete journey: "this situation was initiated by an unanswered email, progressed through a scheduled call, passed through a waiting state, and resolved with a reply." That is a pattern. That is intelligence.

### The Evolution Model

Every signal carries an `evolutionHistory` — an ordered list of evolution events. Each event records:

| Field | Type | Description |
|-------|------|-------------|
| `evolutionId` | string | Unique identifier for this evolution event |
| `timestamp` | Date | When this evolution occurred |
| `previousState` | `SignalEvolutionState` | The signal's state before this event |
| `newState` | `SignalEvolutionState` | The signal's state after this event |
| `trigger` | string | What caused this evolution (`meeting_scheduled`, `reply_received`, `days_escalated`) |
| `evidenceUpdate` | `object or null` | If the evidence changed, the new `evidenceKey + evidenceData` |
| `severityChange` | `SeverityDelta or null` | If severity changed, the direction and reason |

### Signal Evolution States

| State | Description |
|-------|-------------|
| `initial` | Signal first produced — condition just crossed threshold |
| `escalated` | Severity or urgency has increased (more days elapsed, higher value at risk) |
| `de_escalated` | Severity has decreased (partial resolution, user action taken but not complete) |
| `evolved` | Signal type is the same; the underlying situation has progressed into a new phase |
| `resolved` | Resolution condition met — signal archives |

### Worked example — Customer Silent

```
Signal: email_important_unanswered
SignalId: sig_4821
ParentSignalId: null
CorrelationId: corr_119

[initial — Day 9]
  State: initial
  Evidence: "No response from Maria Chen in 9 days."
  Severity: critical
  Trigger: email_threshold_crossed

[escalated — Day 14]
  State: escalated
  Evidence: "No response from Maria Chen in 14 days. Deal closes in 3 days."
  Severity: critical
  Trigger: deal_close_proximity_detected (correlationId: corr_119)

[evolved — Day 15]
  State: evolved
  Evidence: "Meeting scheduled with Maria Chen for tomorrow."
  Severity: warning (de-escalated — action is in progress)
  Trigger: meeting_created_for_entity

[evolved — Day 17]
  State: evolved
  Evidence: "Meeting held. Maria Chen indicated board approval pending."
  Severity: warning
  Trigger: meeting_completed_note_added

[resolved — Day 24]
  Trigger: reply_received_from_contact
```

The `signalId: sig_4821` persists through all five states. The complete journey is readable: 9-day silence → escalation at close proximity → user acted (meeting) → waiting → resolved in 24 days total. Business Memory can read this as one coherent pattern.

### What does not evolve

A fully resolved signal does not evolve. It is archived. If the same condition recurs (the same contact goes silent again 30 days later), a new signal is produced with a new `signalId` — and that new signal carries a `parentSignalId` pointing to the previous resolved signal. The chain of recurrence is preserved through `parentSignalId`, even though the signals themselves are separate instances.

### Evolution and the Signal Contract

Evolution does not change a signal's `type`, `entityType`, `entityId`, `tier`, or `workspaceId`. These fields are permanent for the lifetime of the signal. What evolution changes:
- `evidenceKey` and `evidenceData` — the current evidence updates as the situation progresses
- `severity` — may change as the situation escalates or de-escalates
- `claimedBy` — may change as consumers re-evaluate
- `evolutionHistory` — grows with each state transition

---

## Chapter 20 — Signal Graph

The Signal Graph is the conceptual model of how signals connect to every other intelligence element in Gunimi.

It is not a data structure to implement in v1.0. It is the architectural concept that AI will use to reason about causes, trace chains, and identify patterns that no single signal reveals. The v1.0 principle: **build the nodes correctly now so the edges can be added later.**

### The Graph

```
Interaction
(email, meeting, note, task, deal event)
      ↓ produced_by
Signal
(Signal Engine — ephemeral, active)
      ↓ archived_into
Signal Archive
(Signal Engine — resolved, retained)
      ↓ read_by
Business Memory
(pattern synthesis, confidence accumulation)
      ↓ produces
Memory Signal / Threshold Calibration
(AI Core → Signal Engine, Tier 4)
      ↓ claimed_by
Decision
(Workspace surface — one recommendation)
      ↓ acted_on_by
Action
(user-taken action: email, call, note, stage change)
      ↓ produces
New Interaction        →→→   or triggers   →→→   Automation (post-Alpha)
(completing the cycle)               (system-executed action based on signal state)
```

### Node types

| Node | What it represents |
|------|--------------------|
| **Interaction** | A raw business event: email sent, meeting held, note created, deal stage changed |
| **Signal** | A threshold-crossing condition produced by the Signal Engine |
| **Decision** | A consumer claiming a signal as the basis for a recommendation |
| **Action** | A user or system acting on a Decision |
| **Memory** | A synthesized insight derived from signal patterns and interaction history |
| **Automation** | A system-executed action triggered by a signal state (post-Alpha) |

### Edge types

| Edge | From → To | Meaning |
|------|-----------|---------|
| `produced_by` | Signal ← Interaction | This signal was triggered by this specific event |
| `informed_by` | Decision ← Signal | This Decision was made because of this signal |
| `archived_into` | Archive ← Signal | This signal, once resolved, entered the archive |
| `derived_from` | Memory ← Signal Archive | This memory item was synthesized from these archived signals |
| `produced_by` | Memory Signal ← Memory | This Tier 4 signal was created because this memory item became time-sensitive |
| `triggered_by` | Automation ← Signal | This automation fired because of this signal state (post-Alpha) |
| `resolved_by` | Signal Resolution ← Action | This action caused the signal to resolve |

### Why the Graph matters

**For AI reasoning:** AI Core does not operate on isolated signals. It operates on the graph. When AI Core asks "why is this deal at risk?", the answer is not "because `deal_stale` is firing." The answer is: "because three `deal_stale` signals have fired for this entity across six months, each preceded by an `email_important_unanswered` signal, and each was resolved by a phone call. The current situation shows the same pattern — the phone call has not yet happened."

That reasoning requires the graph. It requires knowing that the current signal is connected via `parentSignalId` to prior signals, which are connected to `email_important_unanswered` signals via `correlationId`, which are connected to actions (phone calls) that resolved them. Without the graph, this is noise. With the graph, this is a specific recommendation grounded in evidence: "Call — this entity responds to calls when email goes unanswered."

**For Explainability (Chapter 21):** The Signal Graph is the evidence chain that answers "why?" Every node in the graph is reachable from the current signal through its identity fields. The full path from "email not replied to" to "system recommends calling" is traceable.

**For Automation:** An automation rule is a conditional traversal of the graph: "when a signal of type X is in state Y for entity of type Z for N days, trigger action A." The graph makes this expressible without brittle hardcoded conditions.

**For the user:** The user never sees the graph. They see: "Call Maria — her previous stall was also resolved by a call." That sentence is the graph, expressed in natural language, at the moment it is relevant.

---

## Chapter 21 — Explainability

Every signal in the Signal Engine must be able to answer seven questions at any point in its lifecycle. This is not a UI requirement — it is a contract property. The answers must be computable from the signal's own data, without querying external state.

Explainability is what distinguishes intelligence from assertion. A signal that cannot explain itself is a black box. A black box cannot earn trust. A black box cannot be corrected when it is wrong.

### The Seven Questions

**1 — Why does this signal exist?**

What business condition makes this signal valid right now?

Answered by: `type` (the signal category defines the business condition) + `evidenceData` (the specific instance of that condition).

Example answer: "This signal exists because `deal_approaching_close` is true: the deal 'Enterprise Expansion' closes in 4 days and has not yet been won or lost."

A signal that cannot name its specific business condition violates Rule P.1 (evidence before production) and should not exist in the Engine.

---

**2 — When did this signal originate?**

When was this condition first detected? When did it become urgent?

Answered by: `producedAt` (when the signal was created) + `evolutionHistory` (when it escalated or evolved).

Example answer: "This signal was first produced 14 days ago when the close date entered the 7-day window. It escalated 3 days ago when the deal value was confirmed at $85,000, increasing its priority weight in the Focus algorithm."

---

**3 — From what did this signal come?**

What specific event or data point triggered this signal?

Answered by: `origin` (the specific source record) + `producedBy` (which producer evaluated it).

Example answer: "This signal was produced by the Deal Resolver from the deal record `deal_id:xyz789`. The triggering condition was `expected_close_date: 2026-07-18` evaluated against today's date `2026-07-14`."

This is the paper trail. Not "who told you?" but "what specific data made this true?" `origin` (Chapter 18) is what makes this question answerable.

---

**4 — What is the evidence?**

What specific, observable fact is this signal based on?

Answered by: `evidenceKey` (the locale template) + `evidenceData` (the runtime values).

Example answer: "'Enterprise Expansion closes in 4 days.'"

The evidence is the most user-facing of the seven answers — it is what appears in the Decision section's reason sentence (Workspace Grammar Rule 2.3). Evidence that cannot be expressed as a named entity + specific condition + time dimension is not valid evidence for a signal.

---

**5 — What is the confidence?**

How certain is the system that this signal is valid?

Answered by: `confidence` — `high`, `medium`, or `low`.

Example answer: "Confidence: high. The close date is a structured field with a specific date value. The condition is deterministic — no inference is involved."

Confidence governs which surfaces are eligible to display the signal (Chapter 4.4) and how AI Core weights this signal against competing signals. It is never exposed directly to users — but it is transparent to every internal consumer.

---

**6 — What changed?**

If this signal has evolved from its initial state, what changed and when?

Answered by: `evolutionHistory` (Chapter 19) — the ordered list of state transitions with timestamps, triggers, and evidence updates.

Example answer: "This signal was initially produced with evidence 'No response in 9 days.' It escalated on Day 14 when the deal close date entered a 3-day window. It evolved on Day 15 when a meeting was scheduled. It is currently in `evolved` state — the meeting was held; awaiting reply."

The "what changed" question is the signal's journal. Without evolution history, a signal's current state appears without context. With it, the journey from initial condition to current state is legible — and AI Core can use the journey to calibrate its next recommendation.

---

**7 — How can this signal disappear?**

What action or event will cause this signal to resolve?

Answered by: `resolutionCondition` (human-readable description) + `expiresAt` (TTL, if applicable).

Example answer: "This signal resolves when the deal is marked won or lost, or when the expected close date is updated to a date more than 7 days in the future. It will also archive 7 days after the close date passes, even if neither condition is met."

This is the most actionable of the seven questions. A user who knows how a signal disappears can take purposeful action. A signal that offers no visible resolution path creates learned helplessness — the user sees it, cannot remove it, and eventually ignores it. The resolution condition is also the primary feedback loop for trust: the user acts, the signal resolves, the system works.

### Explainability as a contract

These seven questions are not documentation — they are requirements. Every signal type in Chapter 5 must be answerable across all seven dimensions from its own data. A proposed signal type that cannot provide deterministic answers to all seven is not a well-defined signal type.

### Explainability in v1.0

Explainability manifests in v1.0 as three things:

1. **Decision evidence sentence** — the one-sentence evidence in every Decision recommendation (Workspace Grammar Rule 2.3) is the user-visible expression of Question 4.
2. **Resolution-driven disappearance** — when a signal resolves because the user took the recommended action, Questions 4 and 7 have completed their feedback loop.
3. **Preparation section** — the context assembled for the current Decision action is explainability in practice: "here is what you'll need, and here is why it is relevant."

Post-Alpha, explainability enables:
- AI reasoning chains ("the system recommended X because of signal Y produced from event Z")
- Automation audit trails ("automation A fired because signal B reached state C")
- User-facing "why?" affordances in recommendations
- Regulatory audit readiness for enterprise deployments

---

## Final Note — The Signal Engine and Silence

The most important thing the Signal Engine produces is not a signal.

It is the absence of a signal when none is warranted.

A business owner who opens Today and sees "Everything is on track. No immediate priority today." has received accurate intelligence. Their business is healthy. They can plan their day without the cognitive tax of false urgency.

This honest silence is what distinguishes intelligence from noise.

The Signal Engine earns the right to speak by knowing when not to speak. Every signal that enters the Engine reduces the value of every other signal. The Engine's discipline about what qualifies as a signal is what makes the signals that do qualify worth acting on.

A user who has learned that the Signal Engine is quiet when there is nothing urgent will trust its alarm when it speaks. That trust is the foundation of the habit. The habit is the foundation of the product.

---

**Version:** 1.1
**Created:** 2026-07-11
**Updated:** 2026-07-11 — Added Chapter 18 (Signal Identity), Chapter 19 (Signal Evolution), Chapter 20 (Signal Graph), Chapter 21 (Explainability)
**Authority:** Gunimi Product Bible v1.0 · Workspace Contract v1.0 · Workspace Grammar v1.0 · Today Experience Blueprint v1.0 · Workspace Principles v1.0
**Applies to:** Every business signal produced and consumed in Gunimi — Today, Workspaces, Notifications, Business Memory, Automation (post-Alpha)
**Next review:** After Open Alpha completes — audit signal types against real user behavior and revise thresholds accordingly
