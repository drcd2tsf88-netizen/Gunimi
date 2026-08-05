# ADR-005: Operational Responsibility Model

Status: Accepted
Date: August 2026
Authors: Michal Guoth, Gunimi Architecture

---

## Context

Every system that coordinates work eventually faces the same question: who is
responsible for what?

The standard answer — a field called `assigned_to` pointing to a user — seems
obvious. It is how most CRMs, project tools, and ticketing systems work. It is
also wrong.

`assigned_to` models ownership. Organizations do not run on ownership. They run
on responsibility — distributed, temporal, multi-party, typed, and tracked.

The difference between modeling ownership and modeling responsibility is the
difference between a task tracker and an organizational intelligence platform.

---

## Why Ownership Fails

Traditional systems assign ownership to people:

```
Deal.assigned_to → User
Task.assigned_to → User
Contact.assigned_to → User
```

This creates a model where one person "owns" an entity. But consider what happens
in a real enterprise deal:

- Sales is responsible for commercial progress
- Legal is responsible for NDA and contract review
- Finance is responsible for payment terms and approval
- Operations is responsible for implementation planning

This is not four people who "own" the deal. It is four participants who carry
distinct responsibilities toward the same business reality.

The `assigned_to` model cannot represent this. When you add a second `assigned_to`,
you begin the inevitable drift toward:

```
owner_id, co_owner_id, legal_reviewer_id, finance_approver_id...
```

Each new field is a workaround for a model that was wrong from the start.

**Gunimi does not assign work to owners. Gunimi records responsibilities between
participants.**

Ownership is an administrative concept. Responsibility is how organizations operate.

---

## The Relationship Taxonomy

ADR-003 established that Relationship is a first-class entity. This ADR refines
that model by distinguishing between two fundamentally different categories of
Relationship:

### Structural Relationship

A Structural Relationship exists independently of any work being performed. It
describes business reality as it stands.

Examples:
- Person `works_for` Organization
- Company `owns` Subsidiary
- Person `serves_on_board_of` Organization
- Company `partners_with` Company

Structural Relationships are facts about the world. They are captured and maintained
in `workspace_relationships` (ADR-003). They are the foundation of relationship
intelligence.

### Operational Relationship

An Operational Relationship emerges when participants take on responsibility for a
specific piece of business reality. It describes how work is coordinated, not what
the world looks like.

Examples:
- Legal Team takes `reviewer` responsibility for Deal #1234
- Jan Kováč takes `approver` responsibility for Contract #567
- Sales SK Team takes `owner` responsibility for Contact Alza

Operational Relationships are **Assignments**. They have a purpose, a lifecycle,
a context, and a temporal boundary. When the work is done, the Assignment closes
— but it never disappears.

This ADR governs Operational Relationships. Structural Relationships are governed
by ADR-003.

*Note: A third category — Epistemic Relationships (what entities know or relate to
in a knowledge context) — is reserved for a future ADR. The taxonomy is
Structural | Operational | Epistemic.*

---

## Decision

**Assignment is the canonical model for all operational responsibility in Gunimi.**

An Assignment is an Operational Relationship between a Business Reality and a
Participant. It records who is responsible for what, in what capacity, for how long,
and under what circumstances.

### What Assignment is not

Assignment is not a foreign key. The difference:

| FK approach | Assignment approach |
|---|---|
| `deal.assigned_to = user_id` | Deal has Assignment where Actor = person, responsibility = owner |
| One owner per entity | Multiple participants with distinct responsibilities |
| No history when it changes | Full lifecycle, every transition recorded |
| No context for why | Decision Context captures the moment |
| Deleted when reassigned | Transferred, never deleted |

### The Assignment model

