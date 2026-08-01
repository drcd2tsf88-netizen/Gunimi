# Gunimi Platform Principles

Version: 1.0
Status: Constitutional
Established: July 2026

---

## Purpose

These principles govern how every decision at the platform level is made and evaluated.

They are not design guidelines. They are not product values. They are the decision
framework that sits above every roadmap, every feature, every architectural choice.

When two options are debated and both seem reasonable, these principles resolve
the debate. When a shortcut is tempting, these principles name what is being
sacrificed. When a new capability is proposed, these principles determine whether
it belongs.

This document is a companion to the [Domain Laws](DOMAIN_LAWS.md) — laws govern
what the platform must never do; principles govern how the platform makes choices.

---

## The Foundational Principle

### Reality Principle

> Gunimi does not model software. Gunimi models business reality.
> Everything else — AI, workflows, interfaces, and automation —
> is simply a way of helping people understand and improve that reality.

This is the root from which all other principles grow. Every other principle is
a consequence or elaboration of this one.

When this principle is lived genuinely, every design decision has a clear test:

- Does this reflect how business reality actually works?
- Or does this reflect how the software was convenient to build?

If the answer is the latter, the decision must be revisited.

---

## Structural Principles

### Principle 1 — One Business Reality

Business reality is singular. It is captured once, stored once, and presented
through multiple perspectives — never duplicated, never fragmented.

One company. One person. One deal. One history. Many views.

The moment the platform begins duplicating reality — different records for different
roles, different data models for different modules, different sources of truth for
different integrations — it stops being a platform and becomes a collection of
disconnected tools.

**Applied:** Every integration, import, and sync must resolve to the canonical
record, not create new ones. Duplication is always a bug, not a feature.

---

### Principle 2 — Role-Aware Perspective

Role changes what is visible and what is emphasized. Role never changes what is true.

A CEO and a Sales Manager looking at the same deal see different aspects of the
same reality. Their perspectives are shaped by their role, their permissions, and
their context. The underlying reality is identical.

This principle prevents the common failure of building multiple data models for
multiple roles — a design that leads inevitably to inconsistent "truths" across
the platform.

**Applied:** Data is stored in one canonical model. Role-aware presentation layers
surface what is relevant to who is looking, when. The storage layer is role-agnostic.
The presentation layer is role-intelligent.

---

### Principle 3 — Identity Before Authentication

Existence comes before access.

A person exists in business reality — with relationships, history, and meaning —
before they ever log in to Gunimi. Authentication grants access to the system.
It does not grant existence within it.

This principle ensures that Gunimi's model of business reality is never limited
to people who have Gunimi accounts. A candidate, a board member, an investor, a
supplier contact — all of these people exist. Their identity is captured. Their
relationships are modeled. Their history accumulates.

**Applied:** The People Model separates identity from authentication at the schema
level. `workspace_people` represents existence. Authentication records represent
access. The connection between the two is optional from the identity layer's
perspective.

---

### Principle 4 — Platform Before Features

Every feature must fit the platform model.

A feature that requires a database shortcut, a hardcoded assumption, or a violation
of Domain Laws is not a feature. It is technical debt with a user interface.

This principle is harder than it sounds. It means that some features that would
be quick to build in a naive model require significant platform investment to build
correctly. The platform investment always wins.

The cost of a wrong platform decision compounds. The cost of a feature that waits
for the right platform moment does not.

**Applied:** Before building any feature, verify that the domain model supports it
cleanly. If it does not, the domain model must be extended through a deliberate,
principled process — not worked around.

---

## Intelligence Principles

### Principle 5 — AI Trust Boundary

AI may observe, suggest, and analyze. AI may never decide, delete, or act on
behalf of a user without explicit human confirmation for high-impact actions.

Trust is the scarcest resource in an AI platform. It is easy to lose and very
slow to rebuild. Every time AI acts in a way that surprises or harms a user,
trust is damaged — not for that action alone, but for AI in general within the
platform.

The Trust Boundary defines where AI operates independently versus where human
confirmation is required. This boundary must be explicit, visible, and consistent.

**High-impact actions requiring human confirmation:**
- Sending any external communication on a user's behalf
- Deleting or archiving a business entity
- Closing or losing a deal
- Sharing information outside the Workspace
- Modifying historical records

**Applied:** Every AI capability must be classified against the Trust Boundary
before implementation. Capabilities that cross the boundary without confirmation
are a product defect, not a feature.

---

### Principle 6 — Explainability First

Every AI output must be traceable to its source.

A suggestion without an explanation is a guess. A signal without provenance is
noise. A memory without a source is an invented fact.

Explainability is not a nice-to-have transparency feature. It is the mechanism
by which users can trust AI output — because they can verify it. A platform
where AI produces unexplainable outputs trains users to distrust all AI outputs,
even correct ones.

