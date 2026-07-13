# Gunimi — User Lifecycle

**Version:** 1.0
**Status:** Authoritative — do not implement against the codebase without reading this first
**Authority:** Gunimi Engineering Charter v1.0 · Gunimi Product Bible v1.0
**Created:** 2026-07-11

---

## Purpose

This document defines the complete lifecycle of a Gunimi user from first contact to active workspace usage. It is the single source of truth for the order, boundaries, and rules of each lifecycle phase.

Every future change to the registration flow, auth system, or onboarding experience must be evaluated against this document first.

---

## The Three-Phase Lifecycle

```
PHASE 1 — REGISTRATION
  ↓ Register (email + password)
  ↓ Verify email
  ↓ Confirm account (profile created)
  ↓ Waitlist confirmation
  ——————————————
  [Admin approval: platform_role → "beta"]
  ——————————————

PHASE 2 — ACCESS
  ↓ First login after approval
  ↓ Role check passes
  ↓ Membership check: no workspace found
  ↓ Workspace Provisioning
  ——————————————

PHASE 3 — WORKSPACE
  ↓ Today — morning briefing
  ↓ Active workspace use
  ↓ Relationship management, deals, tasks, notes
```

---

## Phase 1 — Registration

**Purpose:** Establish a verified identity. Nothing more.

**Routes:**
- `app/register/page.tsx` — email + password + full name form
- `app/register/verify/page.tsx` — "check your inbox" holding screen
- `app/register/complete/page.tsx` — email link lands here, creates/updates profile, redirects

**What happens:**
1. User submits registration form (`supabase.auth.signUp`)
2. Supabase sends verification email to `emailRedirectTo: /register/complete`
3. User clicks the link → arrives at `/register/complete`
4. Auth session is detected via `onAuthStateChange`
5. Profile row is created or updated in `profiles` table:
   - `platform_role: "user"` (default — no access)
   - `status: "active"`
   - `onboarding_completed: true`
6. Role is checked:
   - `"user"` → redirect to `/waitlist`
   - `"beta" | "team" | "admin"` → redirect to `/register/setup` (edge case: pre-approved users)
7. Invite token exception: if `orbit_invite_token` exists in localStorage, redirect to `/invite/{token}` instead. This user is joining an existing workspace — Workspace Provisioning does not apply.

**What does NOT happen in Phase 1:**
- No workspace is created
- No workspace membership is created
- No `createWorkspace()` is called
- No workspace-related UI is shown
- No "Synchronizing Workspace", "Preparing Workspace", "Initializing Workspace" messages

**Invariant:** A user who completes Phase 1 has:
- ✅ A verified auth account
- ✅ A `profiles` row
- ❌ No workspace
- ❌ No workspace membership
- ❌ No dashboard access

---

## Waitlist

**Purpose:** The holding state between registration and approval. The user exists but has no access.

**Route:** `app/waitlist/page.tsx`

**Who lands here:** Every new registrant whose `platform_role` is `"user"`.

**What happens here:** Nothing. The waitlist page is informational. It communicates that the user's account exists, their application is pending, and they will be notified when approved.

**What the waitlist page must never show:**
- Workspace creation progress
- Sync UI of any kind
- "Your workspace is ready" messaging
- Dashboard navigation or links

**How approval works:** An admin changes `platform_role` in Supabase from `"user"` to `"beta"` (or `"team"` or `"admin"`). No automated approval exists. This is intentional for Open Alpha.

**Invariant:** A user on the waitlist has:
- ✅ A verified auth account
- ✅ A `profiles` row with `platform_role: "user"`
- ❌ No workspace
- ❌ No workspace membership
- ❌ No dashboard access

---

## Phase 2 — Access & Workspace Provisioning

**Purpose:** Convert an approved user into an active workspace member for the first time.

**Trigger:** An approved user (`platform_role: "beta" | "team" | "admin"`) logs in and the dashboard layout detects they have no workspace membership.

**Route:** `app/register/setup/page.tsx`

**Entry paths:**
1. **Normal path:** Approved user logs in → `/dashboard` → `DashboardLayoutClient` checks role (pass) → checks membership (none found) → redirects to `/register/setup`
2. **Edge path:** User was pre-approved before their email was verified → `/register/complete` detects approved role → redirects to `/register/setup` directly

**What happens in `/register/setup`:**
1. Session is verified (if no session → redirect to `/login`)
2. Idempotency check: if workspace membership already exists (user navigated back here), activate it and go to `/dashboard`
3. `createWorkspace({ name: "My Workspace" })` is called
4. `setActiveWorkspace(workspace.id)` sets the cookie
5. User is redirected to `/dashboard`

**Idempotency:** The setup page is safe to visit multiple times. If a workspace already exists, it will never create a second one. It detects existing membership and forwards to the dashboard.

**What the setup page shows:**
- "Setting up your workspace..." — accurate, appropriate, expected here
- Progress indicator
- Success confirmation before redirect

**What happens in `DashboardLayoutClient` to enforce this:**
```
session found
  → profile fetched
  → status "suspended" → sign out → /login
  → role check: "user" → /waitlist
  → membership check: no membership → /register/setup   ← the new guard
  → render dashboard
```

