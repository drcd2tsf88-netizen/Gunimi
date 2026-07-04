# 05 — Shadows & Lighting

## Core Rule

**Shadows in Gunimi never use black.** Every shadow is ambient purple. The interface is illuminated from within, and the purple glow is the light source.

This is not aesthetic — it is functional. Black shadows on dark backgrounds read as "holes". Purple ambient shadows read as "floating".

---

## Shadow Scale

| Token | CSS value | Usage |
|---|---|---|
| `--g-shadow-xs` | `0 1px 4px rgba(109,91,255,0.06), ring` | Inline elements, chips |
| `--g-shadow-sm` | `0 3px 12px rgba(109,91,255,0.09), ring` | Small cards, buttons |
| `--g-shadow-md` | `0 8px 28px rgba(109,91,255,0.13), ring` | Standard cards (default) |
| `--g-shadow-lg` | `0 16px 48px rgba(109,91,255,0.17), ring` | Dropdowns, popovers |
| `--g-shadow-xl` | `0 28px 70px rgba(109,91,255,0.22), ring` | Dialogs, command palette |

All shadow tokens include a `ring` — a `0 0 0 1px rgba(255,255,255,0.XX)` inset that reads as a surface definition layer. This adds "edge" to the card without adding a visible border.

---

## Glow Scale

Glows are not shadows — they emit light. Used for AI elements, primary CTAs, and focused UI components.

| Token | CSS value | Usage |
|---|---|---|
| `--g-glow-xs` | `0 0 8px rgba(109,91,255,0.20)` | Active icons |
| `--g-glow-sm` | `0 0 18px rgba(109,91,255,0.28)` | Hover on primary elements |
| `--g-glow-md` | `0 0 36px rgba(109,91,255,0.35)` | Primary buttons, active state |
| `--g-glow-lg` | `0 0 56px rgba(109,91,255,0.42)` | AI Core medium, large CTAs |
| `--g-glow-xl` | `0 0 80px rgba(109,91,255,0.50)` | AI Core hero, full-screen AI |
| `--g-glow-ai` | `0 0 28px rgba(34,211,238,0.30)` | AI-active indicators only |

---

## Lighting Tokens

Semantic lighting contexts. Each is a `background-image` radial-gradient that simulates a light source.

| Token | Effect | Usage |
|---|---|---|
| `--g-light-ambient` | Soft top-center violet wash | Page sections, hero backgrounds |
| `--g-light-focused` | Concentrated center circle | Loading states, AI Core context |
| `--g-light-ai-active` | Cyan center pulse | Cards when AI is running |
| `--g-light-ai-thinking` | Violet+cyan mixed | AI chat, during generation |
| `--g-light-hero` | Wide top-edge violet bloom | Landing hero, splash pages |
| `--g-light-card` | Soft top-left radial | Card hover ambient |
| `--g-light-hover` | Brighter top-left radial | Interactive card hover |

### Application

Lighting tokens are applied as `background-image` on a `pointer-events: none` absolutely-positioned overlay layer:

```tsx
{/* CARD LIGHTING OVERLAY */}
<div
  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
  style={{ backgroundImage: "var(--g-light-hover)" }}
/>
```

### Hover Lighting Progression

A card in its default state has `--g-light-card` at `opacity-0`. On hover, it fades to `opacity-100` over 500ms. This creates the "internal illumination" effect — the card doesn't just lift, it warms.

---

## When to Use What

| Scenario | Shadow | Glow |
|---|---|---|
| Default card | `--g-shadow-md` | none |
| Hovered card | `--g-shadow-lg` | none |
| Active/selected card | `--g-shadow-md` + `--g-border-active` | none |
| Primary button | `--g-shadow-sm` | `--g-glow-md` |
| Hovered primary button | `--g-shadow-md` | `--g-glow-lg` |
| AI indicator (idle) | none | `--g-glow-xs` |
| AI indicator (active) | none | `--g-glow-ai` |
| Dialog | `--g-shadow-xl` | none |
| Tooltip | `--g-shadow-lg` | none |
| AI Core (sidebar) | none | `--g-glow-sm` |
| AI Core (loading) | none | `--g-glow-lg` |
| AI Core (hero) | none | `--g-glow-xl` |
