# Gunimi — AI-First Workspace Operating System

**Version 2.0 — August 2026 — Confidential**

---

## Executive Summary

Gunimi is an AI-native workspace operating system built for modern businesses. It replaces the fragmented stack of CRM tools, project management apps, email clients, calendar apps, and note-taking systems with a single, intelligent workspace that understands the full context of a business — its people, relationships, deals, tasks, communication, signals, and meetings.

Gunimi is not a CRM. It is not a Notion clone. It is a living workspace that learns, observes, and surfaces intelligence automatically — so teams can focus on relationships and execution, not on data entry.

**Current status:** Open Beta. Actively used in production. Full feature set operational.

---

## The Problem

Modern business teams operate across 5–10 disconnected tools simultaneously:

- **CRM** (HubSpot, Pipedrive) — contacts and deals, but no real intelligence
- **Project management** (Linear, Asana, Monday) — tasks and execution, isolated from relationships
- **Note-taking** (Notion, Obsidian) — knowledge, disconnected from context
- **Email** (Gmail, Outlook) — communication, invisible to the rest of the stack
- **Calendar** (Google Calendar) — meetings with no CRM context
- **Analytics** (dashboards) — reactive, not proactive

The result: context is lost at every handoff. Deals stall silently. Relationships decay unnoticed. Teams spend more time managing tools than managing work.

---

## The Solution

Gunimi unifies the entire business context into one workspace:

```
Companies → Contacts → Deals → Tasks → Notes → Email → Calendar → Intelligence
```

Every entity connects to every other. Every interaction generates a signal. Every signal feeds the intelligence layer. The workspace learns over time and surfaces what matters — without being asked.

### Core Principles

- **Context first** — every piece of information is linked to people, companies, and deals
- **Intelligence by default** — the system observes and surfaces, the user doesn't configure
- **AI native** — not AI added on top, but AI woven into every layer
- **Minimal surface** — premium, enterprise-grade UI with no visual clutter
- **Workspace, not app** — a living environment, not a static tool

---

## Core Modules

### 1. Contacts (Relationship Management)

Full contact lifecycle management built on `workspace_people` — Gunimi's core people graph.

**Features:**
- Complete contact profiles (name, email, phone, position, company, status, notes)
- Priority flagging with visual indicators
- Status lifecycle: Lead → Active → Won
- Tag system with color-coded labels and AI-generated tag intelligence
- Bulk operations: multi-select, bulk tag, bulk delete, merge duplicates
- CSV import
- **Relationship Health Score** — automatic 0–100 score per contact based on:
  - Email recency and frequency (last 30 days)
  - Active deals
  - Open tasks
  - Tiers: Healthy (≥60) / Watching (30–59) / At Risk (10–29) / Cold (0–9)
- **Upcoming Meetings** — upcoming Google Calendar events with this contact shown on contact detail page (matched by email)

### 2. Companies

Company management with full relationship graph:
- Company profiles (name, industry, website, size, description)
- Linked contacts, deals, tasks, notes, orders
- Signal integration — company-level activity tracking
- Tag support and AI intelligence

### 3. Deals (Pipeline Management)

Sales pipeline with structured deal lifecycle:
- Deal title, value (EUR), stage, priority, linked contact and company
- Kanban + list views
- Stage tracking: Prospect → Qualified → Proposal → Negotiation → Closed Won / Lost
- Signal generation on deal creation, stage change, stall detection
- Full order history per deal

### 4. Tasks (Execution Layer)

Workspace-wide task management:
- Priority levels: High / Medium / Low
- Status: To Do / In Progress / Done
- Due dates with overdue detection
- Linked to contacts, companies, deals
- Assignee support across team members
- Signals generated for overdue tasks and completion events
- ⌘K quick create from anywhere in the workspace

### 5. Notes (Knowledge Layer)

Structured knowledge capture with rich text support:
- Tiptap-based rich text editor
- `#tag` and `@member` mention system with hover cards
- Linked to contacts, companies, deals
- Workspace-wide notes feed
- ⌘K quick create

### 6. Email (Communication Layer — V2)

