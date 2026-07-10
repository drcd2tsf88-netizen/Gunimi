# Gunimi Blueprint — Contact Workspace v1.0

**Version:** 1.0
**Status:** Foundational — permanent
**Authority:** Gunimi Product Bible · Workspace Principles · Deal Workspace Blueprint (Reference)
**Reference Workspace:** Deal Workspace v1.0

> *Note: `docs/WORKSPACE_CONTRACT.md` does not currently exist. This blueprint is authored from the Product Bible, Workspace Principles, and Deal Workspace Blueprint. When WORKSPACE_CONTRACT.md is created, this blueprint must be reviewed against it.*

---

> *"A contact is not a record. A contact is a person. The Contact Workspace exists to make every business conversation with that person smarter, faster, and more human."*

---

## Mission

The Contact Workspace is the operational environment for one real person in your business universe.

It is not a CRM contact record.

It is not a form with fields.

It is not a list of activities.

It is the place where you understand the relationship with a specific person — and where that relationship moves forward.

When a user opens the Contact Workspace, the system has already done the thinking. The relationship has been assessed. The most valuable next action has been identified. The context for the next interaction has been prepared.

The user arrives ready to act — not ready to read.

---

## The Core Question

Every time a user opens the Contact Workspace, the product must immediately answer:

> **Who is this person to my business, what is the current state of our relationship, and what should I do next?**

Only after answering this question may the Workspace expose supporting detail.

---

## Task 1 — Purpose

### Why does the Contact Workspace exist?

Business is conducted through people. Every deal is won or lost through people. Every partnership begins with a person. Every customer becomes a person when the relationship deepens beyond a transaction.

Yet most business software treats a person as a database record. A row in a table. A form with fields. A list of associated activities that the user must read and synthesize themselves.

The Contact Workspace exists because person-to-person relationships deserve an operational environment — not a record. It exists so that a business owner can open any contact and instantly understand the relationship, its current state, and what it needs — without reading, without searching, without synthesizing.

### What business question does it answer?

The Contact Workspace answers one question per open:

**"What does this relationship need from me today?"**

Not: "What data exists about this contact?"
Not: "What is this person's status?"
Not: "Show me all activities related to this person."

The question is always forward-looking. What does the relationship need? What should happen next? What am I walking into?

### What should the user know within five seconds?

1. **Who this person is** — name, role, company, relationship depth
2. **The current health of the relationship** — is it active, warm, stale, at risk?
3. **The single most valuable next action** — specific, actionable, grounded in evidence

If the user must scroll, click, or think to find any of these three answers, the Workspace has failed.

---

## Task 2 — Workspace Sections

The Contact Workspace implements the same five-section architecture as the Deal Workspace Reference.

**The structure is non-negotiable.** The Contact Workspace adapts the content to relationships. It does not invent a different structure.

---

### Section 1 — Situation

**Purpose:**

The Situation answers the question: "What is happening with this person today?"

It is the relationship health layer. It surfaces the signals that determine whether this relationship is active, at risk, or requires attention — without asking the user to derive these signals themselves.

**Business value:**

A business owner managing thirty active relationships cannot remember the status of each one. The Situation layer is the system's answer to: "where does this relationship stand right now, before I say or do anything?"

The Situation is never a static status field. It is a derived assessment based on observable behavior: how long since last contact, whether tasks are overdue, whether an active deal is stalling, whether the relationship is newly created and unengaged.

**Information hierarchy:**

1. Relationship health signal — the primary derived assessment (one sentence)
2. Supporting signals — secondary observations (stale activity, overdue follow-up, active deal context)
3. Suppression — when the Decision layer already communicates a signal, the Situation layer suppresses it to avoid duplication

Signals that are already surfaced by the Decision card must not repeat in the Situation layer. The Situation layer shows secondary context only when the primary recommendation has already addressed the most urgent signal.

**What it must never do:**

- Show a "Contact Status" field from the database (that is a record field, not a relationship assessment)
- Manufacture urgency when there is none
- Be silent when there is a genuine signal
- Show the same signal twice (once in Situation, once in Decision)

---

### Section 2 — Decision

