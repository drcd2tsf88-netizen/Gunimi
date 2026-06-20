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