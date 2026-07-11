# Gunimi Blueprint — Company Workspace v1.0

**Version:** 1.0
**Status:** Foundational — permanent
**Authority:** Gunimi Product Bible · Workspace Principles · Workspace Contract v1.0 · Workspace Grammar v1.0
**Reference Workspace:** Deal Workspace v1.0 · Contact Workspace v1.0

> *"A company is not a record. A company is a living commercial relationship. The Company Workspace exists to make every decision about that relationship smarter, faster, and more intentional."*

---

## Mission

The Company Workspace is the operational environment for one business organization in your commercial universe.

It is not a CRM account record.

It is not a list of contacts and deals.

It is not a company database entry.

It is the place where you understand the relationship with a specific organization — and where that relationship moves forward.

When a user opens the Company Workspace, the system has already assessed the relationship. The health of the commercial engagement has been determined. The most valuable next action has been identified. The context for the next interaction has been assembled.

The user arrives ready to act — not ready to read.

---

## The Core Question

Every time a user opens the Company Workspace, the product must immediately answer:

> **What does this company relationship need from me today?**

Not: "What data exists about this company?"
Not: "What is this company's status?"
Not: "Show me all activities related to this company."

The question is always forward-looking. What does the relationship need? What should happen next? What am I walking into?

---

## Purpose

### Why does the Company Workspace exist?

B2B business is conducted through organizations. Every deal belongs to a company. Every commercial relationship involves an organization with multiple stakeholders, multiple opportunities, and a relationship history that spans time.

Most business software treats a company as a folder — a way to group contacts, deals, and notes that share the same name. The company page is a list of records. The user must read every item and synthesize the situation themselves.

The Company Workspace exists because commercial relationships deserve an operational environment. It exists so that a business owner or sales professional can open any company and instantly understand where the relationship stands — without reading, without searching, without synthesizing.

### What the user must know within five seconds

1. **Who this company is** — name, industry, relationship health
2. **The current state of the commercial relationship** — active, developing, stale, at risk
3. **The single most valuable next action** — specific, actionable, grounded in evidence

If the user must scroll, click, or think to find any of these answers, the Workspace has failed.

---

## Workspace Sections

The Company Workspace implements the same five-section architecture as the Deal Workspace and Contact Workspace.

**The structure is non-negotiable.** The Company Workspace adapts the content to organizational relationships. It does not invent a different structure.

---

### Section 1 — Situation

**Purpose:**

The Situation answers: "What is the current state of this company relationship?"

It is the relationship health layer. It surfaces observable signals about this organization — without asking the user to derive these signals themselves.

**Business value:**

A business professional managing multiple company relationships cannot hold the status of each in their head. The Situation layer answers: "Before I do anything, what is actually happening with this company right now?"

**Signals surfaced (in priority order):**

1. Contact count — how many active contacts are in this organization
2. Active deal count — how many commercial opportunities are open
3. Last activity — how recently there has been meaningful engagement

**Suppression rules:**

- If Decision has claimed "stale relationship" as its basis, Situation does not repeat the activity signal.
- If Decision has claimed "no contacts" as its basis, Situation does not repeat the contact signal.
- If Decision has claimed "no active deals" as its basis, Situation does not repeat the deal signal.
- If Decision has claimed "closing deal" as its basis, Situation does not repeat the deal signal.

**What it must never do:**

- Show raw database status fields as the relationship health
- Manufacture urgency when there is none
- Duplicate the primary signal claimed by Decision
- Show technical data types or timestamps

---

### Section 2 — Decision

**Purpose:**

The Decision answers: "What is the single most valuable next action for this company relationship?"

One recommendation. One explanation. Grounded in real observable evidence.

**Business value:**

One clear action is more valuable than ten suggestions. When nothing actionable exists — when the commercial relationship is healthy, contacts are engaged, deals are progressing — the Decision shows a calm, honest healthy state.

**Decision priority order:**

The Decision resolver evaluates the company relationship in this priority sequence. The first matching condition becomes the recommendation:

1. **Closing deal** — an active deal closes within 7 days → ensure everything is in place
2. **Stale relationship** — no activity in more than 21 days → re-engage
3. **No contacts** — company has no contacts on record → add a key contact
4. **No active deals** — contacts exist but no open opportunities → explore new commercial potential
5. **Incomplete profile** — missing industry information → complete the profile
6. **Healthy state** — no action required → relationship is on track

Each condition maps to a typed `CompanyActionType`. The action type drives the Preparation layer's assembly.

**What it must never do:**

- Show more than one recommendation
- Redescribe what the Situation already surfaced
- Use AI labels or claim the recommendation is AI-generated
- Disappear when the relationship is healthy

**Healthy state:**

When no action is required, the Decision shows: "This company relationship is on track. No immediate action required."

---

### Section 3 — Preparation

**Purpose:**

The Preparation surfaces the context the user needs before acting on the Decision recommendation. It assembles. It does not analyze or introduce new recommendations.

**Assembly rules by Decision action:**

| Decision | Preparation Items |
|----------|------------------|
| `closing_deal` | Closing deal name + link + value; primary contact + link |
| `stale_relationship` | Primary contact + link; last activity summary |
| `no_contacts` | Nothing to prepare — the action itself is to add |
| `no_active_deals` | Primary contact + link |
| `incomplete_profile` | Nothing — the action itself is to edit |
| healthy state | Not rendered (Preparation is absent when Decision is healthy) |

**Conditionality:**

Preparation renders only when `preparationItems.length > 0`. When the Decision is healthy, Preparation is absent. When the action requires no preparation material (e.g., "add a contact"), Preparation is absent.

---

### Section 4 — Story

**Purpose:**

The Story answers: "How did this relationship develop?"

It narrates the chronological history of the commercial relationship — from when the company was first added to the workspace, through meetings, calls, emails, and milestones, to the most recent interaction.

**Story rules:**

1. **Always begins with the origin** — the synthetic event for when the company was added to the workspace.
2. **Oldest first** — the origin is first; the most recent interaction is last.
3. **Primary milestones individually** — meetings, calls, emails, stage changes each get their own entry.
4. **Secondary events grouped** — administrative activities, minor updates, system events are collapsed into a single "N additional activities" milestone.
5. **Human language throughout** — no system event names, no field names, no technical identifiers.
6. **Explains path. Never evaluates present.** — Story recounts what happened. It does not assess whether the current state is good or bad.

**What it must never do:**

- Be reverse-chronological
- Show every individual secondary event as a separate entry
- Use system language or database field names
- Predict or recommend

---

### Section 5 — Context

**Purpose:**

The Context answers: "What else is part of this commercial picture?"

It surfaces the connections — people, opportunities, notes, and interactions — that give the company relationship its depth.

**Context sections (shown only when they have entries):**

| Section | Contents | Navigation |
|---------|----------|-----------|
| Key Contacts | Up to 3 active contacts in this organization | Link to Contact Workspace |
| Active Deals | Up to 3 open commercial opportunities | Link to Deal Workspace |
| Recent Notes | Up to 3 most recent notes | Display only (no note workspace yet) |
| Last Meeting | Most recent meeting or call activity | Display only |

**Conditionality:**

Each section is shown only when it has entries. If all sections are empty, the Context tab shows a calm empty state. This state is honest: "Contacts, deals and notes will appear here as the relationship grows."

**What it must never do:**

- Show all historical records (curated, not complete)
- Duplicate what Preparation already surfaced
- Make recommendations
- Show timestamps in ISO format

---

## Header

The Company Workspace header must display:

1. **Back navigation** — link to Companies list with translated label
2. **Entity type badge** — "Company" (translated)
3. **Health signal** — derived chip, not a manual status field
4. **Owner badge** — the person responsible for this company relationship
5. **Company name** — in the largest typography
6. **Contextual subtitle** — industry and country
7. **Primary actions** — Edit company

**Health signal derivation:**

| Level | Condition |
|-------|-----------|
| `healthy` (Active) | Activity within last 14 days |
| `warning` (Cooling Down) | No activity in 14–21 days, or no contacts, or no active deals |
| `at-risk` (At Risk) | No activity in more than 21 days, or no `last_activity_at` recorded |

**Prohibited header elements:**

