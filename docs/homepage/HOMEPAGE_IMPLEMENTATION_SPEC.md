# Homepage Implementation Spec
**Version 1.0 — Pre-implementation authority document**

Copy: `docs/homepage/HOMEPAGE_COPY_BIBLE.md`
Tokens: `docs/GUNIMI_VISUAL_TOKENS.md`
Design system: `docs/design-language/`

This document defines how the homepage is built. Every animation, every spacing value, every interaction. Where values reference `--g-*` tokens, use `docs/GUNIMI_VISUAL_TOKENS.md` as the source.

---

## Motion Philosophy

Motion exists to improve understanding.
Never to attract attention.

Every animation on this page must answer one of four questions before it ships:

**1. Where?** — Spatial orientation. Where is something moving to or from? Does the visitor need to track this movement to understand what changed?

**2. What changed?** — State transition. Is something different from what it was? Does motion make the change clear without requiring the visitor to notice it themselves?

**3. What is important?** — Hierarchy. Does this movement direct the visitor's attention to what matters most at this moment?

**4. What happens next?** — Progression. Does this motion lead the visitor toward the next meaningful action or reveal?

If a motion answers none of these four questions — remove it.

This is not a technical rule. It is the standard against which every animation decision is evaluated. "It looks nice" is not an answer to any of the four questions.

---

## Experience Budget

Performance budgets protect page speed.
Experience budgets protect visitor attention.

| Budget | Limit | Why |
|---|---|---|
| Maximum simultaneous animations | 3 | More than 3 competing motions creates visual noise, not experience |
| Maximum hero reading time | 15 seconds | If the hero requires more than 15 seconds to understand, the copy is too long |
| Maximum CTA decision time | 30 seconds | By Section 4, a visitor should have enough information to decide whether to act |
| Maximum section height | 100vh | No section exceeds one viewport without offering interaction or a clear visual exit |
| Maximum sections before first CTA | 4 | Hero is Section 1. First CTA opportunity: Section 4 (Proof Moment) |
| Maximum words per headline | 8 | Counted across both lines |
| Maximum words per body paragraph | 60 | Long paragraphs break reading rhythm on dark backgrounds |
| Maximum items in any list | 7 | Cognitive load limit for unordered feature lists |
| Maximum CTAs per section | 2 | Primary + secondary. Never three competing actions |

These are constraints, not guidelines. When a section violates an Experience Budget rule, the content is restructured — not the budget.

---

## Performance Budget

```
LCP (Largest Contentful Paint)    < 2.5s
CLS (Cumulative Layout Shift)     < 0.1
INP (Interaction to Next Paint)   < 100ms

Homepage JS bundle                < 200KB gzipped
AiCore (if canvas)                measure LCP impact before shipping
                                  fall back to CSS if LCP > 2.0s with canvas
Images                            next/image, WebP, lazy load below fold
Animations                        transform + opacity only — no layout triggers
Font                              Inter, subset, preload hero weight only
Critical CSS                      inline above-the-fold styles
```

---

## Global Implementation Rules

**Scroll animation pattern:**
```ts
viewport={{ once: true, margin: "-15%" }}
```
`once: true` — every section animates only on first entry, never on scroll back.
`margin: "-15%"` — triggers when element is 15% into viewport from the bottom edge.

**Reduced motion:**
```ts
const shouldReduceMotion = useReducedMotion(); // Framer Motion

const entrance = shouldReduceMotion
  ? {}
  : { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };
```

AiCore under reduced motion: static render, rings visible, no rotation, no particles.
Signal card under reduced motion: all fields visible immediately, no sequential fade.
All other scroll animations: content visible immediately at full opacity.

**Transition properties:**
Never use `transition: all`. Always specify properties:
```css
transition: background var(--g-duration-md), border-color var(--g-duration-md);
```

**Animation properties:**
Never animate layout properties (`width`, `height`, `padding`, `margin`).
Always animate `transform` and `opacity` only.

---

## Section 0 — Navbar