**Purpose:**

The Decision answers the question: "What is the single most valuable next action for this relationship?"

It surfaces one recommendation, with one explanation, grounded in real observable evidence.

**Business value:**

One clear action is more valuable than ten suggestions. The Decision layer does not present options. It presents a recommendation — specific, grounded, with the reasoning visible. The user may choose to follow it or not. The system never decides for them. But it always has a view.

When nothing actionable exists — when the relationship is healthy, tasks are current, no deals are at risk — the Decision shows a calm, honest healthy state. Silence is not failure. Silence is accurate.

**Information hierarchy:**

1. Primary action label — what to do (business language, imperative voice)
2. Reason — why now (one sentence, grounded in specific evidence)
3. Healthy state — shown when nothing is urgent (honest, calm, no manufactured urgency)

**Decision priority order:**

The Decision resolver evaluates the relationship in this priority sequence. The first matching condition becomes the recommendation:

1. Overdue tasks related to this contact
2. Relationship has been stale (no contact beyond the threshold)
3. Active deal associated with this contact requires attention (closing soon or stalling)
4. Contact has no company linked (important context is missing)
5. Contact is newly created with no interactions (relationship has not been initiated)
6. Contact has no reachable information (no email, no phone)
7. Relationship is healthy — show calm state

Each condition maps to a typed action. The action type drives both the Decision card content and the Preparation layer's assembly.

**What it must never do:**

- Show more than one primary recommendation
- Fabricate a recommendation when there is no evidence
- Expose AI as the source of the recommendation
- Use vague language ("consider following up" is not a recommendation)

---

### Section 3 — Preparation

**Purpose:**

The Preparation answers the question: "What should already be ready before I interact with this person?"

It assembles the context that should be in hand before any meeting, call, or email — so the user arrives prepared without manually gathering information.

**Business value:**

An exceptional executive assistant prepares before every interaction. Before a call with a client, they would prepare: the last conversation outcome, any open commitments, the current state of active deals, relevant company news, and the stated purpose of the conversation. They would not ask the manager to assemble this themselves.

The Preparation section does exactly this. Its content is determined by the current Decision action — the preparation adapts to what is about to happen. If the decision is "follow up on stale relationship," the preparation assembles the history of the last interaction and what was outstanding. If the decision is "prepare for closing meeting," the preparation assembles deal context, key stakeholders, and open negotiation points.

**Information hierarchy:**

Preparation items are contextual to the Decision action. They always include:

1. **Last interaction** — when, what type, what outcome
2. **Open commitments** — tasks that were promised, pending responses
3. **Active deal context** — if there is a deal in progress, its current state and stage
4. **Key notes** — the most recent relevant notes from prior interactions
5. **Company context** — who else at this company is in the system, relationship state

Empty when nothing is needed (healthy relationship, no upcoming interaction, no pending items). Empty states are honest — not filled with placeholder content.

**What it must never do:**

- Show preparation items that are not connected to the current decision action
- Duplicate information already visible in the Situation or Decision sections
- Show everything — surface the relevant, suppress the rest

---

### Section 4 — Story

**Purpose:**

The Story answers the question: "How did this relationship evolve, and what does its arc tell me?"

It is the continuous narrative of the relationship — not a reverse-chronological activity log, but a forward-moving story that shows how the relationship was built event by event.

**Business value:**

A contact activity log shows what happened. The Story shows what the relationship became. These are fundamentally different.

A log gives the user the raw material for synthesis. A story has already synthesized. The user can scan the Story and understand — without reading every entry — whether this relationship was built quickly or slowly, whether it has been consistently engaged or sporadic, whether significant milestones (a deal closed, a proposal rejected, a referral given) mark meaningful inflection points.

The Story is also the memory of the relationship. When a new team member takes ownership of this contact, the Story tells them what they need to know without reading every note and email.

**Information hierarchy:**

1. Relationship origin — when and how the contact entered the system (first email, referral, event, manual creation)
2. Primary milestones — individually rendered: first meeting, deal opened, proposal sent, deal closed, significant note, company change
3. Secondary events — collapsed into milestones: notes added, tasks created, status updates, minor activity
4. Chronological order — always oldest to newest (the relationship is a story moving forward, not a feed moving backward)

