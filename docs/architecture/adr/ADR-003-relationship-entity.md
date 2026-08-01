# ADR-003: Relationship as a First-Class Entity

Status: Accepted
Date: July 2026
Authors: Michal Guoth, Gunimi Architecture

---

## Context

The initial data model represented relationships as foreign keys:

```sql
workspace_contacts (
  company_id UUID REFERENCES workspace_companies(id),
  ...
)

workspace_deals (
  contact_id UUID REFERENCES workspace_contacts(id),
  company_id UUID REFERENCES workspace_companies(id),
  ...
)
```

This is how most CRM systems work. It is how most relational databases are taught.
It is also fundamentally wrong for modeling business reality.

The problem: a foreign key models a static reference. A Relationship in business
reality is a dynamic, temporal, typed, confidence-weighted fact.

Consider what we cannot express with foreign keys:

- "Jan Novak worked for Alza from January 2019 to August 2023, as Head of Procurement,
  originally introduced through a partner referral from Company X"
- "Jan Novak now works for ČSOB, but still has informal influence over Alza purchasing
  decisions through his successor, Petra Kováčová"
- "The relationship between Company A and Company B is currently strained following
  a contract dispute in Q2 2025 — the primary contact has changed twice"

None of these can be represented by `contact.company_id = some_uuid`. A foreign key
does not have:
- A type (employment, partnership, advisory, ownership...)
- A status (active, historical, uncertain, contested)
- A valid period (when did this connection hold?)
- A confidence level (how certain are we?)
- A source (what evidence supports this?)
- A history (how has this connection evolved?)

Every piece of business intelligence that makes Gunimi genuinely useful depends on
relationships being rich, temporal, and traceable — not just references.

---

## Decision

**Relationship is a first-class entity with its own table, lifecycle, and history.**

```sql
workspace_relationships (
  id              UUID PRIMARY KEY,
  workspace_id    UUID NOT NULL,
  type            TEXT NOT NULL,           -- employment, partnership, advisory...
  status          TEXT NOT NULL,           -- active, historical, uncertain
  entity_a_type   TEXT NOT NULL,           -- person, company, deal...
  entity_a_id     UUID NOT NULL,
  entity_b_type   TEXT NOT NULL,
  entity_b_id     UUID NOT NULL,
  direction       TEXT DEFAULT 'bidirectional',
  valid_from      DATE,
  valid_to        DATE,                    -- NULL = currently active
  confidence      NUMERIC(3,2) DEFAULT 1.0, -- 0.0 to 1.0
  source          TEXT,                    -- how this was established
  context         JSONB,                   -- additional structured context
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  created_by      UUID                     -- person who established this record
)
```

### Relationship types

Initial type vocabulary (extensible):
- `employment` — person works at organization/business entity
- `advisory` — person advises organization/business entity
- `board_membership` — person serves on board of organization/business entity
- `partnership` — business entity partners with business entity
- `ownership` — person or entity owns stake in business entity
- `client` — business entity is client of workspace organization
- `supplier` — business entity is supplier to workspace organization
- `investment` — person or entity has invested in business entity
- `referral` — one entity introduced another entity to the workspace

### Backward compatibility

Existing surfaces that use `contact.company_id` continue to work — but they are
now resolved through a Relationship query rather than a direct join:

```sql
-- Old: SELECT * FROM contacts WHERE company_id = $1
-- New: resolved through the relationship graph
SELECT p.*
FROM workspace_people p
JOIN workspace_relationships r ON r.entity_a_id = p.id
WHERE r.entity_b_id = $company_id
  AND r.type = 'employment'
  AND r.status = 'active'
  AND r.workspace_id = $workspace_id;
```

This is a more expensive query at small scale. It is the correct query at any scale
where relationship intelligence matters.

---

## Rationale

**Why not keep foreign keys and add metadata tables?**

A hybrid approach — keep `contact.company_id` for the "primary" relationship and add
a separate `relationship_history` table for complexity — creates two sources of truth.
When the foreign key and the Relationship table disagree, which is correct? This is
a fundamental data integrity problem with no clean resolution.

**Why not model relationships as graph edges in a dedicated graph database?**

A graph database (Neo4j, etc.) is an excellent fit for relationship intelligence at
extreme scale. However:
1. It introduces a second database system with its own consistency guarantees
2. Supabase/PostgreSQL supports graph-like traversal through recursive CTEs
3. The complexity is premature for Open Alpha and early growth
4. The schema defined here is designed to migrate to a graph database if needed —
   the conceptual model is graph-native; the storage is relational for now

**Why not just add more columns to the existing contact/company tables?**

Columns like `relationship_type`, `relationship_since`, `relationship_confidence`
on the contact table would handle the simple case. But:
1. They cannot represent multiple simultaneous relationships between two entities
2. They cannot represent relationships between two companies (no "person" involved)
3. They cannot represent the full graph (a person may have relationships to dozens
   of entities; a foreign key can only point to one)

The only correct model is a first-class Relationship entity.

---

## Consequences

**Positive:**
- Relationship graph becomes a primary intelligence source for AI
- Temporal queries ("who did Jan work with in 2022?") are naturally supported
- Multiple simultaneous relationship types between the same entities are possible
- Relationship history and evolution are first-class, not reconstructed from logs
- Signal generation can be relationship-aware from the foundation

**Challenging:**
- More complex queries for simple "who is this person's company?" lookups
- Migration path needed from existing `contact.company_id` foreign keys
- UI surfaces that display relationship context need updating

**Performance note:**
Relationship queries are join-heavy. Appropriate indexes on `(workspace_id, entity_a_id)`,
`(workspace_id, entity_b_id)`, and `(workspace_id, type, status)` are required from
the start. Graph traversal for multi-hop relationships uses recursive CTEs with depth
limits to prevent runaway queries.

**Timing:**
The full Relationship table migration is an enterprise capability milestone. However,
the conceptual model — Relationship as first-class entity — is adopted immediately.
All new features are designed against this model, even if the underlying data is
still resolved through foreign keys in the interim. The foreign keys are deprecated,
not extended.

---

*Related: [DOMAIN_MODEL.md](../../foundation/DOMAIN_MODEL.md) — Relationship entity definition*
*Related: [DOMAIN_LAWS.md](../../foundation/DOMAIN_LAWS.md) — Law III (Relationship has at least two participants), Law IV (Events are immutable)*
*Related: [ADR-002](ADR-002-people-model.md) — workspace_people as Identity Layer*