Gmail-native email integration — full read and write:
- OAuth 2.0 connection (Gmail API — scopes: `gmail.readonly`, `gmail.send`, `userinfo.email`)
- Automatic thread sync and CRM linking (threads matched to contacts/companies by email address)
- **Email Command Center** — unified inbox with:
  - Unread priority widget
  - Follow-up detection (read thread, linked contact, no reply in 3+ days)
  - Recent threads with linked contacts and companies
  - Email Intelligence widget (CRM coverage rate, unread rate, top contacts/companies)
- **Compose & Reply:**
  - Reply to thread directly from within Gunimi
  - Compose new email to any recipient
  - AI-assisted draft — GPT-4o-mini generates body from relationship context (contact history, open deals, open tasks, last-contacted date)
  - Automatic `email_sent` Signal on every send
  - Scope upgrade flow with amber reconnect banner for existing users

### 7. Calendar (Meeting Intelligence Layer — V2)

Google Calendar integration with full CRM intelligence:
- OAuth 2.0 connection (Google Calendar API)
- Full event sync (read + write + update + delete)
- **Calendar Command Center:**
  - Month / Week / List view with unified overlay of tasks, deals, and calendar events
  - Google Calendar events shown in blue; tasks in violet; deals in emerald
  - Quick-add task directly in any day cell
  - Create new event from the workspace (title, date, start/end time)
  - Edit / delete synced Google Calendar events from within Gunimi
  - Meeting Intelligence widget — busiest day of week, total meeting hours, next meeting countdown, load assessment
  - Stats strip: upcoming meetings, this-week count, connected calendars, revenue meetings (CRM-linked)
- **Event Detail Panel (V2 intelligence):**
  - CRM contact linking — meetings automatically matched to contacts by organizer email
  - **AI Meeting Prep** — one-click GPT-4o-mini brief: relationship context summary, 3 suggested discussion topics, 2–3 key points drawn from open deals, open tasks, and last contact date
  - **Mark as Met** — one-click button creates a `meeting_held` signal for the linked contact; button turns emerald after logging
  - Create Meeting Note — auto-generates a note pre-filled with event title and description
  - Quick link to contact and company records
  - Edit event title and times in-panel; changes pushed to Google Calendar
- **Contact Detail integration:** Upcoming meetings card in contact Overview tab shows next scheduled meetings with that contact

### 8. Orders

Business order management linked to contacts, deals, companies:
- Order title, value, currency (EUR default), status
- State machine: Draft → Confirmed → Shipped → Delivered / Cancelled / Refunded
- Signal generation on order creation, confirmation, fulfillment
- ⌘K quick create, Email → Order conversion
- Full order history per contact, deal, and company

### 9. Tags

Cross-entity tagging system with AI intelligence:
- Color-coded labels (8 color variants)
- Applied to contacts, companies, deals, tasks, notes
- Tag detail page: all tagged entities in one view
- **AI Tag Intelligence** — GPT-4o-mini analyzes all tagged entities and generates a 2–3 sentence business insight about the tag cluster
- TagHoverCard for inline preview
- Mention system: `#tagname` in comments and notes

---

## Intelligence Layer

### Signal Engine

The Signal Engine is Gunimi's core intelligence infrastructure — a real-time event processing layer that observes all workspace activity and generates actionable signals.

**Architecture:**
- 25+ signal types across all entity domains
- Signal lifecycle: `active → resolved → expired`
- Deduplication and suppression logic
- Signal identity: `signalId`, `workspaceId`, `origin`, `correlationId`, `parentSignalId`
- Signal evolution (a signal can change state while maintaining identity)
- Explainability: every signal answers 7 questions (what, who, when, why, what changed, what to do, what if ignored)

**Signal categories:**
- Relationship signals: contact went cold, follow-up needed, deal stalled
- Execution signals: task overdue, deal without tasks, no recent activity
- Communication signals: email sent, email received, no reply in N days
- Meeting signals: meeting held (from Mark as Met), meeting upcoming
- Business signals: order confirmed, order shipped, deal won/lost
- Workspace signals: new member, new contact imported

**Scan Engine:**
- Vercel Cron: runs every 6 hours (`0 */6 * * *`)
- Scans all active workspaces
- Persists `lastRunAt` in workspace preferences
- `/api/signals/health` endpoint for monitoring
- Full observability: all scanners report real counts