```
Height:       64px
Position:     sticky top-0 z-[20]
Background:   bg-[--g-bg]/80 backdrop-blur-md
Border:       border-b border-[--g-border]

Scroll opacity:
  0px scroll   → background opacity: 0
  80px scroll  → background opacity: 80%
  Transition:  background 200ms linear on scroll position

Left:
  Gunimi mark: 24px × 24px
  Wordmark: "Gunimi" — 14px, weight 600, color: --g-text

Right:
  "Join Open Alpha" button
  bg: --g-primary
  text: white, 13px, weight 500
  padding: 8px 16px
  radius: 10px
  hover: bg --g-primary-2, transition 150ms --g-ease

Mobile:
  Same layout. No hamburger. No mobile nav menu for Open Alpha.
```

---

## Section 1 — Hero

```
Height:         min-h-[100dvh]
Layout:         flex flex-col items-center justify-center
Background:     bg-[--g-bg]
Overflow:       hidden
```

**AiCore:**
```
Position:       absolute, centered, z-0
Size:           600px × 600px desktop / 400px × 400px mobile
Props:          showRings=true, showParticles=true, intensity="subtle"
aria-hidden:    true

Entrance:
  opacity: 0 → 1
  duration: var(--g-duration-ai-breathe) (1600ms, not 4500ms — use 2xl)
  Correction: use --g-duration-2xl (950ms). AiCore breathe is the ambient state.
  easing: linear
  delay: 0ms
```

**Content stack** (z-10, relative, flex col, items-center, gap-6, max-width: 720px):

```
Badge:
  Entrance: opacity 0 → 1, 400ms, delay 0ms
  Style: border border-[--g-border-hover] bg-[--g-surface] px-3 py-1 rounded-full
  Font: 11px, weight 500, tracking 0.08em, color: --g-muted
  Dot: 6px × 6px, bg --g-success, rounded-full, animate-pulse, mr-2

Headline (two lines):
  Entrance: opacity 0, y: 20px → 0, delay 200ms, duration 800ms, easing --g-ease
  Font: Hero XL (72px / 80px desktop, 40px / 48px mobile)
  Weight: 600, tracking -0.05em, color: --g-text
  Text-align: center

Product sentence (two lines):
  Entrance: opacity 0, y: 14px → 0, delay 400ms, duration 800ms, easing --g-ease
  Font: 22px / 32px desktop, 17px / 26px mobile
  Weight: 400, color: --g-muted
  Text-align: center

Descriptor:
  Entrance: opacity 0, delay 600ms, duration 600ms
  Font: Caption style (11px, weight 500, tracking 0.12em, uppercase)
  Color: --g-faint
  margin-top: 4px

CTA group:
  Layout: flex gap-3 desktop / flex-col gap-2 mobile
  Entrance: opacity 0, y: 8px → 0, delay 800ms, duration 600ms, easing --g-ease

  Primary button:
    bg: --g-primary
    text: white, 15px, weight 500
    padding: 12px 24px
    radius: 12px
    hover: bg --g-primary-2, scale(1.01), transition 150ms --g-ease
    active: scale(0.97), 80ms

  Secondary link:
    color: --g-muted, 14px
    underline, underline-offset: 4px, decoration-color: --g-border-hover
    hover: color --g-text, transition 150ms

Three data principles:
  Entrance: opacity 0, delay 1000ms, duration 400ms
  Font: 12px / 18px, color: --g-faint
  Layout: flex gap-4 desktop / flex-col gap-1 mobile
  Separator: · (desktop only, mx-2)
```

---

## Section 2 — Why Now

```
Padding: 120px 0 desktop / 80px 0 mobile
Max-width: 640px centered
```

**Eyebrow:**
```
Entrance: opacity 0 → 1, 400ms, on scroll trigger
Font: Caption (11px, uppercase, tracking 0.12em, color: --g-muted)
```