**Applied:** Every AI surface must answer: "Why does Gunimi believe this?" The
answer must be in terms of real events, real history, real relationships. Never
"the AI thinks so."

---

### Principle 7 — Progressive Intelligence

Gunimi becomes smarter as it is used.

Day 1 is useful. Day 365 is transformative. The platform does not ship intelligence
as a static feature — intelligence grows from the business reality it accumulates.

This principle has two consequences. First, the platform must function with minimal
data — it must be useful even when new. Second, it must be designed to become
increasingly powerful as History accumulates, Memory deepens, and Wisdom emerges.

A platform that is the same on day 365 as day 1 has failed at progressive intelligence.

**Applied:** Every feature should consider its day-1 experience (limited data) and
its long-term experience (rich data) explicitly. Features that only work well with
rich data must degrade gracefully to a useful state with minimal data.

---

### Principle 8 — Intelligence Before Automation

Gunimi first makes users intelligent. Then it automates.

Intelligence without automation is a dashboard. Automation without intelligence
is a dangerous black box. The sequence matters.

A user who understands their business situation — who sees the signals, understands
the relationships, knows what is happening — is equipped to authorize automation.
A user who is simply asked to approve automated actions they don't understand is
not being helped. They are being burdened with responsibility for something they
cannot evaluate.

**Applied:** Before any automated action is introduced, the intelligence layer that
makes that action understandable must exist first. Users must be able to see why
an automation would act before it acts automatically.

---

### Principle 9 — Trust Before Automation

Optimize for trust before convenience.

When a choice exists between an approach that maximizes automation convenience
and one that maximizes user trust, trust wins.

This is not an argument against automation. Automation that users trust is
more powerful than automation they don't. The goal is not to avoid automation
— it is to build automation on a foundation of demonstrated trustworthiness.

**Applied:** Features that sacrifice trust for convenience are always reconsidered.
The question is never "how do we automate this?" but "how do we earn the right
to automate this?"

---

## Design Principles

### Principle 10 — Temporal Awareness

Business reality exists in time. Gunimi must model it that way.

A relationship is not static. It has a beginning, an evolution, and often an end.
A contact's role changes. A company's relationship with its customer changes.
A deal's probability changes. Gunimi must model these changes as the natural
lifecycle they are, not as overwritten states.

**Applied:** Where a business concept has temporal validity — especially Relationships
— `valid_from` and `valid_to` are first-class attributes, not audit fields. The
question "what was the state of this relationship in Q1 2024?" must have an answer.

*Note on bi-temporal persistence:* Full bi-temporal modeling (transaction time vs.
valid time) is an enterprise-tier capability. The initial implementation captures
valid time on Relationships. Transaction-time bi-temporality is a future milestone,
not an Open Alpha requirement. The architecture must not preclude it.

---

### Principle 11 — Silence Is Intelligence

Gunimi does not surface what requires no attention.

An empty dashboard is not a failure. It is the platform saying: *"Everything is
under control. No action needed today."* That is a valuable communication.

A platform that generates noise to appear active trains users to ignore it. A
platform that is silent when nothing is needed trains users to pay attention when
it speaks.

**Applied:** Every notification, signal, and surface must pass the question: "If
I don't surface this, does anything bad happen?" If the answer is no, it should
not be surfaced.

---

### Principle 12 — Workspace as Boundary

Everything meaningful in Gunimi belongs to a Workspace.

Permissions, history, memory, AI context, signals, notifications — all of these
are Workspace-scoped. Nothing meaningful crosses Workspace boundaries without
explicit, deliberate design.

This principle protects Workspace isolation — ensuring that the business reality
of one Organization is never visible to, or influenced by, another.

**Applied:** Every new entity, feature, and AI capability must be designed against
the Workspace boundary. Cross-Workspace data flows must be exceptional, deliberate,
and explicitly permissioned.

---

## Decision Framework

When a decision is genuinely difficult, apply these questions in order:

1. **Reality test:** Does this reflect how business reality works, or how
   the software is convenient to build?

2. **Law check:** Does this violate any Domain Law? If yes, redesign the solution.

3. **Principle alignment:** Which Platform Principles are most relevant? Does
   this decision honor them?

4. **Long-term test:** Will this decision still seem correct in five years?
   Would we be comfortable explaining it to a team of 50 engineers?

5. **Trust test:** Does this increase or decrease the likelihood that users
   trust Gunimi with more of their business reality over time?

If all five questions are answered satisfactorily, the decision is sound.

---

*These principles are permanent in intent and flexible in application. The
world changes, business changes, technology changes. The principles survive by
remaining relevant to those changes — not by being so rigid that they cannot
accommodate them. When a principle seems to conflict with reality, the first
question is always: are we applying it correctly?*