The Story is always chronological. Reverse-chronological activity feeds are an anti-pattern. The user understands a relationship by reading its history forward — from how it started to where it is now.

**What it must never do:**

- Show every event individually (creates log, not story)
- Sort in reverse chronological order
- Show technical events (record created, field updated, ID changed)
- Show events without human meaning attached to them

---

### Section 5 — Context

**Purpose:**

The Context answers the question: "What else is connected to this person that is relevant to understanding them?"

It is the supporting fabric of the relationship — everything that provides depth without being the primary working surface.

**Business value:**

A person in business does not exist in isolation. They are connected to a company, to deals, to colleagues, to a history of notes, to tasks in progress. Understanding who a person is requires understanding their context — not just their profile fields.

The Context section makes this supporting fabric accessible without making it primary. It is the tab the user goes to when they want to go deeper — not the tab they need to go to just to understand the basics.

**Information hierarchy:**

Context sections are rendered as `GunimiContextCard` components, one per section:

1. **Company** — the organization this person works for, with a link to the Company Workspace
2. **Active Deals** — deals currently associated with this contact, with their stage and urgency
3. **Recent Notes** — the most recent notes from prior interactions (not all notes — the recent and relevant ones)
4. **Open Tasks** — pending tasks related to this contact
5. **Colleagues** — other contacts at the same company in the system (relationship web)

Context sections are shown only when they have content. An empty Context section is not shown. An empty Context tab shows a calm `GunimiEmptyState` — honest, not apologetic.

**What it must never do:**

- Show all notes, all tasks, all deals (that is a list view, not context)
- Show raw metadata (IDs, timestamps in ISO format, technical fields)
- Require the user to navigate away to understand what is shown

---

## Task 3 — Workspace Header

The Contact Workspace Header is the identity and accountability anchor. It answers: "Who is this person and who owns this relationship?" before the user reads a single section.

The Deal Workspace Header centers the opportunity: name, stage, value, close date, owner.

The Contact Workspace Header centers the person and the relationship: name, role, company, relationship health, owner, last contact.

### Header Elements

**1. Contact Name**

The most prominent element. Displayed in the largest type. Immediately legible at a glance.

*Why:* The user opened this page for a specific person. The first thing they see must confirm they are in the right place.

**2. Position + Company (with link)**

Displayed directly beneath the name as a subtitle. The company name is a link to the Company Workspace.

*Why:* A person's role and company are the first two things anyone says when introducing a business contact. "Maria Chen, VP of Procurement at Acme." They belong together, beneath the name, immediately visible. The company link eliminates the need to navigate away for company context.

**3. Relationship Health Signal**

A derived chip — not a user-editable status field. Expressed in natural, business language:
- "Active" — recent interaction within the past 7 days
- "Engaged" — interaction within the past 30 days
- "Needs attention" — no contact beyond the staleness threshold
- "New relationship" — created within the past 14 days, limited history

The health signal is computed. It is never manually set. It reflects reality, not intent.

*Why:* The single most important thing to know about any relationship before engaging it is: what is its current state? Not "what field did someone type into a Status dropdown" — but what does the actual evidence of interaction say about this relationship right now?

A manually-set status field is the user's opinion. A derived health signal is the system's observation. The system's observation is more reliable and requires no maintenance.

**4. Owner Badge**

The person responsible for this relationship. Always visible. Single owner always.

*Why:* Principle 8 — Single Ownership. Accountability must always be obvious. The owner is the answer to "who is responsible for this relationship?" — a question that must never require searching.

**5. Last Contacted**

A natural-language expression of recency: "3 days ago", "2 weeks ago", "Never contacted."

*Why:* The single most important temporal signal for a relationship. Before reading anything else, knowing "when did we last speak to this person?" orients every subsequent piece of information. The Situation and Decision sections elaborate — but this signal in the header provides immediate orientation.

**6. Primary Actions**

The three most probable next actions for any contact interaction, always accessible without scrolling:
- **Email** — initiate or continue a conversation
- **Log interaction** — record a meeting, call, or note
- **Add task** — create a follow-up or action item

