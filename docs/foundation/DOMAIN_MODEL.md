# Gunimi Domain Model

Version: 1.0
Status: Constitutional — supersedes all database schemas, API designs, and UI decisions
Established: July 2026

---

## Purpose

This document defines what exists in business reality.

Not what tables exist in the database.
Not what endpoints exist in the API.
Not what pages exist in the UI.

What exists in the world that Gunimi is responsible for understanding.

Every entity defined here is derived from observing how businesses actually operate.
If a concept is not in this document, it does not receive first-class treatment in
the platform.

---

## The Reality Principle

> Gunimi does not model software. Gunimi models business reality.
> Software exists only to help people perceive and improve that reality.

This principle is the root from which all design decisions grow. When something cannot
be justified against the Reality Principle, it is a software convenience, not a
domain entity.

---

## What Makes Something an Entity

An entity must satisfy all three conditions:

1. **Own identity** — it exists independently, can be referred to, tracked, and uniquely identified
2. **Own lifecycle** — it can be created, evolve, and end independently of other entities
3. **Own history** — events happen *to* it; its state changes meaningfully over time

Entities that fail this test are not entities. They are properties, states, classifications,
or derived artifacts.

**Examples of things that are NOT entities:**
- `Notification` — an event, not a thing
- `Pipeline Stage` — a state classification, not an independent entity
- `Tag` / `Label` — a classification applied to entities, not an entity itself
- `AI Summary` — a derived artifact, not primary reality
- `Reminder` — a time event, not an independent entity with its own lifecycle

---

## The Entities

### Person

> A human being who exists in the context of business reality.

A Person is not a user account. A Person is not a contact record. A Person is a human
being — with a name, a professional identity, relationships, a history, and a role in
business life that exists entirely independently of any software system.

A Person may be a colleague, a client, a prospect, a supplier representative, a board
member, an advisor, or a candidate. Role is not part of identity — it is a perspective
applied to identity.

**What a Person IS:**
- A human being with persistent, independent identity
- A participant in business relationships over time
- The subject of events, memory, and signals
- Capable of holding many roles simultaneously or sequentially

**What a Person IS NOT:**
- A login or user account (authentication is access management, not identity)
- A contact in a contact list (that is a role, not the person)
- Defined by their current employer or title (which change)
- Duplicatable within a Workspace

**Core attributes of identity (never change):**
- Name as the person knows themselves
- Unique presence within a Workspace (one record, always)

**Temporal attributes (change, but history is preserved):**
- Role within a given Organization or context
- Contact information
- Associated Business Entities

**Connects to:** Identity, Organization (via Relationship), Business Entity (via Relationship),
Event, Memory, Signal

---

### Identity

> The persistent, singular anchor that makes a Person the same person across
> all contexts, roles, and time.

Identity is the answer to: *who is this, regardless of what they do?*

A Person named Jan Novak may work at three companies over ten years, hold four
different roles, and use five different email addresses. Identity is what connects
all of those states into one continuous human being.

**What Identity IS:**
- A persistent, non-duplicatable anchor within a Workspace
- Independent of authentication (a person exists even without a Gunimi login)
- The root from which all role-based representations derive

**What Identity IS NOT:**
- An email address (email changes)
- A login credential (access changes)
- A job title (roles change)

**Relationship to authentication:** When a Person also has access to Gunimi as a
team member, their Identity is linked to an authentication record. But authentication
is a property of access, not of existence. Identity comes first.

---

### Organization

> A structured group of people working toward a shared purpose — the internal
> context from which a Workspace views its business reality.

An Organization is the inside. It represents who uses Gunimi: the team, the company,
the firm that has created a Workspace to manage its business reality.

**What an Organization IS:**
- The internal team or company operating within a Workspace
- Defined by shared purpose, membership, and decision-making structure
- The entity that grants access, defines roles, and owns the Workspace

**What an Organization IS NOT:**
- A Business Entity (an Organization is the inside; a Business Entity is the outside)
- Identical to the company as it appears to its own customers

**Critical distinction:** The same legal company — say, Alza — may be an Organization
within its own Gunimi Workspace, while simultaneously appearing as a Business Entity
in the Workspace of a supplier who sells to Alza. These are never the same record.
They represent the same legal entity viewed from different relational positions.

---

### Business Entity

> An external company, institution, or structured group that participates in
> business reality as a counterpart — a customer, supplier, partner, or investor.

A Business Entity is the outside. It represents the companies and institutions with
which an Organization conducts business.

**What a Business Entity IS:**
- Any external company or institution in a business relationship
- A participant in deals, contracts, and ongoing commercial relationships
- A subject of business memory, signals, and relationship intelligence

