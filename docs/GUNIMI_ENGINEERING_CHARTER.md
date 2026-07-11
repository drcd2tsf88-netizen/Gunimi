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
