# Gunimi Blueprint — Domain Foundation v1.0

**Version:** 1.0  
**Status:** Foundational — permanent  
**Authority:** Gunimi Product Bible v1.0 · ADR-002 (People Model) · ADR-003 (Relationship Entity) · Domain Laws v1.0  
**Applies to:** Every human identity, relationship, and memory provenance record in Gunimi

> *"A foreign key records where a pointer was at one moment in time. A relationship records what was true, for how long, with what confidence, and why we believe it."*

---

## Preface

Gunimi was built quickly. The initial data model made the decisions that every early-stage CRM makes: people are rows in a contacts table, their company is a foreign key, their history is inferred from activity logs. This is fast to build. It is wrong to scale.

The Domain Foundation migration corrects three foundational errors before the first paying customer fills data into the incorrect model.

**Error 1 — Identity is conflated with authentication.**  
`workspace_contacts` exists as a table. `workspace_members` exists as a separate table. A person who logs in lives in one place. A person who does not live in another. When a contact gets a login, their history splits. When an employee leaves and becomes an advisor, they move tables. The system cannot reason about a person's complete history because the person does not have a complete record — they have fragments in multiple tables indexed by different keys.

**Error 2 — Relationship is modeled as a pointer.**  
`contact.company_id` is a UUID. It records a single company, at a single moment, with no type, no duration, no confidence, no source. The question "who did this person work with in 2022?" cannot be answered. The question "does this person still have influence at their former employer?" cannot even be asked. Business intelligence depends on relationships being rich, temporal, and traceable — not pointers.

**Error 3 — Memory has no chain of custody.**  
Business Memory records exist without a verifiable link to the events that produced them. A memory that cannot name its source cannot be trusted. An AI that produces memories without provenance cannot be audited. An enterprise that cannot explain why the system believes something will not use the system.

The Domain Foundation corrects all three errors. It does so in a way that preserves backward compatibility for all existing surfaces while establishing the correct architectural model for everything built afterward.

---

## Chapter 1 — The Three-Layer Identity Model

### The problem with the current split

Business reality contains a continuous spectrum of people. An employee who logs in daily. A board member who never logs in but whose opinions are tracked. A candidate in the hiring pipeline. A supplier contact managed entirely by an account manager. A client who will eventually receive a partner login.

Under the current model:
- People with logins: `workspace_members` + `auth.users`
- People without logins: `workspace_contacts`

When a contact receives a login, they move tables. Their history does not move with them. They now exist in two places, partially. This is not a migration problem — it is a conceptual error. The model says "a person exists when they have a login." This is wrong. A person exists because they are real. Authentication is a property of access management, not a condition of existence.

### The three-layer model

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1 — Identity                                         │
│  workspace_people                                           │
│  "Who exists in this business's reality"                    │
│  Always present. Authentication-independent.                │
└─────────────────────────────────────────────────────────────┘
           ↕ optional link (person_id FK)
┌─────────────────────────────────────────────────────────────┐
│  Layer 2 — Access                                           │
│  workspace_members                                          │
│  "Who has access to this Workspace"                         │
│  Present only when the person has a Gunimi login.           │
└─────────────────────────────────────────────────────────────┘
           ↕ linked to
┌─────────────────────────────────────────────────────────────┐
│  Layer 3 — Authentication                                   │
│  auth.users                                                 │
│  "Who can authenticate to Gunimi"                           │
│  Managed by Supabase Auth. Scope: login only.               │
└─────────────────────────────────────────────────────────────┘
```

A person may exist at Layer 1 without Layers 2 or 3. This is the normal case for all external contacts, suppliers, candidates, and advisors.

A person may exist at Layers 1 and 2 without being a member of a different Workspace — because access is Workspace-scoped.

A person at Layer 3 without Layer 1 is an error state. Authentication without identity is undefined within the business model.

### workspace_contacts as a backward-compatible view

The historical `workspace_contacts` concept does not disappear. It becomes a role-filtered view of `workspace_people`. A "contact" is not a different kind of person — it is a Person in the role of external contact within a specific Workspace context.

```sql
CREATE VIEW workspace_contacts AS
  SELECT wp.*
  FROM workspace_people wp
  LEFT JOIN workspace_members wm ON wm.person_id = wp.id
  WHERE wm.id IS NULL OR wm.id IS NOT NULL;
  -- Initially: all people (full backward compat)
  -- Future: filter by role as the model matures