### Relationship Health Score

Automatic 0–100 health score per contact. Computed from 4 signal sources:

| Signal | Max Points | Logic |
|---|---|---|
| Email recency | 40 | ≤7d=40, ≤14d=32, ≤30d=22, ≤60d=12, ≤90d=5 |
| Email frequency (30d) | 25 | 5+=25, 3+=18, 1+=10 |
| Total deals | 20 | 2+=20, 1=14 |
| Open tasks | 15 | 2+=15, 1=10 |

Rendered as a colored dot + score in the CRM contacts list. Batch computed — 3 parallel DB queries for all contacts, aggregated in TypeScript.

**Health tiers:**
- 🟢 Healthy (≥60): emerald — relationship is active
- 🟡 Watching (30–59): amber — needs attention soon
- 🔴 At Risk (10–29): red — relationship is decaying
- ⚫ Cold (0–9): zinc — contact has gone dark

### AI Meeting Prep

Per-event AI preparation brief triggered from the Calendar Event Detail Panel:
- Contact name, position, last-contacted date
- Open deals (title + stage)
- Open tasks
- GPT-4o-mini generates: context summary, 3 suggested topics, 2-3 key points
- On-demand (user-triggered), not pre-computed
- Language-agnostic output

### AI Tag Intelligence

Per-tag AI analysis using GPT-4o-mini:
- Analyzes all entities under a tag
- Detects patterns: industry clusters, deal stage concentration, stalled pipelines
- Available in workspace language (EN/SK/CS)

### AI Email Draft

Per-thread / per-compose AI email body generation:
- Pulls relationship context: contact name, position, last contacted, open tasks, active deals
- GPT-4o-mini generates a concise, professional email body
- Writes in workspace language (EN/SK/CS)
- No placeholder brackets — uses real data

### Business Memory Blueprint

A documented architecture for persistent workspace intelligence:
- 7 memory types (contact, company, deal, interaction, preference, signal, workspace)
- Memory identity contract (full traceability: source, confidence, created_by, version)
- Memory versioning (immutable history)
- Memory graph: Memory ↔ Signal ↔ Story ↔ Workspace
- AI Trust Boundary: defined list of what AI may never store

---

## Technical Architecture

### Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router, Server Components) |
| Language | TypeScript (strict) |
| Styling | TailwindCSS v4 |
| Backend | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth (email/password, magic link) |
| AI | OpenAI GPT-4o-mini (via openai SDK) |
| Email | Gmail API (OAuth 2.0), Postmark (transactional) |
| Calendar | Google Calendar API (OAuth 2.0) |
| Error tracking | Sentry |
| Deployment | Vercel (Edge + Serverless) |
| Internationalization | next-intl (EN / SK / CS) |
| Cron | Vercel Cron Jobs |

### Data Layer

```
workspace
├── workspace_people        (contacts — core people graph)
├── workspace_contacts      (SQL VIEW — backwards compatibility)
├── workspace_companies     (companies)
├── workspace_deals         (sales pipeline)
├── workspace_tasks         (execution layer)
├── workspace_notes         (knowledge)
├── workspace_orders        (business orders)
├── workspace_tags          (cross-entity labels)
├── workspace_teams         (organizational structure)
├── workspace_members       (user ↔ workspace membership)
├── email_connections       (Gmail OAuth tokens + scopes)
├── email_threads           (synced email threads)
├── email_messages          (individual messages)
├── calendar_connections    (Google Calendar OAuth tokens)
├── calendar_events         (synced calendar events)
├── signals                 (intelligence events)
├── comments                (tiptap-based with mentions)
└── dogfood_feedback        (internal quality monitoring)
```

`workspace_people` is the primary people graph. `workspace_contacts` is a SQL VIEW for backwards compatibility. All 37 server-side files reference `workspace_people` directly.

### Server Architecture

- **Server Actions** — all data mutations use Next.js Server Actions (no REST API for internal use)
- **supabaseAdmin** — server-side client with service role for all server actions
- **supabase (client)** — browser client with RLS-enforced user session for realtime
- **logger.ts** — server-side structured logging; zero `console.log` in production
- **Sentry** — all unhandled errors captured automatically; no console.error in client components

