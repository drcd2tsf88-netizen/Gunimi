# Gunimi Workspace Contract

**Version:** 1.0
**Status:** Foundational — permanent
**Authority:** Gunimi Product Bible v1.0 · Workspace Principles · Workspace Grammar v1.0
**Supersedes:** Nothing — this document extends and makes concrete what the Principles and Grammar define.

> *"Every Workspace is a contract between the product and the user. The product promises to answer five questions in the same way, every time, for every entity. This document specifies what that promise requires."*

---

## Purpose

This document is the formal technical and behavioral contract that every Workspace implementation must satisfy.

The Product Bible defines what Gunimi believes.
The Workspace Principles define what a Workspace is.
The Workspace Grammar defines how a Workspace thinks.

**The Workspace Contract defines what a Workspace must do.**

It is the specification that every Workspace Blueprint is written against. It is the checklist every Workspace implementation is audited against. It is the document that prevents any two Workspaces from making different promises to the user.

If a Blueprint conflicts with this Contract, the Contract takes precedence.
If an implementation conflicts with this Contract, the implementation must change.

---

## 1. Workspace Definition

A Workspace is the operational environment for a single business entity — a deal, a contact, a company, a project, or any entity that has a lifecycle, relationships, and work associated with it.

A Workspace is not:
- A detail page
- A CRM record view
- A form with related lists
- A dashboard
- An activity log

A Workspace is the place where a specific piece of business moves forward.

---

## 2. Workspace Lifecycle

### Opening contract

When a user opens any Workspace, the system guarantees:

1. The entity is identified immediately — name, type, health, owner — before any other content.
2. The most important signal is visible without scrolling.
3. One clear recommended next action is presented within the first viewport.

The system must complete this contract within the first render. There is no loading state that defers any of these three guarantees.

### Active contract

While the user is inside a Workspace:

1. Context comes to the Workspace — the user is never directed elsewhere to retrieve information that belongs to this entity.
2. Navigation between tabs never loses information — switching from Overview to Story and back does not lose scroll position, does not re-fetch, and does not reset state.
3. The Workspace reflects current state — if the entity changes (a task is completed, a stage changes), the Workspace reflects that change without requiring a full page reload for typical interactions.

### Exit contract

When the user leaves the Workspace:

1. No work is lost — any in-progress inputs (notes being typed, task being edited) are either preserved or explicitly discarded by the user.
2. Navigation returns to the correct list view — the back navigation always returns to the correct entity list, never to an unrelated page.

---

## 3. Mandatory Sections

Every Workspace implementation must include exactly five sections, in exactly this order:

| Order | Section | Question Answered | Component Required |
|-------|---------|-------------------|-------------------|
| 1 | Situation | What is happening? | `{Entity}Intelligence` |
| 2 | Decision | What should happen next? | `GunimiDecisionCard` |
| 3 | Preparation | What do I already have? | `GunimiPreparationCard` |
| 4 | Story | How did we get here? | `GunimiStory` |
| 5 | Context | What else is connected? | `GunimiContextCard` × N |

**Sections 1–3 appear in the Overview tab.**
**Section 4 occupies the Story tab.**
**Section 5 occupies the Context tab.**

The Work tab (tasks, notes, email) is not a Question section. It is the operational surface for doing work. It always appears as the third tab, between Story and Context.

### Section presence rules

- **Situation:** Always present. Shows calm healthy state when no signals exist. Never absent.
- **Decision:** Always present. Shows honest healthy state when no action is needed. Never absent.
- **Preparation:** Present only when the Decision action requires it. Conditionally rendered. Never shown with manufactured items.
- **Story:** Always present. Shows early-relationship state when history is limited. Never absent.
- **Context:** Present when at least one section has content. Each context section is shown only when it has entries. An empty Context tab shows a calm empty state.

---

## 4. Mandatory Tab Structure

Every Workspace has exactly four tabs. No more. No fewer.

