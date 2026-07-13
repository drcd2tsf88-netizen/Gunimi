# Gunimi Visual Tokens
**Cross-Product Token Contract — v1.0**

All product surfaces — Homepage, Genesis, Dashboard, Today, Workspace, Settings — must use only these tokens. No surface-specific hex values. No local color constants. No exceptions.

| Layer | File |
|---|---|
| Implementation | `styles/orbit-theme.css` (`--g-*` CSS custom properties) |
| Design reference | `docs/design-language/` (philosophy, usage, anti-patterns) |
| This document | The contract — what tokens exist and where they are required |

---

## Color Tokens

### Backgrounds
```
--g-bg           #05060A           Page canvas, sidebar, hero backgrounds
--g-surface      #0A0E17           Cards, panels, dropdowns
--g-surface-2    #0F1520           Elevated cards, hover fills inside surface
--g-surface-3    #161E2E           Tooltips, floating layers
--g-overlay      rgba(5,6,10,0.82) Modal/dialog backdrops
```
Rule: Never skip surface levels. A card on the page uses `--g-surface`. A card inside that card uses `--g-surface-2`.

### Primary Identity
```
--g-primary       #6D5BFF                    Primary buttons, active states, CTAs
--g-primary-2     #8B7DFF                    Hover states, icon fills
--g-primary-3     #A998FF                    Badge text, subtle accent labels
--g-primary-4     #C4B5FF                    Very light accents, headline gradients
--g-primary-glow  rgba(109,91,255,0.18)      Shadow / glow fills
--g-primary-soft  rgba(109,91,255,0.08)      Background tints
--g-primary-subtle rgba(109,91,255,0.04)     Ultra-subtle backgrounds
```

### AI Accent
```
--g-ai       #22D3EE                  AI status indicators, AI-active states only
--g-ai-2     #67E8F9                  AI highlight text
--g-ai-glow  rgba(34,211,238,0.12)   AI element shadows
--g-ai-soft  rgba(34,211,238,0.06)   AI background tints
```
Rule: AI cyan exists ONLY where AI is actively running. Never use it for decoration, hover effects on non-AI elements, or visual interest. It is a signal, not a color.

### Text
```
--g-text      #F7F8FC                Primary headings, key values
--g-text-2    #C8CDD8                Body text, descriptions
--g-muted     #9AA3B2                Labels, captions, secondary info
--g-faint     rgba(247,248,252,0.28) Ghost text, placeholders
--g-disabled  rgba(247,248,252,0.22) Disabled form elements
```

### Borders
```
--g-border        rgba(255,255,255,0.055)  Default card/panel borders
--g-border-hover  rgba(255,255,255,0.100)  Hovered elements
--g-border-active rgba(109,91,255,0.200)   Active nav items, selected states
--g-border-focus  rgba(109,91,255,0.350)   Focused inputs
--g-border-ai     rgba(34,211,238,0.150)   AI-active element borders
```
Rule: Never use solid, fully opaque borders. Borders are transparent overlays, not lines.

### Status
```
--g-success       #22c55e                 Positive outcomes, live indicators
--g-success-soft  rgba(34,197,94,0.10)    Success background tints
--g-warning       #f59e0b                 Caution states, attention signals
--g-warning-soft  rgba(245,158,11,0.10)   Warning backgrounds
--g-danger        #ef4444                 Destructive actions, errors
--g-danger-soft   rgba(239,68,68,0.10)    Error backgrounds
--g-info          #3b82f6                 Informational states
--g-info-soft     rgba(59,130,246,0.10)   Info backgrounds
```

---

## Typography Tokens

Font: **Inter** throughout. No decorative fonts. No display serif.

```
Hero XXL    96px  700  -0.06em   Landing hero only
Hero XL     72px  600  -0.05em   Section heroes
Hero        56px  600  -0.04em   Feature headlines
H1          40px  600  -0.03em   Page titles
H2          30px  600  -0.025em  Section titles
H3          22px  600  -0.02em   Subsection titles
Title       17px  600  -0.015em  Card titles, widget titles
Subtitle    15px  500  -0.01em   Card subtitles, descriptions
Body Large  16px  400   0        Primary body copy
Body        14px  400   0        Default body
Small       13px  400   0        Secondary text
Caption     11px  500  +0.04em   Labels, timestamps, badges (uppercase only)
Numbers     28px  700  -0.04em   KPI values, metrics
KPI         48px  700  -0.05em   Hero metrics
Mono        13px  400   0        Code, IDs, technical values
```

Rules:
- Negative tracking on all headings — positive tracking only on Caption (uppercase micro-labels)
- Weight carries hierarchy — do not use size alone
- Body text line-height: 1.6 · Headings: 1.0–1.1 · UI labels: 1.0
- Never justify — only left-align or center

Text color assignments:
```
Page title / main heading   → --g-text
Paragraph / description     → --g-text-2
Label / caption             → --g-muted
Placeholder / ghost         → --g-faint
Disabled                    → --g-disabled
Primary action text         → white
Accent label (badge, tag)   → --g-primary-3
AI indicator                → --g-ai or --g-ai-2
```

---

## Spacing Tokens

Every spacing value is a multiple of 4px. Nothing outside this scale is permitted.