**Opening line:**
```
Font: 48px / 56px desktop, 30px / 38px mobile, weight 600, text-center
Entrance: opacity 0, y: 20 → 0, delay 100ms after eyebrow, 600ms, --g-ease
```

**Three evolution lines** (staggered):
```
Font: 16px / 26px, color: --g-muted, text-center
Entrance:
  Line 1: after opening line settles (600ms), delay 0ms, 400ms
  Line 2: delay 300ms from line 1
  Line 3: delay 300ms from line 2
  Each: opacity 0 → 1, y: 8 → 0, 400ms, --g-ease
```

**Pivot line:**
```
Font: 28px / 38px, weight 600, color: --g-text, text-center
Margin: 40px top and bottom
Entrance: opacity 0 → 1, scale 0.98 → 1, 600ms — after line 3 settles
```

**Body paragraphs:**
```
Font: 18px / 30px, color: --g-muted, max-width 600px, text-center
Entrance: paragraphs stagger 200ms, opacity 0, y: 12 → 0, 500ms each
```

**Closing statement:**
```
Font: 28px / 38px, weight 600, color: --g-text, text-center
Margin: 60px top
Entrance: last to appear, 400ms
```

**Reduced motion:** All text present at full opacity immediately.

---

## Section 3 — The Missing Layer

```
Padding: 120px 0 desktop / 80px 0 mobile
```

**Architectural diagram:**
```
Layout: three columns, total width 1200px, centered
        min-height: 280px

Left column — "Business Events" (4 items):
  Style: small tag — border border-[--g-border] bg-[--g-surface] px-2.5 py-1
         rounded-full, 12px, color: --g-muted
  Layout: flex-col, gap-2, align items to right edge
  Entrance: stagger 120ms each, opacity 0 → 1, x: -16 → 0, 400ms

Right column — "Business Understanding" (4 items):
  Same structure but:
  Border: rgba(109,91,255,0.25)
  Background: --g-primary-subtle
  Color: --g-primary-3
  Layout: align items to left edge
  Entrance: stagger 120ms, 200ms offset after left column, x: 16 → 0

Center line (Gunimi layer):
  Width: 2px
  Height: animates 0% → 100% after both columns, duration 600ms, --g-ease
  Background: linear-gradient(to bottom, transparent, --g-primary, transparent)
  Shadow: 0 0 12px 2px --g-primary-glow
  After draw: steady glow (no pulse loop)
```

**Body text:**
```
Max-width: 560px, centered, margin 60px top
Font: 18px / 30px, color: --g-muted
Each paragraph: fade in on scroll, stagger 200ms
```

**Pivot statement:**
```
Font: 28px / 38px, weight 600, color: --g-text, text-center
Margin: 60px top and bottom
```

---

## Section 4 — The Proof Moment

```
Padding: 120px 0 desktop / 80px 0 mobile
Background addition: radial-gradient(ellipse 600px 400px at center 50%,
                     rgba(109,91,255,0.04), transparent)
                     — behind card only
```

**Signal card:**
```
Width: 540px desktop / full-width with 24px margin mobile
Border: 1px solid --g-border
Background: --g-surface
Radius: --g-radius-lg (14px)
Padding: 20px 24px
Shadow: 0 0 0 1px --g-primary-subtle, 0 12px 40px rgba(0,0,0,0.5)

CRITICAL: This card must be visually identical to the signal card
used in /dashboard/today. Same border, background, typography, severity
indicator. The visitor must recognize it immediately on first open of Today.

Card entrance:
  opacity 0 → 1
  y: 24px → 0
  duration: 800ms
  easing: --g-ease

Internal sequential reveal — opacity only (no y transform inside card):
  0ms:    Header row (⚠ icon, title, ATTENTION chip) + deal name
  100ms:  WHY THIS APPEARED label
  140ms:  WHY THIS APPEARED value
  240ms:  Divider
  280ms:  EVIDENCE label
  320ms:  Evidence line 1
  380ms:  Evidence line 2
  440ms:  Evidence line 3
  540ms:  Divider
  580ms:  SUGGESTED ACTION label
  620ms:  Suggested action body
  760ms:  Divider
  800ms:  CONFIDENCE label
  840ms:  CONFIDENCE value

Each internal element: opacity 0 → 1, duration 300ms, easing --g-ease
All delays are relative to card entrance start.
Total reveal: ~1.1s after card enters.

Reduced motion: card appears at full opacity with all fields visible. No internal stagger.
```