| Position | Tab ID | Label Key | Content |
|----------|--------|-----------|---------|
| 1 | `overview` | `tabOverview` | Situation + Decision + Preparation + Entity Summary |
| 2 | `story` | `tabStory` | `GunimiStory` component |
| 3 | `work` | `tabWork` | Tasks + Notes + relevant communication |
| 4 | `context` | `tabContext` | `GunimiContextCard` sections or `GunimiEmptyState` |

The Work tab carries a count badge when pending items exist. No other tab carries a badge.

Default active tab: `overview`.

---

## 5. Mandatory Header Elements

Every Workspace header must display:

1. **Back navigation** — link to the entity list view, with a translated label
2. **Entity type badge** — the translated entity type ("Contact", "Deal", "Company")
3. **Health signal** — a derived chip using `WorkspaceHealth` (`"healthy"`, `"warning"`, `"at-risk"`)
4. **Owner badge** — the person responsible for this entity
5. **Entity title** — the primary name of this entity, in the largest type
6. **Contextual subtitle** — role, company, stage, or relevant secondary identity
7. **Primary actions** — the most common interactions for this entity type, always visible

### Prohibited header elements

The following must never appear in any Workspace header:

- Database IDs or UUIDs
- ISO timestamps or Unix timestamps in any form
- "Status" dropdowns sourced directly from database fields
- CRM jargon: Lead Score, Source, Created Date, Last Modified, Record Type
- AI labels, Sparkles icons, or any indicator that content is AI-generated
- Manually-settable "status" fields that replace derived health signals

---

## 6. Required Behavior

### Signal suppression

When the Decision layer claims a signal as the basis for its recommendation, the Situation layer must not repeat that same signal. The Situation shows only secondary signals — observations not already addressed by the Decision.

This is non-negotiable. Duplicate signals violate Grammar Rule 3.12 and create user confusion.

Implementation pattern:
```typescript
// Situation component receives activeDecisionAction from the parent view
// Each signal checks before rendering:
if (activeDecisionAction !== "the_action_that_already_addresses_this_signal") {
  // render signal
}
```

### Decision priority

Every Workspace Decision resolver evaluates conditions in a fixed priority order. The first matching condition produces the recommendation. All other conditions are ignored.

The priority order is defined in the entity's Blueprint and must not be changed without a Blueprint revision.

### Preparation conditionality

Preparation is rendered if and only if `preparationItems.length > 0`. An empty Preparation section is never shown. There is no "No preparation needed" state — absence is the state.

### Story chronology

Story events are always sorted oldest-first. Reverse-chronological ordering is prohibited without exception.

### Context conditionality

Context sections are rendered if and only if they have entries. Empty sections within an otherwise non-empty Context tab are simply absent. The Context tab itself shows a `GunimiEmptyState` if and only if zero sections have entries.

---

## 7. Information Ownership

Each piece of information belongs to exactly one section. When information could belong to multiple sections, it belongs to the section that owns its scope.

| Information | Owner | Never in |
|-------------|-------|----------|
| Observable current facts | Situation | Decision, Story |
| The recommended next action | Decision | Situation, Preparation, Context |
| Items needed to execute the Decision action | Preparation | Context |
| The chronological history | Story | Situation, Decision |
| Connected entities and relationships | Context | Preparation |

If the same fact would naturally appear in two sections, the section with narrower scope wins. Preparation (immediate action scope) wins over Context (broad relationship scope) when the item is needed for the current action.

---

## 8. Engine Component Responsibilities

The Workspace Engine components are the implementation of the Contract's section requirements. Each component has a single responsibility and accepts only pre-translated strings from external callers.

