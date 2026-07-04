# OrbitDesk

OrbitDesk is an AI-first Workspace Operating System.

OrbitDesk is NOT a CRM.

OrbitDesk is NOT a Notion clone.

OrbitDesk combines:

- Companies
- Contacts
- Deals
- Tasks
- Notes
- Email
- Relationship Intelligence
- Orbit Intelligence

---

# Product Vision

OrbitDesk helps businesses manage:

- relationships
- knowledge
- communication
- opportunities

inside a single workspace.

Focus on productivity, context and intelligence.

---

# Tech Stack

- Next.js 15
- TypeScript
- Supabase
- TailwindCSS
- next-intl
- Server Actions

---

# Orbit OS Design System

Always use existing Orbit OS components.

Prefer:

- OrbitPage
- OrbitSection
- OrbitHeading
- OrbitCard
- OrbitMetricCard
- OrbitTimeline
- OrbitDialog
- OrbitTable
- OrbitEmptyState

Do not create duplicate UI systems.

Do not introduce page-specific design patterns.

---

# Localization — Rule #1

**Never ship user-facing text as hardcoded strings.**

Every visible string must live in `locales/en.json`, `locales/sk.json`, and `locales/cs.json`.

---

## LOCALIZATION POLICY

1. **No hardcoded strings** — ever. Not in server components, not in client components, not in data arrays.
2. **Three locales required** — every key added to `en.json` must also exist in `sk.json` and `cs.json` with an authentic translation.
3. **Server components** use `const t = await getTranslations('namespace')` from `next-intl/server`.
4. **Client components** use `const t = useTranslations('namespace')` from `next-intl`.
5. **Data arrays with text** use `t.raw('key') as SomeType[]` — never inline hardcoded arrays.
6. **Brand terms NOT translated**: Gunimi, AI Core, Workspace, Command Center, Memory, Observatory, Automation, Gunimi AI, Living Workspace, Living Interface — these stay as-is.
7. **No missing keys, no orphan keys, no duplicate keys** across all three locale files.
8. **Localization audit before commit**: confirm every visible string has a key in all three locales.

---

# Internationalization

Never hardcode user-facing text.

Always use next-intl.

All labels, buttons, descriptions and headings must be translatable.

---

# Code Quality

Always write production-ready code.

Never create V1 implementations.

Never introduce temporary solutions.

Never duplicate existing logic.

Prefer reusable abstractions.

Avoid unnecessary complexity.

Preserve existing architecture.

---

# Data Layer

Do not change database schema unless explicitly requested.

Do not modify business logic unless explicitly requested.

Preserve existing Server Actions architecture.

---

# UI Standards

OrbitDesk is:

- premium
- enterprise
- minimal
- dark-first
- AI-native

Avoid visual clutter.

Favor consistency over creativity.

---

# Refactoring Rules

Before making large changes:

1. Analyze codebase.
2. Generate report.
3. Generate migration plan.
4. Wait for approval.
5. Execute changes.

Never refactor the entire repository without approval.

---

# Production Logger Policy — Rule #2

**Production must never output developer logging to the browser console.**

## Rules

1. **`console.log`, `console.debug`, `console.info`** — forbidden in all files. No exceptions.
2. **`console.error` in client components** — forbidden. Errors must be captured by Sentry (automatic) or surfaced via toast. Never via console.
3. **`console.error` in server actions / API routes** — permitted only for unexpected infrastructure failures. Use `logger.error()` from `lib/logger.ts`.
4. **`console.warn` in server code** — permitted only for optional config degradation. Use `logger.warn()`.
5. **All catch blocks** — use `catch { }` (no variable) unless the error object is actually used. Never log caught errors in client code.
6. **Sentry is the error transport** — not the console. Sentry captures all unhandled rejections and error boundaries automatically.

## Logger

Use `lib/logger.ts` in server-side code. Never import it in client components.

---

# Engineering Quality Gates — Rule #3

A feature is **not complete** until ALL of the following pass:

| Gate | Command / Check |
|------|----------------|
| TypeScript | `npm run type-check` — zero errors |
| ESLint | `npm run lint` — zero errors, no new warnings |
| Production Build | `npm run build` — compiles clean |
| Localization Audit | Every visible string in all three locale files |
| GDL Compliance | Uses OrbitOS components, no page-specific design patterns |
| Runtime Audit | Browser DevTools console clean, no avoidable errors |

## Runtime Audit Checklist

Before marking any feature complete, open the browser with DevTools and verify:

- [ ] Console: no `console.log`, no `console.error`, no unhandled rejections
- [ ] Network: no unexpected 404, 500, 401, 403
- [ ] React: no hydration errors, no failed suspense boundaries
- [ ] Supabase: no PGRST116 errors (use `maybeSingle()` where 0 rows is valid)
- [ ] Assets: all referenced icons, fonts, images return 200

---

# Mission

Build a production-ready AI Workspace Operating System.

Every implementation must be scalable, maintainable and enterprise-ready.

---

1. npm run lint
2. npm run type-check
3. npm run build

before commit.

No commit should be produced if any of the three commands fail.

Deployment-ready code only.