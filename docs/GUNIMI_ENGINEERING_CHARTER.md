# Gunimi Engineering Charter

## Mission

Gunimi is no longer in the architecture discovery phase.

The foundation is complete.

From this point forward the mission is:

> **Preserve. Extend. Polish. Scale.**

Not redesign.

---

## Current State

The following systems are considered stable and are frozen unless explicitly approved by the Product Bible.

### Workspace Engine v1.0

**Frozen.**

All future Workspaces extend the Engine.

The Engine itself is not modified unless a fundamental architectural issue is proven.

### Email Engine v1.0

**Frozen.**

Every email flow must use the existing provider abstraction.

No provider-specific code outside `lib/email`.

### Today Experience

**Frozen.**

The cognitive model is complete.

Future improvements extend it.

They never replace it.

### Workspace Grammar

**Frozen.**

Every Workspace answers exactly one question.

No section may violate Grammar.

### Workspace Contract

**Frozen.**

Every Workspace implementation must satisfy the Contract.

### Signal Engine v1.0

**Frozen.**

The Signal Archive is the single source of truth for every business signal.

Signals may only be created through `produceSignal()` exported from `lib/signals/index.ts`.

No code may:

- INSERT directly into `workspace_signals`
- Create a signal object outside the Engine
- Bypass `SIGNAL_REGISTRY` to assign tier, severity, or evidence keys
- Produce a signal that does not satisfy the Signal Contract

The registry is the authority for tier assignments, severity, evidence locale keys, TTL, and surface visibility. These values are defined once and never overridden at runtime.

### Release Gates

**Mandatory.**

Every sprint must pass every Quality Gate.

### Localization

Single localization system.

- No hardcoded UI strings.
- No missing locale keys.
- No duplicated translations.

### Logging

Single logging system.

- No `console.*` outside approved exceptions.
- Every server error uses structured logging.

### Workspace Provisioning

**A production workspace is created only after admin approval. Never during registration.**

The user lifecycle has three distinct phases. Each phase has a strict boundary:

| Phase | What happens | Route |
|-------|-------------|-------|
| **Registration** | Auth account + profile created | `app/register/complete` |
| **Waitlist** | User waits for approval | `app/waitlist` |
| **Provisioning** | Workspace created for the first time | `app/register/setup` |

These boundaries are enforced in code:

- `app/register/complete` — creates profile only. No workspace. No membership. Redirects unapproved users to `/waitlist`.
- `app/register/setup` — creates workspace. Called only when user has `beta | team | admin` role and no existing membership.
- `DashboardLayoutClient` — guards the dashboard by checking role, then membership. An approved user with no workspace is redirected to `/register/setup`.

**This rule exists because:**

A workspace is not a staging artifact. It is the user's permanent operating environment inside Gunimi. Creating it before approval means provisioning production infrastructure for a user who has not been admitted. If the access is later denied or revoked, the workspace is orphaned. If the user is approved months later, the workspace was created in a different state of the product.

**What this means for future development:**

- Never move `createWorkspace()` back into the registration flow.
- Never call `createWorkspace()` from a page that does not first verify `platform_role === "beta" | "team" | "admin"`.
- The invite flow is the only exception: users accepting workspace invites join an existing workspace directly. Workspace creation does not apply.

See `docs/architecture/USER_LIFECYCLE.md` for the complete lifecycle specification.

---

## Architecture Freeze

The following platform documents are now considered authoritative and frozen.

| Document | Location |
|----------|----------|
| Product Bible | `docs/GUNIMI_PRODUCT_BIBLE.md` |
| Engineering Charter | `docs/GUNIMI_ENGINEERING_CHARTER.md` |
| Workspace Principles | `docs/WORKSPACE_PRINCIPLES.md` |
| Workspace Grammar | `docs/WORKSPACE_GRAMMAR.md` |
| Workspace Contract | `docs/WORKSPACE_CONTRACT.md` |
| Workspace Engine | `lib/workspace/` + `docs/certification/` |
| Signal Engine Blueprint | `docs/blueprints/SIGNAL_ENGINE_BLUEPRINT.md` |
| Business Memory Blueprint | `docs/blueprints/BUSINESS_MEMORY_BLUEPRINT.md` |
| AI Platform Architecture | `docs/blueprints/AI_PLATFORM_ARCHITECTURE.md` |