**Invariant:** A user who completes Phase 2 has:
- ✅ A verified auth account
- ✅ A `profiles` row with `platform_role: "beta"` (or team/admin)
- ✅ A workspace (`workspaces` table row)
- ✅ An owner membership (`workspace_members` table row, `role: "owner"`)
- ✅ An active workspace cookie (`orbit_workspace_id`)
- ✅ Dashboard access

---

## Phase 3 — Workspace

**Purpose:** The user's permanent operating environment inside Gunimi.

**Entry:** Dashboard renders after successful Phase 2.

**First experience:**
- Today page (`app/dashboard/page.tsx`) — morning briefing
- Empty workspace state — no relationships, no deals, no contacts yet
- The workspace is named "My Workspace" (user can rename in Settings)

**No re-provisioning:** Once a workspace exists, the setup route is never triggered again. `DashboardLayoutClient` finds the membership and renders the dashboard directly on every subsequent login.

---

## The Invite Flow — Exception

Users who receive a workspace invite follow a different path that bypasses Workspace Provisioning entirely.

```
Invite email received
  ↓ Click invite link → /invite/{token}
  ↓ If not logged in → /login?invite={token}
  ↓ Log in → /invite/{token}
  ↓ Accept invite → workspace_members row created for existing workspace
  ↓ /dashboard
```

The invite flow:
- Does not create a new workspace
- Does not go through `/register/setup`
- Does not require `platform_role: "beta"` — invite acceptance is its own authorization

**How this is implemented:** In `app/register/complete`, if `orbit_invite_token` exists in localStorage, the user is redirected to `/invite/{token}` before the role check. This bypasses both the waitlist check and the provisioning flow.

---

## State Machine Summary

| State | `platform_role` | Has workspace | Can access dashboard |
|-------|----------------|---------------|---------------------|
| Just registered | `"user"` | ❌ | ❌ |
| On waitlist | `"user"` | ❌ | ❌ |
| Admin approved | `"beta"` | ❌ | Triggers provisioning |
| Provisioned | `"beta"` | ✅ | ✅ |
| Invited member | any | ✅ (existing) | ✅ |
| Suspended | any | any | ❌ (signed out) |

---

## File Map

| File | Phase | Responsibility |
|------|-------|---------------|
| `app/register/page.tsx` | 1 | Registration form |
| `app/register/verify/page.tsx` | 1 | Email verification holding screen |
| `app/register/complete/page.tsx` | 1 | Profile creation, role check, redirect |
| `app/waitlist/page.tsx` | Waitlist | Informational holding screen |
| `app/register/setup/page.tsx` | 2 | Workspace creation (approved users only) |
| `app/login/page.tsx` | 2/3 | Sign in, route to dashboard |
| `components/dashboard/DashboardLayoutClient.tsx` | 2/3 | Role guard + membership guard |
| `server/actions/workspace/createWorkspace.ts` | 2 | Workspace + membership row creation |
| `server/actions/workspace/setActiveWorkspace.ts` | 2 | Sets `orbit_workspace_id` cookie |

---

## Rules — What This Document Prohibits

**Rule 1:** `createWorkspace()` may never be called from `app/register/complete` or any page in the registration flow that does not first confirm `platform_role === "beta" | "team" | "admin"`.

**Rule 2:** The waitlist page may never show workspace-related UI. No sync messages. No progress indicators related to workspace creation.

**Rule 3:** The complete page may never show workspace-related UI. No "Initializing Workspace", "Synchronizing Workspace", "Preparing Workspace" messages.

**Rule 4:** `app/register/setup` must always verify session before calling `createWorkspace`. An unauthenticated call to this page redirects to `/login`.

**Rule 5:** `app/register/setup` is idempotent. It must check for an existing membership before creating a new workspace. A user who reaches this page twice must never end up with two workspaces.

**Rule 6:** The dashboard layout must always perform the membership check after the role check. The ordering is: session → profile → status → role → membership → render.

---

## Why These Rules Exist

Creating a workspace during registration was the original bug.

The consequence was: users who will never be approved (or will wait months for approval) had production workspaces created in their name immediately after email verification. The workspace was orphaned from the moment of creation. The user saw "Setting up your workspace..." before being told they were on the waitlist — which was confusing and architecturally wrong.

Workspace Provisioning is a distinct phase because the workspace is not a temporary artifact. It is the user's permanent operating environment. It should exist only when the user is admitted, active, and present to begin using it. Creating it speculatively is wasteful, misleading, and produces inconsistent state.

The phase boundary also makes the system predictable: if a user is on the waitlist, there is no workspace to clean up, no orphaned rows, no state to reconcile. Approval is a clean gate. Before: no workspace. After: workspace exists.

---

*This document is authoritative. Any change to the registration, waitlist, or provisioning flow requires updating this document as part of the same sprint. An implementation that contradicts this document is a bug, not a feature.*

---

**Version:** 1.0
**Created:** 2026-07-11
**Authority:** Gunimi Engineering Charter v1.0