**Card internal typography:**
```
Section labels (WHY THIS APPEARED, EVIDENCE, etc.):
  Font: 10px, uppercase, tracking 0.12em, color: --g-muted
  Margin-bottom: 6px

Section values:
  Font: 14px / 22px, color: --g-text

Header ⚠ chip (ATTENTION):
  Border: rgba(245,158,11,0.3)
  Background: rgba(245,158,11,0.10)
  Text: --g-warning (#f59e0b)
  11px, weight 500, px-2 py-0.5, rounded-full

Dividers: border-t border-[--g-border] my-3

CONFIDENCE value:
  Color: --g-success (#22c55e)
  High confidence = green. Never amber or red for "High".
```

**Card label:**
```
Font: 11px, color: --g-faint, text-center
Margin: 12px top
```

**Three lines:**
```
Font: 20px / 32px, weight 600, text-center, max-width 400px
Spacing: 48px between each line desktop / 36px mobile
Entrance: stagger 400ms between lines, opacity 0 → 1, 500ms each
```

**Architecture statement:**
```
Font: 14px / 22px, color: --g-muted, text-center, max-width 400px
Entrance: after third line appears, 400ms fade
```

---

## Section 4B — The Difference

```
Height: min-h-[60vh]
Layout: flex items-center justify-center
Padding: section-padding-y
```

**Six lines:**
```
Max-width: 560px, text-align: center
Font: 28px / 40px desktop, 22px / 32px mobile, weight 500

Pair spacing: 48px between each pair desktop / 36px mobile
Line spacing within pair: 1.4

Line 1 of each pair (Most software...): color --g-muted
Line 2 of each pair (Gunimi...):        color --g-text

Entrance: NONE.
The six lines are present immediately on scroll.
White space is the motion.

The typographic contrast between muted line 1 and bright line 2
carries all the rhythm. No animation is needed or permitted here.
```

---

## Section 5 — Today Intelligence

```
Padding: 120px 0 desktop / 80px 0 mobile
```

**Opening sentence — "Today begins where yesterday ended.":**
```
Font: 28px / 38px, weight 500, color: --g-muted, text-center
Entrance: first element in section, opacity 0 → 1, 600ms, before eyebrow
Margin-bottom: 40px
```

**Today page representation:**
```
Width: 480px desktop / full-width mobile
Layout: three stacked cards, gap-2

Each card: --g-surface, --g-border, --g-radius-lg (14px), padding 16px 20px

Section label: Caption font (11px, uppercase, tracking 0.12em, color: --g-muted)
Example item: 14px, color: --g-muted (one item per card)

Example item text — abstract only, no user data:
  Focus card:     "Deal requires follow-up · High priority"
  Attention card: "Relationship signal · 3 weeks inactive"
  Work card:      "Task overdue · Linked to active deal"

Card entrance: stagger 150ms, opacity 0, x: 20 → 0, 400ms, --g-ease
```

**Three pillars:**
```
Layout: three columns desktop / one column mobile, gap-12 desktop / gap-8 mobile
Per column max-width: 240px

Label: Caption font, color: --g-muted
Body: 14px / 22px, color: --g-muted

Entrance: stagger 200ms, opacity 0 → 1, y: 8 → 0, 400ms
```

---

## Section 6 — The Workspaces

```
Padding: 120px 0 desktop / 80px 0 mobile
```

**"Nothing exists in isolation.":**
```
Font: 18px, style: italic, color: --g-muted
Margin: 12px below headline / 12px above intro
Padding: 16px 0
Border: border-t border-b border-[--g-border]
Max-width: 400px, centered

This is the Workspace Engine motto.
It has its own contained visual weight — do not merge with headline or intro.
```