Future implementation must extend these documents.

It must not redefine them.

Any proposal that changes the substance of one of these documents requires an **Architecture Review** before implementation.

### What "frozen" means

- The responsibilities, boundaries, and invariants defined in these documents are permanent.
- New capabilities are added by extending an existing layer — not by introducing a parallel one.
- A proposal that contradicts an invariant in any of these documents must be redesigned, not approved as an exception.

### What "Architecture Review" means

- The proposal must explicitly name which document it affects.
- It must explain why the existing architecture cannot satisfy the requirement.
- It must receive explicit written approval before implementation begins.
- The affected document must be updated as part of the implementation — not after.

### What this does not freeze

- Implementation details (specific resolver logic, specific signal thresholds, specific Memory confidence values).
- New additions that fit within the existing architecture (new signal types, new memory types, new Workspace types, new resolver functions).
- UI components and design decisions governed by the GDL.

Frozen means the **architecture** does not change. The product built inside that architecture can grow without limit.

---

## Architecture Principles

The architecture may evolve.

It may never fork.

If an existing subsystem already solves the problem: **extend it. Never duplicate it.**

There must only ever be:

- one Workspace Engine
- one Email Engine
- one Signal Engine
- one Today Engine
- one localization system
- one logging system
- one source of truth for shared Workspace types

---

## Development Philosophy

When implementing anything:

- Prefer extension over replacement.
- Prefer composition over duplication.
- Prefer reuse over invention.

Never redesign a working subsystem because another solution appears cleaner.

Redesign is only permitted if it is proven that the current architecture **cannot** satisfy the requirement.

---

## Production First

Every implementation must leave the product more production-ready than before.

- Never knowingly introduce technical debt.
- Never postpone regressions.

If a regression is introduced:

1. Stop.
2. Fix it immediately.
3. Continue only after the regression is removed.

---

## Quality Gates

Every sprint must finish with:

| Gate | Requirement |
|------|-------------|
| TypeScript | Zero errors |
| ESLint | Zero errors |
| Production build | Clean |
| Browser Console | Zero errors |
| Network | Zero failed requests |
| Runtime | Zero unhandled exceptions |
| Localization | Zero missing messages |
| Technical debt | None introduced |

No gate may be marked **PASS** without evidence.

---

## Regression Policy

Every final report must include:

- TypeScript regressions
- ESLint regressions
- Build regressions
- Browser regressions
- Runtime regressions
- Network regressions
- Localization regressions
- Performance regressions
- Technical debt introduced

If any regression exists: **the sprint is not complete.**

---

## Production Readiness Rule

Production Readiness Score may never decrease.

Every sprint must **maintain** or **increase** production readiness.

---

## Open Alpha Rule

Gunimi is approaching Open Alpha.

Every engineering decision must be evaluated from the perspective of a first-time customer.

Ask:

- Does this increase trust?
- Does this reduce uncertainty?
- Does this improve perceived quality?
- Does this preserve architectural consistency?
- Would this still work for 1,000 users?
- Would this still work for 10,000 users?

If the answer is no: **do not implement until resolved.**

---

## Documentation Rule

Every architectural decision that affects future development must be documented.

No critical knowledge may exist only inside implementation code.

---

## Definition of Done

A task is complete only when:

- [ ] Implementation is complete
- [ ] Architecture remains consistent
- [ ] Documentation is updated
- [ ] Localization is complete
- [ ] Quality Gates pass
- [ ] Release Gates pass
- [ ] No regressions exist
- [ ] Production readiness is maintained or improved

Passing TypeScript and Build alone does not mean a task is complete.

---

## Final Engineering Principle

The goal is no longer to build Gunimi.

The goal is to **preserve, evolve and scale Gunimi** without compromising quality.

Every completed sprint should make the codebase:

- cleaner,
- more maintainable,
- more consistent,
- easier to extend,
- harder to break,
- and more production-ready than before.