- Company status field from database (e.g., "customer", "active")
- Relationship stage field from database
- CRM jargon
- Database IDs, UUIDs, or ISO timestamps
- AI labels or Sparkles icons

---

## Workspace Metrics

Four key numbers displayed immediately below the header:

| Metric | Source |
|--------|--------|
| Pipeline Value | Sum of open deal values (from `company.pipeline_value`) |
| Active Deals | Count of non-won, non-lost deals |
| Contacts | Count of contacts in this organization |
| Last Activity | Natural-language relative time from `company.last_activity_at` |

---

## Tabs

Four tabs. In this order. No exceptions.

| Position | ID | Label | Content |
|----------|----|-------|---------|
| 1 | `overview` | Overview | Situation + Decision + Preparation + Company Profile |
| 2 | `story` | Story | Company History (GunimiStory) |
| 3 | `work` | Work | Notes + Emails |
| 4 | `context` | Context | Key Contacts + Active Deals + Notes + Last Meeting |

Work tab badge: count of notes + emails (pending items indicator).

---

## Business Language

Every visible string uses the language of a B2B business professional.

**Use:**
- "Company relationship"
- "Commercial opportunity"
- "Key contact"
- "Re-engage"
- "Prepare to close"

**Avoid:**
- "Record", "Entity", "Account"
- "Lead Score", "Source", "Pipeline Stage"
- "Updated at", "Created at", "Last Modified"
- Any technical field names

---

## Healthy State

When the Company Workspace is in a healthy state:

- Situation shows: contact count + active deal count (positive framing)
- Decision shows: "This company relationship is on track. No immediate action required."
- Preparation: absent
- Story: shows full history
- Context: shows connected entities

The healthy state is not a neutral state. It is a positive signal. The user should feel confidence, not absence.

---

## Anti-patterns

| Anti-pattern | Why prohibited |
|-------------|----------------|
| Showing "status: customer" as a health signal | Database field, not derived health assessment |
| Listing all notes and deals without curation | Context becomes a database browser |
| Showing activity count as the primary metric | Activity count is not the same as relationship health |
| Repeating the stale-relationship signal in both Situation and Decision | Grammar Rule 3.12 violation |
| Making Preparation items the same regardless of Decision action | Grammar Anti-pattern 9 |
| Disappearing the Decision section when relationship is healthy | Grammar Anti-pattern 8 |

---

## Open Alpha Scope

**In scope for v1.0:**

- Complete five-section architecture
- All four tabs
- Decision resolver with 5 priority conditions
- Preparation conditioned on Decision action
- Chronological story from origin to present
- Context sections: Key Contacts, Active Deals, Recent Notes, Last Meeting
- Health signal derivation
- Full localization (EN, SK, CS)

**Not in scope for v1.0:**

- Company task management (no `getCompanyTasks` action exists — future sprint)
- Company email composition (read-only display)
- Multiple company contacts in Preparation (shows primary only)

---

## Engine Reuse

The Company Workspace reuses the following Engine components without modification:

- `GunimiWorkspaceHeader` — header structure, health badge, owner badge, back nav
- `GunimiWorkspaceTabs` — four-tab structure with badge support
- `GunimiDecisionCard` — single recommendation or healthy state
- `GunimiPreparationCard` — context-specific briefing items
- `GunimiStory` — chronological narrative with milestone events
- `GunimiContextCard` — curated connected entity sections
- `GunimiEmptyState` — honest empty state for Context tab
- `GunimiStatCard` — individual metric display

Shared types from `lib/workspace/types.ts`:
- `StoryEvent` — story event structure
- `RawContextSection` — context section structure
- `RawContextEntry` — individual context entry
- Extended `iconKey` union to include `"deals"` for Active Deals context section

Shared constants from `lib/workspace/constants.ts`:
- `MS_PER_DAY` — used in all time calculations

---

**Version:** 1.0
**Created:** 2026-07-11
**Authority:** Gunimi Product Bible v1.0 · Workspace Contract v1.0 · Workspace Grammar v1.0
**Implements:** Workspace Contract v1.0 §3–§10
**Reference:** Deal Workspace Blueprint v1.0 · Contact Workspace Blueprint v1.0