**What a Business Entity IS NOT:**
- An Organization (it operates outside the Workspace, not within it)
- Identical to the Organization of the same legal name
- Defined only by its current relationship status

**On the inside/outside distinction:** Organization and Business Entity are two different
perspectives on the same type of thing: a structured group of people. The perspective
is determined by the relational position — whether the entity is *us* or *them* from
the Workspace's point of view.

---

### Workspace

> The operational context within which a business perceives, stores, and evolves
> its understanding of reality.

A Workspace is not a company. It is not a product instance. It is not a user account.
A Workspace is the frame through which one Organization views and manages its
business reality.

Everything in Gunimi — every Person, Relationship, Event, Memory, and Signal — belongs
to a Workspace. Nothing meaningful exists outside one.

**What a Workspace IS:**
- The complete operational context of one Organization's business reality
- The boundary of data, intelligence, permissions, and memory
- A living entity that matures through defined lifecycle states

**What a Workspace IS NOT:**
- A company (a company can have multiple Workspaces; one Workspace can serve multiple departments)
- Equivalent to a user account or subscription
- Static — a Workspace evolves as the business it models evolves

**Lifecycle:** Awakening → Active → Learning → Autonomous

---

### Relationship

> A first-class entity representing a meaningful, temporal connection between
> two or more Entities.

Relationship is perhaps the most important entity in Gunimi's domain model, and the
one most commonly misrepresented as a database join.

A Relationship is not a foreign key. It is not a junction table. It is not a tag.
A Relationship is a business fact that stands on its own — with its own type, status,
history, and temporal validity.

*"Jan Novak worked for Alza from January 2019 to August 2023, in a senior
commercial role, introduced through a partner referral."*

This cannot be modeled as a foreign key. It requires an entity.

**What a Relationship IS:**
- A first-class entity with its own identity and lifecycle
- A temporally valid connection (with `valid_from` and `valid_to`)
- Typed (employment, partnership, ownership, advisory, client, supplier...)
- Directional or bidirectional, depending on type
- Confidence-weighted (how certain Gunimi is this relationship exists)
- Sourced (where the evidence for this relationship comes from)

**What a Relationship IS NOT:**
- A database foreign key
- A permanent fact (relationships begin and end; status must be maintained)
- Limited to two participants (some relationships involve groups)

**Core attributes:**
- `type` — what kind of connection this is
- `status` — active, past, pending, uncertain
- `valid_from` / `valid_to` — when this connection held in reality
- `confidence` — how certain Gunimi is this relationship exists
- `source` — what evidence supports this relationship
- `context` — the broader frame (a specific deal, project, organization)

---

### Event

> An objective, immutable record of something that happened in business reality.

An Event is the raw material of History. It is what was observed and recorded.
Events do not change. Events do not disappear. Events accumulate, and together
they constitute the History of any entity.

**What an Event IS:**
- An immutable record of something that happened
- Timestamped with when it occurred in reality
- Linked to the entities it involved
- The atomic unit of History

**What an Event IS NOT:**
- A task or action item (those are intentions, not records)
- A notification (that is a signal, not a historical fact)
- A reminder (that is a future-oriented time event, not a record of reality)
- Modifiable — events are never edited, only superseded by compensating events

**Why immutability matters:** Reality happened. The meeting occurred. The email was sent.
The contract was signed. These facts do not change. If a recording error is discovered,
a compensating Event is created that corrects the record. The original Event stands.

---

### Memory

> An AI-interpreted distillation of what matters, derived from History.

Memory is not History. Memory is the interpretation of History — what Gunimi's AI
has determined to be significant, contextually relevant, and worth preserving as
actionable business knowledge.

Not every Event becomes Memory. Volume does not equal importance. One brief conversation
with the right context can generate more Memory than one hundred routine status updates.

**What Memory IS:**
- A selective, AI-interpreted summary of meaningful patterns in History
- Confidence-weighted (how certain the AI is this matters)
- Decaying (Memory that is never reinforced or revisited loses confidence over time)
- Traceable — every Memory has provenance: which Events and History produced it
- Workspace-scoped

**What Memory IS NOT:**
- A copy of History (Memory selects and interprets; it does not duplicate)
- Objective truth (Memory is interpretation; its confidence rating reflects this)
- Permanent without reinforcement (stale Memory is actively harmful — it misleads)
- AI invention (Memory must be traceable to real Events)

**Provenance requirement:** A piece of Memory without a traceable source in History
is not Memory. It is hallucination. Gunimi never stores AI invention as Memory.