```
workspace_assignments
  id                    UUID PRIMARY KEY
  workspace_id          UUID NOT NULL
  
  -- What is this about
  entity_type           TEXT NOT NULL        -- deal, contact, company, task, contract...
  entity_id             UUID NOT NULL
  
  -- Who is responsible
  actor_type            TEXT NOT NULL        -- person, team, agent, system, organization
  actor_id              UUID NOT NULL        -- references the relevant table
  
  -- What kind of responsibility
  responsibility        TEXT NOT NULL        -- owner, collaborator, reviewer, approver, observer
  
  -- Context at time of assignment
  decision_context      JSONB                -- see Decision Context section below
  
  -- Lifecycle
  status                TEXT NOT NULL        -- proposed, accepted, active, waiting, blocked,
                                             -- completed, cancelled
  
  -- Temporal
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
  active_from           TIMESTAMPTZ          -- when responsibility became/becomes effective
  active_until          TIMESTAMPTZ          -- when responsibility ended (NULL = still active)
  
  -- Transitions
  created_by_actor_type TEXT                 -- who assigned this
  created_by_actor_id   UUID
  closed_reason         TEXT                 -- why this ended
  transferred_to        UUID REFERENCES workspace_assignments(id)
                                             -- if transferred, points to successor Assignment
```

---

## Actors

An Actor is any participant that can bear responsibility. The Actor model is
intentionally polymorphic to accommodate present and future participants.

### Actor types

| Type | Description | Examples |
|---|---|---|
| `person` | An individual human | Jan Kováč (workspace_people.id) |
| `team` | An organizational unit | Sales Slovakia (workspace_teams.id) |
| `agent` | An AI system | Gunimi AI, a specialized reasoning agent |
| `system` | An external system | SAP, DocuSign, a payment processor |
| `organization` | An external organization | A partner company, a supplier |

**Why not just Person and Team?**

Present-day Gunimi uses `person` and `team`. But the model must remain honest about
where it is going. An invoice routed through SAP is an Assignment where the Actor
is an external system. A contract sent for signature through DocuSign is an
Assignment where the Actor is a system. An AI agent that autonomously reviews a
risk assessment is an Assignment where the Actor is an agent.

Building `actor_type + actor_id` from the start costs nothing and preserves a
decade of platform evolution.

### Compatibility with workspace_members

The current implementation does not yet have `workspace_people` (see ADR-002 for
the migration plan). In the interim:

- `actor_type = 'person'` references `workspace_members.id`
- When `workspace_people` migration is complete, this reference will shift to
  `workspace_people.id`

The schema column name is `actor_id`. The application layer resolves it through
the correct table. The architectural contract — Person as identity, not as auth
user — is maintained from the start.

---

## Responsibility Types

The vocabulary of responsibility describes the nature of a participant's commitment
to a piece of business reality.

| Responsibility | Meaning |
|---|---|
| `owner` | Primary accountability. Drives progress. Default point of contact. |
| `collaborator` | Active contributor. Works alongside the owner. |
| `reviewer` | Evaluates the entity and provides assessment or feedback. |
| `approver` | Has authority to authorize next steps or closure. |
| `observer` | Informed of progress. No required action. Not a permission — an active commitment to stay informed. |

Note: `observer` is a Responsibility, not a permission. There is a difference.
Permission governs what an Actor can see in the system. Responsibility governs
what they have committed to. A person may have permission to see a deal without
being an Observer — and an Observer may have narrower system permissions. Permissions
are governed by a separate Permission Engine.

---

## Decision Context

When an Assignment is created, something caused it. Someone looked at a deal, an
entity, a situation — and decided that this Actor should bear this Responsibility.
The Decision Context records that moment.

Decision Context is not a technical snapshot. It is the answer to:
**"Why was this responsibility assigned at this moment?"**

```jsonb
{
  "stage": "negotiation",
  "value": 420000,
  "risk_level": "high",
  "confidence_score": 0.42,
  "ai_recommendation": "legal_review_required",
  "trigger": "contract_value_exceeded_threshold",
  "reason": "Deal exceeds €250k threshold, requires Legal review per policy",
  "expected_outcome": "NDA signed and contract terms approved within 14 days"
}
```