### AI Platform Architecture

11-layer AI platform documented in `docs/blueprints/AI_PLATFORM_ARCHITECTURE.md`:

1. Data Ingestion Layer
2. Signal Production Layer
3. Memory Layer
4. Context Assembly Layer
5. AI Budget Layer
6. Prompt Engineering Layer
7. Model Execution Layer
8. Response Processing Layer
9. Explainability Layer
10. Observability Layer
11. Trust & Safety Layer

**AI Budget Controls:**
- Per-workspace daily token limit (default: 100,000 tokens)
- Suspension kill switch (admin-level)
- `checkAIBudget()` called before every AI request
- Admin dashboard: risk bars, inline limit editor, suspend toggle
- Usage tracked per workspace per day

---

## Security

### Authentication
- Supabase Auth with email/password and magic link
- Session management via httpOnly cookies
- Server-side session validation on every request

### Row Level Security (RLS)
- All workspace data protected by PostgreSQL RLS policies
- Users can only access data within their workspace membership
- Service role (`supabaseAdmin`) used only in server actions — never exposed to client
- All client-side Supabase calls go through the session-bound client

### Email & Calendar OAuth
- Gmail and Google Calendar OAuth tokens stored in encrypted Supabase columns
- Access tokens refreshed automatically before expiry (60s window)
- Token revocation detected and handled (credentials cleared on next request)
- Scope upgrade flow with user-facing reconnect banner (e.g. adding `gmail.send`)
- Scopes stored per connection — scope-check before every write operation

### Admin Console
- 9-section admin console at `/dashboard/admin` with separate access control
- Audit log: every admin mutation logged with actor, action, timestamp, payload
- Broadcast system with banner + composer
- Workspace Manager with feature flags and AI budget controls
- User Manager with invite control

### Production Standards
- Zero `console.log` / `console.debug` / `console.info` in production
- Zero `console.error` in client components
- All errors routed to Sentry
- Sentry DSN configured and active
- All HTTP-only cookies, no localStorage for sensitive data
- CSP headers configured

### Content Security
- Dogfooding feedback system for internal quality monitoring
- Runtime audit: no PGRST116 errors (all queries use `maybeSingle()` where 0 rows is valid)
- No hydration errors, no failed suspense boundaries in production

---

## Scalability

### Database
- PostgreSQL via Supabase — battle-tested, ACID compliant
- Connection pooling via Supabase PgBouncer
- Indexes on all foreign keys and frequently queried columns
- RLS policies are performant (indexed on workspace_id + user_id)
- Horizontal scaling via read replicas (Supabase Pro+)

### Application Layer
- Vercel Edge Network — global CDN for static assets
- Serverless functions — auto-scaling, no cold-start penalty for API routes
- Server Components — minimal client JS bundle, server-rendered by default
- `Promise.all()` pattern — parallel data fetching on every page (no waterfall)

### AI Layer
- Per-workspace token budgets prevent runaway AI costs
- GPT-4o-mini — cost-efficient for high-frequency calls (tag intelligence, email drafts, meeting prep)
- On-demand generation for meeting prep and email drafts (no polling, no pre-computation)
- Response format: `json_object` for structured AI outputs — no parsing fragility

### Email & Calendar Sync
- Batch processing: 10 threads per batch (configurable)
- Incremental sync: `afterDate` filter on subsequent syncs
- Rate limit on sync endpoint
- Token refresh handled automatically in sync pipeline
- Calendar events synced on demand + on OAuth connect

### Cron Jobs
- Signal scan: every 6 hours, all workspaces
- Workspace-level `lastRunAt` persisted — idempotent scans
- CRON_SECRET protected endpoint

### Team Isolation (Architecture Ready)
- Current: all workspace members share full visibility (correct for SMB)
- V2 plan: per-workspace `team_isolation` boolean toggle
  - `false` (default): full shared visibility — no impact on collaborative teams
  - `true`: RLS team-scoped filtering, activated per enterprise customer request
- Architecture designed so small teams are never affected by enterprise isolation features

---

## Internationalization

