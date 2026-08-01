# ADR-002: People Model — workspace_people as Identity Layer

Status: Accepted
Date: July 2026
Authors: Michal Guoth, Gunimi Architecture

---

## Context

The initial implementation of Gunimi separated people into two categories:

- **Team members** — people who log in to Gunimi, modeled via `auth.users` and
  a `workspace_members` table
- **Contacts** — external people the team tracks in a `workspace_contacts` table

This created a structural split that doesn't match business reality. Business reality
contains a continuous spectrum of people:

- An employee who logs in daily
- A board member who never logs in but whose opinions are tracked
- A candidate in the hiring process who has no system access
- A supplier contact managed entirely by an account manager on their behalf
- A client who will eventually get a partner login
- An investor who attends quarterly reviews but has no day-to-day access

Under the split model, a person moves from `workspace_contacts` to `workspace_members`
when they get a login. This means:
- Their history is split across two tables
- Their relationships are tracked in two places
- The migration from "contact" to "member" is destructive

More fundamentally: this model says "a person exists when they have a login." This
is wrong. A person exists because they are real. Authentication is a property of
access management, not a condition of existence.

---

## Decision

**`workspace_people` is the unified Identity Layer for all humans in business reality.**

Every human being who exists in the context of a Workspace — regardless of whether
they have a Gunimi login — has a record in `workspace_people`. This table is the
canonical source of identity for all people.

Authentication, when it exists, is layered on top:
- `auth.users` remains the authentication layer (who can log in)
- `workspace_people` is the identity layer (who exists in business reality)
- `workspace_members` links a `workspace_people` record to an `auth.users` record,
  granting access and defining role within the Workspace

### The three-layer model

```
Identity:       workspace_people     ← exists in business reality
                                         (always)
     ↕ optional link
Access:         workspace_members    ← has access to this Workspace
                                         (when they have a login)
     ↕ linked to
Authentication: auth.users           ← can authenticate to Gunimi
                                         (when they have an account)
```

A person may exist at Layer 1 without Layers 2 or 3. This is normal and expected.

A person may exist at Layers 1 and 2 (they have access to this Workspace) without
an entry at Layer 3 in a different Workspace — because access is Workspace-scoped.

A person at Layer 3 without Layer 1 is an error — authentication without identity
is undefined within the business model.

### workspace_contacts as a view

The historical `workspace_contacts` concept becomes a role-filtered view of
`workspace_people`. A "contact" is not a different kind of person — it is a
Person in the role of external contact within a specific Workspace context.

```sql
-- Contacts are people who have an external relationship but no Workspace access
CREATE VIEW workspace_contacts AS
  SELECT wp.*
  FROM workspace_people wp
  LEFT JOIN workspace_members wm ON wm.person_id = wp.id
  WHERE wm.id IS NULL;
```

This provides backward compatibility for surfaces that think in terms of "contacts"
without requiring a separate entity.

---

## Rationale

**Why not keep the split model?**

The split model is a software convenience. It matches how many CRM tools work.
It does not match how business reality works.

In business reality, "people we work with" is a spectrum. The line between "team
member" and "contact" is blurry and changes over time. A supplier contact becomes
a hire. A client becomes an advisor. An investor becomes a board member. Each
transition should be a lifecycle event, not a database migration.

**Why not just use auth.users for everyone?**

`auth.users` is an authentication table. It governs who can log in. Giving every
person in a business's network a Gunimi login for the purpose of tracking them is:
- A data model error (authentication is not identity)
- A practical impossibility (most contacts will never have accounts)
- A security concern (authentication scope should be minimal)

**Why workspace_people?**

Because the question the identity layer answers is: *"Who exists in this business's
reality?"* — not *"Who can log in?"*

This matches how real businesses think. A company maintains a record of every person
they have a relationship with — employees, contractors, clients, partners, advisors,
candidates, board members — regardless of what software those people have access to.

---

## Consequences

**Positive:**
- Complete relationship history for all people, regardless of authentication status
- Lifecycle transitions (contact → member, employee → advisor) are Events, not migrations
- AI can reason about the full people graph, not just the subset with logins
- Relationship intelligence covers all people, not just "contacts"

**Challenging:**
- Requires migration of existing `workspace_contacts` data into `workspace_people`
- Backward compatibility requires the `workspace_contacts` view for existing surfaces
- More complex onboarding explanation: "everyone in the system" vs "everyone who logs in"

**Timing:**
This migration must be completed before the first paying customer. The cost of
migrating with one customer is multiplicatively higher than migrating before any.

**Architectural commitment:**
`workspace_people` as the Identity Layer is a permanent architectural decision.
It correctly models the spectrum of human relationships in business reality.

---

*Related: [DOMAIN_MODEL.md](../../foundation/DOMAIN_MODEL.md) — Person, Identity entity definitions*
*Related: [DOMAIN_LAWS.md](../../foundation/DOMAIN_LAWS.md) — Law VI (Identity independent of authentication), Law XI (one record per person)*