Decision Context fields (all optional, populated as available):

| Field | Type | Purpose |
|---|---|---|
| `stage` | string | Entity stage at time of assignment |
| `value` | number | Entity value at time of assignment |
| `risk_level` | string | Risk assessment at time of assignment |
| `confidence_score` | 0.0–1.0 | AI confidence in this assignment decision |
| `ai_recommendation` | string | What AI suggested |
| `trigger` | string | What event or rule caused this |
| `reason` | string | Human-readable explanation |
| `expected_outcome` | string | What success looks like for this assignment |
| `escalation_policy` | string | What happens if this Assignment stalls |

**Why this matters for AI:**

In two years, Gunimi can say:

> "This deal was assigned to Legal when confidence was 42% and value was €50k.
> Today, confidence is 91% and value is €420k. Legal assignment has not progressed
> in 23 days."

Without Decision Context, that sentence is not possible. With it, the AI has both
the measurement and the baseline to reason about organizational performance.

Decision Context is also training data. Every Assignment with a known Outcome
becomes a data point that improves AI's ability to recommend the right participant
for the right responsibility.

---

## Assignment Lifecycle

An Assignment moves through a defined set of states. Every transition is a
historical event and a potential Signal.

```
proposed → accepted → active → waiting → blocked → completed
                                                 ↘ cancelled
```

### State definitions

| State | Meaning | Signal opportunity |
|---|---|---|
| `proposed` | Assignment created; Actor has not yet acknowledged | Unacknowledged assignments after N hours |
| `accepted` | Actor has confirmed the responsibility | Time from proposed to accepted |
| `active` | Actor is actively working | Baseline for stagnation detection |
| `waiting` | Waiting for input from another participant | Cross-team dependency signal |
| `blocked` | Waiting on something outside the system | External blocker signal |
| `completed` | Responsibility fulfilled | Cycle time, outcome quality |
| `cancelled` | Assignment withdrawn before completion | Cancellation patterns |

### The `waiting` vs `blocked` distinction

`waiting` = this Assignment depends on another Participant within Gunimi.
This is a cross-team dependency. The Signal Engine can identify it and surface it.

`blocked` = this Assignment depends on something outside Gunimi (a regulator,
a third party, an external system). The Signal Engine can track duration
and escalate if needed.

This distinction is critical because the organizational response is different:
- Waiting → resolve the internal dependency (talk to Legal)
- Blocked → escalate or find a workaround (external dependency)

---

## Temporal Model

Every Assignment exists in time. The temporal model captures this precisely.

```
created_at      when the Assignment record was created in Gunimi
active_from     when the responsibility became (or becomes) effective
active_until    when the responsibility ended (NULL = currently active)
closed_reason   why the Assignment closed
transferred_to  if ended by transfer, reference to the successor Assignment
```

**Why `active_from` and `active_until` instead of just `created_at`?**

A responsibility may be created in advance. A deal may be assigned to Legal starting
next Monday. `active_from` captures the business-effective date; `created_at`
captures the administrative record date. Both are true. Neither is redundant.

This is the foundation for future bi-temporal reasoning: what was true at a given
moment in time vs. what we recorded about it at a given moment in time.

---

## Immutability Principle

**Assignments are append-only historical records. Their state may evolve, but their
existence is permanent.**

An Assignment is never deleted. Ever.

It may be:
- `completed` — responsibility fulfilled
- `cancelled` — responsibility withdrawn
- `transferred` — responsibility passed to a successor Assignment

When an Assignment is transferred, the original Assignment closes with
`closed_reason = "transferred"` and `transferred_to = {new assignment id}`.
The new Assignment records its own Decision Context. The chain of responsibility
is fully traceable.

This principle flows from Domain Law IV: *Events are immutable.*