**Three workspace cards:**
```
Desktop layout: three columns, 1fr each, gap-4
Mobile layout:  horizontal scroll, scroll-snap-type: x mandatory
                Each card: min-width 80vw, scroll-snap-align: start
                24px right margin between cards

Per card:
  Background: --g-surface
  Border: --g-border
  Radius: --g-radius-lg
  Padding: 24px

  Status chip (top of card):
    Live: border rgba(34,197,94,0.3), bg --g-success-soft, text --g-success
    Content: "Live"
    Font: 11px, weight 500, tracking 0.06em, px-2 py-0.5, rounded-full

  Workspace type label: Caption, color: --g-muted, margin-top 8px
  Headline: Title font (17px, weight 600), color: --g-text
  Body: 14px / 22px, color: --g-muted

  NO workspace content preview. NO data values. NO fake records.
  Cards show only structural description (label + headline + body).

Entrance: stagger 150ms, opacity 0, y: 16 → 0, 500ms
```

---

## Section 7 — Email Intelligence

```
Padding: 120px 0 desktop / 80px 0 mobile
Layout: two columns desktop (5/12 text, 7/12 visual) / stacked mobile (visual second)
```

**Visual (right column):**
```
A Contact Workspace card (GDL card style, 480px width desktop)
with an email thread panel embedded inside.

Email thread panel:
  Shows 3 email header rows
  Per row: sender name (13px, weight 500) + subject (13px, color: --g-muted, truncate)
           + date (11px, color: --g-faint)
  Rows separated by border-b --g-border
  No email body content visible

This shows the integration structure — not content.

Entrance: opacity 0, x: 20 → 0, 600ms, --g-ease
```

---

## Section 8 — Business Memory

```
Padding: 140px 0 desktop / 100px 0 mobile
        (Extra vertical space — this section breathes)
Background addition: radial-gradient(ellipse 800px 600px at 50% 0%,
                     rgba(30,20,80,0.15), transparent)
```

**Abstract node graph:**
```
Size: 400px × 200px desktop / full-width, 160px mobile
Implementation: SVG — not canvas, not image

5 nodes:
  Size: 8px × 8px circles
  Background: rgba(109,91,255,0.5)
  Shadow: 0 0 8px rgba(109,91,255,0.3)
  Placement: organic (not grid), pre-defined positions

6 connections:
  Stroke: rgba(109,91,255,0.2), 1px
  Connect nodes in a non-symmetrical pattern

Animation loop (6s, no visible repeat):
  Nodes: opacity oscillates 0.4 → 0.8, each node staggered by 800ms, duration 3s per cycle
  Connections: opacity oscillates 0.1 → 0.3, staggered by 1000ms, duration 4s per cycle

Graph entrance: opacity 0 → 1, 1200ms, --g-ease

Reduced motion: static render, nodes at 0.5 opacity, connections at 0.15 opacity
```

**Body text:**
```
Max-width: 520px, text-center
Font: 18px / 30px, color: --g-muted

Entrance: paragraphs stagger 300ms, opacity 0 → 1, 600ms each
          Slow reveal — patience is the message

Closing line "The blueprint is complete. The foundation already exists. Memory is the next layer.":
  Font: 16px, italic, color: --g-faint
  Margin: 48px top
```

---

## Section 9 — Open Alpha

```
Padding: 120px 0 desktop / 80px 0 mobile
```

**Feature checklist:**
```
Layout: two columns desktop (6 items each) / one column mobile
Gap: 8px between items

Available now items:
  Icon: ✓, color: --g-success, 14px, mr-2
  Text: 14px, color: --g-muted

Coming next items:
  Icon: ○ (empty circle SVG, 12px), color: --g-faint, mr-2
  Text: 14px, color: --g-faint

"Coming next" subheading:
  Font: Caption, color: --g-faint
  Margin: 24px top

Entrance: items stagger 40ms each, opacity 0 → 1, y: 6 → 0, 300ms
```