*Why:* Primary actions belong in the header because they are workspace-agnostic and always relevant. No matter what tab the user is on, no matter what state the relationship is in, these three actions are always valid. Requiring the user to navigate to a specific tab before taking a common action is unnecessary friction.

### What the Contact Header must never show

- A "Status" dropdown (this is a CRM database field, not a relationship signal)
- A "Source" field (metadata about data origin — never user-facing)
- A "Lead Score" (a CRM KPI — not a business signal)
- A "Created date" (internal metadata — irrelevant to relationship work)
- Contact ID or any database identifier
- Company name without a link (if you show the company, it must be navigable)

---

## Task 4 — Data Belonging to the Contact Workspace

The Contact Workspace draws from the following data. All of this data already exists in the current Gunimi data model and is already fetched in the existing contact detail page.

**No new data sources are required for the Contact Workspace.**

### Identity Data (Contact type)

| Field | Workspace Use |
|-------|--------------|
| `name` | Header — primary identity |
| `position` | Header — role subtitle |
| `company_name` | Header — company subtitle (linked) |
| `email` | Primary action target (Email button) |
| `phone` | Secondary action target |
| `last_contacted_at` | Header — last contacted signal; Situation — relationship health input |
| `created_at` | Story — relationship origin event |
| `owner.full_name` | Header — owner badge |

**Fields that exist but must never be shown:**

- `id` — internal, never user-facing
- `status` — database field, replaced by derived relationship health
- `company_id` — internal reference, replaced by company name + link
- `notes` (the raw text notes field on the contact record itself) — superseded by structured Notes from `getContactNotes`

### Related Data (already fetched)

| Data | Source | Workspace Use |
|------|--------|--------------|
| Deals | `getContactDeals` | Situation, Decision, Preparation, Context |
| Tasks | `getContactTasks` | Situation (overdue detection), Decision, Preparation, Context |
| Activity | `getContactActivity` | Story — primary events and grouped milestones |
| Notes | `getContactNotes` | Preparation, Context, Story |
| Emails | `getContactEmails` | Story — communication milestones |

### What data belongs where

**Situation layer uses:**
- `last_contacted_at` — for staleness detection
- `tasks` (filtered: overdue) — for urgency detection
- `deals` (filtered: active) — for deal-relationship signals

**Decision layer uses:**
- All Situation inputs — for priority evaluation
- `contact.email` + `contact.phone` — for reachability check
- `contact.company_id` — for company-linked check

**Preparation layer uses:**
- Most recent note from `notes`
- Most recent activity from `activity`
- Active deal(s) from `deals`
- Overdue tasks from `tasks`

**Story uses:**
- All `activity` events — for the narrative
- `deals` — for deal-milestone events (deal opened, deal won/lost)
- `notes` — as story chapter markers when significant
- `contact.created_at` — for the synthetic origin event

**Context uses:**
- `deals` — Active Deals section
- `notes` — Recent Notes section
- `tasks` — Open Tasks section
- `contact.company_id` + `contact.company_name` — Company section

---

## Task 5 — What Must Never Appear

The following elements are explicitly prohibited in the Contact Workspace. Each prohibition protects a specific principle.

### Database-origin fields shown as UI

- `contact.id` or any UUID — internal database identifier
- `contact.status` as a badge or dropdown — this is a CRM field, not a business signal
- `contact.company_id` — internal reference key
- "Source: Web Form" or any data-source metadata — how a record was created is irrelevant to relationship work
- ISO 8601 timestamps ("2026-06-15T10:22:00Z") — always expressed in human language

### CRM jargon

- "Contact Record"
- "Lead"
- "Prospect"
- "Account"
- "Entity"
- "Module"
- "Log Activity"
- "Convert Lead"

These terms reflect how the software is built, not how business works. Business owners talk about people, relationships, conversations, and follow-ups.

### Vanity KPIs

- "Total activities: 47" as a headline metric
- "Emails sent: 12"
- "Open rate: 38%"
- "Lead score: 84"

These numbers exist to make the software appear active. They do not help the user make a better decision about the relationship.