An Assignment is a record of a real commitment made by a real participant. That
commitment happened. Even if it was later cancelled, withdrawn, or superseded —
the fact that it was made is part of organizational history. Gunimi preserves that
history completely.

**What this means for AI:**

An AI system with full Assignment history can answer questions no other system
can. "How many times has this deal changed responsible team?" "Which types of deals
tend to have assignments transferred more than twice?" "Is this the first time Legal
has been assigned but then cancelled on this company's deals?"

---

## Signal Engine Integration

Every Assignment state transition is a potential Signal. The following are the
primary cross-team intelligence opportunities:

| Pattern | Signal type |
|---|---|
| Assignment in `proposed` for > 24 hours | Unacknowledged responsibility |
| Assignment in `waiting` for > N days | Cross-team dependency stall |
| Assignment in `blocked` for > N days | External blocker escalation |
| Multiple Assignments on same entity all in `waiting` | Coordination failure |
| Assignment transferred more than twice | Ownership clarity problem |
| Pattern: entity type X → Legal always waits > 14 days | Organizational bottleneck |
| `actor_type = team` with no `actor_type = person` after N days | Unowned team assignment |

These signals are not hardcoded rules. They are the natural output of a system
that understands responsibility as a first-class concept with full lifecycle
and history.

---

## Implications for the Existing Schema

The adoption of the Operational Responsibility Model has one clear consequence:
**`assigned_to` fields are deprecated across the entire schema.**

| Existing field | Migration path |
|---|---|
| `workspace_deals.assigned_to` | → Assignment where responsibility = `owner` |
| `workspace_tasks.assigned_to` | → Assignment where responsibility = `owner` or `executor` |
| `workspace_contacts.assigned_to` | → Assignment where responsibility = `owner` |

These migrations are not required for Open Alpha. The `assigned_to` fields will
continue to work through a compatibility layer. However:

1. No new `assigned_to` fields are introduced anywhere in the schema
2. No new features are built on top of the `assigned_to` pattern
3. The migration path is a pre-paying-customer requirement (see ADR-002 timing)

The word `assigned_to` does not appear in any new code.

---

## Teams and the Organizational Structure

`workspace_teams` is the first Actor type introduced under this model. A Team is
an organizational unit — a named group of people within a Workspace that can bear
collective responsibility for a piece of business reality.

### The Team Tree

Teams form a tree. Organizational semantics — Department, Division, Business Unit,
Region, Ward, Plant, Practice Area — are interpretations of that tree, not separate
architectural concepts.

This means:
- A Department IS a Team where `team_type = 'department'`
- A Division IS a Team where `team_type = 'division'`
- No additional tables are needed when organizational terminology changes

This allows Gunimi to serve organizations that structure themselves differently:

| Organization type | Tree structure |
|---|---|
| Enterprise (Alza) | Division → Department → Team |
| Hospital | Hospital → Clinic → Ward → Team |
| Manufacturing | Plant → Production Line → Shift → Team |
| Law firm | Practice Area → Team |
| Startup | Team (flat, no parent) |

All of these are the same data model. The `team_type` column carries meaning;
the `parent_team_id` column carries structure. The schema does not change when
organizational terminology changes.

**What is NOT implemented yet:**

`parent_team_id` is present in the schema from the start as an architectural
commitment. However:

1. **Visibility inheritance** — the rule "a Sales Director sees all Assignments
   under all Sales sub-teams" is a Permission Engine concern, not a Team concern.
   It is not implemented in this phase. Permission Engine has its own ADR.

2. **Hierarchy UI** — the initial UI renders Teams as a flat list. Parent/child
   relationships are stored but not yet visualized.

3. **Organizational semantics** — `team_type` values beyond `team` are reserved
   but not used in the first implementation.

These are explicit deferments, not oversights. The schema is ready. The product
surface will evolve.

### Three concerns that must not be mixed