- **3 languages**: English (EN), Slovak (SK), Czech (CS)
- **3,000+ locale keys** covering every visible string in the application
- `next-intl` — server and client components both covered
- Server components: `const t = await getTranslations('namespace')`
- Client components: `const t = useTranslations('namespace')`
- Cookie-based locale switching with SSR support
- AI responses generated in workspace language (EN/SK/CS)
- Zero hardcoded user-facing strings in production

---

## Admin Console

9-section platform administration dashboard at `/dashboard/admin`:

| Section | Capability |
|---|---|
| Hub | Platform overview, key metrics |
| Workspace Manager | All workspaces, feature flags, AI budget per workspace |
| User Manager | All users, invite control |
| AI Ops | Per-workspace token limits, suspension kill switch, risk visualization |
| Platform Health | System status, cron health, error rates |
| Invite Control | Global invite settings, pending invites |
| Broadcast | Platform-wide banner + message composer |
| Audit Log | Full admin action history with actor, action, payload |
| Dogfood | Internal feedback dashboard with categorized feedback |

All admin mutations are logged to the audit system.

---

## Design System (GDL — Gunimi Design Language)

Consistent, premium component library used across every page:

- `GunimiSection` — page section wrapper
- `GunimiHeading` — badge + title + subtitle pattern
- `GunimiCard` — card container with consistent border/bg
- `GunimiMetricCard` / `GunimiStatCard` — KPI display
- `GunimiButton` — primary / secondary / danger variants with loading state
- `GunimiInput` / `GunimiField` — form primitives
- `GunimiEmptyState` — consistent empty state pattern
- `GunimiWorkspaceTabs` — entity workspace navigation
- `GunimiDecisionCard` — AI suggestion display
- `GunimiPreparationCard` — meeting prep / context items
- `GunimiContextCard` — relationship context sections

**Design tokens:**
- Dark-first surface: `#080C14` base, `#060816` panel
- Violet primary: `#6D5BFF` / `#8B7DFF`
- Semantic colors: emerald (success/healthy), amber (warning/watching), red (danger/at-risk), zinc (neutral/cold), cyan (contacts), blue (meetings)
- Typography: Inter — 10px tracking labels to 24px headings
- Border: `border-white/[0.07]` — consistent subtle separation
- AI elements use violet with `Sparkles` icon; never labeled "AI"

---

## Product Roadmap

### Completed ✅

- ✅ Core CRM: Contacts, Companies, Deals
- ✅ Tasks with assignees, priorities, due dates
- ✅ Notes with rich text, `#tag` and `@member` mentions
- ✅ Tags with AI Intelligence (GPT-4o-mini tag cluster analysis)
- ✅ Email Command Center (Gmail sync + read)
- ✅ Email V2 — compose, reply, AI draft, `email_sent` signals
- ✅ Calendar V2 — Google Calendar sync, month/week/list view, create/edit/delete events
- ✅ Calendar AI Meeting Prep — context brief per event, GPT-4o-mini
- ✅ Calendar Mark as Met — one-click `meeting_held` signal
- ✅ Upcoming meetings on contact detail page
- ✅ Orders with signal integration, Email→Order, ⌘K create
- ✅ Signal Engine — 25 signal types, scan engine (every 6h cron)
- ✅ Relationship Health Score — 0–100, 4-signal model, dot + score in CRM list
- ✅ AI Brief — daily workspace intelligence summary
- ✅ AI Email Draft — context-aware, writes in workspace language
- ✅ AI Budget Controls — per-workspace daily token limit + kill switch
- ✅ Admin Console — 9 sections, full audit log
- ✅ Teams (organizational labels, UI, no-RLS V1)
- ✅ Domain Foundation — workspace_people graph, all 37 files migrated
- ✅ Workspace Preferences — language, AI language, regional, cookie-based switching
- ✅ Internationalization — EN/SK/CS, 3000+ keys, zero hardcoded strings
- ✅ Sentry error tracking — client + server
- ✅ Invite system — Resend email + copy-link fallback
- ✅ Command Center ⌘K — global quick-create for tasks, notes, emails, orders
- ✅ Dogfooding feedback system — internal quality loop

### Near-term