| Component | Contract Section | Entity-specific logic | Allowed imports |
|-----------|-----------------|----------------------|-----------------|
| `GunimiWorkspaceHeader` | Header | None | `components/ui`, `lib/workspace` |
| `GunimiWorkspaceTabs` | Tab structure | None | `components/ui` |
| `GunimiDecisionCard` | Decision | None | `components/ui` |
| `GunimiPreparationCard` | Preparation | None | `components/ui` |
| `GunimiStory` | Story | None | `components/ui`, `lib/workspace` |
| `GunimiContextCard` | Context | None | `components/ui` |
| `GunimiEmptyState` | Empty states | None | `components/ui` |

**No Engine component may import from an entity domain** (`lib/deals/`, `lib/contacts/`, `lib/companies/`, etc.).

**No Engine component may contain entity-specific logic**, conditional rendering based on entity type, or branching based on which Workspace is rendering.

Shared types required by Engine components live in `lib/workspace/types.ts`. Shared constants required by Engine components live in `lib/workspace/constants.ts`.

---

## 9. Resolver Contract

Every Workspace entity must implement exactly four resolvers in `lib/{entity}/`:

| File | Function | Returns |
|------|----------|---------|
| `decision.ts` | `resolve{Entity}Decision(entity, ...)` | `{Entity}DecisionResult \| null` |
| `preparation.ts` | `resolve{Entity}Preparation(entity, decision, ...)` | `{Entity}PrepItem[]` |
| `story.ts` | `resolve{Entity}Story(entity, ...)` | `StoryEvent[]` |
| `context.ts` | `resolve{Entity}Context(entity, ...)` | `RawContextSection[]` |

### Resolver invariants

1. **Pure functions.** Resolvers have no side effects. They accept data and return data. They do not call APIs, read cookies, access the DOM, or mutate state.

2. **Locale-key output, not translated strings.** Resolvers return locale keys (`actionKey`, `reasonKey`, `badgeKey`, `titleKey`, `labelKey`). They never return translated strings. Translation happens in the view component using `useTranslations`.

3. **Null means healthy.** `resolve{Entity}Decision` returns `null` when the entity is healthy and no action is required. A `null` result causes `GunimiDecisionCard` to render its calm healthy state.

4. **Empty array means nothing to show.** `resolve{Entity}Preparation` returns `[]` when Preparation should not be rendered. `resolve{Entity}Context` returns `[]` when the Context tab should show the empty state.

5. **Always start at origin.** `resolve{Entity}Story` always begins with a synthetic origin event derived from the entity's creation timestamp.

6. **Action type switch, not locale key switch.** Preparation and Situation use `switch (decision.action)` on typed `{Entity}ActionType` values — never on locale key strings. This makes branching refactor-safe.

7. **Shared types, workspace imports.** Resolvers import `StoryEvent`, `RawContextSection`, `RawContextEntry`, and `MS_PER_DAY` from `lib/workspace/` — never from another entity domain.

---

## 10. View Component Contract

The view component (`{Entity}DetailView.tsx`) is the bridge between the resolver layer and the Engine component layer. It is a client component.

### Required structure

```typescript
// 1. All resolver calls wrapped in useMemo
const decision = useMemo(() => resolve{Entity}Decision(...), [...deps]);
const rawPrep  = useMemo(() => resolve{Entity}Preparation(...), [...deps]);
const rawStory = useMemo(() => resolve{Entity}Story(...), [...deps]);
const rawContext = useMemo(() => resolve{Entity}Context(...), [...deps]);

// 2. All translation transformation wrapped in useMemo
const prepItems    = useMemo(() => rawPrep.map(item => translate(item, t)), [rawPrep, t]);
const storyEvents  = useMemo(() => rawStory.map(event => translate(event, t)), [rawStory, t]);
const contextSections = useMemo(() => rawContext.map(section => translate(section, t)), [rawContext, t]);

// 3. Render Engine components with pre-translated strings only
<GunimiDecisionCard label={t("...")} action={t(decision.actionKey)} reason={t(decision.reasonKey)} />
```

### Prohibited view component patterns

- Passing locale keys to Engine components (translation must happen before passing)
- Calling resolver functions outside of `useMemo`
- Embedding business logic that belongs in resolvers
- Rendering entity-specific database fields directly as text without going through resolver output

