# 02 — Color System

All tokens are in `styles/orbit-theme.css` under the `:root` block.

---

## Background Levels

The background system has four layers. Think of it as depth — L0 is the floor, L3 is the ceiling.

| Token | Value | Usage |
|---|---|---|
| `--g-bg` | `#05060A` | Page canvas, sidebar |
| `--g-surface` | `#0A0E17` | Cards, panels, dropdowns |
| `--g-surface-2` | `#0F1520` | Elevated cards, hover fills |
| `--g-surface-3` | `#161E2E` | Tooltips, floating layers |
| `--g-overlay` | `rgba(5,6,10,0.82)` | Modal/dialog backdrop |

**Rule:** Never skip levels. A card on the page uses `--g-surface`. A card inside that card uses `--g-surface-2`. A tooltip on that card uses `--g-surface-3`.

---

## Primary Identity

| Token | Value | Usage |
|---|---|---|
| `--g-primary` | `#6D5BFF` | Primary buttons, active states, CTA |
| `--g-primary-2` | `#8B7DFF` | Hover, icon fills, secondary accents |
| `--g-primary-3` | `#A998FF` | Light accents, badge text, subtle labels |
| `--g-primary-4` | `#C4B5FF` | Very light accents, headline gradients |
| `--g-primary-glow` | `rgba(109,91,255,0.18)` | Shadow/glow fills |
| `--g-primary-soft` | `rgba(109,91,255,0.08)` | Background tints |
| `--g-primary-subtle` | `rgba(109,91,255,0.04)` | Ultra-subtle backgrounds |

---

## AI Accent

| Token | Value | Usage |
|---|---|---|
| `--g-ai` | `#22D3EE` | AI status indicators, AI-active states |
| `--g-ai-2` | `#67E8F9` | AI highlight text |
| `--g-ai-glow` | `rgba(34,211,238,0.12)` | AI element shadows |
| `--g-ai-soft` | `rgba(34,211,238,0.06)` | AI background tints |

**Strict rule:** The AI accent exists ONLY where AI is actually running. Never use cyan for decoration, hover effects on non-AI elements, or visual interest. It is a signal, not a color.

---

## Text Scale

| Token | Value | Usage |
|---|---|---|
| `--g-text` | `#F7F8FC` | Primary headings, key values |
| `--g-text-2` | `#C8CDD8` | Body text, descriptions |
| `--g-muted` | `#9AA3B2` | Labels, captions, secondary info |
| `--g-faint` | `rgba(247,248,252,0.28)` | Ghost text, placeholder |
| `--g-disabled` | `rgba(247,248,252,0.22)` | Disabled form elements |

---

## Borders

| Token | Value | Usage |
|---|---|---|
| `--g-border` | `rgba(255,255,255,0.055)` | Default card/panel borders |
| `--g-border-hover` | `rgba(255,255,255,0.100)` | Hovered elements |
| `--g-border-active` | `rgba(109,91,255,0.200)` | Active nav items, selected states |
| `--g-border-focus` | `rgba(109,91,255,0.350)` | Focused inputs |
| `--g-border-ai` | `rgba(34,211,238,0.150)` | AI-active element borders |

**Rule:** Never use a solid, fully opaque border. Borders are transparent overlays, not lines.

---

## Status Colors

| Token | Value | Usage |
|---|---|---|
| `--g-success` | `#22c55e` | Positive outcomes, live indicators |
| `--g-success-soft` | `rgba(34,197,94,0.10)` | Success background tints |
| `--g-warning` | `#f59e0b` | Caution states |
| `--g-warning-soft` | `rgba(245,158,11,0.10)` | Warning backgrounds |
| `--g-danger` | `#ef4444` | Destructive actions, errors |
| `--g-danger-soft` | `rgba(239,68,68,0.10)` | Error backgrounds |
| `--g-info` | `#3b82f6` | Informational states |
| `--g-info-soft` | `rgba(59,130,246,0.10)` | Info backgrounds |

---

## Chart Palette

Eight colors guaranteed to be visually distinct on dark backgrounds:

| Token | Value |
|---|---|
| `--g-chart-1` | `#6D5BFF` (primary violet) |
| `--g-chart-2` | `#22D3EE` (AI cyan) |
| `--g-chart-3` | `#A998FF` (light violet) |
| `--g-chart-4` | `#34d399` (emerald) |
| `--g-chart-5` | `#f59e0b` (amber) |
| `--g-chart-6` | `#f472b6` (rose) |
| `--g-chart-7` | `#60a5fa` (blue) |
| `--g-chart-8` | `#fb923c` (orange) |

Always use in order. Do not skip chart colors for aesthetic reasons.

---

## Color Anti-Patterns

| ❌ Never | ✅ Instead |
|---|---|
| `#000` or `#ffffff` borders | `rgba(255,255,255,0.055)` |
| `box-shadow: 0 4px 8px #000` | `box-shadow: var(--g-shadow-md)` |
| Using cyan for hover states | Use `--g-primary-2` |
| Saturated violet fills (old `#7c3aed`) | Use `--g-primary` (`#6D5BFF`) |
| Pure white text (`#ffffff`) | Use `--g-text` (`#F7F8FC`) |
| Any hardcoded hex | Reference a `--g-*` token |
