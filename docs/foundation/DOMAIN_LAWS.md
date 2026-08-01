# Gunimi Domain Laws

Version: 1.0
Status: Constitutional — these laws are inviolable
Established: July 2026

---

## Purpose

Domain Laws are not guidelines. They are not best practices. They are not defaults
that a clever engineer can override given sufficient justification.

They are laws.

When a proposed solution violates a Domain Law, the discussion does not end in a
compromise. The solution is redesigned.

If a Domain Law turns out to be wrong — which is possible, because all models are
incomplete — it is amended through a deliberate process with full awareness of the
consequences. Not quietly bypassed.

These laws exist because Gunimi models business reality, and reality has rules that
do not bend to implementation convenience.

---

## The Laws

### Law I — Business Reality Is Never Duplicated

One person. One company. One deal. One record.

No matter how many integrations exist, how many views are created, or how many
representations serve different consumers — the underlying entity is singular.

Duplication of business reality is the primary source of data integrity failure.
Two records for Jan Novak means that every action taken against one record is
invisible to the other. Memory diverges. Signals contradict. History fragments.

**Consequence of violation:** Duplicate records must be merged, not archived. The
merge must preserve the complete history of both records. Information may never
be discarded in a merge operation.

**Exception:** None. There are no circumstances under which duplicating a business
entity is architecturally acceptable.

---

### Law II — Every Memory Has Provenance

No piece of Memory may exist in Gunimi without a traceable source in History.

Memory is interpretation. Interpretation requires something to interpret. A Memory
that cannot be traced to one or more Events is not Memory — it is AI invention.
Gunimi never stores AI invention as knowledge.

Provenance is what separates a trustworthy system from a hallucinating one. Users
must be able to ask *why* Gunimi believes something, and the system must be able
to answer with evidence.

**Consequence of violation:** A Memory without provenance must be immediately
invalidated and flagged for review. It may not be used to generate Signals, inform
AI responses, or appear in any user-facing surface.

---

### Law III — Every Relationship Has at Least Two Participants

A Relationship that connects only one entity is not a Relationship. It is a property.

This law prevents the misuse of Relationship as a label or category system. A
relationship expresses a connection between distinct entities. Without a second
participant, there is nothing to connect.

**Consequence of violation:** The construct should be redesigned as a property,
classification, or attribute of the single entity involved.

---

### Law IV — Events Are Immutable

What happened cannot be changed.

An Event is a record of business reality at a specific point in time. Editing it
is editing the past. Gunimi does not edit the past.

If an Event was recorded incorrectly, the correction is made by creating a
compensating Event — one that records the correction as a new fact in time. The
original Event stands as evidence of what was believed at the time of recording.

**Consequence of violation:** Any system pathway that allows an Event to be
modified (not corrected with a compensating event) introduces historical corruption.
This is a critical architectural failure.

**On soft deletes:** Events may be marked as erroneous or superseded. They may not
be deleted. A deleted Event is a gap in History. Gaps in History are gaps in trust.

---

### Law V — Roles Change Perspective, Never Reality

The same Event, seen by a Sales Director and a CFO, is the same Event. The same
Person, viewed by a recruiter and a sales executive, is the same Person.

Role determines what is visible, what is emphasized, and what actions are available.
Role never determines what is true.

This law protects Gunimi from the common failure mode of building different data
models for different roles, leading to systems where different users genuinely see
different "truths" — not just different views, but different facts.

**Consequence of violation:** If Role is being used to determine what data is
stored rather than what data is shown, the design must be corrected. Data storage
is role-agnostic. Data presentation is role-aware.

---

### Law VI — Identity Exists Independently of Authentication

A Person exists in business reality whether or not they have a Gunimi login.

A candidate who has never logged in. A board member who receives no system notifications.
A supplier contact who is managed by an account manager on their behalf. All of these
people exist. Their relationships, history, and memory must be captured and maintained
regardless of their authentication status.

**Consequence of violation:** Designing any business entity to require authentication
as a precondition for existence creates a system that models software users, not
business reality. Any entity that cannot exist without a login is an incomplete
domain model.

---