---

## 11. Allowed Extension Points

The following extension points are explicitly permitted and expected as Gunimi grows:

1. **New entity Workspaces** — adding `lib/{entity}/` resolvers and `{Entity}DetailView.tsx` without changing Engine components
2. **New Decision action types** — extending `{Entity}ActionType` union and adding cases to resolver switches
3. **New Preparation items** — adding cases to the Preparation resolver switch
4. **New Story event types** — adding entries to `PRIMARY_TYPE_MAP` or deal/contact story logic
5. **New Context sections** — adding sections to the context resolver
6. **New locale keys** — adding keys to all three locale files simultaneously

### Prohibited extension patterns

1. Adding entity-specific logic inside Engine components
2. Moving type definitions from `lib/workspace/` back into entity domains
3. Creating a sixth question or a fifth tab without a Product Bible revision
4. Bypassing resolver output by passing raw database fields to Engine components
5. Creating duplicate type definitions across entity domains

---

## 12. Non-Negotiable Invariants

These invariants have no exceptions. Any proposed exception is a signal that the Blueprint needs to be revisited, not that the Contract should yield.

1. Every Workspace answers exactly five questions. No more. No fewer.
2. Every Workspace has exactly four tabs. No more. No fewer.
3. The Decision section shows exactly one recommendation. Never two.
4. No signal appears in both Situation and Decision.
5. Story is always chronological — oldest first.
6. No AI labels, Sparkles, or AI indicators appear in any Workspace.
7. No ISO timestamps appear in any Workspace — always natural language.
8. No CRM jargon appears in any Workspace.
9. Engine components never import from entity domains.
10. Resolver functions are pure — no side effects, no API calls, no DOM access.
11. All user-facing strings are translated — no hardcoded text in any component.
12. All locale keys exist in all three locale files simultaneously.

---

## 13. Relationship with Governing Documents

| Document | Role | Relationship to this Contract |
|----------|------|-------------------------------|
| Gunimi Product Bible | Constitution — why Gunimi exists | This Contract implements Product Bible principles in Workspace architecture |
| Workspace Principles | What every Workspace contains | This Contract operationalizes the Principles into specific requirements |
| Workspace Grammar | How every Workspace thinks | This Contract enforces Grammar through resolver and component rules |
| Workspace Blueprints | Entity-specific design for one Workspace | Blueprints are written against this Contract; conflicts resolve in favor of the Contract |

When a Blueprint says "do X" and this Contract says "never do X," the Contract takes precedence and the Blueprint must be revised.

When this Contract is silent on a topic, the Workspace Grammar is the next authority. When the Grammar is silent, the Workspace Principles. When the Principles are silent, the Product Bible.

---

## 14. Certification

A Workspace is certified when it satisfies all of the following:

| Requirement | Check |
|-------------|-------|
| Five sections implemented | All five questions answered in the correct section |
| Four tabs present | Overview, Story, Work, Context — in order |
| Signal suppression active | Situation suppresses signals claimed by Decision |
| Decision is one recommendation | Never more than one primary action |
| Story is chronological | First event is the origin; sorted oldest-first |
| Context is conditional | Sections shown only when they have entries |
| Header complete | All mandatory header elements present |
| No prohibited elements | No CRM jargon, no AI labels, no ISO timestamps, no raw DB fields |
| Resolver contract satisfied | Pure functions, locale-key output, workspace imports |
| Engine independence | Engine components import only from `lib/workspace` and `components/ui` |
| Quality gates passing | TypeScript zero errors, ESLint zero errors, build clean |
| Localization complete | All visible strings in en.json, sk.json, cs.json |

---

**Version:** 1.0
**Created:** 2026-07-10
**Authority:** Gunimi Product Bible v1.0 · Workspace Principles · Workspace Grammar v1.0
**Next review:** After Company Workspace Blueprint is created — audit this Contract against it for completeness