| Concern | What it governs | Where it lives |
|---|---|---|
| Organization | Who exists and how they relate | Team tree (this ADR) |
| Permission | Who can see and do what | Permission Engine (future ADR) |
| Visibility | What the UI surfaces | Application layer |

Mixing these three into one model is a common architectural mistake. Gunimi keeps
them separate from the start.

### The schema

```
workspace_teams
  id              UUID PRIMARY KEY
  workspace_id    UUID NOT NULL
  parent_team_id  UUID REFERENCES workspace_teams(id)  -- nullable, tree structure
  team_type       TEXT NOT NULL DEFAULT 'team'
                  -- team | department | division | business_unit | region | ...
                  -- only 'team' is used in the initial implementation
  name            TEXT NOT NULL
  description     TEXT
  color           TEXT
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()

workspace_team_memberships
  id              UUID PRIMARY KEY
  team_id         UUID REFERENCES workspace_teams(id) NOT NULL
  actor_id        UUID NOT NULL   -- workspace_members.id (workspace_people.id post-migration)
  role            TEXT NOT NULL   -- lead | member
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
  left_at         TIMESTAMPTZ     -- NULL = currently active
```

Team membership roles:
- `lead` — accountable for team output; primary contact for cross-team coordination
- `member` — active participant in the team's work

Note: `viewer` is not a team role. Access to data is governed by the Permission
Engine. Team membership governs responsibility, not visibility.

The UI section for Team management is `/organization` — not Settings. Settings are
personal. An organization's structure is a first-class product surface.

---

## Consequences

**Positive:**
- Responsibility is fully traceable: who committed to what, when, why, and how it ended
- AI can reason about organizational patterns, not just individual entity status
- The model accommodates any future participant type (AI agents, external systems)
  without schema changes
- Cross-team dependencies become first-class signals, not invisible bottlenecks
- Full historical record: even if a team is dissolved, its Assignments remain

**Challenging:**
- More complex queries than `WHERE assigned_to = $user_id`
- Existing surfaces built on `assigned_to` require migration
- UI must communicate responsibility clearly — not just "assigned to", but "who is
  responsible for what"

**Not in scope for this ADR:**
- Permission Engine (governs visibility; separate concern from responsibility)
- Epistemic Relationships (governed by a future ADR)
- Full bi-temporal implementation (reserved for post-paying-customer sprint)
- Departments, Roles, Cost Centers, Locations (natural extensions of the
  Organization section; no architectural changes required to add them)

---

## The Architectural Compass

This ADR closes with the principle that guided every decision above:

> *Gunimi does not assign work to owners. Gunimi records responsibilities between
> participants. Ownership is an administrative concept. Responsibility is how
> organizations operate.*

If a future feature design requires an `owner_id` field or an `assigned_to`
column, that design should be re-evaluated against this principle before
implementation.

The measure of a good design in this domain is not "can we tell who owns this?" —
it is "can we tell who is responsible, for what, since when, and why?"

---

*Related: [DOMAIN_MODEL.md](../../foundation/DOMAIN_MODEL.md) — Relationship entity*
*Related: [DOMAIN_LAWS.md](../../foundation/DOMAIN_LAWS.md) — Law III (Relationship), Law IV (Immutability)*
*Related: [ADR-002](ADR-002-people-model.md) — workspace_people as Identity Layer*
*Related: [ADR-003](ADR-003-relationship-entity.md) — Relationship as First-Class Entity*
*Related: [ADR-004](ADR-004-knowledge-layers.md) — Knowledge Layers (History → Memory → Wisdom)*
*Related: [SIGNAL_ENGINE_BLUEPRINT.md](../../blueprints/SIGNAL_ENGINE_BLUEPRINT.md) — Signal generation*
*Related: [BUSINESS_MEMORY_BLUEPRINT.md](../../blueprints/BUSINESS_MEMORY_BLUEPRINT.md) — Memory provenance*