### Law VII — Business Entity and Organization Are Never the Same Record

An Organization is the inside. A Business Entity is the outside.

The same legal company — for example, a large retailer — may appear as a Business
Entity in the Workspace of one of its suppliers (they sell to this retailer), and
as an Organization in its own Workspace (the retailer itself uses Gunimi internally).

These are two different records, connected by a Relationship when both representations
exist in the same platform. They are never merged into one record because the relational
perspective (inside vs. outside) is a fundamental part of their meaning.

**Consequence of violation:** Merging inside and outside perspectives into a single
record destroys the relational context that makes the distinction meaningful.

---

### Law VIII — AI Never Creates Reality

AI observes reality. AI interprets reality. AI learns from reality.

AI does not create reality.

A relationship that AI infers must be presented as a hypothesis, with confidence
rating and evidence, pending human confirmation. Once a human confirms it, it
becomes part of the historical record — as a human-confirmed relationship, not as
an AI-invented one.

The provenance of every piece of knowledge in Gunimi must show whether it originated
from human input or AI inference. These are not equivalent.

**Consequence of violation:** AI-invented facts stored as confirmed reality contaminate
the Memory layer. This is the most dangerous failure mode in an AI-augmented system —
the platform becomes unreliable at the most fundamental level.

---

### Law IX — Memory Decays Without Reinforcement

A piece of Memory that is never revisited, acted upon, or confirmed loses confidence
over time.

Stale Memory is worse than no Memory. No Memory is ignorance. Stale Memory is
false confidence. A system that presents three-year-old relationship context as
current business intelligence is misleading, not helpful.

Memory must carry a confidence rating that degrades on a time curve appropriate
to its type. Relationship-context Memory decays more slowly than tactical-action
Memory. AI is responsible for flagging Memory that has fallen below useful confidence
thresholds.

**Consequence of violation:** A Memory system without decay becomes a museum, not
an intelligence layer. It accumulates artifacts rather than maintaining a living
picture of business reality.

---

### Law X — Wisdom Is Never Hardcoded

Patterns must be learned from real business history within a real Workspace.

Rules authored by engineers and presented as Wisdom are assumptions, not knowledge.
They may be useful as initial defaults — if clearly labeled as such — but they are
never Wisdom in the domain sense. Wisdom is earned through observed evidence.

**Consequence of violation:** Hardcoded "wisdom" that is presented as learned
intelligence erodes user trust the moment it fails to apply to a real situation.
Worse, it is invisible — users cannot see that it is a rule, not a pattern.

---

### Law XI — A Person Exists Only Once Within a Workspace

One human being. One record. Always.

This is a specific application of Law I, called out separately because it is the
most frequently violated in practice. CRM tools create duplicate contacts constantly.
Gunimi must not.

**Consequence of violation:** See Law I. Additionally, duplicate Person records create
fragmented Relationship graphs, contradictory Memory, and AI reasoning failures. This
is a data integrity crisis that becomes increasingly expensive to resolve over time.

---

### Law XII — Signals Have Lifecycle

A Signal that exists forever is a failed Signal.

Every Signal must be tracked through its complete lifecycle: emerging, active,
resolved, dismissed, or expired. A Signal without lifecycle tracking becomes noise.
A system full of unresolved Signals is a system no one trusts.

**Consequence of violation:** Unlifecycled Signals accumulate. Users stop engaging
with them. The Signal layer becomes invisible background noise rather than actionable
intelligence.

---

## Amending a Domain Law

Domain Laws may be amended under the following conditions:

1. The Law is demonstrably wrong — not merely inconvenient
2. The amendment is proposed explicitly, with full description of the change and
   its consequences
3. The consequences for existing data, AI behavior, and platform promises are
   fully articulated before the amendment is applied
4. A new version of this document is created with the change recorded and dated

A Domain Law is never quietly bypassed. Bypassing a law without amending it
produces the worst outcome: a system where the documented laws no longer reflect
how the system actually behaves.

---

*These laws define the shape of business reality as Gunimi understands it.
They exist to protect the platform from short-term implementation pressure
at the cost of long-term coherence.*