### AI branding

- AI labels on any element
- Sparkle icons on business data
- "AI-powered analysis"
- "Generated by AI"
- Any indication that intelligence is coming from a model

AI is infrastructure. It has no identity in the workspace.

### Duplicate information

- Company information in both the header subtitle and a "Company Card" section
- Active deals listed in both the Preparation section and shown again in a deals list on the same tab
- The same signal in both the Situation section and the Decision card

Information that appears twice forces the user to reconcile it. Gunimi never makes users reconcile.

### Everything at once

- All notes, all activities, all tasks, all deals shown simultaneously on a single tab
- Infinite scroll through undifferentiated activity history
- Every historical event rendered individually without grouping

Showing everything is not the same as showing what matters. Curating for relevance requires the system to have a view about what is relevant now.

---

## Task 6 — Contact Workspace vs. Traditional CRM Contact Page

### What a traditional CRM contact page shows

A traditional CRM contact page is structured as a form with related lists.

**The form:**
Fields are displayed in their database categories: Basic Info, Contact Details, Relationship Info, System Fields. The user sees: Name, Email, Phone, Position, Status (Active/Inactive), Lead Source (Web Form/Manual), Lead Score (72), Created Date, Last Modified Date.

**The related lists:**
Below the form, stacked vertically: Open Activities (a list), Activity History (a reverse-chronological log), Related Deals (a list), Related Cases (a list), Related Notes (a list), Related Files (a list).

**What the user must do:**
1. Read the form fields to build a mental picture of who this person is
2. Scroll through the activity history to understand what has happened
3. Check each related list for anything relevant
4. Decide themselves what to do next
5. Open a separate deal record to understand deal context
6. Open email to check the actual conversation

The CRM page is a record retrieval system. It retrieves everything and asks the user to think.

### What the Gunimi Contact Workspace shows

**The header:**
Maria Chen · VP of Procurement · [Acme Corp ↗] · Relationship: Needs attention · Owner: Alex K. · Last contact: 18 days ago

**The overview tab (in order):**
1. Situation — "No contact in 18 days. Two open tasks are approaching their due date."
2. Decision — "Schedule a check-in with Maria. You left the Q3 proposal unanswered and the close date is in 11 days."
3. Preparation — Last interaction: 18 days ago (discovery call, outcome: interested, next step: send proposal). Open commitment: Q3 Proposal (sent, unanswered). Active deal: Enterprise Expansion ($45,000 — Proposal stage).
4. Business summary — compressed identity: who Maria is, company context, relationship depth

The workspace does the thinking. The user arrives ready to act.

### Why Gunimi is better

**The deal workspace is not a better CRM.** The comparison is the wrong frame. The Contact Workspace answers a different question.

| CRM Page | Contact Workspace |
|----------|-----------------|
| Retrieves records | Prepares decisions |
| Shows all data | Shows relevant data |
| User synthesizes | System synthesizes |
| Activity log | Relationship story |
| Status field | Derived health signal |
| Forward to email/deal | Everything present |
| User decides what matters | System surfaces what matters |

The fundamental difference: a CRM page trusts the user to figure out what to do. The Contact Workspace trusts itself to figure out what matters — and shows the user both the answer and the reasoning.

This is not feature superiority. It is a different philosophy of what software is for.

---

## Task 7 — Open Alpha Readiness

**Can the Contact Workspace be implemented immediately using the current Workspace Engine?**

**YES — with high confidence.**

The architectural foundation is complete. Every GDL component required for the Contact Workspace already exists. Every data source required is already fetched. The resolver pattern is proven.

Implementation is an application of an existing pattern, not an invention of a new one.

---

### What can be reused without modification

**GDL Components — zero changes required:**

| Component | Contact Workspace Use |
|-----------|----------------------|
| `GunimiDecisionCard` | Decision section — generic, contact-ready |
| `GunimiPreparationCard` | Preparation section — generic, contact-ready |
| `GunimiContextCard` | Context tab sections — generic, contact-ready |
| `GunimiStory` | Story tab — generic, contact-ready |
| `GunimiWorkspaceTabs` | Four-tab structure — generic, contact-ready |
| `GunimiEmptyState` | Empty states throughout — generic, contact-ready |
| `GunimiCard` | Any card surface — generic, contact-ready |