---

### Signal

> A detected pattern or condition in business reality that may require attention.

A Signal is Gunimi's way of surfacing what matters from the complexity of business
reality. It is not a notification. It is not an alert. It is a detected pattern with
context, confidence, and a recommended response.

**What a Signal IS:**
- A pattern detected across Events, Memory, Relationships, or Business Entities
- Temporary — Signals have lifecycle (emerging → active → resolved / expired)
- Actionable — every Signal connects to a recommended response
- Explainable — every Signal must be traceable to its evidence

**What a Signal IS NOT:**
- A notification (a notification is a UI delivery mechanism; a Signal is a detected pattern)
- A permanent fact (Signals resolve, expire, or are dismissed)
- Invented by AI without evidence (a Signal requires traceable evidence)

**Lifecycle:** A Signal that resolves through human action becomes an Event.
A Signal that is dismissed is recorded as dismissed (this is itself an Event).
A Signal that expires without action is recorded as expired.

---

### Wisdom

> Generalized patterns learned from multiple instances of History and Memory,
> applicable across entities and time periods.

Wisdom is the highest layer of intelligence in Gunimi. It is not about one person
or one company — it is about how this type of business situation tends to unfold.

Wisdom is never hardcoded. It is never authored by engineers. It is derived from
the accumulated weight of real business history within a Workspace.

**What Wisdom IS:**
- A generalized pattern derived from many similar instances in History and Memory
- Applicable across entities (not about one person or company, but about a type of situation)
- Earned — Wisdom requires enough evidence to generalize responsibly
- Updatable — new evidence refines or invalidates prior Wisdom

**What Wisdom IS NOT:**
- A rule written by a product manager
- A single event or memory pattern (one case does not constitute a generalization)
- A permanent truth (business contexts change; Wisdom must evolve)

**Example:**
- Event: 47 customers reduced their plan after onboarding call lasted less than 20 minutes
- Memory: Short onboarding correlates with early churn in the SMB segment
- Wisdom: SMB customers require at least 30 minutes of structured onboarding to form
  a durable commitment — accelerate at the cost of retention

---

### Context

> The operational frame within which a piece of knowledge, signal, or memory
> has coherent meaning.

Context is what makes isolated facts intelligible. A meeting note means little
without knowing which deal it relates to. A signal about a contact's activity means
little without knowing their role in an active opportunity.

Context is not a tag. It is not a category. It is the relational frame that connects
disparate pieces of knowledge into a coherent picture.

**What Context IS:**
- A frame of reference that links Events, Memory, and Signals into coherent meaning
- Multi-level (a deal exists within a relationship, which exists within a business entity)
- The foundation of AI reasoning — without context, AI cannot make useful connections

**What Context IS NOT:**
- A classification or category (those are labels)
- A folder or organizational structure
- Permanent — context shifts as business situations evolve

---

## The Entity Map

```
Identity
  └─ Person (has one Identity within a Workspace)
       ├─ Relationship → Organization (employee, advisor, director...)
       ├─ Relationship → Business Entity (contact, champion, decision-maker...)
       └─ Relationship → Person (colleague, mentor, referral...)

Organization
  └─ Workspace (one org can have one or more Workspaces)
       ├─ Signal (detected patterns within this Workspace)
       ├─ Memory (interpreted knowledge within this Workspace)
       └─ Event (recorded facts within this Workspace)

Business Entity
  ├─ Relationship → Person (contacts, champions, stakeholders)
  ├─ Relationship → Business Entity (subsidiaries, partners, competitors)
  ├─ Event (meetings, communications, milestones)
  ├─ Memory (accumulated business knowledge)
  └─ Signal (detected patterns)

Relationship (first-class entity)
  ├─ type, status, valid_from, valid_to
  ├─ confidence, source, context
  └─ Event history (how this relationship evolved)

Event → Memory → Wisdom (the Knowledge Stack, see KNOWLEDGE_LAYERS.md)
```

---

## What This Model Is NOT

This document is not a database schema. Tables, columns, indexes, and foreign keys
are implementation decisions derived from this model. If an implementation decision
contradicts this model, the implementation is wrong.

This document is not an API contract. Endpoints are representations of this model
for specific consumers. A representation may simplify, aggregate, or project the model
for a given use case. It may never contradict it.

This document is not a UI specification. Screens are role-aware perspectives on this
model. They surface what is relevant to who is looking, when. They never define reality.

---

*This document must be reviewed and confirmed before any new entity is added to
the platform. An entity that is not in this document does not belong at the root of
the domain model.*
