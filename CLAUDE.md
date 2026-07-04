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