**Server actions — zero changes required:**

All six server actions already exist and are already called in the current contact detail page:

- `getContact(contactId)` ✅
- `getContactDeals(contactId)` ✅
- `getContactTasks(contactId)` ✅
- `getContactActivity(contactId)` ✅
- `getContactNotes(contactId)` ✅
- `getContactEmails(contactId)` ✅

**Architecture pattern — directly applicable:**

The resolver → `DealDetailView` → GDL component pipeline from the Deal Workspace is the exact pattern for the Contact Workspace. The implementation replaces `DealDetailView.tsx` with `ContactDetailView.tsx` and creates a parallel resolver library in `lib/contacts/`.

---

### What needs to be created

**New resolvers — four files, same pattern as `lib/deals/`:**

**`lib/contacts/constants.ts`**

Shared thresholds for relationship intelligence. Some constants (e.g., `STALE_THRESHOLD_DAYS`) should be promoted from `lib/deals/constants.ts` to a shared location (e.g., `lib/shared/constants.ts`) rather than duplicated. Contact-specific thresholds: `NEW_RELATIONSHIP_THRESHOLD_DAYS` (14 days — contacts created recently with no interactions).

**`lib/contacts/decision.ts`**

`resolveContactDecision(contact, tasks, deals)` → `ContactDecisionResult | null`

Evaluates the relationship in priority order and returns one typed action with locale keys for the action label and reason. Returns `null` when the relationship is healthy. Same structure as `DealDecisionResult` with a `ContactActionType` union replacing `DealActionType`.

**`lib/contacts/preparation.ts`**

`resolveContactPreparation(contact, decision, tasks, notes, deals)` → `RawPreparationItem[]`

Returns preparation items that are contextual to the current decision action. Uses the same `PreparationItem` type as the Deal Workspace (already generic). Switches on `ContactActionType` (typed) — never on locale key strings.

**`lib/contacts/story.ts`**

`resolveContactStory(contact, activities, deals)` → `StoryEvent[]`

Returns the relationship narrative as a chronological event array. Uses the same `StoryEvent` type as the Deal Workspace. Primary events: first interaction, meetings, deals opened/won/lost, significant notes, email milestones. Secondary events: task creation, note addition, minor activity. Always starts with a synthetic "relationship began" event from `contact.created_at`.

**`lib/contacts/context.ts`**

`resolveContactContext(contact, deals, notes, tasks)` → `RawContextSection[]`

Returns four context sections: Company, Active Deals, Recent Notes, Open Tasks. Uses the same `RawContextSection` and `RawContextEntry` types as the Deal Workspace `lib/deals/context.ts`.

---

**New view component — one file:**

**`components/contacts/detail/ContactDetailView.tsx`**

Replaces the current stacked module layout of `ContactHeader + ContactCompanyCard + ContactDeals + ContactTasks + ...`.

Implements the four-tab structure using `GunimiWorkspaceTabs`. Wraps all four resolver calls in `useMemo`. Translates locale-keyed resolver output using `useTranslations`. Passes pre-translated strings to GDL components.

Follows the exact same pattern as `DealDetailView.tsx` — the implementation template already exists.

---

**New Intelligence component — one file:**

**`components/contacts/detail/ContactIntelligence.tsx`**

The relationship health surface. Equivalent to `DealIntelligence.tsx`. Renders secondary relationship signals not covered by the primary Decision action. Accepts `activeDecisionAction?: ContactActionType` and suppresses signals already communicated by the Decision card. Returns `null` when no secondary signals exist and a decision is active.

---

**New Header component — one file:**

**`components/contacts/detail/ContactHeader.tsx`**

Purpose-built for relationship identity. Replaces the existing `ContactHeader.tsx`. Shows: name, position + company (linked), derived relationship health chip, owner badge, last contacted in natural language, three primary action buttons. The header chip is computed from the resolver — never a static field.

---

### What to do with the existing contact detail page