**Access line:**
```
⚠ DO NOT SHIP until access model is confirmed.
Remove this comment when model is decided and replace with final copy.
```

---

## Section 10 — Final CTA

```
Height: min-h-[70vh]
Layout: flex items-center justify-center
Background: bg-[--g-bg]
```

**AiCore:**
```
Position: absolute, centered, z-0
Size: 400px desktop / 280px mobile
Same props as hero but intensity="minimal" (if supported)
aria-hidden: true
```

**Content:**
```
z-10, relative, text-center, flex-col, items-center, gap-6

Headline:
  Same scale as Section 1 Hero (Hero XL: 72px / 40px mobile)
  Entrance: opacity 0, y: 16 → 0, 700ms, --g-ease

CTAs:
  Same style as Section 1
  Entrance: opacity 0, y: 8 → 0, delay 200ms, 600ms
  No data principles below CTAs (those belong in hero only)
```

---

## Section 11 — Footer

```
Border-top: border-[--g-border]
Padding: 48px 0
Background: bg-[--g-bg]

Layout: four columns desktop / 2×2 grid mobile

Brand column:
  Mark: 20px + "Gunimi" 14px weight 600
  Tagline: 12px, color: --g-faint, margin-top 4px

Link columns:
  Heading: Caption font, color: --g-faint
  Links: 13px, color: --g-muted, block, mb-2
  Hover: color --g-text, transition 150ms

Bottom bar:
  Border-top: --g-border, pt-4, mt-8
  Copyright: 12px, color: --g-faint
  Left-aligned only

Prohibited content:
  Certification badges. SLA statistics. Social proof.
  Feature lists. Any marketing claim.
```

---

## Accessibility Checklist

Complete before first deploy.

```
[ ] AiCore: aria-hidden="true" on all decorative animations
[ ] Signal card: role="figure" aria-label="Example signal from Gunimi"
[ ] Page heading hierarchy: one h1 (Hero headline) → h2 per section
[ ] All CTA text is descriptive (not "Click here" or "Learn more")
[ ] Color contrast: body text WCAG AA (4.5:1 minimum on --g-bg)
    Verify: --g-muted (#9AA3B2) on --g-bg (#05060A) — must meet 4.5:1
    Verify: --g-primary (#6D5BFF) on --g-bg (#05060A) for large text — 3:1 minimum
[ ] Focus ring: 2px solid --g-primary, offset 2px, on all interactive elements
[ ] No horizontal scroll at any viewport width
[ ] Font preloaded: preload Inter weight 400 and 600 for hero
[ ] All images use next/image with alt text. Decorative: alt=""
[ ] Reduced motion: no transform or opacity animation fires under prefers-reduced-motion
    Test: Enable OS reduced motion. AiCore must be static. Signal card must be fully visible.
[ ] Keyboard navigation: Tab reaches all interactive elements in source order
```

---

## Pre-Ship Checklist

```
[ ] Access model confirmed — Section 9 access line written and approved
[ ] AiCore LCP measured — canvas impact acceptable (< 2.5s LCP total)
[ ] useReducedMotion() confirmed as implementation approach
[ ] Signal card component matches /dashboard/today visual exactly
[ ] No hardcoded hex values in homepage components (all use --g-* tokens or Tailwind token classes)
[ ] All user-facing strings in locales/en.json, locales/sk.json, locales/cs.json
[ ] npm run type-check — 0 errors
[ ] npm run lint — 0 errors
[ ] npm run build — clean compile
[ ] npm run check:locales — EN/SK/CS parity
[ ] Browser console clean — no errors, no warnings
[ ] Network tab — no 404, no 500 on any asset
[ ] LCP < 2.5s (measured with Lighthouse)
[ ] CLS < 0.1 (measured with Lighthouse)
[ ] Mobile layout verified at 375px and 430px
[ ] Reduced motion verified with OS setting enabled
```
