---
name: gunimi-ship-check
description: Use before implementing any Gunimi feature AND before declaring it complete. Enforces localization policy, GDL compliance, quality gates, and zero-breaking-change discipline.
---

# Gunimi Ship Check

## Overview

Two mandatory gates for every Gunimi change — one before touching code, one before saying done.

**Announce at start:** "Running gunimi-ship-check."

---

## GATE 1 — Before Writing Any Code

Run this when a task is understood but no files have been modified yet.

### 1. Scope Map

List every file that will be created or modified. For each:
- Is it a client component? → needs `useTranslations`
- Is it a server component or action? → needs `await getTranslations`
- Does it show any text to the user? → locale keys required

### 2. Locale Pre-flight

For every visible string in the planned feature:
- Does a key already exist in `locales/en.json`?
- If not: add it to **all three files** — `en.json`, `sk.json`, `cs.json` — before writing the component
- Never write a component with a hardcoded string and "I'll add the key later" — do it first

**Namespace rule:** Top-level keys in locale files are namespaces. Use existing namespaces where possible. Never invent a new namespace without checking if an existing one fits.

### 3. GDL Compliance Check

Does the feature need any of these?
- A button → use `GunimiButton`
- A card → use `GunimiCard` or `GunimiMetricCard`
- A section wrapper → use `GunimiSection`
- An input → use `GunimiInput` or `GunimiField`
- A heading → use `GunimiHeading`
- An empty state → use `GunimiEmptyState`
- A select/dropdown → use Radix Select from `components/ui/select.tsx` — NEVER native `<select>`
- Tabs → use `GunimiWorkspaceTabs`

If a GDL component exists for the use case: use it. Do not create a page-specific variant.

### 4. Breaking Change Risk

For each file being modified:
- Is it a shared component used by multiple pages? → list which pages
- Is it a server action called from multiple places? → list callers
- Is it a type or interface? → list all consumers

**If any answer is "yes":** state the risk explicitly and confirm the plan is safe before proceeding. Do not silently modify shared code.

### 5. Data Layer Check

- Are any new Supabase queries needed? → use `maybeSingle()` where 0 rows is valid (never `.single()` on optional data)
- Is a schema change needed? → do NOT change schema unless explicitly requested. If schema change is needed: stop and discuss.
- Are new Server Actions needed? → follow existing pattern in `server/actions/`

---

## GATE 2 — Before Declaring Complete

Run this after all code is written, before saying "done", "hotovo", or anything implying success.

### 1. Localization Audit (the most common failure)

For every locale key added or modified, verify ALL THREE files have it:

```
REQUIRED CHECK — do not skip:
- grep "your.key" locales/en.json   → must exist
- grep "your.key" locales/sk.json   → must exist  
- grep "your.key" locales/cs.json   → must exist
```

Check for:
- Missing keys (key in en.json but not sk.json or cs.json)
- Orphan keys (key in locale files but never used in code)
- Hardcoded strings (any visible text in JSX not wrapped in `t("...")`)
- Wrong namespace (using `t("signals.types.x")` when namespace is `signalsPage`)

### 2. Console Cleanliness

Search the modified files for forbidden patterns:
- `console.log` → forbidden everywhere
- `console.debug` → forbidden everywhere
- `console.info` → forbidden everywhere
- `console.error` in client components → forbidden
- `catch (e)` or `catch (err)` where error is only logged → use `catch { }` instead

### 3. Quality Gates — ALL THREE must pass

Run in this order. If any fails: fix before proceeding.

```bash
npm run lint
```
Expected: 0 errors, no new warnings compared to before the change.

```bash
npm run type-check
```
Expected: 0 errors.

```bash
npm run build
```
Expected: exits 0, no compilation errors.

**The Iron Law:** Do not claim the feature is complete until you have seen the output of all three commands in the current session. "It should pass" is not evidence. Run them.

### 4. Runtime Checklist (if UI was changed)

- No hydration errors in browser console
- No unexpected 404 / 500 / 401 in Network tab
- No PGRST116 Supabase errors (use `maybeSingle()`)
- All icons, images, fonts load (200 OK)

### 5. Final Confirmation

Only after all gates pass, state:

```
gunimi-ship-check PASSED
- Locale keys: en ✓ / sk ✓ / cs ✓
- lint: 0 errors
- type-check: 0 errors
- build: clean
- Breaking changes: none / [described]
```

---

## Common Failure Patterns (from Gunimi history)

| What went wrong | Root cause | Prevention |
|---|---|---|
| Signal names in English in digest email | Wrong namespace path `msgs.signals?.types` instead of `msgs.signalsPage?.types` | Gate 2 locale audit |
| AI Next Action in English | Workspace language not fetched — `workspace.preferences` doesn't exist on type | Gate 1 data layer check |
| `logAIUsage` wrong signature | Called with positional args, not object | Gate 2 type-check |
| Build fails after "done" | Type error introduced in shared file | Gate 2 quality gates |
| sk.json missing diacritics | Copy-paste from en.json without proper SK translation | Gate 1 locale pre-flight |
| Native `<select>` introduced | New component written without checking GDL | Gate 1 GDL compliance |

---

## Gunimi Architecture Quick Reference

- **People:** `workspace_people` table (`workspace_contacts` is a VIEW — do not write to it)
- **Memories:** `workspace_memories` table — types: `context`, `commitment`, `relationship_pattern`, `outcome`
- **AI usage logging:** `logAIUsage({ workspaceId, userId, feature, inputTokens, outputTokens })` — object, not positional
- **AI feature types:** `"chat" | "brief" | "assistant" | "summary"`
- **Budget check:** always `checkAIBudget(workspaceId)` before any OpenAI call
- **Workspace language:** not on `getCurrentWorkspace()` type — query `supabaseAdmin` separately for `preferences`
- **Supabase admin:** `supabaseAdmin` for server actions, `supabase` (client) for components
- **Error transport:** Sentry (automatic) — never `console.error` in client code