The current `app/dashboard/contacts/[id]/page.tsx` fetches all data in parallel — this is correct and must be preserved.

The rendering layer (the stacked components) is replaced by `ContactDetailView.tsx`, which receives all data as typed props and applies the workspace architecture.

The existing components (`ContactCompanyCard`, `ContactDeals`, `ContactTasks`, `ContactNotes`, `ContactEmails`, `ContactActivity`, `ContactIntelligence`, `EntityMemoryPanel`) are retired as the workspace architecture supersedes their individual responsibilities. Their data is absorbed into the resolver outputs and rendered through GDL components.

---

### Architecture diagram

```
app/dashboard/contacts/[id]/page.tsx   ← Server Component
  │
  ├─ Parallel data fetch (all 6 actions)
  │
  └─ ContactDetailView.tsx              ← Client Component
       │
       ├─ useMemo: resolveContactDecision(contact, tasks, deals)
       ├─ useMemo: resolveContactPreparation(contact, decision, tasks, notes, deals)
       ├─ useMemo: resolveContactStory(contact, activities, deals)
       ├─ useMemo: resolveContactContext(contact, deals, notes, tasks)
       │
       ├─ ContactHeader.tsx
       │
       └─ GunimiWorkspaceTabs (4 tabs)
            │
            ├─ Overview Tab
            │    ├─ ContactIntelligence (Situation — suppression-aware)
            │    ├─ GunimiDecisionCard (Decision)
            │    ├─ GunimiPreparationCard (Preparation — conditional)
            │    └─ Contact Business Summary
            │
            ├─ Story Tab
            │    └─ GunimiStory (rawStory → StoryEvent[])
            │
            ├─ Work Tab
            │    └─ Tasks + Notes (inline, workspace-native)
            │
            └─ Context Tab
                 └─ GunimiContextCard × N sections
```

---

### Open Alpha readiness assessment

| Requirement | Status |
|-------------|--------|
| GDL components available | ✅ Complete |
| Server actions available | ✅ Complete |
| Data model sufficient | ✅ Complete |
| Resolver pattern proven | ✅ Complete (Deal Workspace) |
| New resolvers required | 4 new files — standard pattern |
| New components required | 3 new files (View, Header, Intelligence) |
| Locale keys required | ~20 new keys (3 locales each) |
| Schema changes required | None |
| New data fetching required | None |
| Breaking changes | None — additive implementation |

**Estimate:** The Contact Workspace is the most buildable major feature in the current roadmap because every dependency is already resolved.

---

## The Final Question

*"If somebody opens the Contact Workspace for the first time — will they feel they are looking at a person, or at a CRM record?"*

A CRM record has fields. Fields belong to tables. Tables belong to databases. Databases belong to software.

A person has a name, a role, a company, a history with your business, and a relationship that is either growing or fading. They have a last conversation that went well or left something open. They have a deal in progress or a partnership being explored. They have a colleague who introduced them to your company, or a note from three months ago that has not been followed up on.

The Contact Workspace shows the person.

The header says their name and who they are in the world — not what status field was assigned to them in the database. The relationship health signal says whether you've been in touch recently — not what category they were imported under. The Decision card says what the relationship needs today — not what activity count their record has accumulated.

A user who opens the Contact Workspace and reads: "Maria Chen · VP of Procurement · Acme Corp · Relationship: Needs attention · Last contact: 18 days ago — Schedule a check-in: you left the Q3 proposal unanswered and the close date is in 11 days" — is looking at a person.

A user who opens a CRM record and reads: "Maria Chen | Status: Active | Lead Score: 84 | Source: Web Form | Last Modified: 2026-06-21 | Activities: 47 | Open Tasks: 2" — is looking at a record.

The architecture described in this blueprint produces the first experience.

That is why this blueprint exists.

---

## One Sentence Definition

> The Contact Workspace is not where information about a person is stored. It is where the relationship with that person moves forward.

---

**Version:** 1.0
**Created:** 2026-07-08
**Authority:** Gunimi Product Bible v1.0 · Workspace Principles · Deal Workspace Blueprint v1.0
**Next review:** After WORKSPACE_CONTRACT.md is created — audit compliance