```

All existing server actions, queries, and UI surfaces that reference `workspace_contacts` continue to work without modification. The VIEW is the backward-compatibility contract.

---

## Chapter 2 — workspace_people Schema

```sql
CREATE TABLE workspace_people (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

  -- Identity fields (from workspace_contacts)
  full_name         TEXT NOT NULL,
  email             TEXT,
  phone             TEXT,
  avatar_url        TEXT,
  job_title         TEXT,
  linkedin_url      TEXT,
  notes             TEXT,

  -- Classification
  tags              TEXT[]    DEFAULT '{}',
  custom_fields     JSONB     DEFAULT '{}',
  priority          BOOLEAN   DEFAULT false,

  -- Lifecycle
  status            TEXT      DEFAULT 'active',   -- active | archived
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW(),

  -- Deprecated FK (kept for backward compat during transition)
  -- Will be removed once workspace_relationships is the primary source
  company_id        UUID REFERENCES workspace_companies(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX workspace_people_workspace_id_idx ON workspace_people (workspace_id);
CREATE INDEX workspace_people_email_idx        ON workspace_people (workspace_id, email);
CREATE INDEX workspace_people_company_id_idx   ON workspace_people (workspace_id, company_id);
```

### workspace_members link to workspace_people

```sql
ALTER TABLE workspace_members
  ADD COLUMN person_id UUID REFERENCES workspace_people(id) ON DELETE SET NULL;

CREATE INDEX workspace_members_person_id_idx ON workspace_members (person_id);
```

The `person_id` link is nullable initially. It is populated for new members at onboarding. Existing members are linked via a backfill job that matches on email against `workspace_people`.

---

## Chapter 3 — workspace_relationships Schema

A Relationship is a first-class entity. It records what was true between two entities — with a type, a status, a valid period, a confidence level, and a source.

```sql
CREATE TABLE workspace_relationships (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,

  -- The two participants
  entity_a_type   TEXT NOT NULL,    -- person | company | deal
  entity_a_id     UUID NOT NULL,
  entity_b_type   TEXT NOT NULL,
  entity_b_id     UUID NOT NULL,

  -- Relationship definition
  type            TEXT NOT NULL,    -- see vocabulary below
  direction       TEXT NOT NULL DEFAULT 'bidirectional',  -- unidirectional | bidirectional
  status          TEXT NOT NULL DEFAULT 'active',         -- active | historical | uncertain

  -- Temporal bounds
  valid_from      DATE,             -- NULL = unknown start
  valid_to        DATE,             -- NULL = currently active

  -- Intelligence fields
  confidence      NUMERIC(3,2) DEFAULT 1.0,  -- 0.00 to 1.00
  source          TEXT,             -- how this was established
  context         JSONB DEFAULT '{}',

  -- Audit
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  created_by      UUID REFERENCES workspace_people(id) ON DELETE SET NULL
);

-- Indexes for relationship graph traversal
CREATE INDEX rel_workspace_a_idx ON workspace_relationships (workspace_id, entity_a_type, entity_a_id);
CREATE INDEX rel_workspace_b_idx ON workspace_relationships (workspace_id, entity_b_type, entity_b_id);
CREATE INDEX rel_type_status_idx ON workspace_relationships (workspace_id, type, status);
```

### Relationship type vocabulary

| Type | Meaning |
|---|---|
| `employment` | Person works at / worked at a company |
| `advisory` | Person advises an organization |
| `board_membership` | Person serves on board of an organization |
| `partnership` | Two business entities in a formal partnership |
| `ownership` | Person or entity owns stake in another entity |
| `client` | Business entity is client of workspace |
| `supplier` | Business entity is supplier to workspace |
| `referral` | One entity introduced another to the workspace |
| `investment` | Entity has invested in another entity |

### Seeding from existing FKs

On migration, all existing `workspace_people.company_id` FKs are converted to Relationship records:

```sql
INSERT INTO workspace_relationships (
  workspace_id, entity_a_type, entity_a_id,
  entity_b_type, entity_b_id,
  type, status, source
)
SELECT
  wp.workspace_id,
  'person', wp.id,
  'company', wp.company_id,
  'employment', 'active', 'migrated_from_fk'
FROM workspace_people wp
WHERE wp.company_id IS NOT NULL;
```

`company_id` on `workspace_people` is kept as a deprecated column during transition. It is not removed until all UI surfaces have been updated to resolve company association through the Relationship graph.

---

## Chapter 4 — Memory Provenance

Every Business Memory record must have a chain of custody — a verifiable link to the events, signals, or observations that produced it.

```sql
ALTER TABLE business_memories
  ADD COLUMN source_events JSONB DEFAULT '[]';
```

### source_events structure

```json
[
  {
    "type": "signal",
    "id": "sig_abc123",
    "signalType": "relationship_stale",
    "observedAt": "2026-08-15T09:00:00Z"
  },
  {
    "type": "email",
    "threadId": "thread_xyz",
    "subject": "Re: Q3 proposal",
    "receivedAt": "2026-08-14T14:22:00Z"
  }
]
```

A Memory with an empty `source_events` array is a Memory without provenance. The system must still function with unprovenance memories (for backward compat), but new memories produced after this migration must always carry at least one source event.

---

## Chapter 5 — Migration Execution Plan

### Phase 1 — Database (SQL, manual run in Supabase Dashboard)

**Migration file:** `20260827000001_domain_foundation.sql`

Steps in a single transaction:
1. Create `workspace_people` table
2. Copy all rows from `workspace_contacts` to `workspace_people`
3. Drop `workspace_contacts` table
4. Create `workspace_contacts` VIEW pointing to `workspace_people`
5. Add `person_id` column to `workspace_members`
6. Create `workspace_relationships` table with indexes
7. Seed relationships from `company_id` FKs
8. Add `source_events` column to `business_memories`

**Total estimated downtime:** Zero (all additive, VIEW replaces table with same name)

### Phase 2 — Type layer (code)

Update `types/contact.ts`:
- Keep `Contact` type shape identical (backward compat)
- Add `person_id?: string` field
- Document `company_id` as deprecated

### Phase 3 — Server actions (gradual, background)

High-traffic actions updated to query `workspace_people` directly:
- `getContacts`, `getContact`, `createContact`, `updateContact`
- `mergeContacts`, `bulkDeleteContacts`
- Signal producers that reference contacts

Low-traffic actions continue working via VIEW.

### Phase 4 — Cleanup (post-stability)

After 30 days of stable operation:
- Mark `company_id` on `workspace_people` as scheduled for removal
- Update all remaining actions to use Relationship graph queries
- Drop deprecated `company_id` column

---

## Chapter 6 — Invariants

These rules may never be violated by any implementation.

**Invariant I — Identity is independent of authentication.**  
A person in `workspace_people` has no required link to `auth.users`. The absence of an auth record does not make the person invalid.

**Invariant II — One record per person per workspace.**  
A person may not have two `workspace_people` records in the same workspace. Merge, do not duplicate.

**Invariant III — The VIEW is the backward-compatibility contract.**  
`workspace_contacts` as a VIEW must exist and must return valid data for as long as any server action or query references it. It may not be dropped until all references are removed.

**Invariant IV — Relationships are not foreign keys.**  
No new feature may model a relationship between two entities as a direct FK. The `workspace_relationships` table is the only correct place for inter-entity relationships.

**Invariant V — company_id is deprecated, not extended.**  
No new feature may write to `workspace_people.company_id`. Reading it for backward compat is permitted during the transition period only.

**Invariant VI — Memories must have provenance.**  
Any Memory produced by the AI layer after this migration must carry at least one entry in `source_events`. Provenance-free memories from before the migration are grandfathered; provenance-free memories produced after are a bug.

**Invariant VII — Relationships have temporal bounds.**  
A Relationship without `valid_from` is a Relationship whose start is unknown. This is valid. A Relationship that is `status='historical'` must have `valid_to` set. A historical relationship without an end date is inconsistent state.

**Invariant VIII — Person lifecycle transitions are Events.**  
Moving a person from "contact" to "member" is not a data migration — it is a lifecycle event. It is recorded as such. The person's `workspace_people` record does not change identity. A new `workspace_members` row is created with `person_id` pointing to the existing `workspace_people` record.

**Invariant IX — Relationship confidence is evidence-backed.**  
A Relationship with `confidence = 1.0` and `source = NULL` is an inconsistency. Full confidence requires a stated source. Relationships with unknown source must carry `confidence ≤ 0.8`.

**Invariant X — No orphan relationships.**  
A Relationship whose `entity_a_id` or `entity_b_id` no longer exists is invalid. Cascade deletes or soft-delete checks must prevent orphan relationship records.

**Invariant XI — workspace_people is the AI's primary people graph.**  
Every AI operation that reasons about people must query `workspace_people`, not `workspace_contacts`. The contacts view is for legacy surfaces only.

**Invariant XII — Migration is atomic or it does not happen.**  
The Phase 1 SQL migration runs in a single transaction. If any step fails, the entire migration rolls back. Partial domain foundation state is worse than no migration.

---

## Chapter 7 — What Does Not Change

- All existing UI components — they query via server actions, unaffected
- All existing server actions — they read via the VIEW, unaffected
- All existing API routes and webhooks
- The `Contact` TypeScript type shape (backward compat preserved)
- Signal Engine producers (still query `workspace_contacts` via VIEW)
- RLS policies (workspace_people mirrors workspace_contacts policies)

---

## Chapter 8 — What Changes Immediately

- `workspace_contacts` is a VIEW, not a table (transparent to callers)
- New contacts created via `createContact` are inserted into `workspace_people`
- New members onboarded receive a `workspace_people` record + `workspace_members` link
- Business Memories produced by the AI layer carry `source_events`
- Company association of a new contact creates both the deprecated FK and a Relationship record

---

## Chapter 9 — Post-Migration Unlocks

Once Domain Foundation is in place, the following become buildable:

**Teams / Oddelenia `#9`**  
Teams can be modeled as Relationship clusters. A team member's `workspace_people` record links to a `workspace_relationships` record of type `team_membership`. Teams do not require a `team_id` FK.

**Full Relationship Intelligence**  
AI can traverse the Relationship graph to answer: "Who in our network has worked with this person?" — a query that requires the graph, not a FK.

**Lifecycle Transitions as Events**  
Contact → Member transitions are Event records. AI can observe that a contact has become a team member and generate a signal.

**Memory Audit Trail**  
Enterprise customers can request a complete provenance chain for any Memory the system holds about a person. This is only possible with `source_events`.

---

*Authority: ADR-002 · ADR-003 · Domain Laws VI, III, II · Gunimi Product Bible*  
*Written: 2026-08-27*  
*Status: Approved for implementation*
