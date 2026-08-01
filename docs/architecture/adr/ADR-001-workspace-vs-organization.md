# ADR-001: Workspace vs Organization vs Business Entity

Status: Accepted
Date: July 2026
Authors: Michal Guoth, Gunimi Architecture

---

## Context

Early in Gunimi's design, the platform modeled "companies" as a single entity type.
A company the team works for internally (their own firm) and a company they sell to
or partner with externally were both stored as companies. This created an ambiguity:

- When a user from Company A logs in, they belong to "their" company.
- When they add Company B as a customer, Company B is a different kind of company.
- But Company B might also use Gunimi internally — making them both an external
  "company we sell to" from Company A's perspective and an internal "company that
  uses Gunimi" from their own perspective.

The naive solution — a single `companies` table with a type flag — fails because
the same entity can be both types simultaneously, from different relational positions.

The question also arose: if `Organization` represents the internal team using Gunimi,
and `Business Entity` represents external companies — what is a `Workspace`?

---

## Decision

Three distinct concepts, serving different purposes:

**Workspace** — The operational context within which a business perceives and manages
its reality. A Workspace is not a company. It is the frame through which one
organizational perspective views business reality. One company may have multiple
Workspaces (by department, region, or use case). One Workspace serves one perspective.

**Organization** — The structured internal group operating within a Workspace.
The Organization is the "we" — the team that uses Gunimi, makes decisions within
the Workspace, and owns the business reality captured there.

**Business Entity** — An external company, institution, or structured group that
participates in business reality as a counterpart. Customers, suppliers, partners,
investors. The Business Entity is the "them" — organizations that the Workspace
relates to from the outside.

### The inside/outside distinction

Organization is the inside perspective. Business Entity is the outside perspective.
These are never the same record, even when they refer to the same legal entity.

Example: Alza (a large retailer) may appear as:
- A **Business Entity** in the Workspace of a supplier who sells to Alza
- An **Organization** within Alza's own Gunimi Workspace (if Alza uses Gunimi)

From the supplier's perspective, Alza is "them." From Alza's own perspective,
Alza is "us." These are two different relational positions, and they produce two
different records — connected by a Relationship when both exist on the platform.

---

## Rationale

The alternative approaches considered:

**Option A: Single entity with a type flag**
```sql
companies (
  id, name, type ENUM('internal', 'external', 'both'),
  ...
)
```
Rejected because: The `'both'` case is architecturally undefined. A record that is
simultaneously "us" and "them" has no clear ownership, no clear permissions model,
and no clear memory model. The relational position is fundamental to the entity's
meaning.

**Option B: Inheritance model with a base `entity` table**
All company-like things inherit from a base entity. Internal and external variants
are subtypes.
Rejected because: The inheritance relationship implies a shared identity. But an
Organization and a Business Entity that happen to represent the same legal company
do not share identity — they share a legal registration number. Their operational
reality within Gunimi is completely separate.

**Option C: Three distinct entities (chosen)**
Organization, Business Entity, and Workspace serve distinct roles and are modeled
as such. When the same legal company appears in both positions, the two records
are linked by a Relationship of type `same_legal_entity`, maintaining the relational
distinction while acknowledging the real-world connection.

---

## Consequences

**Positive:**
- Clear data model: every record has an unambiguous identity and role
- Relationship between "us" and "them" versions of the same company can be explicitly
  modeled and tracked
- Role-aware presentation is simplified — the perspective is always clear

**Challenging:**
- More complex to explain during onboarding — "why are there two entries for Alza?"
  requires a brief explanation of the inside/outside model
- Merge/link workflow needed for the case where a Business Entity is discovered to
  also be an Organization

**Architectural commitment:**
This decision is stable. It correctly reflects how business reality works. The
same legal company genuinely is two different things in two different relational
contexts. Modeling this correctly is a prerequisite for relationship intelligence.

---

*Related: [DOMAIN_MODEL.md](../../foundation/DOMAIN_MODEL.md) — Organization,
Business Entity, Workspace entity definitions*