```
--g-space-1    4px    Icon padding, tight gaps
--g-space-2    8px    Small gaps, badge padding
--g-space-3    12px   Input padding-y, compact spacing
--g-space-4    16px   Input padding-x, row padding
--g-space-5    20px   Card inner padding (small)
--g-space-6    24px   Card padding (standard)
--g-space-8    32px   Section inner gap
--g-space-10   40px   Section padding
--g-space-12   48px   Between sections
--g-space-16   64px   Page section padding
--g-space-20   80px   Large vertical rhythm
--g-space-24   96px   Hero spacing
--g-space-32   128px  Maximum section separation
```

Max-widths:
```
Layout max:   max-w-7xl  (1280px)
Content max:  max-w-5xl  (1024px)
Text column:  max-w-3xl  (768px)
```

---

## Motion Tokens

### Duration
```
--g-duration-instant   80ms    Micro-feedback (icon color swap)
--g-duration-xs        120ms   Tooltip appear/hide
--g-duration-sm        200ms   Border/color transitions on hover
--g-duration-md        300ms   Standard transitions (cards, buttons)
--g-duration-lg        450ms   Panel open/close, sidebar slide
--g-duration-xl        650ms   Page entrances, modal appear
--g-duration-2xl       950ms   Hero animations, first-load entrances
```

AI durations (always slower than UI — geological patience):
```
--g-duration-ai-pulse        3200ms   AI indicator pulse
--g-duration-ai-breathe      4500ms   AI Core ambient breath
--g-duration-ai-orbit-fast   36000ms  AI Core inner ring
--g-duration-ai-orbit-mid    58000ms  AI Core middle ring
--g-duration-ai-orbit-slow   88000ms  AI Core outer ring
--g-duration-ai-particle     4800ms   Particle drift
```

### Easing
```
--g-ease          cubic-bezier(0.16, 1, 0.3, 1)      Default — fast start, graceful end
--g-ease-out      cubic-bezier(0.0, 0.0, 0.2, 1)     Elements leaving the screen
--g-ease-in       cubic-bezier(0.4, 0, 1, 1)          Elements entering at speed
--g-ease-spring   cubic-bezier(0.34, 1.56, 0.64, 1)  Bouncy entrances (use rarely)
--g-ease-smooth   cubic-bezier(0.25, 0.46, 0.45, 0.94) Continuous animations
--g-ease-linear   linear                               Continuous rotations (AI Core only)
```

### Stagger
```
stagger-fast    60ms   Dense lists, table rows
stagger-base    100ms  Cards, standard lists
stagger-slow    200ms  Section reveals, deliberate sequences
```

---

## Border Radius Tokens

```
--g-radius-sm    6px    Badges, chips, tags
--g-radius-md    10px   Buttons, small inputs
--g-radius-lg    14px   Cards, panels, dropdowns
--g-radius-xl    18px   Modals, sheet dialogs
--g-radius-2xl   24px   Large surface containers
--g-radius-full  9999px Circular elements, pills
```

---

## Z-Index Stack

```
base              0    Normal document flow
card-overlay     10    Absolute-positioned card elements
sticky-nav       20    Sticky navbar, sticky headers
dropdown         30    Dropdowns, popovers
modal-backdrop   40    Modal backdrop overlay
modal            50    Modal, sheet, drawer panels
toast            60    Toast notifications
tooltip          70    Tooltips (always above everything else)
```

---

## Breakpoints

```
sm    640px    Mobile landscape
md    768px    Tablet portrait
lg    1024px   Tablet landscape / small desktop
xl    1280px   Desktop
2xl   1536px   Large desktop
```

---

## AI Core Ring Speeds

These values encode the product's visual identity. They are permanent and must not be changed.

```
Outer ring:   88s linear infinite
Middle ring:  58s linear infinite reverse   ← counter-rotation creates depth
Inner ring:   36s linear infinite
Breath:       scale 0.78 → 1.22 → 0.78, 4.5s easeInOut
```

---

## Reduced Motion

All animations must respect `prefers-reduced-motion: reduce`.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

In React/Framer Motion: use `useReducedMotion()` hook. All `motion.div` components check this before applying transform/opacity animations.

AI Core under reduced motion: static render — rings visible, no rotation, no particles.

---

## Cross-Product Authority

Every surface that uses visual design tokens must reference this document.

| Surface | Status |
|---|---|
| Dashboard | Uses `--g-*` tokens via `styles/orbit-theme.css` |
| Homepage | Must use `--g-*` tokens — no local hex values |
| Genesis | Must use `--g-*` tokens — cinematic extensions allowed, core tokens locked |
| Today | Uses `--g-*` tokens via dashboard inheritance |
| Workspaces | Uses `--g-*` tokens via dashboard inheritance |
| Settings | Uses `--g-*` tokens via dashboard inheritance |

If any surface introduces a new color, spacing, or motion value that does not exist in this document, that value must first be added here — with a use case justification — before it can be used anywhere.

**One source. Zero drift.**

---

## Anti-Patterns (Global)

| Never | Instead |
|---|---|
| Hardcoded hex values in components | `var(--g-*)` or Tailwind token |
| `transition: all 0.3s ease` | `transition: background var(--g-duration-md), border-color var(--g-duration-md)` |
| `display: none/block` for show/hide | `opacity + pointer-events` |
| Cyan (`--g-ai`) for decoration | `--g-primary` family |
| Pure white `#ffffff` | `--g-text` (`#F7F8FC`) |
| Pure black `#000000` | `--g-bg` (`#05060A`) |
| Positive letter-spacing on headings | Negative tracking only |
| Justified text | Left-align or center |
| Skipping surface levels | Always step through bg → surface → surface-2 → surface-3 |

*Full philosophy, usage examples, and component patterns: `docs/design-language/`*