- 🔄 Business Memory Layer — persistent AI memory per workspace
- 🔄 Public REST API — external integrations
- 🔄 Webhooks for external events

### Planned (Post-Beta)

- 📅 Outlook / Microsoft 365 email + calendar integration
- 📅 Mobile-optimized views
- 📅 Team isolation V2 — per-workspace RLS toggle (enterprise)
- 📅 Gunimi Calendar — native calendar (independent of Google)
- 📅 Video meeting integration (Zoom, Google Meet context)

---

## Pricing Model

| Tier | Price | What's Included |
|---|---|---|
| **Free** | €0/month | Up to 200 contacts, basic CRM, tasks, notes — no AI, no signals |
| **Standard** | €29/user/month | Unlimited CRM, Signal Engine, Relationship Health, AI (limited budget), email sync |
| **Pro** | €79/user/month | Full AI (email draft, meeting prep, tag intelligence), orders, teams, AI Brief, calendar intelligence, priority support |
| **Enterprise** | Custom | Admin Console, audit log, custom AI budget, team isolation, SLA, SSO |

---

## Why Gunimi

### vs. HubSpot / Pipedrive
HubSpot and Pipedrive are CRMs first — they track deals and contacts but have no ambient intelligence, no meeting prep, no relationship health scoring, no email-to-signal bridge. Gunimi observes the entire workspace and surfaces signals proactively. No configuration required.

### vs. Notion / Obsidian
Notion is a knowledge tool. It has no concept of relationships, deals, signals, or AI that understands business context. Gunimi is built around entities and their connections — notes are linked to contacts, companies, and deals.

### vs. Linear / Asana
Task tools with no CRM, no relationship graph, no communication layer. Gunimi connects execution to relationships — tasks are linked to contacts, companies, deals, and generate intelligence signals.

### vs. Google Calendar + Gmail (standalone)
Calendar and email without CRM context. Gunimi integrates both and adds the intelligence layer: who you're meeting with, what deals are open with them, what tasks are pending, and an AI brief before every meeting.

### The Gunimi Difference
- **One workspace, full context** — contacts, deals, tasks, notes, email, calendar, orders in one place
- **Signal Engine** — proactive intelligence, not reactive dashboards
- **Relationship Health Score** — automatic, multi-signal scoring per contact
- **AI Meeting Prep** — context brief generated before every meeting with a CRM contact
- **AI that understands business context** — not a chatbot, but an embedded intelligence layer
- **Enterprise architecture** — RLS, audit logs, AI budget controls, admin console
- **Built for Europe** — Slovak/Czech/English, EUR currency, GDPR-aware architecture

---

## Technical Blueprints

Gunimi maintains formal architecture blueprints in `/docs/blueprints/`:

- `SIGNAL_ENGINE_BLUEPRINT.md` — 21 chapters, 25 signal types, Signal Identity contract
- `BUSINESS_MEMORY_BLUEPRINT.md` — 23 chapters, 7 memory types, AI Trust Boundary
- `AI_PLATFORM_ARCHITECTURE.md` — 15 chapters, 11 layers, 20 invariants
- `WORKSPACE_LIFECYCLE.md` — 4 workspace states, entry/exit conditions
- `DOMAIN_FOUNDATION_BLUEPRINT.md` — People graph architecture, 37-file migration

These blueprints are living documents — they precede implementation and govern all architectural decisions.

---

## Engineering Quality Standards

Every feature must pass all quality gates before shipping:

| Gate | Standard |
|---|---|
| TypeScript | `npm run type-check` — zero errors |
| ESLint | `npm run lint` — zero errors, zero warnings |
| Production Build | `npm run build` — clean compilation |
| Localization | Every visible string in EN + SK + CS |
| GDL Compliance | Uses Gunimi Design Language components only |
| Runtime Audit | DevTools console clean, no unhandled errors, no PGRST116 |

Production code standards:
- No `console.log`, `console.debug`, `console.info` anywhere in production code
- No `console.error` in client components — Sentry captures all errors
- All caught errors in client code use `catch { }` without variable binding
- All server errors routed to Sentry via `logger.error()`
- Every DB query that can return 0 rows uses `.maybeSingle()` — never `.single()`

---

*Gunimi — Your workspace understands you.*
